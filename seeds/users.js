import bcrypt from 'bcryptjs';
export const usersSeed = [
    {
        email: 'admin@ghostwriter.os',
        name: 'Administrator',
        role: 'admin',
        passwordRaw: 'AdminPass123!',
    },
    {
        email: 'demo@ghostwriter.os',
        name: 'Demo User',
        role: 'user',
        passwordRaw: 'DemoPass123!',
    },
];
export async function getHashedUsers() {
    return Promise.all(usersSeed.map(async (u) => ({
        ...u,
        passwordHash: await bcrypt.hash(u.passwordRaw, 10),
    })));
}
//# sourceMappingURL=users.js.map