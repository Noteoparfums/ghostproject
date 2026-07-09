import type { PlanSlug, BillingInterval, LedgerSource } from './constants/plans.js';
import type { FunnelType, PipelineStage, AssetType, Framework } from './constants/funnels.js';

// ─── Status unions (mirror the schema ENUMs) ─────────────────────────────────

export type UserRole = 'user' | 'admin';

export type ProjectStatus = 'active' | 'archived';

export type GenerationStatus = 'queued' | 'running' | 'complete' | 'failed' | 'cancelled';

export type StageStatus = 'pending' | 'running' | 'complete' | 'failed';

export type SubscriptionStatus =
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'paused'
  | 'cancelled'
  | 'expired';

export type PaymentProviderKind = 'stripe' | 'mock';

export type InvoiceStatus = 'draft' | 'open' | 'paid' | 'past_due' | 'refunded' | 'void';

export type InvoiceLineType = 'subscription' | 'proration' | 'topup' | 'tax' | 'discount';

export type PaymentAttemptStatus = 'succeeded' | 'failed';

export type MockPaymentBehavior = 'valid' | 'decline';

export type RefundStatus = 'requested' | 'approved' | 'succeeded' | 'rejected';

export type CouponDuration = 'once' | 'repeating' | 'forever';

export type TicketStatus = 'open' | 'answered' | 'closed';
export type TicketPriority = 'low' | 'normal' | 'high';
export type TicketSender = 'user' | 'staff';

export type ChangelogCategory = 'new' | 'improved' | 'fixed';

export type AuditActorType = 'user' | 'admin' | 'system' | 'webhook';

export type WebhookStatus = 'processed' | 'skipped' | 'failed';

export type JobStatus = 'running' | 'succeeded' | 'failed';

// ─── Billing state machine (Section 7.A / 6.3) ───────────────────────────────

/**
 * Legal subscription-status transitions. Any transition not listed is illegal
 * and must throw + be audit-logged. This map is the single source of truth for
 * both the server guard and the unit tests.
 */
export const SUBSCRIPTION_TRANSITIONS: Record<SubscriptionStatus, SubscriptionStatus[]> = {
  trialing: ['active', 'cancelled', 'expired'],
  active: ['past_due', 'paused', 'cancelled', 'expired'],
  past_due: ['active', 'expired', 'cancelled'],
  paused: ['active', 'cancelled', 'expired'],
  cancelled: ['active'], // reactivate within grace window
  expired: [], // terminal — new subscription required
};

export function isLegalSubscriptionTransition(
  from: SubscriptionStatus,
  to: SubscriptionStatus,
): boolean {
  return SUBSCRIPTION_TRANSITIONS[from].includes(to);
}

// ─── Domain DTOs (shared client/server shapes) ───────────────────────────────

export interface Plan {
  id: number;
  slug: PlanSlug;
  name: string;
  monthly_price_cents: number;
  annual_price_cents: number;
  monthly_credits: string; // DECIMAL as string
  seats: number;
  features: string[];
  is_active: boolean;
}

export interface Subscription {
  id: number;
  user_id: number;
  plan_id: number;
  plan_slug: PlanSlug;
  provider: PaymentProviderKind;
  status: SubscriptionStatus;
  interval: BillingInterval;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  pending_plan_id: number | null;
  paused_until: string | null;
  provider_subscription_id?: string | null;
  providerSubscriptionId?: string | null;
}

export interface Invoice {
  id: number;
  number: string;
  subtotal_cents: number;
  tax_cents: number;
  total_cents: number;
  currency: string;
  status: InvoiceStatus;
  paid_at: string | null;
  created_at: string;
}

export interface LedgerEntry {
  id: number;
  delta: string;
  balance_after: string;
  source: LedgerSource;
  reference_id: string | null;
  note: string | null;
  created_at: string;
}

export interface GenerationSummary {
  id: number;
  funnel_type: FunnelType;
  status: GenerationStatus;
  credits_charged: string;
  copy_score: number | null;
  version: number;
  created_at: string;
}

export interface AssetResult {
  id: number;
  asset_type: AssetType;
  content: string;
  variant: string | null;
  edited_content: string | null;
  framework_note: string | null;
  copy_score: number | null;
  score_breakdown: CopyScoreBreakdown | null;
}

export interface CopyScoreBreakdown {
  hook_strength: number;
  clarity: number;
  cta_presence: number;
  reading_level: number;
}

export interface StageContextMeta {
  stage: PipelineStage;
  framework?: Framework;
}

// ─── Pagination envelope ─────────────────────────────────────────────────────

export interface PageMeta {
  page: number;
  per_page: number;
  total: number;
}

export interface Paginated<T> {
  data: T[];
  meta: PageMeta;
}
