import mysql from 'mysql2/promise';
import { loadEnv } from '@ghostwriter/shared';
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

export const pool = mysql.createPool({
  uri: env.DATABASE_URL,
  connectionLimit: 5,
  namedPlaceholders: false,
  waitForConnections: true,
  timezone: 'Z',
});
