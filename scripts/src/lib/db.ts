import pg from 'pg';
import { loadEnv } from '@ghostwriter/shared';
import dns from 'node:dns';

dns.setDefaultResultOrder('ipv4first');
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function loadEnvFile() {
  const rootDir = path.resolve(__dirname, '../../..');
  const envPath = path.join(rootDir, '.env');
  if (fs.existsSync(envPath)) {
    const content = fs.readFileSync(envPath, 'utf8');
    for (const line of content.split('\n')) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const index = trimmed.indexOf('=');
      if (index === -1) continue;
      const key = trimmed.slice(0, index).trim();
      const val = trimmed.slice(index + 1).trim();
      if (!process.env[key]) {
        process.env[key] = val;
      }
    }
  }
}

loadEnvFile();

const env = loadEnv();

// Setup connection details
const pgPool = new pg.Pool({
  connectionString: env.DATABASE_URL,
  max: 5,
});

function convertSql(sql: string, params: any[]): { sql: string; isInsert: boolean; isModify: boolean } {
  let paramIndex = 1;
  let inSingleQuote = false;
  let inDoubleQuote = false;
  let inBacktick = false;
  let resultSql = '';

  for (let i = 0; i < sql.length; i++) {
    const char = sql[i];
    if (char === "'" && sql[i - 1] !== '\\') {
      if (!inDoubleQuote && !inBacktick) inSingleQuote = !inSingleQuote;
      resultSql += char;
    } else if (char === '"' && sql[i - 1] !== '\\') {
      if (!inSingleQuote && !inBacktick) inDoubleQuote = !inDoubleQuote;
      resultSql += char;
    } else if (char === '`') {
      if (!inSingleQuote && !inDoubleQuote) {
        inBacktick = !inBacktick;
        resultSql += '"'; // Replace backticks with double quotes
      } else {
        resultSql += char;
      }
    } else if (char === '?' && !inSingleQuote && !inDoubleQuote && !inBacktick) {
      resultSql += `$${paramIndex++}`;
    } else {
      resultSql += char;
    }
  }

  // Translate MySQL specific functions: DATE_ADD and DATE_SUB
  resultSql = resultSql.replace(/DATE_ADD\(([^,]+),\s*INTERVAL\s+(\d+)\s+([A-Z]+)\)/gi, "$1 + INTERVAL '$2 $3'");
  resultSql = resultSql.replace(/DATE_SUB\(([^,]+),\s*INTERVAL\s+(\d+)\s+([A-Z]+)\)/gi, "$1 - INTERVAL '$2 $3'");

  // Translate MySQL lock functions to PostgreSQL advisory locks
  if (/GET_LOCK\(\s*'gw_scheduler'\s*,\s*0\s*\)/i.test(resultSql)) {
    resultSql = "SELECT CASE WHEN pg_try_advisory_lock(738392) THEN 1 ELSE 0 END as locked";
  }
  if (/RELEASE_LOCK\(\s*'gw_scheduler'\s*\)/i.test(resultSql)) {
    resultSql = "SELECT CASE WHEN pg_advisory_unlock(738392) THEN 1 ELSE 0 END as released";
  }

  const trimmed = resultSql.trim();
  const isInsert = /^insert\s+into/i.test(trimmed);
  const isModify = /^(update|delete)\s+/i.test(trimmed);

  if (isInsert && !/returning/i.test(trimmed)) {
    resultSql = resultSql.trim() + ' RETURNING id';
  }

  return { sql: resultSql, isInsert, isModify };
}

async function runQuery(
  executor: pg.Pool | pg.PoolClient,
  rawSql: string,
  params: any[] = []
): Promise<[any, any]> {
  const { sql, isInsert, isModify } = convertSql(rawSql, params);
  
  const res = await executor.query(sql, params);
  
  if (isInsert) {
    const insertId = res.rows[0]?.id ? Number(res.rows[0].id) : null;
    return [{ insertId, affectedRows: res.rowCount }, null] as any;
  }
  
  if (isModify) {
    return [{ affectedRows: res.rowCount }, null] as any;
  }
  
  return [res.rows, null];
}

class pgConnectionWrapper {
  constructor(public client: pg.PoolClient) {}

  async execute(sql: string, params: any[] = []) {
    return runQuery(this.client, sql, params);
  }

  async query(sql: string, params: any[] = []) {
    return runQuery(this.client, sql, params);
  }

  async beginTransaction() {
    await this.client.query('BEGIN');
  }

  async commit() {
    await this.client.query('COMMIT');
  }

  async rollback() {
    await this.client.query('ROLLBACK');
  }

  release() {
    this.client.release();
  }

  async end() {
    this.client.release();
  }
}

class pgPoolWrapper {
  async execute(sql: string, params: any[] = []) {
    return runQuery(pgPool, sql, params);
  }

  async query(sql: string, params: any[] = []) {
    return runQuery(pgPool, sql, params);
  }

  async getConnection(): Promise<pgConnectionWrapper> {
    const client = await pgPool.connect();
    return new pgConnectionWrapper(client);
  }

  async end() {
    await pgPool.end();
  }
}

export const pool = new pgPoolWrapper() as any;
