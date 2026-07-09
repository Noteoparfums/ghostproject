import { z } from 'zod';
import type { PageMeta, Paginated } from './types.js';

/** Query schema for `?page=&per_page=` list endpoints. */
export const paginationQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  per_page: z.coerce.number().int().min(1).max(100).default(20),
});

export type PaginationQuery = z.infer<typeof paginationQuery>;

/** Convert a validated pagination query into SQL LIMIT/OFFSET params. */
export function toLimitOffset(q: PaginationQuery): { limit: number; offset: number } {
  return { limit: q.per_page, offset: (q.page - 1) * q.per_page };
}

/** Build the `{ data, meta }` envelope returned by every list endpoint. */
export function paginated<T>(data: T[], q: PaginationQuery, total: number): Paginated<T> {
  const meta: PageMeta = { page: q.page, per_page: q.per_page, total };
  return { data, meta };
}
