import { z } from 'zod';
/** Public contact / support form. */
export const contactSchema = z.object({
    name: z.string().trim().min(1, 'Name is required').max(120),
    email: z.string().trim().toLowerCase().email(),
    subject: z.string().trim().min(1, 'Subject is required').max(200),
    message: z.string().trim().min(10, 'Please add a few more details').max(5000),
});
/** Newsletter subscribe (double opt-in handled server-side). */
export const newsletterSubscribeSchema = z.object({
    email: z.string().trim().toLowerCase().email(),
    source: z.string().trim().max(120).optional(),
});
/** Public template gallery listing. */
export const listTemplatesQuery = z.object({
    page: z.coerce.number().int().min(1).default(1),
    per_page: z.coerce.number().int().min(1).max(100).default(24),
    category: z.string().trim().max(80).optional(),
    q: z.string().trim().max(120).optional(),
});
/** Public blog listing. */
export const listBlogQuery = z.object({
    page: z.coerce.number().int().min(1).default(1),
    per_page: z.coerce.number().int().min(1).max(50).default(12),
    tag: z.string().trim().max(80).optional(),
});
export const slugParam = z.object({
    slug: z
        .string()
        .trim()
        .min(1)
        .max(200)
        .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Invalid slug'),
});
/** Changelog listing. */
export const listChangelogQuery = z.object({
    page: z.coerce.number().int().min(1).default(1),
    per_page: z.coerce.number().int().min(1).max(50).default(20),
});
/** Admin: create/update a changelog entry. */
export const changelogEntrySchema = z.object({
    title: z.string().trim().min(1).max(200),
    body: z.string().trim().min(1).max(50000),
    version: z.string().trim().max(40).optional(),
    published: z.boolean().default(false),
});
/** Admin: credit adjustment on a user's ledger. */
export const adminCreditAdjustSchema = z.object({
    user_id: z.coerce.number().int().positive(),
    delta: z
        .number()
        .refine((n) => n !== 0, 'delta must be non-zero')
        .refine((n) => Math.abs(n) <= 10000, 'delta out of range'),
    reason: z.string().trim().min(3, 'Reason is required').max(500),
});
export const userIdParam = z.object({ id: z.coerce.number().int().positive() });
//# sourceMappingURL=platform.js.map