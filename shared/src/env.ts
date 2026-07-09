import { z } from 'zod';

/**
 * The single zod env schema. `parseEnv` is pure (returns errors); the server's
 * `loadEnv` wraps it and exits with a human-readable list of every bad var.
 */
export const envSchema = z
  .object({
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
    PORT: z.coerce.number().default(4001),
    NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
    APP_URL: z.string().default('http://localhost:5173'),
    JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters').optional(),
    AI_PROVIDER: z.enum(['mock', 'openai', 'anthropic']).default('mock'),
    AI_API_KEY: z.string().optional(),
    AI_MODEL: z.string().optional(),
    STRIPE_SECRET_KEY: z.string().optional(),
    STRIPE_WEBHOOK_SECRET: z.string().optional(),
    MOCK_WEBHOOK_SECRET: z.string().default('dev-webhook-secret'),
    SMTP_URL: z.string().optional(),
    MAINTENANCE_MODE: z.coerce.boolean().default(false),
    LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
    ALERT_WEBHOOK_URL: z.string().optional(),
    APP_VERSION: z.string().default('dev'),
  })
  .superRefine((v, ctx) => {
    if (v.NODE_ENV === 'production' && !v.JWT_SECRET) {
      ctx.addIssue({
        code: 'custom',
        path: ['JWT_SECRET'],
        message: 'JWT_SECRET is required in production',
      });
    }
    if (v.AI_PROVIDER !== 'mock' && !v.AI_API_KEY) {
      ctx.addIssue({
        code: 'custom',
        path: ['AI_API_KEY'],
        message: `AI_API_KEY required when AI_PROVIDER=${v.AI_PROVIDER}`,
      });
    }
  });

export type Env = z.infer<typeof envSchema>;

export type EnvParseResult =
  | { success: true; env: Env }
  | { success: false; issues: { path: string; message: string }[] };

export function parseEnv(source: Record<string, string | undefined>): EnvParseResult {
  const parsed = envSchema.safeParse(source);
  if (parsed.success) return { success: true, env: parsed.data };
  return {
    success: false,
    issues: parsed.error.issues.map((i) => ({
      path: i.path.join('.'),
      message: i.message,
    })),
  };
}
