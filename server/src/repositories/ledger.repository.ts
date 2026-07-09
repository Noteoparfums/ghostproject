import { query, queryOne, pool, type TransactionConnection } from '../lib/db.js';
import type { LedgerSource } from '@ghostwriter/shared';

export interface LedgerRow {
  id: number;
  user_id: number;
  delta: string; // DECIMAL
  balance_after: string; // DECIMAL
  source: LedgerSource;
  generation_id: number | null;
  invoice_id: number | null;
  note: string | null;
  expires_at: Date | null;
  idempotency_key: string | null;
  created_at: Date;
  updated_at: Date;
}

export const ledgerRepository = {
  async balance(userId: number, tx?: TransactionConnection): Promise<number> {
    const row = await queryOne<{ bal: string }>(
      'SELECT COALESCE(SUM(delta), 0) AS bal FROM credit_ledger WHERE user_id = ?',
      [userId],
      tx
    );
    return Number(row?.bal ?? 0);
  },

  async balanceForUpdate(userId: number, tx: TransactionConnection): Promise<number> {
    // Acquire a row-lock on the user's credit ledger entries to prevent race conditions
    const [rows] = await tx.execute(
      'SELECT COALESCE(SUM(delta), 0) AS bal FROM credit_ledger WHERE user_id = ? FOR UPDATE',
      [userId]
    );
    return Number((rows as any)[0]?.bal ?? 0);
  },

  async write(data: {
    userId: number;
    delta: number;
    balanceAfter: number;
    source: LedgerSource;
    generationId?: number | null;
    invoiceId?: number | null;
    note?: string | null;
    idempotencyKey?: string | null;
  }, tx: TransactionConnection): Promise<number> {
    await tx.execute(
      `INSERT INTO credit_ledger 
      (user_id, delta, balance_after, source, generation_id, invoice_id, note, idempotency_key) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.userId,
        data.delta,
        data.balanceAfter,
        data.source,
        data.generationId || null,
        data.invoiceId || null,
        data.note || null,
        data.idempotencyKey || null
      ]
    );
    return data.balanceAfter;
  },

  async listByUser(userId: number, page = 1, perPage = 20, tx?: TransactionConnection): Promise<LedgerRow[]> {
    const offset = (page - 1) * perPage;
    return query<LedgerRow>(
      'SELECT * FROM credit_ledger WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [userId, perPage, offset],
      tx
    );
  }
};
