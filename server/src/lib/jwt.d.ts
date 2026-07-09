export interface AccessPayload {
    id: number;
    role: 'user' | 'admin';
    email: string;
    sid: number;
}
export declare function signAccess(payload: AccessPayload): string;
export declare function verifyAccess(token: string): AccessPayload;
export declare function randomToken(bytes?: number): string;
export declare function sha256(input: string): string;
//# sourceMappingURL=jwt.d.ts.map