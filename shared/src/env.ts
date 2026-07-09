/**
 * zod env schema + loadEnv(). The single source of validated configuration.
 * loadEnv() fails fast with a human-readable list of every missing/invalid
 * variable — never a stack trace, never a partial boot.
 */
import { z } from 'zod';

export const envSchema = z
  .object({
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
    PORT: z.coerce.number().int().positive().default(4001),
    NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
    APP_URL: z.string().url().default('http://localhost:5173'),
    APP_VERSION: z.string().default('0.0.0-dev'),
    JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters').optional(),
    AI_PROVIDER: z.enum(['mock', 'openai', 'anthropic']).default('mock'),
    AI_API_KEY: z.string().optional(),
    AI_MODEL: z.string().optional(),
    STRIPE_SECRET_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),
    MOCK_WEBHOOK_SECRET: z.string().min(1).default('dev-webhook-secret'),
    SMTP_URL: z.string().optional(),
    MAINTENANCE_MODE: z.coerce.boolean().default(false),
    LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
    ALERT_WEBHOOK_URL: z.string().url().optional(),
    SENTRY_DSN: z.string().optional(),
  })
  .superRefine((v, ctx) => {
    if (v.NODE_ENV === 'production' && !v.JWT_SECRET) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['JWT_SECRET'],
        message: 'JWT_SECRET is required in production',
      });
    }
    if (v.AI_PROVIDER !== 'mock' && !v.AI_API_KEY) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['AI_API_KEY'],
        message: `AI_API_KEY is required when AI_PROVIDER=${v.AI_PROVIDER}`,
      });
    }
    if (v.NODE_ENV === 'production' && !v.STRIPE_SECRET_KEY && !v.SMTP_URL) {
      // Not fatal, but callers may warn. Left as a soft note (no issue added).
    }
  });

export type Env = z.infer<typeof envSchema>;

/** Format zod issues into one human-readable line per bad variable. */
export function formatEnvIssues(error: z.ZodError): string[] {
  return error.issues.map((issue) => {
    const path = issue.path.join('.') || '(root)';
    return `  - ${path}: ${issue.message}`;
  });
}

export interface LoadEnvResult {
  env: Env;
  warnings: string[];
}

/**
 * Parse process.env (or a provided source). On failure, throws an EnvValidationError
 * whose message lists every bad variable. Callers at the process boundary catch
 * this, print `error.message`, and `process.exit(1)` — no stack trace.
 */
export class EnvValidationError extends Error {
  constructor(public readonly issues: string[]) {
    super(`Configuration invalid:\n${issues.join('\n')}`);
    this.name = 'EnvValidationError';
  }
}

export function loadEnv(source: NodeJS.ProcessEnv = process.env): LoadEnvResult {
  const parsed = envSchema.safeParse(source);
  if (!parsed.success) {
    throw new EnvValidationError(formatEnvIssues(parsed.error));
  }
  const warnings: string[] = [];
  if (parsed.data.NODE_ENV !== 'production' && !parsed.data.JWT_SECRET) {
    warnings.push('Using insecure dev JWT secret — set JWT_SECRET for production.');
  }
  return { env: parsed.data, warnings };
}
