import mysql from 'mysql2/promise';
import { env } from '../config/env.js';

export const pool = mysql.createPool({
  uri: env.DATABASE_URL,
  connectionLimit: 10,
  namedPlaceholders: false,
  waitForConnections: true,
  timezone: 'Z',
});

export type TransactionConnection = mysql.Connection | mysql.PoolConnection | mysql.Pool;

export async function query<T = any>(
  sql: string,
  params: any[] = [],
  tx?: TransactionConnection
): Promise<T[]> {
  const executor = tx || pool;
  const [rows] = await executor.execute(sql, params);
  return rows as T[];
}

export async function queryOne<T = any>(
  sql: string,
  params: any[] = [],
  tx?: TransactionConnection
): Promise<T | null> {
  const rows = await query<T>(sql, params, tx);
  return rows[0] ?? null;
}

export async function withTransaction<T>(
  callback: (conn: mysql.PoolConnection) => Promise<T>
): Promise<T> {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    const result = await callback(conn);
    await conn.commit();
    return result;
  } catch (err) {
    try {
      await conn.rollback();
    } catch {
      // ignore
    }
    throw err;
  } finally {
    conn.release();
  }
}
