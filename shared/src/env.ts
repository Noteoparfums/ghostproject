import { z } from 'zod';

/**
 * The single zod env schema. `loadEnv()` fails fast with a human-readable list of
 * every missing/invalid variable — never a stack trace, never a partial boot.
 * This is the ONLY place raw `process.env` should be read.
 */
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
    MOCK_WEBHOOK_SECRET: z.string().default('dev-webhook-secret'),

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
    if (v.NODE_ENV === 'production' && v.STRIPE_SECRET_KEY && !v.STRIPE_WEBHOOK_SECRET) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['STRIPE_WEBHOOK_SECRET'],
        message: 'STRIPE_WEBHOOK_SECRET is required when STRIPE_SECRET_KEY is set',
      });
    }
  });

export type Env = z.infer<typeof envSchema>;

/** Format zod issues into a readable, per-variable bullet list. */
export function formatEnvErrors(error: z.ZodError): string[] {
  return error.issues.map((issue) => {
    const path = issue.path.join('.') || '(root)';
    return `  - ${path}: ${issue.message}`;
  });
}

export interface LoadEnvResult {
  ok: true;
  env: Env;
  warnings: string[];
}

export interface LoadEnvFailure {
  ok: false;
  errors: string[];
}

import fs from 'node:fs';
import path from 'node:path';

function loadDotEnv() {
  const paths = [
    path.resolve(process.cwd(), '.env'),
    path.resolve(process.cwd(), '../.env')
  ];
  for (const envPath of paths) {
    if (fs.existsSync(envPath)) {
      try {
        const content = fs.readFileSync(envPath, 'utf-8');
        for (const line of content.split('\n')) {
          const cleanLine = line.trim();
          if (!cleanLine || cleanLine.startsWith('#')) continue;
          const match = cleanLine.match(/^([\w.-]+)\s*=\s*(.*)$/);
          if (match) {
            const key = match[1]!;
            let value = match[2] || '';
            if (value.startsWith('"') && value.endsWith('"')) {
              value = value.slice(1, -1);
            } else if (value.startsWith("'") && value.endsWith("'")) {
              value = value.slice(1, -1);
            }
            if (process.env[key] === undefined) {
              process.env[key] = value.trim();
            }
          }
        }
      } catch (err) {
        // ignore read errors
      }
    }
  }
}

/**
 * Parse and validate the given source (defaults to process.env).
 * Returns a discriminated result so callers can decide how to exit — the server
 * boot prints errors and exits(1); tests assert on the messages.
 */
export function parseEnv(source: Record<string, unknown> = process.env): LoadEnvResult | LoadEnvFailure {
  if (source === process.env) {
    loadDotEnv();
  }
  const parsed = envSchema.safeParse(source);
  if (!parsed.success) {
    return { ok: false, errors: formatEnvErrors(parsed.error) };
  }
  const warnings: string[] = [];
  if (parsed.data.NODE_ENV !== 'production' && !parsed.data.JWT_SECRET) {
    warnings.push('Using an insecure dev JWT secret — set JWT_SECRET for production.');
  }
  return { ok: true, env: parsed.data, warnings };
}

/**
 * Convenience loader for runtime boot: prints and exits on failure. Not used by
 * tests (they call parseEnv directly to assert on messages).
 */
export function loadEnv(source: Record<string, unknown> = process.env): Env {
  const result = parseEnv(source);
  if (!result.ok) {
    // eslint-disable-next-line no-console
    console.error('Configuration invalid:');
    for (const line of result.errors) {
      // eslint-disable-next-line no-console
      console.error(line);
    }
    process.exit(1);
  }
  for (const warning of result.warnings) {
    // eslint-disable-next-line no-console
    console.warn(`!!! ${warning}`);
  }
  return result.env;
}
