import { execute } from './db.js';
import crypto from 'node:crypto';

export const errorDigest = {
  async record(err: any) {
    try {
      const message = err?.message || 'Unknown error';
      const stack = err?.stack || '';

      // Get the top frame of the stack trace to group errors
      const frames = stack.split('\n');
      const topFrame = frames[1] || message;

      const hash = crypto.createHash('sha256').update(topFrame).digest('hex');

      await execute(
        `INSERT INTO error_digests (frame_hash, message, stack, count, first_seen, last_seen)
         VALUES (?, ?, ?, 1, NOW(), NOW())
         ON CONFLICT (frame_hash) DO UPDATE SET
           count = error_digests.count + 1,
           last_seen = NOW(),
           message = EXCLUDED.message,
           stack = EXCLUDED.stack`,
        [hash, message.slice(0, 500), stack]
      );
    } catch (e) {
      console.error('Failed to log error digest:', e);
    }
  }
};
