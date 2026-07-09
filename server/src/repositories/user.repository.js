import { query, queryOne, pool } from '../lib/db.js';
import { randomToken, sha256 } from '../lib/jwt.js';
export const userRepository = {
    async findByEmail(email, tx) {
        return queryOne('SELECT * FROM users WHERE email = ? AND deleted_at IS NULL', [email], tx);
    },
    async findById(id, tx) {
        return queryOne('SELECT * FROM users WHERE id = ? AND deleted_at IS NULL', [id], tx);
    },
    async create(data, tx) {
        const executor = tx || pool;
        const [result] = await executor.execute('INSERT INTO users (email, password_hash, name, marketing_opt_in, signup_utm) VALUES (?, ?, ?, ?, ?)', [data.email, data.password_hash, data.name, data.marketing_opt_in, data.signup_utm ? JSON.stringify(data.signup_utm) : null]);
        return result.insertId;
    },
    async markEmailVerified(userId, tx) {
        const executor = tx || pool;
        await executor.execute('UPDATE users SET email_verified_at = NOW() WHERE id = ?', [userId]);
    },
    async updatePassword(userId, passwordHash, tx) {
        const executor = tx || pool;
        await executor.execute('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, userId]);
    },
    async updateProfile(userId, updates, tx) {
        const executor = tx || pool;
        const fields = [];
        const params = [];
        if (updates.name !== undefined) {
            fields.push('name = ?');
            params.push(updates.name);
        }
        if (updates.avatarUrl !== undefined) {
            fields.push('avatar_url = ?');
            params.push(updates.avatarUrl);
        }
        if (updates.marketing !== undefined) {
            fields.push('marketing_opt_in = ?');
            params.push(updates.marketing ? 1 : 0);
        }
        if (fields.length > 0) {
            params.push(userId);
            await executor.execute(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, params);
        }
    },
    async softDelete(userId, tx) {
        const executor = tx || pool;
        await executor.execute('UPDATE users SET deleted_at = NOW() WHERE id = ?', [userId]);
    }
};
export const sessionRepository = {
    async create(userId, refreshToken, ip, userAgent, expiresAt, tx) {
        const executor = tx || pool;
        const hash = sha256(refreshToken);
        const [result] = await executor.execute('INSERT INTO sessions (user_id, refresh_token_hash, ip, user_agent, expires_at, last_active_at) VALUES (?, ?, ?, ?, ?, NOW())', [userId, hash, ip, userAgent, expiresAt]);
        return result.insertId;
    },
    async findValidByHash(hash, tx) {
        return queryOne('SELECT * FROM sessions WHERE refresh_token_hash = ? AND revoked_at IS NULL AND expires_at > NOW()', [hash], tx);
    },
    async updateActivity(sessionId, ip, tx) {
        const executor = tx || pool;
        await executor.execute('UPDATE sessions SET last_active_at = NOW(), ip = ? WHERE id = ?', [ip, sessionId]);
    },
    async revoke(sessionId, tx) {
        const executor = tx || pool;
        await executor.execute('UPDATE sessions SET revoked_at = NOW() WHERE id = ?', [sessionId]);
    },
    async revokeAllUserSessions(userId, tx) {
        const executor = tx || pool;
        await executor.execute('UPDATE sessions SET revoked_at = NOW() WHERE user_id = ? AND revoked_at IS NULL', [userId]);
    },
    async revokeAllOthers(userId, currentSessionId, tx) {
        const executor = tx || pool;
        await executor.execute('UPDATE sessions SET revoked_at = NOW() WHERE user_id = ? AND id != ? AND revoked_at IS NULL', [userId, currentSessionId]);
    },
    async listActiveForUser(userId, tx) {
        return query('SELECT * FROM sessions WHERE user_id = ? AND revoked_at IS NULL AND expires_at > NOW() ORDER BY last_active_at DESC', [userId], tx);
    }
};
export const tokenRepository = {
    async createEmailVerificationToken(userId, tx) {
        const executor = tx || pool;
        const token = randomToken(32);
        const hash = sha256(token);
        await executor.execute('INSERT INTO email_verification_tokens (user_id, token_hash, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 24 HOUR))', [userId, hash]);
        return token;
    },
    async consumeEmailVerificationToken(token, tx) {
        const executor = tx || pool;
        const hash = sha256(token);
        const row = await queryOne('SELECT id, user_id FROM email_verification_tokens WHERE token_hash = ? AND used_at IS NULL AND expires_at > NOW()', [hash], tx);
        if (!row)
            return null;
        await executor.execute('UPDATE email_verification_tokens SET used_at = NOW() WHERE id = ?', [row.id]);
        return row.user_id;
    },
    async createPasswordResetToken(userId, tx) {
        const executor = tx || pool;
        const token = randomToken(32);
        const hash = sha256(token);
        await executor.execute('INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 1 HOUR))', [userId, hash]);
        return token;
    },
    async consumePasswordResetToken(token, tx) {
        const executor = tx || pool;
        const hash = sha256(token);
        const row = await queryOne('SELECT id, user_id FROM password_reset_tokens WHERE token_hash = ? AND used_at IS NULL AND expires_at > NOW()', [hash], tx);
        if (!row)
            return null;
        await executor.execute('UPDATE password_reset_tokens SET used_at = NOW() WHERE id = ?', [row.id]);
        return row.user_id;
    }
};
//# sourceMappingURL=user.repository.js.map