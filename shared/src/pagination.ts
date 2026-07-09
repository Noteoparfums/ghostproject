/**
 * Pagination: `?page=&per_page=` request schema + `{ data, meta }` envelope.
 */
import { z } from 'zod';

export const DEFAULT_PER_PAGE = 20;
export const MAX_PER_PAGE = 100;

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  per_page: z.coerce.number().int().min(1).max(MAX_PER_PAGE).default(DEFAULT_PER_PAGE),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

export interface PaginationMeta {
  page: number;
  per_page: number;
  total: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PaginationMeta;
}

/** Convert a validated pagination query into SQL LIMIT/OFFSET. */
export function toLimitOffset(q: PaginationQuery): { limit: number; offset: number } {
  return { limit: q.per_page, offset: (q.page - 1) * q.per_page };
}

/** Wrap rows + a total into the standard paginated envelope. */
export function paginate<T>(rows: T[], total: number, q: PaginationQuery): Paginated<T> {
  return { data: rows, meta: { page: q.page, per_page: q.per_page, total } };
}
