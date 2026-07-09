import { z } from 'zod';

const envSchema = z
  .object({
    DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
    PORT: z.coerce.number().default(4001),
    NODE_ENV: z.enum(['development', 'staging', 'production']).default('development'),
    APP_URL: z.string().default('http://localhost:5173'),
    JWT_SECRET: z.string().min(16).optional(),
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

export function loadEnv(): Env {
  const parsed = envSchema.safeParse(process.env);
  if (!parsed.success) {
    console.error('Configuration invalid:');
    for (const issue of parsed.error.issues) {
      console.error(`  - ${issue.path.join('.')}: ${issue.message}`);
    }
    process.exit(1);
  }
  if (parsed.data.NODE_ENV !== 'production' && !parsed.data.JWT_SECRET) {
    console.warn('!!! Using insecure dev JWT secret — set JWT_SECRET for production !!!');
  }
  return parsed.data;
}

export const env = loadEnv();
export const isProd = env.NODE_ENV === 'production';
export const jwtSecret = env.JWT_SECRET ?? 'dev-insecure-secret-ghostwriter-os';
