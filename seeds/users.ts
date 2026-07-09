import bcrypt from 'bcryptjs';

export interface UserSeed {
  email: string;
  name: string;
  role: 'user' | 'admin';
  passwordRaw: string;
}

export const usersSeed: UserSeed[] = [
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
  return Promise.all(
    usersSeed.map(async (u) => ({
      ...u,
      passwordHash: await bcrypt.hash(u.passwordRaw, 10),
    }))
  );
}
