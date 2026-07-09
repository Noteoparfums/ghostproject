import { execute, query, queryOne } from '../lib/db.js';
export const ticketRepository = {
    async create(data, tx) {
        const result = await execute("INSERT INTO tickets (user_id, subject, priority, status) VALUES (?, ?, ?, 'open') RETURNING id", [data.userId, data.subject, data.priority || 'normal'], tx);
        return result.rows[0].id;
    },
    async findById(id, tx) {
        return queryOne('SELECT * FROM tickets WHERE id = ?', [id], tx);
    },
    async listByUser(userId, tx) {
        return query('SELECT * FROM tickets WHERE user_id = ? ORDER BY updated_at DESC', [userId], tx);
    },
    async updateStatus(id, status, tx) {
        await execute('UPDATE tickets SET status = ? WHERE id = ?', [status, id], tx);
    },
    async addMessage(data, tx) {
        const result = await execute('INSERT INTO ticket_messages (ticket_id, sender, message) VALUES (?, ?, ?) RETURNING id', [data.ticketId, data.sender, data.message], tx);
        await execute('UPDATE tickets SET updated_at = NOW() WHERE id = ?', [data.ticketId], tx);
        return result.rows[0].id;
    },
    async getMessages(ticketId, tx) {
        return query('SELECT * FROM ticket_messages WHERE ticket_id = ? ORDER BY created_at ASC', [ticketId], tx);
    }
};
export const changelogRepository = {
    async create(data, tx) {
        const result = await execute('INSERT INTO changelog_entries (title, body, version, published) VALUES (?, ?, ?, ?) RETURNING id', [data.title, data.body, data.version || null, data.published ? 1 : 0], tx);
        return result.rows[0].id;
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
        await execute(`INSERT INTO newsletter_subscribers (email, source) 
       VALUES (?, ?)
       ON CONFLICT (email) DO UPDATE SET updated_at = NOW()`, [email, source || null], tx);
    }
};
//# sourceMappingURL=platform.repository.js.map