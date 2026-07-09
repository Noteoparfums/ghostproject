import { parseEnv, type Env } from '@ghostwriter/shared';

export type { Env };

export function loadEnv(): Env {
  const result = parseEnv(process.env);
  if (!result.success) {
    console.error('Configuration invalid:');
    for (const issue of result.issues) {
      console.error(`  - ${issue.path}: ${issue.message}`);
    }
    process.exit(1);
  }
  if (result.env.NODE_ENV !== 'production' && !result.env.JWT_SECRET) {
    console.warn('!!! Using insecure dev JWT secret \u2014 set JWT_SECRET for production !!!');
  }
  return result.env;
}

export const env = loadEnv();
export const isProd = env.NODE_ENV === 'production';
export const jwtSecret = env.JWT_SECRET ?? 'dev-insecure-secret-ghostwriter-os';
