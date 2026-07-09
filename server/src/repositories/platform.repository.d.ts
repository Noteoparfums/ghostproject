import { type TransactionConnection } from '../lib/db.js';
export interface TicketRow {
    id: number;
    user_id: number;
    subject: string;
    priority: 'low' | 'normal' | 'high';
    status: 'open' | 'answered' | 'closed';
    created_at: Date;
    updated_at: Date;
}
export interface TicketMessageRow {
    id: number;
    ticket_id: number;
    sender: 'user' | 'staff';
    message: string;
    created_at: Date;
}
export interface ChangelogEntryRow {
    id: number;
    title: string;
    body: string;
    version: string | null;
    published: boolean;
    created_at: Date;
    updated_at: Date;
}
export declare const ticketRepository: {
    create(data: {
        userId: number;
        subject: string;
        priority?: "low" | "normal" | "high";
    }, tx?: TransactionConnection): Promise<number>;
    findById(id: number, tx?: TransactionConnection): Promise<TicketRow | null>;
    listByUser(userId: number, tx?: TransactionConnection): Promise<TicketRow[]>;
    updateStatus(id: number, status: "open" | "answered" | "closed", tx?: TransactionConnection): Promise<void>;
    addMessage(data: {
        ticketId: number;
        sender: "user" | "staff";
        message: string;
    }, tx?: TransactionConnection): Promise<number>;
    getMessages(ticketId: number, tx?: TransactionConnection): Promise<TicketMessageRow[]>;
};
export declare const changelogRepository: {
    create(data: {
        title: string;
        body: string;
        version?: string | null;
        published?: boolean;
    }, tx?: TransactionConnection): Promise<number>;
    listPublished(tx?: TransactionConnection): Promise<ChangelogEntryRow[]>;
    listAll(tx?: TransactionConnection): Promise<ChangelogEntryRow[]>;
};
export declare const newsletterRepository: {
    subscribe(email: string, source?: string | null, tx?: TransactionConnection): Promise<void>;
};
//# sourceMappingURL=platform.repository.d.ts.map