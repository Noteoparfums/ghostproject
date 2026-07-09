import mysql, { type Pool, type PoolConnection } from 'mysql2/promise';
import { env } from '../config/env.js';
import dns from 'node:dns';

dns.setDefaultResultOrder('ipv4first');

function connectionOptions(connectionString: string) {
  const url = new URL(connectionString);
  if (url.protocol !== 'mysql:' && url.protocol !== 'mysql2:') {
    throw new Error('DATABASE_URL must use the mysql:// protocol');
  }

  return {
    host: url.hostname,
    port: url.port ? Number(url.port) : 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: decodeURIComponent(url.pathname.slice(1)),
    ssl: url.searchParams.has('ssl')
      ? { minVersion: 'TLSv1.2' as const, rejectUnauthorized: true }
      : undefined,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };
}

export const pool = mysql.createPool(connectionOptions(env.DATABASE_URL));

export type TransactionConnection = Pool | PoolConnection;

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
  callback: (conn: any) => Promise<T>
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
