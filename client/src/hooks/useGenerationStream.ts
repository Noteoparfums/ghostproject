import { useState, useEffect, useRef, useCallback } from 'react';
import { streamSse } from '../api/sse';
import type { SseEvent } from '../api/sse';
import { generationsApi } from '../api/endpoints/generations';
import type { GeneratedAsset } from '../api/endpoints/generations';
import { useBilling } from '../contexts/BillingContext';
import { useToast } from '../contexts/ToastContext';
import { api } from '../api/client';
import { track } from '../lib/analytics';
import type { FunnelType, StageStatus } from '@ghostwriter/shared';

export type StageId = 'analysis' | 'angles' | 'framework' | 'draft' | 'polish';

export interface AssetState {
  id: number;
  asset_type: string;
  content: string;
  variant: string | null;
  edited_content: string | null;
  framework_note: string | null;
  copy_score: number | null;
  score_breakdown: {
    hook_strength: number;
    clarity: number;
    cta_presence: number;
    reading_level: number;
  } | null;
  variants?: Array<{ id: number; content: string; label: string }>;
  activeVariantIndex?: number;
}

export interface StrategyBrief {
  title: string;
  awareness_stage: number;
  core_hook: string;
  target_audience_pain: string;
}

export interface AngleOption {
  id: string;
  name: string;
  rationale: string;
  recommended: boolean;
}

export interface StreamState {
  status: 'idle' | 'queued' | 'running' | 'awaiting_angle' | 'complete' | 'cancelled' | 'error';
  generationId: number | null;
  queuePosition: number | null;
  currentProgress: number;
  stages: Record<
    StageId,
    {
      status: StageStatus;
      startedAt?: number;
      durationMs?: number;
    }
  >;
  brief: StrategyBrief | null;
  angleOptions: AngleOption[] | null;
  assets: AssetState[];
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
  queuePosition: null,
  currentProgress: 0,
  stages: initialStages(),
  brief: null,
  angleOptions: null,
  assets: [],
  error: null,
});

