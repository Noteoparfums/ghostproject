import type { LedgerSource } from '@ghostwriter/shared';
export declare const creditService: {
    balance(userId: number): Promise<number>;
    /** Atomic ledger write. delta negative for charges. Uses a row lock on the user's ledger. */
    write(userId: number, delta: number, source: LedgerSource, refs?: {
        generationId?: number | null;
        invoiceId?: number | null;
        idempotencyKey?: string | null;
    }, note?: string): Promise<number>;
    charge(userId: number, cost: number, source: LedgerSource, refs?: {
        generationId?: number | null;
        invoiceId?: number | null;
        idempotencyKey?: string | null;
    }, note?: string): Promise<number>;
    refund(userId: number, amount: number, refs?: {
        generationId?: number | null;
        invoiceId?: number | null;
        idempotencyKey?: string | null;
    }, note?: string): Promise<number>;
    grant(userId: number, amount: number, source: LedgerSource, refs?: {
        generationId?: number | null;
        invoiceId?: number | null;
        idempotencyKey?: string | null;
    }, note?: string): Promise<number>;
};
//# sourceMappingURL=credit.service.d.ts.map