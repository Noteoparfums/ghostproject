import { execute, queryOne, type TransactionConnection } from '../lib/db.js';

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
    const result = await execute<{ id: number }>(
      `INSERT INTO payment_events (provider, event_id, type, payload) 
       VALUES (?, ?, ?, ?)
       ON CONFLICT (provider, event_id) DO NOTHING
       RETURNING id`,
      [data.provider, data.eventId, data.type, JSON.stringify(data.payload)],
      tx
    );
    return result.rowCount === 1;
  },

  async findByEventId(provider: string, eventId: string, tx?: TransactionConnection): Promise<PaymentEventRow | null> {
    return queryOne<PaymentEventRow>(
      'SELECT * FROM payment_events WHERE provider = ? AND event_id = ?',
      [provider, eventId],
      tx
    );
  },

  async markProcessed(provider: string, eventId: string, tx?: TransactionConnection): Promise<void> {
    await execute(
      'UPDATE payment_events SET processed_at = NOW(), error_message = NULL WHERE provider = ? AND event_id = ?',
      [provider, eventId],
      tx
    );
  },

  async markFailed(provider: string, eventId: string, errorMsg: string, tx?: TransactionConnection): Promise<void> {
    await execute(
      'UPDATE payment_events SET error_message = ? WHERE provider = ? AND event_id = ?',
      [errorMsg, provider, eventId],
      tx
    );
  }
};
