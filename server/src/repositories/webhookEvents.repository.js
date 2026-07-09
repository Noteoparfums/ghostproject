import { query, queryOne, pool } from '../lib/db.js';
export const webhookEventsRepository = {
    async insertIfNew(data, tx) {
        const executor = tx || pool;
        try {
            await executor.execute(`INSERT INTO payment_events (provider, event_id, type, payload) 
         VALUES (?, ?, ?, ?)`, [data.provider, data.eventId, data.type, JSON.stringify(data.payload)]);
            return true;
        }
        catch (err) {
            if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
                return false;
            }
            throw err;
        }
    },
    async findByEventId(provider, eventId, tx) {
        return queryOne('SELECT * FROM payment_events WHERE provider = ? AND event_id = ?', [provider, eventId], tx);
    },
    async markProcessed(provider, eventId, tx) {
        const executor = tx || pool;
        await executor.execute('UPDATE payment_events SET processed_at = NOW(), error_message = NULL WHERE provider = ? AND event_id = ?', [provider, eventId]);
    },
    async markFailed(provider, eventId, errorMsg, tx) {
        const executor = tx || pool;
        await executor.execute('UPDATE payment_events SET error_message = ? WHERE provider = ? AND event_id = ?', [errorMsg, provider, eventId]);
    }
};
//# sourceMappingURL=webhookEvents.repository.js.map