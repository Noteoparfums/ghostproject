/**
 * Plan slugs, credit costs, top-up packs, dunning schedule, and the refund window.
 * Prices themselves live in the `plans` table (single source of truth); the numbers
 * here are the structural constants the code branches on.
 */
export const PLAN_SLUGS = ['free', 'pro', 'agency'];
export const BILLING_INTERVALS = ['monthly', 'annual'];
/**
 * Credit costs per action. These are usage-cost constants, not prices.
 * Section 6.G: full funnel = 1.00, section regen = 0.25, hook variant = 0.10.
 */
export const CREDIT_COSTS = {
    FULL_FUNNEL: 1.0,
    SECTION_REGEN: 0.25,
    VARIANT: 0.1,
};
/** One-time credit top-up packs (price in integer cents). Top-up credits never expire. */
export const TOPUP_PACKS = {
    small: { slug: 'small', credits: 25, price_cents: 1500 },
    large: { slug: 'large', credits: 100, price_cents: 4900 },
};
/** Dunning retry schedule in days after the initial failure. */
export const DUNNING_RETRY_DAYS = [1, 3, 7];
/** Days of grace after which generation endpoints are blocked while past_due. */
export const DUNNING_GRACE_DAYS = 7;
/** Money-back guarantee window (days since invoice paid_at). */
export const REFUND_WINDOW_DAYS = 14;
/** Max concurrent generations per account before requests are queued. */
export const MAX_CONCURRENT_GENERATIONS = 3;
/** Ledger sources — mirrors the credit_ledger.source ENUM in the schema. */
export const LEDGER_SOURCES = [
    'plan_grant',
    'topup',
    'generation',
    'section_regen',
    'variant',
    'refund',
    'admin_adjust',
    'expiry',
];
//# sourceMappingURL=plans.js.map