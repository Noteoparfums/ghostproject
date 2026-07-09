import { auditRepository } from '../repositories/audit.repository.js';
import type { TransactionConnection } from '../lib/db.js';

export const auditService = {
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
    await auditRepository.log(data, tx);
  }
};