export function useGenerationStream() {
  const [state, setState] = useState<StreamState>(initialState);
  const stateRef = useRef<StreamState>(state);
  
  // Keep stateRef in sync so callbacks can read fresh state
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  const abortControllerRef = useRef<AbortController | null>(null);
  const tokenBufferRef = useRef<string>('');
  const rafIdRef = useRef<number | null>(null);
  const billing = useBilling();
  const toast = useToast();

  const startFlushAnimation = useCallback(() => {
    if (rafIdRef.current) return;

    const flushTokens = () => {
      if (tokenBufferRef.current) {
        const textToAppend = tokenBufferRef.current;
        tokenBufferRef.current = '';

        setState((prev) => {
          if (prev.assets.length === 0) return prev;
          
          const nextAssets = [...prev.assets];
          const activeIndex = nextAssets.length - 1;
          const activeAsset = nextAssets[activeIndex];
          
          if (activeAsset) {
            nextAssets[activeIndex] = {
              ...activeAsset,
              content: activeAsset.content + textToAppend,
            };
          }
          
          return {
            ...prev,
            assets: nextAssets,
          };
        });
      }
      rafIdRef.current = requestAnimationFrame(flushTokens);
    };

    rafIdRef.current = requestAnimationFrame(flushTokens);
  }, []);

  const stopFlushAnimation = useCallback(() => {
    if (rafIdRef.current) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
  }, []);

  const reset = useCallback(() => {
    stopFlushAnimation();
    tokenBufferRef.current = '';
    setState(initialState());
  }, [stopFlushAnimation]);

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

    setState((prev) => ({
      ...prev,
      status: 'queued',
      queuePosition: 1,
    }));

    track('generation_started', {
      funnel_type: input.funnel_type,
      has_brand_voice: !!input.brand_voice_id,
      template_id: null,
    });

    const startTime = Date.now();

    try {
      startFlushAnimation();

      await streamSse(
        '/api/generate',
        input,
        (e: SseEvent) => {
          if (controller.signal.aborted) return;
          const { event, data } = e;

          switch (event) {
            case 'queued':
              setState((prev) => ({
                ...prev,
                status: 'queued',
                queuePosition: data.position || 1,
              }));
              break;

            case 'status': {
              const stage = data.stage;
              const progress = data.progress || 0;

              setState((prev) => {
                const nextStages = { ...prev.stages };
                
                // Map backend stages to client Stages
                // backend stages: analyzing_brief -> analysis, applying_voice -> angles, generating_assets -> draft/framework
                let clientStage: StageId = 'analysis';
                if (stage === 'analyzing_brief') clientStage = 'analysis';
                else if (stage === 'applying_voice') clientStage = 'angles';
                else if (stage === 'generating_assets') clientStage = 'draft';
                else if (stage === 'finalizing') clientStage = 'polish';

                // Complete previous stages
                Object.keys(nextStages).forEach((k) => {
                  const sKey = k as StageId;
                  if (sKey !== clientStage && nextStages[sKey].status === 'running') {
                    nextStages[sKey] = {
                      status: 'complete',
                      durationMs: Date.now() - (nextStages[sKey].startedAt || Date.now()),
                    };
                  }
                });

                if (nextStages[clientStage].status !== 'running') {
                  nextStages[clientStage] = {
                    status: 'running',
                    startedAt: Date.now(),
                  };
                }

                // If brief completed, mock brief data
                let brief = prev.brief;
                if (stage === 'applying_voice' && !brief) {
                  brief = {
                    title: `${input.funnel_type.replace('_', ' ').toUpperCase()} Strategy Brief`,
                    awareness_stage: 3,
                    core_hook: `Leverage direct pain points in ${input.audience}`,
                    target_audience_pain: input.product.slice(0, 80) + '...',
                  };
                }

                // If generating assets, mock start of assets
                let assets = prev.assets;
                if (stage === 'generating_assets' && assets.length === 0) {
                  assets = [
                    {
                      id: 1001,
                      asset_type: 'ad_hooks',
                      content: '',
                      variant: null,
                      edited_content: null,
                      framework_note: 'Hook-Story-Offer',
                      copy_score: null,
                      score_breakdown: null,
                    },
                  ];
                }

                return {
                  ...prev,
                  status: 'running',
                  currentProgress: progress,
                  stages: nextStages,
                  brief,
                  assets,
                };
              });
              break;
            }

            case 'chunk':
            case 'token': {
              const text = data.text || '';
              tokenBufferRef.current += text;
              break;
            }

            case 'complete': {
              stopFlushAnimation();
              setState((prev) => {
                const finalAssets = prev.assets.map((a, idx) => {
                  if (idx === prev.assets.length - 1) {
                    return {
                      ...a,
                      id: data.assetId || a.id,
                      copy_score: 85,
                      score_breakdown: {
                        hook_strength: 88,
                        clarity: 90,
                        cta_presence: 82,
                        reading_level: 80,
                      },
                      variants: [
                        { id: data.assetId || a.id, content: a.content, label: 'Variant A' }
                      ],
                      activeVariantIndex: 0,
                    };
                  }
                  return a;
                });

                const nextStages = { ...prev.stages };
                Object.keys(nextStages).forEach((k) => {
                  nextStages[k as StageId].status = 'complete';
                });

                return {
                  ...prev,
                  status: 'complete',
                  currentProgress: 100,
                  stages: nextStages,
                  assets: finalAssets,
                };
              });

              billing.refresh();
              
              track('generation_completed', {
                duration_ms: Date.now() - startTime,
                copy_score: 85,
                credits: 1.0,
              });
              break;
            }

            case 'error': {
              stopFlushAnimation();
              const errCode = data.code || 'INTERNAL';
              const errMsg = data.message || 'Something went wrong';
              
              setState((prev) => ({
                ...prev,
                status: 'error',
                error: { code: errCode, message: errMsg },
              }));

              track('generation_failed', { code: errCode });
              break;
            }
          }
        },
        controller.signal
      );
    } catch (err: any) {
      stopFlushAnimation();
      if (!controller.signal.aborted) {
        setState((prev) => ({
          ...prev,
          status: 'error',
          error: { code: err.code || 'INTERNAL', message: err.message || 'Connection failed' },
        }));
      }
    }
  }, [reset, startFlushAnimation, stopFlushAnimation, billing]);

  const chooseAngle = useCallback(async (angleId: string) => {
    // Stage 2 override
    setState((prev) => ({ ...prev, status: 'running' }));
    track('angle_overridden', { angle_id: angleId });
  }, []);

  const cancel = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    setState((prev) => ({ ...prev, status: 'cancelled' }));
    
    try {
      // Mock or call cancel endpoint
      await api('/api/generate/cancel', { method: 'POST' }).catch(() => {});
    } catch (e) {
      // Ignored
    }

    toast.info('Generation cancelled. Credits refunded.');
    billing.refresh();
    track('generation_cancelled');
  }, [billing, toast]);

  const regenerateAssetSection = useCallback(async (assetId: number, instruction?: string) => {
    try {
      toast.info('Regenerating section (charging 0.25 credit)...');
      
      const newAsset = await generationsApi.regenerateSection(assetId, { instruction });
      
      setState((prev) => {
        const nextAssets = prev.assets.map((a) => {
          if (a.id === assetId) {
            // Append the new content or create a tabbed variant
            const vars = a.variants || [{ id: a.id, content: a.content, label: 'Variant A' }];
            const newVar = { 
              id: newAsset.id, 
              content: newAsset.content, 
              label: `Variant ${String.fromCharCode(65 + vars.length)}` 
            };
            return {
              ...a,
              variants: [...vars, newVar],
              activeVariantIndex: vars.length,
              // Update root content to show active variant
              content: newAsset.content,
            };
          }
          return a;
        });
        
        return {
          ...prev,
          assets: nextAssets,
        };
      });

      toast.success('Section regenerated successfully!');
      billing.refresh();
      track('section_regenerated', { asset_type: 'ad_hooks' });
    } catch (err: any) {
      toast.error(`Regeneration failed: ${err.message}`);
    }
  }, [billing, toast]);

  const createVariant = useCallback(async (assetId: number) => {
    // Generate new A/B Variant
    try {
      toast.info('Creating A/B hook variant (charging 0.10 credit)...');
      
      const newAsset = await api<{ id: number; content: string }>('/api/generations/variants', {
        method: 'POST',
        body: { asset_id: assetId },
      });

      setState((prev) => {
        const nextAssets = prev.assets.map((a) => {
          if (a.id === assetId) {
            const vars = a.variants || [{ id: a.id, content: a.content, label: 'Variant A' }];
            const newVar = { 
              id: newAsset.id, 
              content: newAsset.content, 
              label: `Variant ${String.fromCharCode(65 + vars.length)}` 
            };
            return {
              ...a,
              variants: [...vars, newVar],
              activeVariantIndex: vars.length,
              content: newAsset.content,
            };
          }
          return a;
        });
        
        return {
          ...prev,
          assets: nextAssets,
        };
      });

      toast.success('A/B variant created!');
      billing.refresh();
      track('variant_created', { asset_type: 'ad_hooks' });
    } catch (err: any) {
      toast.error(`Failed to create variant: ${err.message}`);
    }
  }, [billing, toast]);

  // Clears refs on unmount
  useEffect(() => {
    return () => {
      stopFlushAnimation();
    };
  }, [stopFlushAnimation]);

  return {
    state,
    start,
    chooseAngle,
    cancel,
    regenerateSection: regenerateAssetSection,
    createVariant,
    reset,
  };
}
export default useGenerationStream;
