import { loadEnv } from '@ghostwriter/shared';
export const env = loadEnv();
export const isProd = env.NODE_ENV === 'production';
export const jwtSecret = env.JWT_SECRET ?? 'dev-insecure-secret-ghostwriter-os';
//# sourceMappingURL=env.js.map