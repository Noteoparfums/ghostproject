import { env } from './env.js';

export const runtime = {
  isProd: env.NODE_ENV === 'production',
  isStaging: env.NODE_ENV === 'staging',
  isDev: env.NODE_ENV === 'development',
  devSurfacesEnabled: env.NODE_ENV !== 'production',
  mailer: {
    provider: env.SMTP_URL ? 'smtp' : 'mock',
  },
  ai: {
    provider: env.AI_PROVIDER,
    model: env.AI_MODEL,
  },
  payment: {
    provider: env.STRIPE_SECRET_KEY ? 'stripe' : 'mock',
  }
};
