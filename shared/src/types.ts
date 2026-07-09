import type { FunnelType, PipelineStage } from './funnels';

export interface Plan {
  id: number;
  slug: string;
  name: string;
  monthly_price_cents: number;
  annual_price_cents: number;
  monthly_credits: string;
  seats: number;
  features: string[];
  is_active: boolean;
}

export interface Me {
  id: number;
  email: string;
  name: string;
  role: 'user' | 'admin';
  avatar_url: string | null;
  email_verified: boolean;
  plan: { slug: string; name: string } | null;
  credits: string;
  unread_notifications: number;
}

export interface Subscription {
  id: number;
  status: 'trialing' | 'active' | 'past_due' | 'paused' | 'cancelled' | 'expired';
  interval: 'monthly' | 'annual';
  plan: Plan | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  pending_plan: Plan | null;
}

export interface LedgerEntry {
  id: number;
  delta: string;
  balance_after: string;
  source: string;
  note: string | null;
  created_at: string;
}

export interface GenerationSummary {
  id: number;
  funnel_type: FunnelType;
  status: string;
  copy_score: number | null;
  credits_charged: string;
  created_at: string;
}

export interface Paginated<T> {
  data: T[];
  meta: { page: number; per_page: number; total: number };
}

export type { FunnelType, PipelineStage };
