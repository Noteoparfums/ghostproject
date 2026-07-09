/**
 * Public barrel for @ghostwriter/shared. Client and server import from here (or
 * from the subpath exports declared in package.json). Single source of truth for
 * schemas, constants, error codes, the event catalog, and shared types.
 */

export * from './error-codes.js';
export * from './types.js';
export * from './money.js';
export * from './vat.js';
export * from './pagination.js';
export * from './env.js';

export * from './constants/plans.js';
export * from './constants/funnels.js';

export * from './analytics/events.js';

export * from './schemas/auth.js';
export * from './schemas/account.js';
export * from './schemas/projects.js';
export * from './schemas/brand-voice.js';
export * from './schemas/generation.js';
export * from './schemas/billing.js';
export * from './schemas/platform.js';
export * from './schemas/analytics.js';
