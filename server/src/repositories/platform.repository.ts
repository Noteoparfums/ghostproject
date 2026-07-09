import { query, queryOne, pool, type TransactionConnection } from '../lib/db.js';

export interface TicketRow {
  id: number;
  user_id: number;
  subject: string;
  priority: 'low' | 'normal' | 'high';
  status: 'open' | 'answered' | 'closed';
  created_at: Date;
  updated_at: Date;
}

export interface TicketMessageRow {
  id: number;
  ticket_id: number;
  sender: 'user' | 'staff';
  message: string;
  created_at: Date;
}

export interface ChangelogEntryRow {
  id: number;
  title: string;
  body: string;
  version: string | null;
  published: boolean;
  created_at: Date;
  updated_at: Date;
}

export const ticketRepository = {
  async create(data: {
    userId: number;
    subject: string;
    priority?: 'low' | 'normal' | 'high';
  }, tx?: TransactionConnection): Promise<number> {
    const executor = tx || pool;
    const [result] = await executor.execute(
      'INSERT INTO tickets (user_id, subject, priority, status) VALUES (?, ?, ?, "open")',
      [data.userId, data.subject, data.priority || 'normal']
    );
    return (result as any).insertId;
  },

  async findById(id: number, tx?: TransactionConnection): Promise<TicketRow | null> {
    return queryOne<TicketRow>('SELECT * FROM tickets WHERE id = ?', [id], tx);
  },

  async listByUser(userId: number, tx?: TransactionConnection): Promise<TicketRow[]> {
    return query<TicketRow>('SELECT * FROM tickets WHERE user_id = ? ORDER BY updated_at DESC', [userId], tx);
  },

  async updateStatus(id: number, status: 'open' | 'answered' | 'closed', tx?: TransactionConnection): Promise<void> {
    const executor = tx || pool;
    await executor.execute('UPDATE tickets SET status = ? WHERE id = ?', [status, id]);
  },

  async addMessage(data: {
    ticketId: number;
    sender: 'user' | 'staff';
    message: string;
  }, tx?: TransactionConnection): Promise<number> {
    const executor = tx || pool;
    const [result] = await executor.execute(
      'INSERT INTO ticket_messages (ticket_id, sender, message) VALUES (?, ?, ?)',
      [data.ticketId, data.sender, data.message]
    );
    // Touch the ticket to update its updated_at timestamp
    await executor.execute('UPDATE tickets SET updated_at = NOW() WHERE id = ?', [data.ticketId]);
    return (result as any).insertId;
  },

  async getMessages(ticketId: number, tx?: TransactionConnection): Promise<TicketMessageRow[]> {
    return query<TicketMessageRow>('SELECT * FROM ticket_messages WHERE ticket_id = ? ORDER BY created_at ASC', [ticketId], tx);
  }
};

export const changelogRepository = {
  async create(data: {
    title: string;
    body: string;
    version?: string | null;
    published?: boolean;
  }, tx?: TransactionConnection): Promise<number> {
    const executor = tx || pool;
    const [result] = await executor.execute(
      'INSERT INTO changelog_entries (title, body, version, published) VALUES (?, ?, ?, ?)',
      [data.title, data.body, data.version || null, data.published ? 1 : 0]
    );
    return (result as any).insertId;
  },

  async listPublished(tx?: TransactionConnection): Promise<ChangelogEntryRow[]> {
    return query<ChangelogEntryRow>('SELECT * FROM changelog_entries WHERE published = 1 ORDER BY created_at DESC', [], tx);
  },

  async listAll(tx?: TransactionConnection): Promise<ChangelogEntryRow[]> {
    return query<ChangelogEntryRow>('SELECT * FROM changelog_entries ORDER BY created_at DESC', [], tx);
  }
};

export const newsletterRepository = {
  async subscribe(email: string, source?: string | null, tx?: TransactionConnection): Promise<void> {
    const executor = tx || pool;
    await executor.execute(
      `INSERT INTO newsletter_subscribers (email, source) 
       VALUES (?, ?)
       ON DUPLICATE KEY UPDATE updated_at = NOW()`,
      [email, source || null]
    );
  }
};
