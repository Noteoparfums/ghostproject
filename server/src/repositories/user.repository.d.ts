import { type TransactionConnection } from '../lib/db.js';
import type { UserRole } from '@ghostwriter/shared';
export interface UserRow {
    id: number;
    email: string;
    password_hash: string;
    name: string;
    avatar_url: string | null;
    email_verified_at: Date | null;
    role: UserRole;
    marketing_opt_in: boolean;
    banned_at: Date | null;
    deleted_at: Date | null;
    signup_utm: any;
    created_at: Date;
    updated_at: Date;
}
export declare const userRepository: {
    findByEmail(email: string, tx?: TransactionConnection): Promise<UserRow | null>;
    findById(id: number, tx?: TransactionConnection): Promise<UserRow | null>;
    create(data: {
        email: string;
        password_hash: string;
        name: string;
        marketing_opt_in: boolean;
        signup_utm?: any;
    }, tx?: TransactionConnection): Promise<number>;
    markEmailVerified(userId: number, tx?: TransactionConnection): Promise<void>;
    updatePassword(userId: number, passwordHash: string, tx?: TransactionConnection): Promise<void>;
    updateProfile(userId: number, updates: {
        name?: string;
        avatarUrl?: string | null;
        marketing?: boolean;
    }, tx?: TransactionConnection): Promise<void>;
    softDelete(userId: number, tx?: TransactionConnection): Promise<void>;
};
export interface SessionRow {
    id: number;
    user_id: number;
    refresh_token_hash: string;
    user_agent: string | null;
    ip: string | null;
    last_active_at: Date | null;
    expires_at: Date;
    revoked_at: Date | null;
}
export declare const sessionRepository: {
    create(userId: number, refreshToken: string, ip: string, userAgent: string, expiresAt: Date, tx?: TransactionConnection): Promise<number>;
    findValidByHash(hash: string, tx?: TransactionConnection): Promise<SessionRow | null>;
    updateActivity(sessionId: number, ip: string, tx?: TransactionConnection): Promise<void>;
    revoke(sessionId: number, tx?: TransactionConnection): Promise<void>;
    revokeAllUserSessions(userId: number, tx?: TransactionConnection): Promise<void>;
    revokeAllOthers(userId: number, currentSessionId: number, tx?: TransactionConnection): Promise<void>;
    listActiveForUser(userId: number, tx?: TransactionConnection): Promise<SessionRow[]>;
};
export declare const tokenRepository: {
    createEmailVerificationToken(userId: number, tx?: TransactionConnection): Promise<string>;
    consumeEmailVerificationToken(token: string, tx?: TransactionConnection): Promise<number | null>;
    createPasswordResetToken(userId: number, tx?: TransactionConnection): Promise<string>;
    consumePasswordResetToken(token: string, tx?: TransactionConnection): Promise<number | null>;
};
//# sourceMappingURL=user.repository.d.ts.map