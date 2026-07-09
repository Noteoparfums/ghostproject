import { query, queryOne, pool } from '../lib/db.js';
export const ticketRepository = {
    async create(data, tx) {
        const executor = tx || pool;
        const [result] = await executor.execute('INSERT INTO tickets (user_id, subject, priority, status) VALUES (?, ?, ?, "open")', [data.userId, data.subject, data.priority || 'normal']);
        return result.insertId;
    },
    async findById(id, tx) {
        return queryOne('SELECT * FROM tickets WHERE id = ?', [id], tx);
    },
    async listByUser(userId, tx) {
        return query('SELECT * FROM tickets WHERE user_id = ? ORDER BY updated_at DESC', [userId], tx);
    },
    async updateStatus(id, status, tx) {
        const executor = tx || pool;
        await executor.execute('UPDATE tickets SET status = ? WHERE id = ?', [status, id]);
    },
    async addMessage(data, tx) {
        const executor = tx || pool;
        const [result] = await executor.execute('INSERT INTO ticket_messages (ticket_id, sender, message) VALUES (?, ?, ?)', [data.ticketId, data.sender, data.message]);
        // Touch the ticket to update its updated_at timestamp
        await executor.execute('UPDATE tickets SET updated_at = NOW() WHERE id = ?', [data.ticketId]);
        return result.insertId;
    },
    async getMessages(ticketId, tx) {
        return query('SELECT * FROM ticket_messages WHERE ticket_id = ? ORDER BY created_at ASC', [ticketId], tx);
    }
};
export const changelogRepository = {
    async create(data, tx) {
        const executor = tx || pool;
        const [result] = await executor.execute('INSERT INTO changelog_entries (title, body, version, published) VALUES (?, ?, ?, ?)', [data.title, data.body, data.version || null, data.published ? 1 : 0]);
        return result.insertId;
    },
    async listPublished(tx) {
        return query('SELECT * FROM changelog_entries WHERE published = 1 ORDER BY created_at DESC', [], tx);
    },
    async listAll(tx) {
        return query('SELECT * FROM changelog_entries ORDER BY created_at DESC', [], tx);
    }
};
export const newsletterRepository = {
    async subscribe(email, source, tx) {
        const executor = tx || pool;
        await executor.execute(`INSERT INTO newsletter_subscribers (email, source) 
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE updated_at = NOW()`, [email, source || null]);
    }
};
//# sourceMappingURL=platform.repository.js.map