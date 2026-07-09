import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { pool } from './lib/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const migrationsDir = path.resolve(__dirname, '../../migrations');

async function ensureMigrationTable() {
  await pool.execute(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      filename VARCHAR(255) PRIMARY KEY,
      applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
}

async function getAppliedMigrations(): Promise<Set<string>> {
  const [rows] = await pool.execute('SELECT filename FROM schema_migrations');
  return new Set((rows as any[]).map((r) => r.filename));
}

function splitSqlStatements(sql: string): string[] {
  // Simple regex-based splitter that splits on semicolon at the end of lines
  return sql
    .split(/;\s*$/m)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
}

async function main() {
  console.log('Running database migrations...');
  await ensureMigrationTable();
  const applied = await getAppliedMigrations();

  const files = fs
    .readdirSync(migrationsDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  for (const file of files) {
    if (applied.has(file)) {
      console.log(`Skipping applied migration: ${file}`);
      continue;
    }

    console.log(`Applying migration: ${file}...`);
    const sqlPath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(sqlPath, 'utf-8');
    const statements = splitSqlStatements(sql);

    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      for (const statement of statements) {
        await connection.execute(statement);
      }
      await connection.execute('INSERT INTO schema_migrations (filename) VALUES (?)', [file]);
      await connection.commit();
      console.log(`Migration applied successfully: ${file}`);
    } catch (err) {
      await connection.rollback();
      console.error(`Error applying migration ${file}:`, err);
      process.exit(1);
    } finally {
      connection.release();
    }
  }

  console.log('Database is fully up-to-date.');
  await pool.end();
}

main().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
