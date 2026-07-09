import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pool } from './lib/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationsDir = path.resolve(__dirname, '../../migrations');

async function main() {
  const tableResult = await pool.query<{ exists: string | null }>(
    "SELECT to_regclass('public.schema_migrations')::text AS exists"
  );
  const applied = new Set<string>();

  if (tableResult.rows[0]?.exists) {
    const result = await pool.query<{ filename: string }>('SELECT filename FROM schema_migrations');
    for (const row of result.rows) {
      applied.add(row.filename);
    }
  }

  const files = fs.readdirSync(migrationsDir).filter((file) => file.endsWith('.sql')).sort();

  console.log('\nMigration Status Report:');
  console.log('========================');
  for (const file of files) {
    console.log(`[${applied.has(file) ? 'APPLIED' : 'PENDING'}] ${file}`);
  }
  console.log('========================\n');

  await pool.end();
}

main().catch((error) => {
  console.error('Status check failed:', error);
  process.exit(1);
});