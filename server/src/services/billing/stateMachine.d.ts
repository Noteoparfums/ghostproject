import type { SubscriptionStatus } from '@ghostwriter/shared';
import { type TransactionConnection } from '../../lib/db.js';
export declare function transitionSubscription(subscriptionId: number, toStatus: SubscriptionStatus, tx: TransactionConnection, updates?: any): Promise<void>;
//# sourceMappingURL=stateMachine.d.ts.map