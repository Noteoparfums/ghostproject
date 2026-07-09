import { execute, queryOne } from '../lib/db.js';
export const webhookEventsRepository = {
    async insertIfNew(data, tx) {
        const result = await execute(`INSERT INTO payment_events (provider, event_id, type, payload) 
       VALUES (?, ?, ?, ?)
       ON CONFLICT (provider, event_id) DO NOTHING
       RETURNING id`, [data.provider, data.eventId, data.type, JSON.stringify(data.payload)], tx);
        return result.rowCount === 1;
    },
    async findByEventId(provider, eventId, tx) {
        return queryOne('SELECT * FROM payment_events WHERE provider = ? AND event_id = ?', [provider, eventId], tx);
    },
    async markProcessed(provider, eventId, tx) {
        await execute('UPDATE payment_events SET processed_at = NOW(), error_message = NULL WHERE provider = ? AND event_id = ?', [provider, eventId], tx);
    },
    async markFailed(provider, eventId, errorMsg, tx) {
        await execute('UPDATE payment_events SET error_message = ? WHERE provider = ? AND event_id = ?', [errorMsg, provider, eventId], tx);
    }
};
//# sourceMappingURL=webhookEvents.repository.js.map