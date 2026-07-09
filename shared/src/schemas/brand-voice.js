import { z } from 'zod';
/** Tone sliders 0–100 each (Formal↔Casual, Safe↔Bold, Short↔Story-driven). */
export const toneSlidersSchema = z.object({
    formal_casual: z.number().int().min(0).max(100),
    safe_bold: z.number().int().min(0).max(100),
    short_story: z.number().int().min(0).max(100),
});
/** Each writing sample must be at least 200 chars (Section 6.E). */
export const sampleTextSchema = z.string().trim().min(200, 'Each sample must be at least 200 characters');
export const createBrandVoiceSchema = z.object({
    name: z.string().trim().min(1, 'Name is required').max(120),
    sample_texts: z.array(sampleTextSchema).min(2, 'Provide at least 2 samples').max(5),
    tone_sliders: toneSlidersSchema,
    banned_words: z.array(z.string().trim().min(1)).max(200).default([]),
});
export const patchBrandVoiceSchema = createBrandVoiceSchema.partial().refine((v) => Object.keys(v).length > 0, 'At least one field is required');
//# sourceMappingURL=brand-voice.js.map