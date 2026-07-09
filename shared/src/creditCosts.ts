export const CREDIT_COSTS = {
  FULL_FUNNEL: 1.0,
  SECTION_REGEN: 0.25,
  VARIANT: 0.1,
} as const;

export const PLAN_SLUGS = ['free', 'pro', 'agency'] as const;
export type PlanSlug = (typeof PLAN_SLUGS)[number];

export const TOPUP_PACKS = {
  small: { credits: 25, price_cents: 1500 },
  large: { credits: 100, price_cents: 4900 },
} as const;
