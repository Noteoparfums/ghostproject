export declare const accountService: {
    getProfile(userId: number): Promise<import("../repositories/user.repository.js").UserRow>;
    updateProfile(userId: number, updates: {
        name?: string;
        avatarUrl?: string | null;
        marketing?: boolean;
    }): Promise<import("../repositories/user.repository.js").UserRow>;
    deleteAccount(userId: number): Promise<void>;
};
//# sourceMappingURL=account.service.d.ts.map