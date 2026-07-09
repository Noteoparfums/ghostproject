import { pool, type TransactionConnection } from '../lib/db.js';

export interface AuditLogRaw {
  id: number;
  actor_type: 'user' | 'admin' | 'system' | 'webhook';
  actor_id: number | null;
  action: string;
  target_type: string | null;
  target_id: number | null;
  properties: any;
  ip_address: string | null;
  user_agent: string | null;
  created_at: Date;
}

export const auditRepository = {
  async log(
    data: {
      actorType: 'user' | 'admin' | 'system' | 'webhook';
      actorId?: number | null;
      action: string;
      targetType?: string | null;
      targetId?: number | null;
      properties?: any;
      ipAddress?: string | null;
      userAgent?: string | null;
    },
    tx?: TransactionConnection
  ): Promise<void> {
    const executor = tx || pool;
    await executor.execute(
      `INSERT INTO audit_logs (actor_type, actor_id, action, target_type, target_id, properties, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.actorType,
        data.actorId || null,
        data.action,
        data.targetType || null,
        data.targetId || null,
        data.properties ? JSON.stringify(data.properties) : null,
        data.ipAddress || null,
        data.userAgent || null
      ]
    );
  }
};
