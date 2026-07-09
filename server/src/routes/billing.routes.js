import { Router } from 'express';
import { asyncHandler } from '../lib/asyncHandler.js';
import { requireAuth } from '../middleware/auth.js';
import { billingController } from '../controllers/billing.controller.js';
import { validate } from '../middleware/validate.js';
import { z } from 'zod';
const router = Router();
router.use(requireAuth);
const createSubscriptionSchema = z.object({
    planSlug: z.string(),
    interval: z.enum(['monthly', 'annual'])
});
const topupSchema = z.object({
    amountCents: z.number().int().min(500)
});
const mockCheckoutCompleteSchema = z.object({
    type: z.enum(['subscription', 'topup']),
    planSlug: z.string().optional(),
    interval: z.enum(['monthly', 'annual']).optional(),
    amountCents: z.number().int().optional()
});
router.get('/state', asyncHandler(billingController.getBillingState));
router.get('/invoices', asyncHandler(billingController.getInvoices));
router.post('/checkout/subscription', validate({ body: createSubscriptionSchema }), asyncHandler(billingController.createSubscriptionCheckout));
router.post('/checkout/topup', validate({ body: topupSchema }), asyncHandler(billingController.createTopupCheckout));
router.post('/checkout/mock-complete', validate({ body: mockCheckoutCompleteSchema }), asyncHandler(billingController.completeMockCheckout));
router.post('/portal', asyncHandler(billingController.createPortal));
router.post('/subscription/cancel', asyncHandler(billingController.cancelSubscription));
export default router;
//# sourceMappingURL=billing.routes.js.map