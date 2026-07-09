import { pool } from './lib/db.js';
import { loadEnv } from '@ghostwriter/shared';
import { execSync } from 'node:child_process';

const env = loadEnv();

async function main() {
  if (env.NODE_ENV === 'production') {
    console.error('Error: db-reset cannot be run in production.');
    process.exit(1);
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await client.query<{ tablename: string }>(
      "SELECT tablename FROM pg_catalog.pg_tables WHERE schemaname = 'public'"
    );
    for (const row of result.rows) {
      const tableName = row.tablename.replace(/"/g, '""');
      console.log(`Dropping table: ${tableName}`);
      await client.query(`DROP TABLE "${tableName}" CASCADE`);
    }
    await client.query('DROP FUNCTION IF EXISTS update_updated_at_column() CASCADE');
    await client.query('COMMIT');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await pool.end();
  }

  execSync('npm run migrate', { stdio: 'inherit' });
  execSync('npm run seed', { stdio: 'inherit' });
  console.log('Database reset successfully.');
}

main().catch((error) => {
  console.error('Database reset failed:', error);
  process.exit(1);
});