import { logger } from '../lib/logger.js';
import type { Plan, PaymentProviderKind, BillingInterval } from '@ghostwriter/shared';
import { randomUUID } from 'node:crypto';

export interface CheckoutSession {
  url: string;
  id: string;
}

export interface PaymentAdapter {
  kind: PaymentProviderKind;
  createSubscriptionCheckout(userId: number, userEmail: string, plan: Plan, interval: BillingInterval): Promise<CheckoutSession>;
  createTopupCheckout(userId: number, userEmail: string, amountCents: number): Promise<CheckoutSession>;
  createCustomerPortal(userId: number, customerId: string): Promise<string>;
  cancelSubscription(subscriptionId: string): Promise<void>;
  refundPayment(paymentIntentId: string, amountCents: number): Promise<void>;
}

export class MockPaymentAdapter implements PaymentAdapter {
  kind: PaymentProviderKind = 'mock';

  async createSubscriptionCheckout(userId: number, userEmail: string, plan: Plan, interval: BillingInterval): Promise<CheckoutSession> {
    const id = `mock_cs_${randomUUID()}`;
    logger.info({ userId, planId: plan.id, interval }, 'Created mock subscription checkout');
    return {
      id,
      url: `/app/billing/mock-checkout?session_id=${id}&type=subscription&plan=${plan.slug}&interval=${interval}`
    };
  }

  async createTopupCheckout(userId: number, userEmail: string, amountCents: number): Promise<CheckoutSession> {
    const id = `mock_cs_${randomUUID()}`;
    logger.info({ userId, amountCents }, 'Created mock topup checkout');
    return {
      id,
      url: `/app/billing/mock-checkout?session_id=${id}&type=topup&amount=${amountCents}`
    };
  }

  async createCustomerPortal(userId: number, customerId: string): Promise<string> {
    logger.info({ userId, customerId }, 'Created mock customer portal session');
    return `/app/billing`;
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    logger.info({ subscriptionId }, 'Mock canceled subscription');
  }

  async refundPayment(paymentIntentId: string, amountCents: number): Promise<void> {
    logger.info({ paymentIntentId, amountCents }, 'Mock refunded payment');
  }
}

// You can add a StripePaymentAdapter implementation here in the future
export const paymentAdapter = new MockPaymentAdapter();
