import { type Env } from '@ghostwriter/shared';
export type { Env };
export declare const env: {
    DATABASE_URL: string;
    PORT: number;
    NODE_ENV: "development" | "staging" | "production";
    APP_URL: string;
    APP_VERSION: string;
    AI_PROVIDER: "mock" | "groq" | "openai" | "anthropic";
    MOCK_WEBHOOK_SECRET: string;
    MAINTENANCE_MODE: boolean;
    LOG_LEVEL: "debug" | "info" | "warn" | "error";
    JWT_SECRET?: string | undefined;
    AI_API_KEY?: string | undefined;
    GROQ_API_KEY?: string | undefined;
    AI_MODEL?: string | undefined;
    AI_FALLBACK_MODELS?: string | undefined;
    STRIPE_SECRET_KEY?: string | undefined;
    STRIPE_WEBHOOK_SECRET?: string | undefined;
    SMTP_URL?: string | undefined;
    ALERT_WEBHOOK_URL?: string | undefined;
    SENTRY_DSN?: string | undefined;
};
export declare const isProd: boolean;
export declare const jwtSecret: string;
//# sourceMappingURL=env.d.ts.map