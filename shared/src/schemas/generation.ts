import { z } from 'zod';
import { FUNNEL_TYPES } from '../constants/funnels.js';

/** Body for POST /api/generate (SSE). Section 9 generation contract. */
export const generateSchema = z.object({
  project_id: z.coerce.number().int().positive().nullable().optional(),
  brand_voice_id: z.coerce.number().int().positive().nullable().optional(),
  funnel_type: z.enum(FUNNEL_TYPES),
  product: z
    .string()
    .trim()
    .min(20, 'Describe your product in at least 20 characters')
    .max(5000),
  audience: z.string().trim().min(3, 'Describe your audience').max(1000),
  tone: z.string().trim().max(200).optional().default(''),
  template_id: z.coerce.number().int().positive().nullable().optional(),
});
export type GenerateInput = z.infer<typeof generateSchema>;

/** Submit an angle override during the stage-2 pause. */
export const submitAngleSchema = z.object({
  angle_id: z.string().min(1, 'angle_id is required'),
});
export type SubmitAngleInput = z.infer<typeof submitAngleSchema>;

/** Regenerate a single asset (section) — 0.25 credit. */
export const regenerateSectionSchema = z.object({
  asset_id: z.coerce.number().int().positive(),
});
export type RegenerateSectionInput = z.infer<typeof regenerateSectionSchema>;

/** Create an A/B hook variant — 0.10 credit. */
export const createVariantSchema = z.object({
  asset_id: z.coerce.number().int().positive(),
});
export type CreateVariantInput = z.infer<typeof createVariantSchema>;

/** Save an inline edit, or revert to the original content. */
export const patchAssetSchema = z
  .object({
    edited_content: z.string().max(200000).nullable().optional(),
    revert: z.boolean().optional(),
  })
  .refine(
    (v) => v.edited_content !== undefined || v.revert === true,
    'Provide edited_content or revert=true',
  );
export type PatchAssetInput = z.infer<typeof patchAssetSchema>;

export const idParam = z.object({ id: z.coerce.number().int().positive() });

export const generationAssetParams = z.object({
  id: z.coerce.number().int().positive(),
  assetId: z.coerce.number().int().positive(),
});

export const diffParams = z.object({
  id: z.coerce.number().int().positive(),
  otherId: z.coerce.number().int().positive(),
});

export const listGenerationsQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  per_page: z.coerce.number().int().min(1).max(100).default(20),
  project_id: z.coerce.number().int().positive().optional(),
  funnel_type: z.enum(FUNNEL_TYPES).optional(),
  status: z.enum(['queued', 'running', 'complete', 'failed', 'cancelled']).optional(),
});

export const exportQuery = z.object({
  format: z.enum(['md', 'txt', 'html']).default('md'),
});
