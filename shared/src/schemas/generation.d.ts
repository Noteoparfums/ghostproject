import { z } from 'zod';
/** Body for POST /api/generate (SSE). Section 9 generation contract. */
export declare const generateSchema: z.ZodObject<{
    project_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    brand_voice_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    funnel_type: z.ZodEnum<["vsl", "lead_magnet", "product_launch", "webinar", "ecom_pdp"]>;
    product: z.ZodString;
    audience: z.ZodString;
    tone: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    template_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    funnel_type: "vsl" | "lead_magnet" | "product_launch" | "webinar" | "ecom_pdp";
    product: string;
    audience: string;
    tone: string;
    template_id?: number | null | undefined;
    project_id?: number | null | undefined;
    brand_voice_id?: number | null | undefined;
}, {
    funnel_type: "vsl" | "lead_magnet" | "product_launch" | "webinar" | "ecom_pdp";
    product: string;
    audience: string;
    template_id?: number | null | undefined;
    project_id?: number | null | undefined;
    brand_voice_id?: number | null | undefined;
    tone?: string | undefined;
}>;
export type GenerateInput = z.infer<typeof generateSchema>;
/** Submit an angle override during the stage-2 pause. */
export declare const submitAngleSchema: z.ZodObject<{
    angle_id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    angle_id: string;
}, {
    angle_id: string;
}>;
export type SubmitAngleInput = z.infer<typeof submitAngleSchema>;
/** Regenerate a single asset (section) — 0.25 credit. */
export declare const regenerateSectionSchema: z.ZodObject<{
    asset_id: z.ZodNumber;
    instruction: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    asset_id: number;
    instruction?: string | undefined;
}, {
    asset_id: number;
    instruction?: string | undefined;
}>;
export type RegenerateSectionInput = z.infer<typeof regenerateSectionSchema>;
/** Create an A/B hook variant — 0.10 credit. */
export declare const createVariantSchema: z.ZodObject<{
    asset_id: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    asset_id: number;
}, {
    asset_id: number;
}>;
export type CreateVariantInput = z.infer<typeof createVariantSchema>;
/** Save an inline edit, or revert to the original content. */
export declare const patchAssetSchema: z.ZodEffects<z.ZodObject<{
    edited_content: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    revert: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    edited_content?: string | null | undefined;
    revert?: boolean | undefined;
}, {
    edited_content?: string | null | undefined;
    revert?: boolean | undefined;
}>, {
    edited_content?: string | null | undefined;
    revert?: boolean | undefined;
}, {
    edited_content?: string | null | undefined;
    revert?: boolean | undefined;
}>;
export type PatchAssetInput = z.infer<typeof patchAssetSchema>;
export declare const generationIdParam: z.ZodObject<{
    id: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: number;
}, {
    id: number;
}>;
export declare const generationAssetParams: z.ZodObject<{
    id: z.ZodNumber;
    assetId: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: number;
    assetId: number;
}, {
    id: number;
    assetId: number;
}>;
export declare const diffParams: z.ZodObject<{
    id: z.ZodNumber;
    otherId: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: number;
    otherId: number;
}, {
    id: number;
    otherId: number;
}>;
export declare const listGenerationsQuery: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    per_page: z.ZodDefault<z.ZodNumber>;
    project_id: z.ZodOptional<z.ZodNumber>;
    funnel_type: z.ZodOptional<z.ZodEnum<["vsl", "lead_magnet", "product_launch", "webinar", "ecom_pdp"]>>;
    status: z.ZodOptional<z.ZodEnum<["queued", "running", "complete", "failed", "cancelled"]>>;
}, "strip", z.ZodTypeAny, {
    page: number;
    per_page: number;
    status?: "queued" | "running" | "complete" | "failed" | "cancelled" | undefined;
    funnel_type?: "vsl" | "lead_magnet" | "product_launch" | "webinar" | "ecom_pdp" | undefined;
    project_id?: number | undefined;
}, {
    status?: "queued" | "running" | "complete" | "failed" | "cancelled" | undefined;
    page?: number | undefined;
    per_page?: number | undefined;
    funnel_type?: "vsl" | "lead_magnet" | "product_launch" | "webinar" | "ecom_pdp" | undefined;
    project_id?: number | undefined;
}>;
export declare const exportQuery: z.ZodObject<{
    format: z.ZodDefault<z.ZodEnum<["md", "txt", "html"]>>;
}, "strip", z.ZodTypeAny, {
    format: "md" | "txt" | "html";
}, {
    format?: "md" | "txt" | "html" | undefined;
}>;
//# sourceMappingURL=generation.d.ts.map