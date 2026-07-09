import { Pool, types } from 'pg';
import { loadEnv } from '@ghostwriter/shared';

types.setTypeParser(types.builtins.INT8, (value) => Number(value));

const env = loadEnv();
const url = new URL(env.DATABASE_URL);

if (url.protocol !== 'postgres:' && url.protocol !== 'postgresql:') {
  throw new Error('DATABASE_URL must use the postgresql:// protocol');
}

const sslMode = url.searchParams.get('sslmode');
const useTls = sslMode !== null && sslMode !== 'disable';
url.searchParams.delete('sslmode');
url.searchParams.delete('sslcert');
url.searchParams.delete('sslkey');
url.searchParams.delete('sslrootcert');

export const pool = new Pool({
  connectionString: url.toString(),
  max: 5,
  ssl: useTls
    ? {
        minVersion: 'TLSv1.2',
        rejectUnauthorized: sslMode !== 'no-verify',
      }
    : undefined,
});