import { logger } from '../lib/logger.js';
import type { Plan, PaymentProviderKind, BillingInterval } from '@ghostwriter/shared';
import { AppError } from '../lib/errors.js';

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

export class UnavailablePaymentAdapter implements PaymentAdapter {
  kind: PaymentProviderKind = 'mock';

  async createSubscriptionCheckout(userId: number, userEmail: string, plan: Plan, interval: BillingInterval): Promise<CheckoutSession> {
    logger.warn({ userId, userEmail, planId: plan.id, interval }, 'Subscription checkout requested without a configured payment provider');
    throw new AppError('MAINTENANCE', 'Checkout is unavailable because a payment provider is not configured.');
  }

  async createTopupCheckout(userId: number, userEmail: string, amountCents: number): Promise<CheckoutSession> {
    logger.warn({ userId, userEmail, amountCents }, 'Top-up checkout requested without a configured payment provider');
    throw new AppError('MAINTENANCE', 'Top-up checkout is unavailable because a payment provider is not configured.');
  }

  async createCustomerPortal(userId: number, customerId: string): Promise<string> {
    logger.warn({ userId, customerId }, 'Billing portal requested without a configured payment provider');
    throw new AppError('MAINTENANCE', 'The billing portal is unavailable because a payment provider is not configured.');
  }

  async cancelSubscription(subscriptionId: string): Promise<void> {
    logger.warn({ subscriptionId }, 'Subscription cancellation requested without a configured payment provider');
    throw new AppError('MAINTENANCE', 'Cancellation is unavailable because a payment provider is not configured.');
  }

  async refundPayment(paymentIntentId: string, amountCents: number): Promise<void> {
    logger.warn({ paymentIntentId, amountCents }, 'Refund requested without a configured payment provider');
    throw new AppError('MAINTENANCE', 'Refunds are unavailable because a payment provider is not configured.');
  }
}

export const paymentAdapter = new UnavailablePaymentAdapter();
