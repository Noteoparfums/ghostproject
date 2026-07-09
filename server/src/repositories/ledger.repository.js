import { execute, query, queryOne } from '../lib/db.js';
export const ledgerRepository = {
    async balance(userId, tx) {
        const row = await queryOne('SELECT COALESCE(SUM(delta), 0) AS bal FROM credit_ledger WHERE user_id = ?', [userId], tx);
        return Number(row?.bal ?? 0);
    },
    async balanceForUpdate(userId, tx) {
        await execute('SELECT pg_advisory_xact_lock(?)', [userId], tx);
        const row = await queryOne('SELECT COALESCE(SUM(delta), 0) AS bal FROM credit_ledger WHERE user_id = ?', [userId], tx);
        return Number(row?.bal ?? 0);
    },
    async write(data, tx) {
        await execute(`INSERT INTO credit_ledger 
      (user_id, delta, balance_after, source, generation_id, invoice_id, note, idempotency_key) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
            data.userId,
            data.delta,
            data.balanceAfter,
            data.source,
            data.generationId || null,
            data.invoiceId || null,
            data.note || null,
            data.idempotencyKey || null
        ], tx);
        return data.balanceAfter;
    },
    async listByUser(userId, page = 1, perPage = 20, tx) {
        const offset = (page - 1) * perPage;
        return query('SELECT * FROM credit_ledger WHERE user_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?', [userId, perPage, offset], tx);
    }
};
//# sourceMappingURL=ledger.repository.js.map