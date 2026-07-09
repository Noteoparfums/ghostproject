import { withTransaction } from '../lib/db.js';
import { InsufficientCredits } from '../lib/errors.js';
import { ledgerRepository } from '../repositories/ledger.repository.js';
export const creditService = {
    async balance(userId) {
        return ledgerRepository.balance(userId);
    },
    /** Atomic ledger write. delta negative for charges. Uses a row lock on the user's ledger. */
    async write(userId, delta, source, refs = {}, note = '') {
        return withTransaction(async (tx) => {
            const current = await ledgerRepository.balanceForUpdate(userId, tx);
            const after = Math.round((current + delta) * 100) / 100;
            if (delta < 0 && after < -0.0001) {
                throw InsufficientCredits({ shortfall: Math.abs(after), balance: current });
            }
            await ledgerRepository.write({
                userId,
                delta,
                balanceAfter: after,
                source,
                generationId: refs.generationId,
                invoiceId: refs.invoiceId,
                idempotencyKey: refs.idempotencyKey,
                note
            }, tx);
            return after;
        });
    },
    async charge(userId, cost, source, refs = {}, note = '') {
        return this.write(userId, -Math.abs(cost), source, refs, note);
    },
    async refund(userId, amount, refs = {}, note = '') {
        return this.write(userId, Math.abs(amount), 'refund', refs, note);
    },
    async grant(userId, amount, source, refs = {}, note = '') {
        return this.write(userId, Math.abs(amount), source, refs, note);
    }
};
//# sourceMappingURL=credit.service.js.map