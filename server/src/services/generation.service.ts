import { 
  generationRepository, 
  generationAssetRepository, 
  generationStageRepository 
} from '../repositories/generation.repository.js';
import { creditService } from './credit.service.js';
import { sseRegistry, openSse, type SseHandle } from '../lib/sse.js';
import { AppError } from '../lib/errors.js';
import { logger } from '../lib/logger.js';
import { buildBrief, buildAssets } from '../engine/copyBanks.js';
import type { Response } from 'express';
import { withTransaction } from '../lib/db.js';

export const generationService = {
  async startGeneration(
    userId: number,
    payload: {
      projectId?: number | null;
      brandVoiceId?: number | null;
      funnelType: 'vsl' | 'lead_magnet' | 'product_launch' | 'webinar' | 'ecom_pdp';
      brief: string;
      targetAudience?: string | null;
      tone?: string | null;
    },
    res: Response
  ) {
    const cost = 1.00;
    const balance = await creditService.balance(userId);
    if (balance < cost) {
      throw new AppError('PAYMENT_REQUIRED', 'Insufficient credits for this generation');
    }

    const gen = await withTransaction(async (tx) => {
      // 1. Create generation record in queued status
      const generation = await generationRepository.create({
        userId,
        projectId: payload.projectId,
        brandVoiceId: payload.brandVoiceId,
        funnelType: payload.funnelType,
        inputSnapshot: { 
          brief: payload.brief, 
          targetAudience: payload.targetAudience, 
          tone: payload.tone || 'direct' 
        },
        creditsCharged: cost
      }, tx);

      // 2. Charge credits atomic lock
      await creditService.charge(
        userId,
        cost,
        'generation',
        { generationId: generation.id },
        `Charged ${cost} credits for funnel generation`
      );

      return generation;
    });

    // 3. Open SSE streaming handle
    const handle = openSse(res);
    const abort = new AbortController();
    sseRegistry.register(gen.id, abort, handle);

    // 4. Fire async generation pipeline
    this.runGenerationPipeline(gen.id, userId, payload, handle, abort.signal).catch((err) => {
      logger.error({ err, genId: gen.id }, 'Generation pipeline unhandled error');
    });

    return gen.id;
  },

  async runGenerationPipeline(
    genId: number,
    userId: number,
    payload: {
      projectId?: number | null;
      brandVoiceId?: number | null;
      funnelType: 'vsl' | 'lead_magnet' | 'product_launch' | 'webinar' | 'ecom_pdp';
      brief: string;
      targetAudience?: string | null;
      tone?: string | null;
    },
    handle: SseHandle,
    signal: AbortSignal
  ) {
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

    try {
      // Setup the base brief
      const brief = buildBrief(payload.brief, payload.targetAudience || 'founders', payload.tone || 'direct');
      
      // Stage 1: Analysis
      if (signal.aborted) return;
      handle.send('stage', { stage: 'analysis', status: 'running' });
      await generationStageRepository.upsert({
        generationId: genId,
        stage: 'analysis',
        status: 'running'
      });
      await sleep(1500);

      const analysisOutput = {
        psychographics: {
          desires: ['Save time producing copy', 'Increase conversion rates immediately'],
          pains: ['Writer block', 'Paying expensive agencies', 'Slow turnarounds'],
          fears: ['Losing ad spend on non-converting copy', 'Looking unprofessional']
        },
        objections: [
          { objection: 'Will this match my voice?', response: 'Yes, uses tone sliders & custom sample texts.' },
          { objection: 'Is the output unique?', response: 'Absolutely, generation is context-driven.' }
        ]
      };
      
      handle.send('stage', { stage: 'analysis', status: 'complete', output: JSON.stringify(analysisOutput) });
      await generationStageRepository.upsert({
        generationId: genId,
        stage: 'analysis',
        status: 'complete',
        output: JSON.stringify(analysisOutput),
        durationMs: 1500
      });

      // Stage 2: Angles
      if (signal.aborted) return;
      handle.send('stage', { stage: 'angles', status: 'running' });
      await generationStageRepository.upsert({
        generationId: genId,
        stage: 'angles',
        status: 'running'
      });
      await sleep(1500);

      const anglesOutput = {
        angles: [
          { id: 1, hook: 'What if everything you knew about copy was wrong?', angle_type: 'contrarian' },
          { id: 2, hook: 'The secret system converting cold traffic into buying fans.', angle_type: 'dream-state' },
          { id: 3, hook: 'Stop burning cash on agencies who write boring outlines.', angle_type: 'pain-point' }
        ]
      };

      handle.send('stage', { stage: 'angles', status: 'complete', output: JSON.stringify(anglesOutput) });
      await generationStageRepository.upsert({
        generationId: genId,
        stage: 'angles',
        status: 'complete',
        output: JSON.stringify(anglesOutput),
        durationMs: 1500
      });

      // Stage 3: Framework
      if (signal.aborted) return;
      handle.send('stage', { stage: 'framework', status: 'running' });
      await generationStageRepository.upsert({
        generationId: genId,
        stage: 'framework',
        status: 'running'
      });
      await sleep(1000);

      const frameworkOutput = {
        framework: payload.funnelType === 'vsl' ? 'Problem-Agitate-Mechanism-Offer' : 'Attention-Interest-Desire-Action (AIDA)',
        outline: [
          'Capture attention using hook #1',
          'Agitate core pains (time and agency costs)',
          'Present Ghostwriter OS as the scalable mechanism',
          'Close with strong CTA + objection handler'
        ]
      };

      handle.send('stage', { stage: 'framework', status: 'complete', output: JSON.stringify(frameworkOutput) });
      await generationStageRepository.upsert({
        generationId: genId,
        stage: 'framework',
        status: 'complete',
        output: JSON.stringify(frameworkOutput),
        durationMs: 1000
      });

      // Stage 4: Draft (Streaming Tokens)
      if (signal.aborted) return;
      handle.send('stage', { stage: 'draft', status: 'running' });
      await generationStageRepository.upsert({
        generationId: genId,
        stage: 'draft',
        status: 'running'
      });

      const generatedAssets = buildAssets(payload.funnelType, brief);
      
      // Stream tokens representing the assets
      const fullCopy = generatedAssets.map(a => `[${a.label}]\n\n${a.content}`).join('\n\n====================\n\n');
      const tokens = fullCopy.split(' ');
      let streamedCount = 0;

      for (const token of tokens) {
        if (signal.aborted) return;
        handle.send('token', { token: token + ' ' });
        streamedCount++;
        if (streamedCount % 10 === 0) {
          await sleep(50); // slight speed simulation
        }
      }

      handle.send('stage', { stage: 'draft', status: 'complete', output: 'Draft fully streamed.' });
      await generationStageRepository.upsert({
        generationId: genId,
        stage: 'draft',
        status: 'complete',
        output: 'Draft fully streamed.',
        tokensUsed: Math.ceil(fullCopy.length / 4),
        durationMs: streamedCount * 5
      });

      // Stage 5: Polish
      if (signal.aborted) return;
      handle.send('stage', { stage: 'polish', status: 'running' });
      await generationStageRepository.upsert({
        generationId: genId,
        stage: 'polish',
        status: 'running'
      });
      await sleep(1500);

      // Save each asset to generation_assets table
      let primaryAssetId = 0;
      for (let i = 0; i < generatedAssets.length; i++) {
        const asset = generatedAssets[i]!;
        const copyScore = Math.floor(Math.random() * 15) + 82; // 82-96 score
        const scoreBreakdown = {
          readability: 90,
          persuasion: 85,
          engagement: 88
        };
        const complianceFlags = {
          unsubstantiated_claims: [],
          over_promising: []
        };

        const assetId = await generationAssetRepository.create({
          generationId: genId,
          assetType: asset.asset_type,
          content: asset.content,
          variant: i === 0 ? 'A' : null,
          frameworkNote: asset.framework_note,
          copyScore,
          scoreBreakdown,
          complianceFlags
        });

        if (i === 0) {
          primaryAssetId = assetId;
        }
      }

      // Update generation to complete status
      await generationRepository.update(genId, {
        status: 'complete',
        copyScore: 89
      });

      handle.send('stage', { stage: 'polish', status: 'complete', output: 'Polished and saved.' });
      await generationStageRepository.upsert({
        generationId: genId,
        stage: 'polish',
        status: 'complete',
        output: 'Polished and saved.',
        durationMs: 1500
      });

      handle.send('complete', { assetId: primaryAssetId });
    } catch (e: any) {
      logger.error({ err: e, genId }, 'Error running generation pipeline');
      handle.send('error', { code: 'INTERNAL', message: e?.message || 'Failed during generation pipeline' });
      await generationRepository.update(genId, { status: 'failed', errorMessage: e?.message });
    } finally {
      handle.close();
      sseRegistry.unregister(genId);
    }
  },

  async regenerateSection(userId: number, assetId: number, instruction: string) {
    const asset = await generationAssetRepository.findById(assetId);
    if (!asset) {
      throw new AppError('NOT_FOUND', 'Asset not found');
    }
    
    // Check ownership
    const gen = await generationRepository.findById(asset.generation_id);
    if (!gen || gen.user_id !== userId) {
      throw new AppError('FORBIDDEN', 'Access to asset denied');
    }

    const cost = 0.25;
    const balance = await creditService.balance(userId);
    if (balance < cost) throw new AppError('PAYMENT_REQUIRED', 'Insufficient credits for regeneration');

    await withTransaction(async (tx) => {
      await creditService.charge(
        userId,
        cost,
        'section_regen',
        { generationId: asset.generation_id },
        `Regenerated section based on instruction: ${instruction}`
      );
    });

    const mockContent = `[REGENERATED variant based on: ${instruction}]\n\n${asset.content}`;

    const newAssetId = await generationAssetRepository.create({
      generationId: asset.generation_id,
      assetType: asset.asset_type,
      content: mockContent,
      variant: 'B',
      frameworkNote: `Regenerated from instruction: "${instruction}"`
    });

    return generationAssetRepository.findById(newAssetId);
  }
};
