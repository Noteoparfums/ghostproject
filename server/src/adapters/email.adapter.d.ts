export interface EmailAdapter {
    sendVerificationEmail(to: string, token: string): Promise<void>;
    sendPasswordResetEmail(to: string, token: string): Promise<void>;
    sendWelcomeEmail(to: string, name: string): Promise<void>;
}
export declare class DevMailboxAdapter implements EmailAdapter {
    private appendToMailbox;
    sendVerificationEmail(to: string, token: string): Promise<void>;
    sendPasswordResetEmail(to: string, token: string): Promise<void>;
    sendWelcomeEmail(to: string, name: string): Promise<void>;
}
export declare const emailAdapter: DevMailboxAdapter;
//# sourceMappingURL=email.adapter.d.ts.map