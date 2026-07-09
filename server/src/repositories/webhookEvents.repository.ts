import { query, queryOne, pool, type TransactionConnection } from '../lib/db.js';

export interface PaymentEventRow {
  id: number;
  provider: string;
  event_id: string;
  type: string;
  payload: any;
  processed_at: Date | null;
  error_message: string | null;
  created_at: Date;
  updated_at: Date;
}

export const webhookEventsRepository = {
  async insertIfNew(
    data: {
      provider: string;
      eventId: string;
      type: string;
      payload: any;
    },
    tx?: TransactionConnection
  ): Promise<boolean> {
    const executor = tx || pool;
    try {
      await executor.execute(
        `INSERT INTO payment_events (provider, event_id, type, payload) 
         VALUES (?, ?, ?, ?)`,
        [data.provider, data.eventId, data.type, JSON.stringify(data.payload)]
      );
      return true;
    } catch (err: any) {
      if (err.code === 'ER_DUP_ENTRY' || err.errno === 1062) {
        return false;
      }
      throw err;
    }
  },

  async findByEventId(provider: string, eventId: string, tx?: TransactionConnection): Promise<PaymentEventRow | null> {
    return queryOne<PaymentEventRow>(
      'SELECT * FROM payment_events WHERE provider = ? AND event_id = ?',
      [provider, eventId],
      tx
    );
  },

  async markProcessed(provider: string, eventId: string, tx?: TransactionConnection): Promise<void> {
    const executor = tx || pool;
    await executor.execute(
      'UPDATE payment_events SET processed_at = NOW(), error_message = NULL WHERE provider = ? AND event_id = ?',
      [provider, eventId]
    );
  },

  async markFailed(provider: string, eventId: string, errorMsg: string, tx?: TransactionConnection): Promise<void> {
    const executor = tx || pool;
    await executor.execute(
      'UPDATE payment_events SET error_message = ? WHERE provider = ? AND event_id = ?',
      [errorMsg, provider, eventId]
    );
  }
};
