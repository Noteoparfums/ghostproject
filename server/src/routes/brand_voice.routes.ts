import { Router } from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { requireAuth } from '../middleware/auth.js';
import { brandVoiceController } from '../controllers/brand_voice.controller.js';
import { validate } from '../middleware/validate.js';
import { createBrandVoiceSchema, patchBrandVoiceSchema } from '@ghostwriter/shared';
import { z } from 'zod';

const router = Router();

router.use(requireAuth);

const idParamSchema = z.object({ id: z.coerce.number().int().positive() });

router.get('/', asyncHandler(brandVoiceController.list));
router.post('/', validate({ body: createBrandVoiceSchema }), asyncHandler(brandVoiceController.create));
router.get('/:id', validate({ params: idParamSchema }), asyncHandler(brandVoiceController.get));
router.patch('/:id', validate({ params: idParamSchema, body: patchBrandVoiceSchema }), asyncHandler(brandVoiceController.update));
router.delete('/:id', validate({ params: idParamSchema }), asyncHandler(brandVoiceController.delete));

export default router;
