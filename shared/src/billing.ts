export const SUBSCRIPTION_STATUSES = [
  'trialing',
  'active',
  'past_due',
  'paused',
  'cancelled',
  'expired',
] as const;

export type SubscriptionStatus = (typeof SUBSCRIPTION_STATUSES)[number];

/**
 * Billing state machine — the single legal-transition map.
 * Transitions happen only via webhook events or explicit service actions.
 */
export const SUBSCRIPTION_TRANSITIONS: Record<SubscriptionStatus, readonly SubscriptionStatus[]> = {
  trialing: ['active', 'cancelled', 'expired'],
  active: ['past_due', 'paused', 'cancelled', 'expired'],
  past_due: ['active', 'expired', 'cancelled'],
  paused: ['active', 'cancelled', 'expired'],
  cancelled: ['active'], // reactivate within grace window
  expired: [], // terminal; new subscription required
};

export class IllegalTransitionError extends Error {
  constructor(
    public readonly from: SubscriptionStatus,
    public readonly to: SubscriptionStatus,
  ) {
    super(`Illegal subscription transition ${from} \u2192 ${to}`);
    this.name = 'IllegalTransitionError';
  }
}

export function isLegalTransition(from: SubscriptionStatus, to: SubscriptionStatus): boolean {
  return SUBSCRIPTION_TRANSITIONS[from].includes(to);
}

export function assertTransition(from: SubscriptionStatus, to: SubscriptionStatus): void {
  if (!isLegalTransition(from, to)) throw new IllegalTransitionError(from, to);
}
