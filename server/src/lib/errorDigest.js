import { pool } from './db.js';
import crypto from 'node:crypto';
export const errorDigest = {
    async record(err) {
        try {
            const message = err?.message || 'Unknown error';
            const stack = err?.stack || '';
            // Get the top frame of the stack trace to group errors
            const frames = stack.split('\n');
            const topFrame = frames[1] || message;
            const hash = crypto.createHash('sha256').update(topFrame).digest('hex');
            await pool.execute(`INSERT INTO error_digests (frame_hash, message, stack, count, first_seen, last_seen)
         VALUES (?, ?, ?, 1, NOW(), NOW())
         ON DUPLICATE KEY UPDATE
           count = count + 1,
           last_seen = NOW(),
           message = VALUES(message),
           stack = VALUES(stack)`, [hash, message.slice(0, 500), stack]);
        }
        catch (e) {
            console.error('Failed to log error digest:', e);
        }
    }
};
//# sourceMappingURL=errorDigest.js.map