import { z } from 'zod';
import type { Paginated } from './types.js';
/** Query schema for `?page=&per_page=` list endpoints. */
export declare const paginationQuery: z.ZodObject<{
    page: z.ZodDefault<z.ZodNumber>;
    per_page: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    per_page: number;
}, {
    page?: number | undefined;
    per_page?: number | undefined;
}>;
export type PaginationQuery = z.infer<typeof paginationQuery>;
/** Convert a validated pagination query into SQL LIMIT/OFFSET params. */
export declare function toLimitOffset(q: PaginationQuery): {
    limit: number;
    offset: number;
};
/** Build the `{ data, meta }` envelope returned by every list endpoint. */
export declare function paginated<T>(data: T[], q: PaginationQuery, total: number): Paginated<T>;
//# sourceMappingURL=pagination.d.ts.map