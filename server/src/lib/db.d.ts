import mysql, { type Pool, type PoolConnection } from 'mysql2/promise';
export declare const pool: mysql.Pool;
export type TransactionConnection = Pool | PoolConnection;
export declare function query<T = any>(sql: string, params?: any[], tx?: TransactionConnection): Promise<T[]>;
export declare function queryOne<T = any>(sql: string, params?: any[], tx?: TransactionConnection): Promise<T | null>;
export declare function withTransaction<T>(callback: (conn: any) => Promise<T>): Promise<T>;
//# sourceMappingURL=db.d.ts.map