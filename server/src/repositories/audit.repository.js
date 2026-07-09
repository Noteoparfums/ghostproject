import { execute } from '../lib/db.js';
export const auditRepository = {
    async log(data, tx) {
        await execute(`INSERT INTO audit_logs (actor_type, actor_id, action, target_type, target_id, properties, ip_address, user_agent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`, [
            data.actorType,
            data.actorId || null,
            data.action,
            data.targetType || null,
            data.targetId || null,
            data.properties ? JSON.stringify(data.properties) : null,
            data.ipAddress || null,
            data.userAgent || null
        ], tx);
    }
};
//# sourceMappingURL=audit.repository.js.map