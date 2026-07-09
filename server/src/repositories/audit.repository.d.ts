import { type TransactionConnection } from '../lib/db.js';
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
export declare const auditRepository: {
    log(data: {
        actorType: "user" | "admin" | "system" | "webhook";
        actorId?: number | null;
        action: string;
        targetType?: string | null;
        targetId?: number | null;
        properties?: any;
        ipAddress?: string | null;
        userAgent?: string | null;
    }, tx?: TransactionConnection): Promise<void>;
};
//# sourceMappingURL=audit.repository.d.ts.map