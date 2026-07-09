import { Pool, types, type PoolClient, type QueryResult, type QueryResultRow } from 'pg';
import { env } from '../config/env.js';

types.setTypeParser(types.builtins.INT8, (value) => Number(value));

function connectionConfig(connectionString: string) {
  const url = new URL(connectionString);
  if (url.protocol !== 'postgres:' && url.protocol !== 'postgresql:') {
    throw new Error('DATABASE_URL must use the postgresql:// protocol');
  }

  const sslMode = url.searchParams.get('sslmode');
  const useTls = sslMode !== null && sslMode !== 'disable';
  url.searchParams.delete('sslmode');
  url.searchParams.delete('sslcert');
  url.searchParams.delete('sslkey');
  url.searchParams.delete('sslrootcert');

  return {
    connectionString: url.toString(),
    max: 10,
    ssl: useTls
      ? {
          minVersion: 'TLSv1.2' as const,
          rejectUnauthorized: sslMode !== 'no-verify',
        }
      : undefined,
  };
}

export function postgresSql(sql: string): string {
  let index = 0;
  return sql.replace(/\?/g, () => `$${++index}`);
}

export type TransactionConnection = PoolClient;
export type DatabaseExecutor = Pool | PoolClient;

export const pool = new Pool(connectionConfig(env.DATABASE_URL));

export async function execute<T extends QueryResultRow = QueryResultRow>(
  sql: string,
  params: unknown[] = [],
  tx?: TransactionConnection
): Promise<QueryResult<T>> {
  return (tx ?? pool).query<T>(postgresSql(sql), params);
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  sql: string,
  params: unknown[] = [],
  tx?: TransactionConnection
): Promise<T[]> {
  const result = await execute<T>(sql, params, tx);
  return result.rows;
}

export async function queryOne<T extends QueryResultRow = QueryResultRow>(
  sql: string,
  params: unknown[] = [],
  tx?: TransactionConnection
): Promise<T | null> {
  const rows = await query<T>(sql, params, tx);
  return rows[0] ?? null;
}

export async function withTransaction<T>(
  callback: (client: TransactionConnection) => Promise<T>
): Promise<T> {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    try {
      await client.query('ROLLBACK');
    } catch {
    }
    throw error;
  } finally {
    client.release();
  }
}