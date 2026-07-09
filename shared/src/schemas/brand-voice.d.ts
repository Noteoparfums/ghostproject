import { z } from 'zod';
/** Tone sliders 0–100 each (Formal↔Casual, Safe↔Bold, Short↔Story-driven). */
export declare const toneSlidersSchema: z.ZodObject<{
    formal_casual: z.ZodNumber;
    safe_bold: z.ZodNumber;
    short_story: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    formal_casual: number;
    safe_bold: number;
    short_story: number;
}, {
    formal_casual: number;
    safe_bold: number;
    short_story: number;
}>;
export type ToneSliders = z.infer<typeof toneSlidersSchema>;
/** Each writing sample must be at least 200 chars (Section 6.E). */
export declare const sampleTextSchema: z.ZodString;
export declare const createBrandVoiceSchema: z.ZodObject<{
    name: z.ZodString;
    sample_texts: z.ZodArray<z.ZodString, "many">;
    tone_sliders: z.ZodObject<{
        formal_casual: z.ZodNumber;
        safe_bold: z.ZodNumber;
        short_story: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        formal_casual: number;
        safe_bold: number;
        short_story: number;
    }, {
        formal_casual: number;
        safe_bold: number;
        short_story: number;
    }>;
    banned_words: z.ZodDefault<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    name: string;
    sample_texts: string[];
    tone_sliders: {
        formal_casual: number;
        safe_bold: number;
        short_story: number;
    };
    banned_words: string[];
}, {
    name: string;
    sample_texts: string[];
    tone_sliders: {
        formal_casual: number;
        safe_bold: number;
        short_story: number;
    };
    banned_words?: string[] | undefined;
}>;
export type CreateBrandVoiceInput = z.infer<typeof createBrandVoiceSchema>;
export declare const patchBrandVoiceSchema: z.ZodEffects<z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    sample_texts: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    tone_sliders: z.ZodOptional<z.ZodObject<{
        formal_casual: z.ZodNumber;
        safe_bold: z.ZodNumber;
        short_story: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        formal_casual: number;
        safe_bold: number;
        short_story: number;
    }, {
        formal_casual: number;
        safe_bold: number;
        short_story: number;
    }>>;
    banned_words: z.ZodOptional<z.ZodDefault<z.ZodArray<z.ZodString, "many">>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    sample_texts?: string[] | undefined;
    tone_sliders?: {
        formal_casual: number;
        safe_bold: number;
        short_story: number;
    } | undefined;
    banned_words?: string[] | undefined;
}, {
    name?: string | undefined;
    sample_texts?: string[] | undefined;
    tone_sliders?: {
        formal_casual: number;
        safe_bold: number;
        short_story: number;
    } | undefined;
    banned_words?: string[] | undefined;
}>, {
    name?: string | undefined;
    sample_texts?: string[] | undefined;
    tone_sliders?: {
        formal_casual: number;
        safe_bold: number;
        short_story: number;
    } | undefined;
    banned_words?: string[] | undefined;
}, {
    name?: string | undefined;
    sample_texts?: string[] | undefined;
    tone_sliders?: {
        formal_casual: number;
        safe_bold: number;
        short_story: number;
    } | undefined;
    banned_words?: string[] | undefined;
}>;
export type PatchBrandVoiceInput = z.infer<typeof patchBrandVoiceSchema>;
//# sourceMappingURL=brand-voice.d.ts.map