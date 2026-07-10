export const PRICING_PLANS = [
  {
    name: 'Free Starter',
    slug: 'free',
    monthlyPriceCents: 0,
    annualPriceCents: 0,
    monthlyCredits: 10,
    description: 'Explore the VSL workflow with a focused monthly allowance.',
    features: ['10 monthly credits', 'VSL funnel generation', 'Project organization', 'Campaign history summaries'],
    recommended: false,
    ctaLabel: 'Get Started',
  },
  {
    name: 'Pro Copywriter',
    slug: 'pro',
    monthlyPriceCents: 4900,
    annualPriceCents: 47000,
    monthlyCredits: 100,
    description: 'For individual copywriters building campaigns across funnel types.',
    features: ['100 monthly credits', 'All available funnel types', 'Brand voice profiles', 'Supported section regeneration'],
    recommended: true,
    ctaLabel: 'Choose Pro',
  },
  {
    name: 'Agency Studio',
    slug: 'agency',
    monthlyPriceCents: 19900,
    annualPriceCents: 191000,
    monthlyCredits: 500,
    description: 'For teams coordinating higher-volume campaign work.',
    features: ['500 monthly credits', 'All available funnel types', 'Up to 5 seats', 'Dedicated support manager'],
    recommended: false,
    ctaLabel: 'Choose Agency',
  },
] as const;

export type PublicPlanSlug = (typeof PRICING_PLANS)[number]['slug'];