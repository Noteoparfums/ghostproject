export interface UserSeed {
    email: string;
    name: string;
    role: 'user' | 'admin';
    passwordRaw: string;
}
export declare const usersSeed: UserSeed[];
export declare function getHashedUsers(): Promise<{
    passwordHash: string;
    email: string;
    name: string;
    role: "user" | "admin";
    passwordRaw: string;
}[]>;
//# sourceMappingURL=users.d.ts.map