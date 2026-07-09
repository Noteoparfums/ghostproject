import { z } from 'zod';
/**
 * The single zod env schema. `loadEnv()` fails fast with a human-readable list of
 * every missing/invalid variable — never a stack trace, never a partial boot.
 * This is the ONLY place raw `process.env` should be read.
 */
export declare const envSchema: z.ZodEffects<z.ZodObject<{
    DATABASE_URL: z.ZodString;
    PORT: z.ZodDefault<z.ZodNumber>;
    NODE_ENV: z.ZodDefault<z.ZodEnum<["development", "staging", "production"]>>;
    APP_URL: z.ZodDefault<z.ZodString>;
    APP_VERSION: z.ZodDefault<z.ZodString>;
    JWT_SECRET: z.ZodOptional<z.ZodString>;
    AI_PROVIDER: z.ZodDefault<z.ZodEnum<["mock", "openai", "anthropic"]>>;
    AI_API_KEY: z.ZodOptional<z.ZodString>;
    AI_MODEL: z.ZodOptional<z.ZodString>;
    STRIPE_SECRET_KEY: z.ZodOptional<z.ZodString>;
    STRIPE_WEBHOOK_SECRET: z.ZodOptional<z.ZodString>;
    MOCK_WEBHOOK_SECRET: z.ZodDefault<z.ZodString>;
    SMTP_URL: z.ZodOptional<z.ZodString>;
    MAINTENANCE_MODE: z.ZodDefault<z.ZodBoolean>;
    LOG_LEVEL: z.ZodDefault<z.ZodEnum<["debug", "info", "warn", "error"]>>;
    ALERT_WEBHOOK_URL: z.ZodOptional<z.ZodString>;
    SENTRY_DSN: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    DATABASE_URL: string;
    PORT: number;
    NODE_ENV: "development" | "staging" | "production";
    APP_URL: string;
    APP_VERSION: string;
    AI_PROVIDER: "mock" | "openai" | "anthropic";
    MOCK_WEBHOOK_SECRET: string;
    MAINTENANCE_MODE: boolean;
    LOG_LEVEL: "debug" | "info" | "warn" | "error";
    JWT_SECRET?: string | undefined;
    AI_API_KEY?: string | undefined;
    AI_MODEL?: string | undefined;
    STRIPE_SECRET_KEY?: string | undefined;
    STRIPE_WEBHOOK_SECRET?: string | undefined;
    SMTP_URL?: string | undefined;
    ALERT_WEBHOOK_URL?: string | undefined;
    SENTRY_DSN?: string | undefined;
}, {
    DATABASE_URL: string;
    PORT?: number | undefined;
    NODE_ENV?: "development" | "staging" | "production" | undefined;
    APP_URL?: string | undefined;
    APP_VERSION?: string | undefined;
    JWT_SECRET?: string | undefined;
    AI_PROVIDER?: "mock" | "openai" | "anthropic" | undefined;
    AI_API_KEY?: string | undefined;
    AI_MODEL?: string | undefined;
    STRIPE_SECRET_KEY?: string | undefined;
    STRIPE_WEBHOOK_SECRET?: string | undefined;
    MOCK_WEBHOOK_SECRET?: string | undefined;
    SMTP_URL?: string | undefined;
    MAINTENANCE_MODE?: boolean | undefined;
    LOG_LEVEL?: "debug" | "info" | "warn" | "error" | undefined;
    ALERT_WEBHOOK_URL?: string | undefined;
    SENTRY_DSN?: string | undefined;
}>, {
    DATABASE_URL: string;
    PORT: number;
    NODE_ENV: "development" | "staging" | "production";
    APP_URL: string;
    APP_VERSION: string;
    AI_PROVIDER: "mock" | "openai" | "anthropic";
    MOCK_WEBHOOK_SECRET: string;
    MAINTENANCE_MODE: boolean;
    LOG_LEVEL: "debug" | "info" | "warn" | "error";
    JWT_SECRET?: string | undefined;
    AI_API_KEY?: string | undefined;
    AI_MODEL?: string | undefined;
    STRIPE_SECRET_KEY?: string | undefined;
    STRIPE_WEBHOOK_SECRET?: string | undefined;
    SMTP_URL?: string | undefined;
    ALERT_WEBHOOK_URL?: string | undefined;
    SENTRY_DSN?: string | undefined;
}, {
    DATABASE_URL: string;
    PORT?: number | undefined;
    NODE_ENV?: "development" | "staging" | "production" | undefined;
    APP_URL?: string | undefined;
    APP_VERSION?: string | undefined;
    JWT_SECRET?: string | undefined;
    AI_PROVIDER?: "mock" | "openai" | "anthropic" | undefined;
    AI_API_KEY?: string | undefined;
    AI_MODEL?: string | undefined;
    STRIPE_SECRET_KEY?: string | undefined;
    STRIPE_WEBHOOK_SECRET?: string | undefined;
    MOCK_WEBHOOK_SECRET?: string | undefined;
    SMTP_URL?: string | undefined;
    MAINTENANCE_MODE?: boolean | undefined;
    LOG_LEVEL?: "debug" | "info" | "warn" | "error" | undefined;
    ALERT_WEBHOOK_URL?: string | undefined;
    SENTRY_DSN?: string | undefined;
}>;
export type Env = z.infer<typeof envSchema>;
/** Format zod issues into a readable, per-variable bullet list. */
export declare function formatEnvErrors(error: z.ZodError): string[];
export interface LoadEnvResult {
    ok: true;
    env: Env;
    warnings: string[];
}
export interface LoadEnvFailure {
    ok: false;
    errors: string[];
}
/**
 * Parse and validate the given source (defaults to process.env).
 * Returns a discriminated result so callers can decide how to exit — the server
 * boot prints errors and exits(1); tests assert on the messages.
 */
export declare function parseEnv(source?: Record<string, unknown>): LoadEnvResult | LoadEnvFailure;
/**
 * Convenience loader for runtime boot: prints and exits on failure. Not used by
 * tests (they call parseEnv directly to assert on messages).
 */
export declare function loadEnv(source?: Record<string, unknown>): Env;
//# sourceMappingURL=env.d.ts.map