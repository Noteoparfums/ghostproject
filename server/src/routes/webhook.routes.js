import { Router } from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { webhookController } from '../controllers/webhook.controller.js';
const router = Router();
router.post('/stripe', asyncHandler(webhookController.handleStripe));
router.post('/mock', asyncHandler(webhookController.handleStripe));
export default router;
//# sourceMappingURL=webhook.routes.js.map