import { z } from 'zod';

export const idParam = z.object({ id: z.coerce.number().int().positive() });

export const createProjectBody = z.object({
  name: z.string().trim().min(1, 'Project name is required').max(120),
  description: z.string().trim().max(1000).optional().default(''),
});
export type CreateProjectInput = z.infer<typeof createProjectBody>;

export const patchProjectBody = z
  .object({
    name: z.string().trim().min(1).max(120).optional(),
    description: z.string().trim().max(1000).optional(),
    status: z.enum(['active', 'archived']).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, 'At least one field is required');
export type PatchProjectInput = z.infer<typeof patchProjectBody>;

export const listProjectsQuery = z.object({
  page: z.coerce.number().int().min(1).default(1),
  per_page: z.coerce.number().int().min(1).max(100).default(20),
  status: z.enum(['active', 'archived']).optional(),
});
