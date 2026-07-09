import { billingService } from '../services/billing.service.js';
import { env } from '../config/env.js';
import { logger } from '../lib/logger.js';
import { AppError } from '../lib/errors.js';
import Stripe from 'stripe';
const stripe = env.STRIPE_SECRET_KEY ? new Stripe(env.STRIPE_SECRET_KEY) : null;
export const webhookController = {
    async handleStripe(req, res) {
        const sig = req.headers['stripe-signature'];
        let event;
        if (stripe && env.STRIPE_WEBHOOK_SECRET && sig) {
            try {
                event = stripe.webhooks.constructEvent(req.body, sig, env.STRIPE_WEBHOOK_SECRET);
            }
            catch (err) {
                logger.error({ err }, 'Stripe signature verification failed');
                throw new AppError('WEBHOOK_SIGNATURE_INVALID', 'Signature verification failed');
            }
        }
        else {
            // Fallback/Mock mode in development
            try {
                const bodyStr = Buffer.isBuffer(req.body) ? req.body.toString('utf-8') : JSON.stringify(req.body);
                event = JSON.parse(bodyStr);
            }
            catch (err) {
                logger.error({ err }, 'Failed to parse webhook body');
                throw new AppError('VALIDATION_ERROR', 'Invalid webhook payload');
            }
        }
        const provider = env.STRIPE_SECRET_KEY ? 'stripe' : 'mock';
        const result = await billingService.handleWebhookEvent(provider, event.id, event.type, event);
        res.json({ received: true, ...result });
    }
};
//# sourceMappingURL=webhook.controller.js.map