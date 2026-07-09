import { z } from 'zod';
/** Public contact / support form. */
export declare const contactSchema: z.ZodObject<{
    name: z.ZodString;
    email: z.ZodString;
    subject: z.ZodString;
    message: z.ZodString;
}, "strip", z.ZodTypeAny, {
    subject: string;
    message: string;
    name: string;
    email: string;
}, {
    subject: string;
    message: string;
    name: string;
    email: string;
}>;
export type ContactInput = z.infer<typeof contactSchema>;
/** Newsletter subscribe (double opt-in handled server-side). */
export declare const newsletterSubscribeSchema: z.ZodObject<{
    email: z.ZodString;
    source: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    email: string;
    source?: string | undefined;
}, {
    email: string;
    source?: string | undefined;
}>;
export type NewsletterSubscribeInput = z.infer<typeof newsletterSubscribeSchema>;
/** Public template gallery listing. */
export declare const listTemplatesQuery: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    per_page: z.ZodDefault<z.ZodNumber>;
    category: z.ZodOptional<z.ZodString>;
    q: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    page: number;
    per_page: number;
    category?: string | undefined;
    q?: string | undefined;
}, {
    page?: number | undefined;
    per_page?: number | undefined;
    category?: string | undefined;
    q?: string | undefined;
}>;
export type ListTemplatesQuery = z.infer<typeof listTemplatesQuery>;
/** Public blog listing. */
export declare const listBlogQuery: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    per_page: z.ZodDefault<z.ZodNumber>;
    tag: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    page: number;
    per_page: number;
    tag?: string | undefined;
}, {
    page?: number | undefined;
    per_page?: number | undefined;
    tag?: string | undefined;
}>;
export type ListBlogQuery = z.infer<typeof listBlogQuery>;
export declare const slugParam: z.ZodObject<{
    slug: z.ZodString;
}, "strip", z.ZodTypeAny, {
    slug: string;
}, {
    slug: string;
}>;
export type SlugParam = z.infer<typeof slugParam>;
/** Changelog listing. */
export declare const listChangelogQuery: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    per_page: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    per_page: number;
}, {
    page?: number | undefined;
    per_page?: number | undefined;
}>;
export type ListChangelogQuery = z.infer<typeof listChangelogQuery>;
/** Admin: create/update a changelog entry. */
export declare const changelogEntrySchema: z.ZodObject<{
    title: z.ZodString;
    body: z.ZodString;
    version: z.ZodOptional<z.ZodString>;
    published: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    title: string;
    body: string;
    published: boolean;
    version?: string | undefined;
}, {
    title: string;
    body: string;
    version?: string | undefined;
    published?: boolean | undefined;
}>;
export type ChangelogEntryInput = z.infer<typeof changelogEntrySchema>;
/** Admin: credit adjustment on a user's ledger. */
export declare const adminCreditAdjustSchema: z.ZodObject<{
    user_id: z.ZodNumber;
    delta: z.ZodEffects<z.ZodEffects<z.ZodNumber, number, number>, number, number>;
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    user_id: number;
    reason: string;
    delta: number;
}, {
    user_id: number;
    reason: string;
    delta: number;
}>;
export type AdminCreditAdjustInput = z.infer<typeof adminCreditAdjustSchema>;
export declare const userIdParam: z.ZodObject<{
    id: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: number;
}, {
    id: number;
}>;
//# sourceMappingURL=platform.d.ts.map