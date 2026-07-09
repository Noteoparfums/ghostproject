/**
 * Plan slugs, credit costs, top-up packs, dunning schedule, refund window.
 * Pricing NUMBERS are the DB `plans` table's job (single source of truth); these
 * are the stable enums/constants the code branches on.
 */

export const PLAN_SLUGS = ['free', 'pro', 'agency'] as const;
export type PlanSlug = (typeof PLAN_SLUGS)[number];

export const BILLING_INTERVALS = ['monthly', 'annual'] as const;
export type BillingInterval = (typeof BILLING_INTERVALS)[number];

/**
 * Credit costs per action. These are product constants (not prices), so they
 * live in code and are imported everywhere — never string-duplicated.
 */
export const CREDIT_COSTS = {
  FULL_FUNNEL: 1.0,
  SECTION_REGEN: 0.25,
  VARIANT: 0.1,
} as const;

export type CreditCostKey = keyof typeof CREDIT_COSTS;

/** One-time credit top-up packs (identifier + credit amount). Price is in DB. */
export const TOPUP_PACKS = {
  pack_25: { slug: 'pack_25', credits: 25 },
  pack_100: { slug: 'pack_100', credits: 100 },
} as const;

export type TopupPackSlug = keyof typeof TOPUP_PACKS;

/** Ledger sources — mirrors the credit_ledger.source ENUM. */
export const LEDGER_SOURCES = [
  'plan_grant',
  'topup',
  'generation',
  'section_regen',
  'variant',
  'refund',
  'admin_adjust',
  'expiry',
] as const;
export type LedgerSource = (typeof LEDGER_SOURCES)[number];

/** Dunning retry schedule (days after the first failed payment). */
export const DUNNING_RETRY_DAYS = [1, 3, 7] as const;

/** Days of read-only grace before generation endpoints are blocked. */
export const DUNNING_GRACE_DAYS = 7;

/** Money-back window (days since invoice paid_at) in which a refund is allowed. */
export const REFUND_WINDOW_DAYS = 14;

/** Max concurrent generations per account before requests are queued. */
export const MAX_CONCURRENT_GENERATIONS = 3;
