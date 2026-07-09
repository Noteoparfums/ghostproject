import { type TransactionConnection } from '../lib/db.js';
import type { LedgerSource } from '@ghostwriter/shared';
export interface LedgerRow {
    id: number;
    user_id: number;
    delta: string;
    balance_after: string;
    source: LedgerSource;
    generation_id: number | null;
    invoice_id: number | null;
    note: string | null;
    expires_at: Date | null;
    idempotency_key: string | null;
    created_at: Date;
    updated_at: Date;
}
export declare const ledgerRepository: {
    balance(userId: number, tx?: TransactionConnection): Promise<number>;
    balanceForUpdate(userId: number, tx: TransactionConnection): Promise<number>;
    write(data: {
        userId: number;
        delta: number;
        balanceAfter: number;
        source: LedgerSource;
        generationId?: number | null;
        invoiceId?: number | null;
        note?: string | null;
        idempotencyKey?: string | null;
    }, tx: TransactionConnection): Promise<number>;
    listByUser(userId: number, page?: number, perPage?: number, tx?: TransactionConnection): Promise<LedgerRow[]>;
};
//# sourceMappingURL=ledger.repository.d.ts.map