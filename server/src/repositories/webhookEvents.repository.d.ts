import { type TransactionConnection } from '../lib/db.js';
export interface PaymentEventRow {
    id: number;
    provider: string;
    event_id: string;
    type: string;
    payload: any;
    processed_at: Date | null;
    error_message: string | null;
    created_at: Date;
    updated_at: Date;
}
export declare const webhookEventsRepository: {
    insertIfNew(data: {
        provider: string;
        eventId: string;
        type: string;
        payload: any;
    }, tx?: TransactionConnection): Promise<boolean>;
    findByEventId(provider: string, eventId: string, tx?: TransactionConnection): Promise<PaymentEventRow | null>;
    markProcessed(provider: string, eventId: string, tx?: TransactionConnection): Promise<void>;
    markFailed(provider: string, eventId: string, errorMsg: string, tx?: TransactionConnection): Promise<void>;
};
//# sourceMappingURL=webhookEvents.repository.d.ts.map