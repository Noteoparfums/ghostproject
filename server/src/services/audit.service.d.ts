import type { TransactionConnection } from '../lib/db.js';
export declare const auditService: {
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
//# sourceMappingURL=audit.service.d.ts.map