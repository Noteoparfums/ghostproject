import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './lib/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationsDir = path.resolve(__dirname, '../../migrations');

async function main() {
  const [tables] = await pool.execute("SHOW TABLES LIKE 'schema_migrations'");
  const hasMigrationTable = (tables as any[]).length > 0;

  const applied = new Set<string>();
  if (hasMigrationTable) {
    const [rows] = await pool.execute('SELECT filename FROM schema_migrations');
    for (const r of rows as any[]) {
      applied.add(r.filename);
    }
  }

  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  console.log('\nMigration Status Report:');
  console.log('========================');
  for (const file of files) {
    const status = applied.has(file) ? 'APPLIED' : 'PENDING';
    console.log(`[${status}] ${file}`);
  }
  console.log('========================\n');

  await pool.end();
}

main().catch((err) => {
  console.error('Status check failed:', err);
  process.exit(1);
});
