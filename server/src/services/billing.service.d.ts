import type { BillingInterval } from '@ghostwriter/shared';
import { type TransactionConnection } from '../lib/db.js';
export declare const billingService: {
    getActivePlan(userId: number, tx?: TransactionConnection): Promise<{
        subscription: null;
        plan: import("@ghostwriter/shared").Plan | null;
    } | {
        subscription: import("@ghostwriter/shared").Subscription;
        plan: import("@ghostwriter/shared").Plan | null;
    }>;
    createSubscriptionCheckout(userId: number, planSlug: string, interval: BillingInterval): Promise<import("../adapters/payment.adapter.js").CheckoutSession>;
    createTopupCheckout(userId: number, amountCents: number): Promise<import("../adapters/payment.adapter.js").CheckoutSession>;
    createCustomerPortal(userId: number): Promise<string>;
    cancelSubscription(userId: number): Promise<void>;
    handleCheckoutCompleted(userId: number, type: "subscription" | "topup", planSlug?: string, interval?: BillingInterval, amountCents?: number): Promise<void>;
    handleWebhookEvent(provider: string, eventId: string, type: string, payload: any): Promise<any>;
};
//# sourceMappingURL=billing.service.d.ts.map