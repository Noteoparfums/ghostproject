import { loadEnv, type Env } from '@ghostwriter/shared';

export type { Env };

export const env = loadEnv();
export const isProd = env.NODE_ENV === 'production';
export const jwtSecret = env.JWT_SECRET ?? 'dev-insecure-secret-ghostwriter-os';
export const appUrl = env.APP_URL ?? (env.VERCEL_URL ? `https://${env.VERCEL_URL}` : 'http://localhost:5173');
