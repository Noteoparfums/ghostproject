import { z } from 'zod';
/** Query schema for `?page=&per_page=` list endpoints. */
export const paginationQuery = z.object({
    page: z.coerce.number().int().min(1).default(1),
    per_page: z.coerce.number().int().min(1).max(100).default(20),
});
/** Convert a validated pagination query into SQL LIMIT/OFFSET params. */
export function toLimitOffset(q) {
    return { limit: q.per_page, offset: (q.page - 1) * q.per_page };
}
/** Build the `{ data, meta }` envelope returned by every list endpoint. */
export function paginated(data, q, total) {
    const meta = { page: q.page, per_page: q.per_page, total };
    return { data, meta };
}
//# sourceMappingURL=pagination.js.map