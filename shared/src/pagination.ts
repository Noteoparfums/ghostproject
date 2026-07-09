import { z } from 'zod';

export const PAGINATION_DEFAULT_PER_PAGE = 20;
export const PAGINATION_MAX_PER_PAGE = 100;

/** `?page=&per_page=` query schema shared by every paginated endpoint. */
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  per_page: z.coerce
    .number()
    .int()
    .min(1)
    .max(PAGINATION_MAX_PER_PAGE)
    .default(PAGINATION_DEFAULT_PER_PAGE),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

export interface PageMeta {
  page: number;
  per_page: number;
  total: number;
}

export interface PageEnvelope<T> {
  data: T[];
  meta: PageMeta;
}

export function pageMeta(query: PaginationQuery, total: number): PageMeta {
  return { page: query.page, per_page: query.per_page, total };
}

export function offsetOf(query: PaginationQuery): number {
  return (query.page - 1) * query.per_page;
}
