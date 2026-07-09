import { logger } from '../lib/logger.js';
import { randomUUID } from 'node:crypto';
export class MockPaymentAdapter {
    kind = 'mock';
    async createSubscriptionCheckout(userId, userEmail, plan, interval) {
        const id = `mock_cs_${randomUUID()}`;
        logger.info({ userId, planId: plan.id, interval }, 'Created mock subscription checkout');
        return {
            id,
            url: `/app/billing/mock-checkout?session_id=${id}&type=subscription&plan=${plan.slug}&interval=${interval}`
        };
    }
    async createTopupCheckout(userId, userEmail, amountCents) {
        const id = `mock_cs_${randomUUID()}`;
        logger.info({ userId, amountCents }, 'Created mock topup checkout');
        return {
            id,
            url: `/app/billing/mock-checkout?session_id=${id}&type=topup&amount=${amountCents}`
        };
    }
    async createCustomerPortal(userId, customerId) {
        logger.info({ userId, customerId }, 'Created mock customer portal session');
        return `/app/billing`;
    }
    async cancelSubscription(subscriptionId) {
        logger.info({ subscriptionId }, 'Mock canceled subscription');
    }
    async refundPayment(paymentIntentId, amountCents) {
        logger.info({ paymentIntentId, amountCents }, 'Mock refunded payment');
    }
}
// You can add a StripePaymentAdapter implementation here in the future
export const paymentAdapter = new MockPaymentAdapter();
//# sourceMappingURL=payment.adapter.js.map