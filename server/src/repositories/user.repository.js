import { execute, query, queryOne } from '../lib/db.js';
import { randomToken, sha256 } from '../lib/jwt.js';
export const userRepository = {
    async findByEmail(email, tx) {
        return queryOne('SELECT * FROM users WHERE email = ? AND deleted_at IS NULL', [email], tx);
    },
    async findById(id, tx) {
        return queryOne('SELECT * FROM users WHERE id = ? AND deleted_at IS NULL', [id], tx);
    },
    async create(data, tx) {
        const result = await execute('INSERT INTO users (email, password_hash, name, marketing_opt_in, signup_utm) VALUES (?, ?, ?, ?, ?) RETURNING id', [data.email, data.password_hash, data.name, data.marketing_opt_in ? 1 : 0, data.signup_utm ? JSON.stringify(data.signup_utm) : null], tx);
        return result.rows[0].id;
    },
    async markEmailVerified(userId, tx) {
        await execute('UPDATE users SET email_verified_at = NOW() WHERE id = ?', [userId], tx);
    },
    async updatePassword(userId, passwordHash, tx) {
        await execute('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, userId], tx);
    },
    async updateProfile(userId, updates, tx) {
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
            await execute(`UPDATE users SET ${fields.join(', ')} WHERE id = ?`, params, tx);
        }
    },
    async softDelete(userId, tx) {
        await execute('UPDATE users SET deleted_at = NOW() WHERE id = ?', [userId], tx);
    }
};
export const sessionRepository = {
    async create(userId, refreshToken, ip, userAgent, expiresAt, tx) {
        const hash = sha256(refreshToken);
        const result = await execute('INSERT INTO sessions (user_id, refresh_token_hash, ip, user_agent, expires_at, last_active_at) VALUES (?, ?, ?, ?, ?, NOW()) RETURNING id', [userId, hash, ip, userAgent, expiresAt], tx);
        return result.rows[0].id;
    },
    async findValidByHash(hash, tx) {
        return queryOne('SELECT * FROM sessions WHERE refresh_token_hash = ? AND revoked_at IS NULL AND expires_at > NOW()', [hash], tx);
    },
    async updateActivity(sessionId, ip, tx) {
        await execute('UPDATE sessions SET last_active_at = NOW(), ip = ? WHERE id = ?', [ip, sessionId], tx);
    },
    async revoke(sessionId, tx) {
        await execute('UPDATE sessions SET revoked_at = NOW() WHERE id = ?', [sessionId], tx);
    },
    async revokeAllUserSessions(userId, tx) {
        await execute('UPDATE sessions SET revoked_at = NOW() WHERE user_id = ? AND revoked_at IS NULL', [userId], tx);
    },
    async revokeAllOthers(userId, currentSessionId, tx) {
        await execute('UPDATE sessions SET revoked_at = NOW() WHERE user_id = ? AND id != ? AND revoked_at IS NULL', [userId, currentSessionId], tx);
    },
    async listActiveForUser(userId, tx) {
        return query('SELECT * FROM sessions WHERE user_id = ? AND revoked_at IS NULL AND expires_at > NOW() ORDER BY last_active_at DESC', [userId], tx);
    }
};
export const tokenRepository = {
    async createEmailVerificationToken(userId, tx) {
        const token = randomToken(32);
        const hash = sha256(token);
        await execute("INSERT INTO email_verification_tokens (user_id, token_hash, expires_at) VALUES (?, ?, NOW() + INTERVAL '24 hours')", [userId, hash], tx);
        return token;
    },
    async consumeEmailVerificationToken(token, tx) {
        const hash = sha256(token);
        const row = await queryOne('SELECT id, user_id FROM email_verification_tokens WHERE token_hash = ? AND used_at IS NULL AND expires_at > NOW()', [hash], tx);
        if (!row)
            return null;
        await execute('UPDATE email_verification_tokens SET used_at = NOW() WHERE id = ?', [row.id], tx);
        return row.user_id;
    },
    async createPasswordResetToken(userId, tx) {
        const token = randomToken(32);
        const hash = sha256(token);
        await execute("INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES (?, ?, NOW() + INTERVAL '1 hour')", [userId, hash], tx);
        return token;
    },
    async consumePasswordResetToken(token, tx) {
        const hash = sha256(token);
        const row = await queryOne('SELECT id, user_id FROM password_reset_tokens WHERE token_hash = ? AND used_at IS NULL AND expires_at > NOW()', [hash], tx);
        if (!row)
            return null;
        await execute('UPDATE password_reset_tokens SET used_at = NOW() WHERE id = ?', [row.id], tx);
        return row.user_id;
    }
};
//# sourceMappingURL=user.repository.js.map