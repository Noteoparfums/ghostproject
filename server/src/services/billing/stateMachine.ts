import type { SubscriptionStatus } from '@ghostwriter/shared';
import { isLegalSubscriptionTransition } from '@ghostwriter/shared';
import { subscriptionRepository } from '../../repositories/billing.repository.js';
import type { TransactionConnection } from '../../lib/db.js';
import { AppError } from '../../lib/errors.js';

export async function transitionSubscription(
  subscriptionId: number,
  toStatus: SubscriptionStatus,
  tx: TransactionConnection,
  updates: any = {}
): Promise<void> {
  const [rows] = await tx.execute(
    'SELECT * FROM subscriptions WHERE id = ? FOR UPDATE',
    [subscriptionId]
  );
  const sub = (rows as any[])[0];
  if (!sub) {
    throw new AppError('NOT_FOUND', 'Subscription not found');
  }

  const fromStatus = sub.status as SubscriptionStatus;
  if (fromStatus === toStatus) return;

  const allowed = isLegalSubscriptionTransition(fromStatus, toStatus);
  if (!allowed) {
    throw new AppError(
      'ILLEGAL_TRANSITION',
      `Cannot transition subscription from ${fromStatus} to ${toStatus}`
    );
  }

  const finalUpdates: any = { status: toStatus, ...updates };

  if (toStatus === 'cancelled') {
    finalUpdates.cancelledAt = new Date();
    finalUpdates.cancelAtPeriodEnd = false;
  } else if (toStatus === 'past_due' && fromStatus !== 'past_due') {
    finalUpdates.pastDueSince = new Date();
  } else if (toStatus === 'active') {
    finalUpdates.pastDueSince = null;
    finalUpdates.dunningAttempts = 0;
  }

  await subscriptionRepository.update(subscriptionId, finalUpdates, tx);
}
