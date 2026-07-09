import pg from 'pg';
declare class pgConnectionWrapper {
    client: pg.PoolClient;
    constructor(client: pg.PoolClient);
    execute(sql: string, params?: any[]): Promise<[any, any]>;
    query(sql: string, params?: any[]): Promise<[any, any]>;
    beginTransaction(): Promise<void>;
    commit(): Promise<void>;
    rollback(): Promise<void>;
    release(): void;
    end(): Promise<void>;
}
declare class pgPoolWrapper {
    execute(sql: string, params?: any[]): Promise<[any, any]>;
    query(sql: string, params?: any[]): Promise<[any, any]>;
    getConnection(): Promise<pgConnectionWrapper>;
    end(): Promise<void>;
}
export declare const pool: any;
export type TransactionConnection = pgConnectionWrapper | pgPoolWrapper | any;
export declare function query<T = any>(sql: string, params?: any[], tx?: TransactionConnection): Promise<T[]>;
export declare function queryOne<T = any>(sql: string, params?: any[], tx?: TransactionConnection): Promise<T | null>;
export declare function withTransaction<T>(callback: (conn: any) => Promise<T>): Promise<T>;
export {};
//# sourceMappingURL=db.d.ts.map