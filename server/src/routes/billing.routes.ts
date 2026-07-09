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

router.get('/state', asyncHandler(billingController.getBillingState));
router.get('/invoices', asyncHandler(billingController.getInvoices));
router.post('/checkout/subscription', validate({ body: createSubscriptionSchema }), asyncHandler(billingController.createSubscriptionCheckout));
router.post('/checkout/topup', validate({ body: topupSchema }), asyncHandler(billingController.createTopupCheckout));
router.post('/portal', asyncHandler(billingController.createPortal));
router.post('/subscription/cancel', asyncHandler(billingController.cancelSubscription));

export default router;
