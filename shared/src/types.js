// ─── Billing state machine (Section 7.A / 6.3) ───────────────────────────────
/**
 * Legal subscription-status transitions. Any transition not listed is illegal
 * and must throw + be audit-logged. This map is the single source of truth for
 * both the server guard and the unit tests.
 */
export const SUBSCRIPTION_TRANSITIONS = {
    trialing: ['active', 'cancelled', 'expired'],
    active: ['past_due', 'paused', 'cancelled', 'expired'],
    past_due: ['active', 'expired', 'cancelled'],
    paused: ['active', 'cancelled', 'expired'],
    cancelled: ['active'], // reactivate within grace window
    expired: [], // terminal — new subscription required
};
export function isLegalSubscriptionTransition(from, to) {
    return SUBSCRIPTION_TRANSITIONS[from].includes(to);
}
//# sourceMappingURL=types.js.map