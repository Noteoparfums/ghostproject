import type { PlanSlug } from './creditCosts';

/**
 * Plan definitions used ONLY by the seed script to populate the `plans` table.
 * At runtime every price/credit figure must be read from the database — never
 * from this module.
 */
export interface PlanSeed {
  slug: PlanSlug;
  name: string;
  monthly_price_cents: number;
  annual_price_cents: number; // per-month price when billed annually
  monthly_credits: string; // DECIMAL(8,2) as string
  seats: number;
  features: string[];
}

export const PLAN_SEEDS: PlanSeed[] = [
  {
    slug: 'free',
    name: 'Free',
    monthly_price_cents: 0,
    annual_price_cents: 0,
    monthly_credits: '5.00',
    seats: 1,
    features: ['5 credits / month', 'Watermarked exports', 'Community support'],
  },
  {
    slug: 'pro',
    name: 'Pro',
    monthly_price_cents: 4900,
    annual_price_cents: 3900,
    monthly_credits: '100.00',
    seats: 1,
    features: [
      '100 credits / month',
      'All funnel types',
      'Brand voices',
      'A/B variants',
      'Priority queue',
    ],
  },
  {
    slug: 'agency',
    name: 'Agency',
    monthly_price_cents: 14900,
    annual_price_cents: 11900,
    monthly_credits: '500.00',
    seats: 5,
    features: [
      '500 credits / month',
      'White-label exports',
      'API access',
      'Priority support',
      'Pause option',
      '5 seats',
    ],
  },
];

/** Dunning retry schedule, in days after the first failed payment. */
export const DUNNING_RETRY_DAYS = [1, 3, 7] as const;

/** Grace period (days) in `past_due` before generation endpoints are blocked. */
export const DUNNING_GRACE_DAYS = 7;

/** Money-back guarantee window (days) for refund requests. */
export const REFUND_WINDOW_DAYS = 14;

/** Threshold below which the "credits low" email fires (fraction of monthly grant). */
export const CREDITS_LOW_THRESHOLD = 0.1;
