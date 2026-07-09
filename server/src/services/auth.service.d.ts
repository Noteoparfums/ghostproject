import { type UserRow } from '../repositories/user.repository.js';
export declare const authService: {
    signup(data: {
        email: string;
        name: string;
        passwordRaw: string;
        marketingOptIn: boolean;
        signupUtm?: any;
    }): Promise<{
        user: UserRow;
        sessionId: number;
        accessToken: string;
        refreshToken: string;
    }>;
    login(email: string, passwordRaw: string, ip: string, userAgent: string): Promise<{
        user: UserRow;
        sessionId: number;
        accessToken: string;
        refreshToken: string;
    }>;
    createSession(user: UserRow, ip: string, userAgent: string): Promise<{
        user: UserRow;
        sessionId: number;
        accessToken: string;
        refreshToken: string;
    }>;
    refresh(refreshToken: string, ip: string): Promise<{
        accessToken: string;
        user: UserRow;
    }>;
    logout(sessionId: number): Promise<void>;
    verifyEmail(token: string): Promise<void>;
    requestPasswordReset(email: string): Promise<void>;
    resetPassword(token: string, newPasswordRaw: string): Promise<void>;
};
//# sourceMappingURL=auth.service.d.ts.map