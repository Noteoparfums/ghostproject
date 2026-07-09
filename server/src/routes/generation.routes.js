import { Router } from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { requireAuth } from '../middleware/auth.js';
import { generationController } from '../controllers/generation.controller.js';
import { validate } from '../middleware/validate.js';
import { generateSchema, regenerateSectionSchema, patchAssetSchema, listGenerationsQuery } from '@ghostwriter/shared';
import { z } from 'zod';
const router = Router();
router.use(requireAuth);
const assetIdParamSchema = z.object({ assetId: z.coerce.number().int().positive() });
router.post('/', validate({ body: generateSchema }), asyncHandler(generationController.generate));
router.get('/', validate({ query: listGenerationsQuery }), asyncHandler(generationController.listGenerations));
router.post('/assets/:assetId/regenerate', validate({ params: assetIdParamSchema, body: regenerateSectionSchema }), asyncHandler(generationController.regenerateSection));
router.patch('/assets/:assetId', validate({ params: assetIdParamSchema, body: patchAssetSchema }), asyncHandler(generationController.updateAsset));
export default router;
//# sourceMappingURL=generation.routes.js.map