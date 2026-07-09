import { type TransactionConnection } from '../lib/db.js';
import type { Plan, Subscription, Invoice, SubscriptionStatus, BillingInterval, InvoiceStatus, PaymentProviderKind } from '@ghostwriter/shared';
export declare const planRepository: {
    listActive(tx?: TransactionConnection): Promise<Plan[]>;
    findBySlug(slug: string, tx?: TransactionConnection): Promise<Plan | null>;
    findById(id: number, tx?: TransactionConnection): Promise<Plan | null>;
};
export declare const subscriptionRepository: {
    findActiveByUserId(userId: number, tx?: TransactionConnection): Promise<Subscription | null>;
    findByProviderId(providerSubscriptionId: string, tx?: TransactionConnection): Promise<Subscription | null>;
    create(data: {
        userId: number;
        planId: number;
        interval: BillingInterval;
        status: SubscriptionStatus;
        provider: PaymentProviderKind;
        providerSubscriptionId?: string;
        currentPeriodStart?: Date;
        currentPeriodEnd?: Date;
    }, tx?: TransactionConnection): Promise<number>;
    update(id: number, updates: {
        status?: SubscriptionStatus;
        planId?: number;
        interval?: BillingInterval;
        currentPeriodStart?: Date;
        currentPeriodEnd?: Date;
        cancelAtPeriodEnd?: boolean;
        cancelledAt?: Date | null;
        pausedUntil?: Date | null;
        providerSubscriptionId?: string;
        dunningAttempts?: number;
        pastDueSince?: Date | null;
    }, tx?: TransactionConnection): Promise<void>;
};
export declare const invoiceRepository: {
    create(data: {
        userId: number;
        subscriptionId?: number | null;
        number: string;
        kind: "subscription" | "topup";
        status: InvoiceStatus;
        currency: string;
        subtotalCents: number;
        taxCents: number;
        totalCents: number;
        taxRateBps: number;
        taxCountry?: string | null;
        reverseCharge?: boolean;
        provider: PaymentProviderKind;
        providerInvoiceId?: string | null;
        lineItems: any;
        billingSnapshot?: any;
        paidAt?: Date | null;
    }, tx?: TransactionConnection): Promise<number>;
    findById(id: number, tx?: TransactionConnection): Promise<Invoice | null>;
    findByNumber(number: string, tx?: TransactionConnection): Promise<Invoice | null>;
    updateStatus(id: number, status: InvoiceStatus, updates?: {
        paidAt?: Date | null;
        refundedAt?: Date | null;
    }, tx?: TransactionConnection): Promise<void>;
    listByUser(userId: number, limit?: number, tx?: TransactionConnection): Promise<Invoice[]>;
};
export declare const billingProfileRepository: {
    get(userId: number, tx?: TransactionConnection): Promise<any>;
    upsert(userId: number, data: any, tx?: TransactionConnection): Promise<void>;
};
export declare const couponRepository: {
    findByCode(code: string, tx?: TransactionConnection): Promise<any>;
};
export declare const taxRateRepository: {
    findByCountry(country: string, tx?: TransactionConnection): Promise<any>;
};
export declare const refundRepository: {
    create(data: {
        invoiceId: number;
        userId: number;
        amountCents: number;
        reason?: string | null;
        status: "requested" | "approved" | "rejected" | "processed";
    }, tx?: TransactionConnection): Promise<number>;
    findById(id: number, tx?: TransactionConnection): Promise<any>;
    updateStatus(id: number, status: "requested" | "approved" | "rejected" | "processed", processedAt?: Date | null, tx?: TransactionConnection): Promise<void>;
};
//# sourceMappingURL=billing.repository.d.ts.map