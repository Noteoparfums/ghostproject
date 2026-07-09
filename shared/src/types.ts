/**
 * Status unions used across the domain + the billing state-machine legal
 * transition map. The transition map is the single source of truth consumed by
 * both the server guard (billing/stateMachine.ts) and its unit tests.
 */

export type UserRole = 'user' | 'admin';

export type GenerationStatus = 'queued' | 'running' | 'complete' | 'failed' | 'cancelled';

export type StageStatus = 'pending' | 'running' | 'complete' | 'failed';

export type ProjectStatus = 'active' | 'archived';

export type SubscriptionStatus =
  | 'trialing'
  | 'active'
  | 'past_due'
  | 'paused'
  | 'cancelled'
  | 'expired';

export type InvoiceStatus = 'draft' | 'open' | 'paid' | 'past_due' | 'refunded' | 'void';

export type InvoiceLineItemType = 'subscription' | 'proration' | 'topup' | 'tax' | 'discount';

export type RefundStatus = 'requested' | 'approved' | 'succeeded' | 'rejected';

export type PaymentAttemptStatus = 'succeeded' | 'failed';

export type PaymentMethodBehavior = 'valid' | 'decline';

export type TicketStatus = 'open' | 'answered' | 'closed';

export type TicketPriority = 'low' | 'normal' | 'high';

export type ChangelogCategory = 'new' | 'improved' | 'fixed';

export type PaymentProviderName = 'stripe' | 'mock';

export type WebhookEventStatus = 'processed' | 'skipped' | 'failed';

export type JobRunStatus = 'running' | 'succeeded' | 'failed';

/**
 * Legal subscription transitions. `assertTransition()` (server) throws an
 * IllegalTransitionError for any pair not listed here. Terminal states have [].
 */
export const SUBSCRIPTION_TRANSITIONS: Record<SubscriptionStatus, SubscriptionStatus[]> = {
  trialing: ['active', 'cancelled', 'expired'],
  active: ['past_due', 'paused', 'cancelled', 'expired'],
  past_due: ['active', 'expired', 'cancelled'],
  paused: ['active', 'cancelled', 'expired'],
  cancelled: ['active'], // reactivate within grace window
  expired: [], // terminal — a new subscription is required
};

export function isLegalTransition(from: SubscriptionStatus, to: SubscriptionStatus): boolean {
  return SUBSCRIPTION_TRANSITIONS[from].includes(to);
}
