import mysql from 'mysql2/promise';
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
    connectionLimit: 5,
    queueLimit: 0,
  };
}

export const pool = mysql.createPool(connectionOptions(env.DATABASE_URL));
