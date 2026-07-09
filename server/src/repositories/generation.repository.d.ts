import { type TransactionConnection } from '../lib/db.js';
import type { GenerationStatus, Paginated } from '@ghostwriter/shared';
export interface GenerationRow {
    id: number;
    user_id: number;
    project_id: number | null;
    brand_voice_id: number | null;
    funnel_type: 'vsl' | 'lead_magnet' | 'product_launch' | 'webinar' | 'ecom_pdp';
    input_snapshot: any;
    status: GenerationStatus;
    credits_charged: string;
    copy_score: number | null;
    version: number;
    parent_generation_id: number | null;
    error_message: string | null;
    created_at: Date;
    updated_at: Date;
}
export interface GenerationAssetRow {
    id: number;
    generation_id: number;
    asset_type: string;
    content: string;
    variant: string | null;
    edited_content: string | null;
    framework_note: string | null;
    copy_score: number | null;
    score_breakdown: any;
    compliance_flags: any;
    created_at: Date;
    updated_at: Date;
    user_id: number;
    project_id: number | null;
    is_favorited: number;
}
export interface GenerationStageRow {
    id: number;
    generation_id: number;
    stage: 'analysis' | 'angles' | 'framework' | 'draft' | 'polish';
    status: 'pending' | 'running' | 'complete' | 'failed';
    output: string | null;
    tokens_used: number;
    duration_ms: number;
    created_at: Date;
    updated_at: Date;
}
export declare const generationRepository: {
    create(data: {
        userId: number;
        projectId?: number | null;
        brandVoiceId?: number | null;
        funnelType: "vsl" | "lead_magnet" | "product_launch" | "webinar" | "ecom_pdp";
        inputSnapshot: any;
        creditsCharged: number;
        parentGenerationId?: number | null;
    }, tx?: TransactionConnection): Promise<GenerationRow>;
    findById(id: number, tx?: TransactionConnection): Promise<GenerationRow | null>;
    findOwned(id: number, userId: number, tx?: TransactionConnection): Promise<GenerationRow | null>;
    update(id: number, updates: {
        status?: GenerationStatus;
        copyScore?: number | null;
        errorMessage?: string | null;
        version?: number;
    }, tx?: TransactionConnection): Promise<void>;
    setStatus(tx: TransactionConnection, id: number, status: GenerationStatus): Promise<void>;
    listByUser(userId: number, page?: number, perPage?: number, tx?: TransactionConnection): Promise<Paginated<GenerationRow>>;
};
export declare const generationAssetRepository: {
    create(data: {
        generationId: number;
        assetType: string;
        content: string;
        variant?: string | null;
        editedContent?: string | null;
        frameworkNote?: string | null;
        copyScore?: number | null;
        scoreBreakdown?: any;
        complianceFlags?: any;
    }, tx?: TransactionConnection): Promise<number>;
    findById(id: number, tx?: TransactionConnection): Promise<GenerationAssetRow | null>;
    listByGeneration(generationId: number, tx?: TransactionConnection): Promise<GenerationAssetRow[]>;
    listByProject(projectId: number, tx?: TransactionConnection): Promise<GenerationAssetRow[]>;
    update(id: number, updates: {
        editedContent?: string | null;
        copyScore?: number | null;
        scoreBreakdown?: any;
        complianceFlags?: any;
    }, tx?: TransactionConnection): Promise<void>;
    updateContent(id: number, content: string, tx?: TransactionConnection): Promise<void>;
    toggleFavorite(id: number, isFavorited: boolean, tx?: TransactionConnection): Promise<void>;
};
export declare const generationStageRepository: {
    upsert(data: {
        generationId: number;
        stage: "analysis" | "angles" | "framework" | "draft" | "polish";
        status: "pending" | "running" | "complete" | "failed";
        output?: string | null;
        tokensUsed?: number;
        durationMs?: number;
    }, tx?: TransactionConnection): Promise<void>;
    listByGeneration(generationId: number, tx?: TransactionConnection): Promise<GenerationStageRow[]>;
};
export declare const generatedAssetRepository: {
    create(data: {
        generationId: number;
        assetType: string;
        content: string;
        variant?: string | null;
        editedContent?: string | null;
        frameworkNote?: string | null;
        copyScore?: number | null;
        scoreBreakdown?: any;
        complianceFlags?: any;
    }, tx?: TransactionConnection): Promise<number>;
    findById(id: number, tx?: TransactionConnection): Promise<GenerationAssetRow | null>;
    listByGeneration(generationId: number, tx?: TransactionConnection): Promise<GenerationAssetRow[]>;
    listByProject(projectId: number, tx?: TransactionConnection): Promise<GenerationAssetRow[]>;
    update(id: number, updates: {
        editedContent?: string | null;
        copyScore?: number | null;
        scoreBreakdown?: any;
        complianceFlags?: any;
    }, tx?: TransactionConnection): Promise<void>;
    updateContent(id: number, content: string, tx?: TransactionConnection): Promise<void>;
    toggleFavorite(id: number, isFavorited: boolean, tx?: TransactionConnection): Promise<void>;
};
//# sourceMappingURL=generation.repository.d.ts.map