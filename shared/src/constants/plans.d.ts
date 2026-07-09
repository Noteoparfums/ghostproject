/**
 * Plan slugs, credit costs, top-up packs, dunning schedule, and the refund window.
 * Prices themselves live in the `plans` table (single source of truth); the numbers
 * here are the structural constants the code branches on.
 */
export declare const PLAN_SLUGS: readonly ["free", "pro", "agency"];
export type PlanSlug = (typeof PLAN_SLUGS)[number];
export declare const BILLING_INTERVALS: readonly ["monthly", "annual"];
export type BillingInterval = (typeof BILLING_INTERVALS)[number];
/**
 * Credit costs per action. These are usage-cost constants, not prices.
 * Section 6.G: full funnel = 1.00, section regen = 0.25, hook variant = 0.10.
 */
export declare const CREDIT_COSTS: {
    readonly FULL_FUNNEL: 1;
    readonly SECTION_REGEN: 0.25;
    readonly VARIANT: 0.1;
};
export type CreditAction = keyof typeof CREDIT_COSTS;
/** One-time credit top-up packs (price in integer cents). Top-up credits never expire. */
export declare const TOPUP_PACKS: {
    readonly small: {
        readonly slug: "small";
        readonly credits: 25;
        readonly price_cents: 1500;
    };
    readonly large: {
        readonly slug: "large";
        readonly credits: 100;
        readonly price_cents: 4900;
    };
};
export type TopupPackSlug = keyof typeof TOPUP_PACKS;
/** Dunning retry schedule in days after the initial failure. */
export declare const DUNNING_RETRY_DAYS: readonly [1, 3, 7];
/** Days of grace after which generation endpoints are blocked while past_due. */
export declare const DUNNING_GRACE_DAYS = 7;
/** Money-back guarantee window (days since invoice paid_at). */
export declare const REFUND_WINDOW_DAYS = 14;
/** Max concurrent generations per account before requests are queued. */
export declare const MAX_CONCURRENT_GENERATIONS = 3;
/** Ledger sources — mirrors the credit_ledger.source ENUM in the schema. */
export declare const LEDGER_SOURCES: readonly ["plan_grant", "topup", "generation", "section_regen", "variant", "refund", "admin_adjust", "expiry"];
export type LedgerSource = (typeof LEDGER_SOURCES)[number];
//# sourceMappingURL=plans.d.ts.map