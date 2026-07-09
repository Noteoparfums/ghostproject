import { type SseHandle } from '../lib/sse.js';
import type { Response } from 'express';
export declare const generationService: {
    startGeneration(userId: number, payload: {
        projectId?: number | null;
        brandVoiceId?: number | null;
        funnelType: "vsl" | "lead_magnet" | "product_launch" | "webinar" | "ecom_pdp";
        brief: string;
        targetAudience?: string | null;
        tone?: string | null;
    }, res: Response): Promise<number>;
    runGenerationPipeline(genId: number, userId: number, payload: {
        projectId?: number | null;
        brandVoiceId?: number | null;
        funnelType: "vsl" | "lead_magnet" | "product_launch" | "webinar" | "ecom_pdp";
        brief: string;
        targetAudience?: string | null;
        tone?: string | null;
    }, handle: SseHandle, signal: AbortSignal): Promise<void>;
    regenerateSection(userId: number, assetId: number, instruction: string): Promise<import("../repositories/generation.repository.js").GenerationAssetRow | null>;
};
//# sourceMappingURL=generation.service.d.ts.map