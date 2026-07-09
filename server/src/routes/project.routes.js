import { Router } from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { requireAuth } from '../middleware/auth.js';
import { projectController } from '../controllers/project.controller.js';
import { generationController } from '../controllers/generation.controller.js';
import { validate } from '../middleware/validate.js';
import { z } from 'zod';
import { projectIdParam, createProjectBody, patchProjectBody, listProjectsQuery } from '@ghostwriter/shared';
const router = Router();
router.use(requireAuth);
router.get('/', validate({ query: listProjectsQuery }), asyncHandler(projectController.list));
router.post('/', validate({ body: createProjectBody }), asyncHandler(projectController.create));
router.get('/:id', validate({ params: projectIdParam }), asyncHandler(projectController.get));
router.patch('/:id', validate({ params: projectIdParam, body: patchProjectBody }), asyncHandler(projectController.update));
router.delete('/:id', validate({ params: projectIdParam }), asyncHandler(projectController.delete));
// Nested route for assets in a project
router.get('/:projectId/assets', validate({ params: z.object({ projectId: z.coerce.number().int().positive() }) }), asyncHandler(generationController.listAssetsForProject));
export default router;
//# sourceMappingURL=project.routes.js.map