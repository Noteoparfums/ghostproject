import { useCallback, useEffect, useRef, useState } from 'react';
import type { FunnelType, PipelineStage, StageStatus } from '@ghostwriter/shared';
import { CREDIT_COSTS } from '@ghostwriter/shared';
import { streamSse, type SseEvent } from '../api/sse';
import { generationsApi } from '../api/endpoints/generations';
import { useBilling } from '../contexts/BillingContext';
import { useToast } from '../contexts/ToastContext';
import { track } from '../lib/analytics';

export type StageId = PipelineStage;

export interface AssetState {
  id: number;
  asset_type: string;
  content: string;
  variant: string | null;
  edited_content: string | null;
  framework_note: string | null;
  copy_score: number | null;
  score_breakdown: Record<string, number> | null;
  variants?: Array<{ id: number; content: string; label: string }>;
  activeVariantIndex?: number;
}

export interface StreamState {
  status: 'idle' | 'queued' | 'running' | 'complete' | 'cancelled' | 'error';
  generationId: number | null;
  currentStage: StageId | null;
  stages: Record<StageId, { status: StageStatus; output?: string }>;
  streamedContent: string;
  assets: AssetState[];
  brief: {
    title: string;
    awareness_stage: number;
    core_hook: string;
    target_audience_pain: string;
  } | null;
  error: { code: string; message: string; requestId?: string } | null;
}

const initialStages = (): StreamState['stages'] => ({
  analysis: { status: 'pending' },
  angles: { status: 'pending' },
  framework: { status: 'pending' },
  draft: { status: 'pending' },
  polish: { status: 'pending' },
});

const initialState = (): StreamState => ({
  status: 'idle',
  generationId: null,
  currentStage: null,
  stages: initialStages(),
  streamedContent: '',
  assets: [],
  brief: null,
  error: null,
});

export function useGenerationStream() {
  const [state, setState] = useState<StreamState>(initialState);
  const abortControllerRef = useRef<AbortController | null>(null);
  const tokenBufferRef = useRef('');
  const frameRef = useRef<number | null>(null);
  const billing = useBilling();
  const toast = useToast();

  const stopBuffer = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
  }, []);

  const flushBuffer = useCallback(() => {
    if (frameRef.current !== null) return;
    const flush = () => {
      if (tokenBufferRef.current) {
        const content = tokenBufferRef.current;
        tokenBufferRef.current = '';
        setState((previous) => ({
          ...previous,
          streamedContent: previous.streamedContent + content,
        }));
      }
      frameRef.current = requestAnimationFrame(flush);
    };
    frameRef.current = requestAnimationFrame(flush);
  }, []);

  const drainBuffer = useCallback(() => {
    const content = tokenBufferRef.current;
    tokenBufferRef.current = '';
    if (!content) return;
    setState((previous) => {
      const streamedContent = previous.streamedContent + content;
      return {
        ...previous,
        streamedContent,
      };
    });
  }, []);

  const reset = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    stopBuffer();
    tokenBufferRef.current = '';
    setState(initialState());
  }, [stopBuffer]);

  const start = useCallback(async (input: {
    project_id?: number | null;
    brand_voice_id?: number | null;
    funnel_type: FunnelType;
    product: string;
    audience: string;
    tone?: string;
  }) => {
    reset();
    const controller = new AbortController();
    abortControllerRef.current = controller;
    setState({ ...initialState(), status: 'running' });
    flushBuffer();
    const startedAt = Date.now();

    track('generation_started', {
      funnel_type: input.funnel_type,
      has_brand_voice: Boolean(input.brand_voice_id),
      template_id: null,
    });

    try {
      await streamSse('/api/generate', input, (message: SseEvent) => {
        if (controller.signal.aborted) return;
        const { event, data } = message;

        if (event === 'stage') {
          const stage = data.stage as StageId;
          if (!Object.prototype.hasOwnProperty.call(initialStages(), stage)) return;
          setState((previous) => ({
            ...previous,
            status: 'running',
            currentStage: data.status === 'complete' ? null : stage,
            stages: {
              ...previous.stages,
              [stage]: {
                status: data.status === 'complete' ? 'complete' : 'running',
                output: typeof data.output === 'string' ? data.output : undefined,
              },
            },
          }));
          return;
        }

        if (event === 'token') {
          tokenBufferRef.current += typeof data.token === 'string' ? data.token : '';
          return;
        }

        if (event === 'complete') {
          stopBuffer();
          drainBuffer();
          setState((previous) => ({
            ...previous,
            status: 'complete',
            currentStage: null,
            generationId: Number.isFinite(Number(data.generationId)) ? Number(data.generationId) : null,
            assets: Array.isArray(data.assets) ? data.assets : [],
          }));
          void billing.refresh();
          track('generation_completed', {
            duration_ms: Date.now() - startedAt,
            credits: CREDIT_COSTS.FULL_FUNNEL,
          });
          return;
        }

        if (event === 'error') {
          stopBuffer();
          drainBuffer();
          const code = typeof data.code === 'string' ? data.code : 'INTERNAL';
          setState((previous) => ({
            ...previous,
            status: 'error',
            currentStage: null,
            error: {
              code,
              message: typeof data.message === 'string' ? data.message : 'Generation failed.',
              requestId: typeof data.requestId === 'string' ? data.requestId : undefined,
            },
          }));
          void billing.refresh();
          track('generation_failed', { code });
        }
      }, controller.signal);
    } catch (error: any) {
      stopBuffer();
      drainBuffer();
      if (controller.signal.aborted) return;
      const code = typeof error?.code === 'string' ? error.code : 'CONNECTION_INTERRUPTED';
      setState((previous) => ({
        ...previous,
        status: 'error',
        currentStage: null,
        error: {
          code,
          message: error?.message || 'The generation connection was interrupted. Your balance will refresh automatically.',
          requestId: error?.requestId,
        },
      }));
      void billing.refresh();
      track('generation_failed', { code });
    }
  }, [billing, drainBuffer, flushBuffer, reset, stopBuffer]);

  const regenerateSection = useCallback(async (assetId: number, instruction?: string) => {
    if (!assetId) {
      toast.info('Regeneration is available only when a persisted asset identifier is returned.');
      return;
    }
    try {
      toast.info(`Regenerating this section for ${CREDIT_COSTS.SECTION_REGEN} credit…`);
      const asset = await generationsApi.regenerateSection(assetId, { instruction });
      setState((previous) => ({
        ...previous,
        streamedContent: asset.content,
        assets: [{
          id: asset.id,
          asset_type: asset.asset_type,
          content: asset.content,
          variant: null,
          edited_content: null,
          framework_note: null,
          copy_score: asset.copy_score,
          score_breakdown: null,
        }],
      }));
      void billing.refresh();
      track('section_regenerated', { asset_type: asset.asset_type });
    } catch (error: any) {
      toast.error(error?.message || 'Section regeneration failed.');
    }
  }, [billing, toast]);

  const cancel = useCallback(() => {
    toast.info('Generation cancellation is not supported by the current service. This run will continue in the background.');
  }, [toast]);

  const createVariant = useCallback((_assetId?: number) => {
    toast.info('A/B variants are not available in this workspace.');
  }, [toast]);

  useEffect(() => () => {
    abortControllerRef.current?.abort();
    stopBuffer();
    tokenBufferRef.current = '';
  }, [stopBuffer]);

  return {
    state,
    start,
    cancel,
    createVariant,
    chooseAngle: () => undefined,
    regenerateSection,
    reset,
  };
}

export default useGenerationStream;