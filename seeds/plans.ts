export interface PlanSeed {
  slug: 'free' | 'pro' | 'agency';
  name: string;
  monthly_price_cents: number;
  annual_price_cents: number;
  monthly_credits: number;
  features: string[];
  is_active: boolean;
  sort_order: number;
}

export const plansSeed: PlanSeed[] = [
  {
    slug: 'free',
    name: 'Free Starter',
    monthly_price_cents: 0,
    annual_price_cents: 0,
    monthly_credits: 10.00,
    features: ['VSL funnels only', 'Watermark on PDF exports', 'Max 3 concurrent generations'],
    is_active: true,
    sort_order: 1,
  },
  {
    slug: 'pro',
    name: 'Pro Copywriter',
    monthly_price_cents: 4900,
    annual_price_cents: 47000,
    monthly_credits: 100.00,
    features: ['All funnels enabled', 'No watermarks', 'Priority email support', 'API access'],
    is_active: true,
    sort_order: 2,
  },
  {
    slug: 'agency',
    name: 'Agency Studio',
    monthly_price_cents: 19900,
    annual_price_cents: 191000,
    monthly_credits: 500.00,
    features: ['Custom templates', 'Team workspaces (5 seats)', 'Dedicated support manager', 'Highest generation concurrency'],
    is_active: true,
    sort_order: 3,
  },
];
