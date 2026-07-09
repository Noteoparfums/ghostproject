import type { Plan, PaymentProviderKind, BillingInterval } from '@ghostwriter/shared';
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
export declare class MockPaymentAdapter implements PaymentAdapter {
    kind: PaymentProviderKind;
    createSubscriptionCheckout(userId: number, userEmail: string, plan: Plan, interval: BillingInterval): Promise<CheckoutSession>;
    createTopupCheckout(userId: number, userEmail: string, amountCents: number): Promise<CheckoutSession>;
    createCustomerPortal(userId: number, customerId: string): Promise<string>;
    cancelSubscription(subscriptionId: string): Promise<void>;
    refundPayment(paymentIntentId: string, amountCents: number): Promise<void>;
}
export declare const paymentAdapter: MockPaymentAdapter;
//# sourceMappingURL=payment.adapter.d.ts.map