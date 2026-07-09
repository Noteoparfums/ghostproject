import { Pool, type PoolClient, type QueryResult, type QueryResultRow } from 'pg';
export declare function postgresSql(sql: string, parameterCount?: number): string;
export type TransactionConnection = PoolClient;
export type DatabaseExecutor = Pool | PoolClient;
export declare const pool: Pool;
export declare function execute<T extends QueryResultRow = QueryResultRow>(sql: string, params?: unknown[], tx?: TransactionConnection): Promise<QueryResult<T>>;
export declare function query<T extends QueryResultRow = QueryResultRow>(sql: string, params?: unknown[], tx?: TransactionConnection): Promise<T[]>;
export declare function queryOne<T extends QueryResultRow = QueryResultRow>(sql: string, params?: unknown[], tx?: TransactionConnection): Promise<T | null>;
export declare function withTransaction<T>(callback: (client: TransactionConnection) => Promise<T>): Promise<T>;
//# sourceMappingURL=db.d.ts.map