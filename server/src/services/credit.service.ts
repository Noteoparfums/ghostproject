import { pool, queryOne } from '../lib/db.js';
import { InsufficientCredits } from '../lib/errors.js';

type LedgerSource =
  | 'plan_grant'
  | 'topup'
  | 'generation'
  | 'section_regen'
  | 'variant'
  | 'refund'
  | 'admin_adjust'
  | 'expiry';

export const creditService = {
  async balance(userId: number): Promise<number> {
    const row = await queryOne<{ bal: string }>(
      'SELECT COALESCE(SUM(delta),0) AS bal FROM credit_ledger WHERE user_id = ?',
      [userId],
    );
    return Number(row?.bal ?? 0);
  },

  /** Atomic ledger write. delta negative for charges. Uses a row lock on the user's ledger. */
  async write(
    userId: number,
    delta: number,
    source: LedgerSource,
    referenceId: string | null,
    note: string,
  ): Promise<number> {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();
      const [rows] = await conn.execute(
        'SELECT COALESCE(SUM(delta),0) AS bal FROM credit_ledger WHERE user_id = ? FOR UPDATE',
        [userId],
      );
      const current = Number((rows as any[])[0]?.bal ?? 0);
      const after = Math.round((current + delta) * 100) / 100;
      if (delta < 0 && after < -0.0001) {
        await conn.rollback();
        throw InsufficientCredits({ shortfall: Math.abs(after), balance: current });
      }
      await conn.execute(
        'INSERT INTO credit_ledger (user_id, delta, balance_after, source, reference_id, note) VALUES (?,?,?,?,?,?)',
        [userId, delta, after, source, referenceId, note],
      );
      await conn.commit();
      return after;
    } catch (e) {
      try {
        await conn.rollback();
      } catch {
        /* noop */
      }
      throw e;
    } finally {
      conn.release();
    }
  },

  charge(userId: number, cost: number, source: LedgerSource, ref: string, note: string) {
    return this.write(userId, -Math.abs(cost), source, ref, note);
  },
  refund(userId: number, amount: number, ref: string, note: string) {
    return this.write(userId, Math.abs(amount), 'refund', ref, note);
  },
  grant(userId: number, amount: number, source: LedgerSource, note: string) {
    return this.write(userId, Math.abs(amount), source, null, note);
  },
};
