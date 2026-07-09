import { pool } from './lib/db.js';
import { loadEnv } from '@ghostwriter/shared';
import { execSync } from 'child_process';

const env = loadEnv();

async function main() {
  if (env.NODE_ENV === 'production') {
    console.error('Error: db-reset cannot be run in production.');
    process.exit(1);
  }

  console.log('Dropping all tables from database...');
  const connection = await pool.getConnection();
  try {
    // Disable foreign key checks to allow dropping tables in any order
    await connection.execute('SET FOREIGN_KEY_CHECKS = 0');
    const [rows] = await connection.execute(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = DATABASE()
    `);

    for (const r of rows as any[]) {
      const tableName = r.TABLE_NAME;
      console.log(`Dropping table: ${tableName}`);
      await connection.execute(`DROP TABLE \`${tableName}\``);
    }
    await connection.execute('SET FOREIGN_KEY_CHECKS = 1');
    console.log('All tables dropped.');
  } catch (err) {
    console.error('Error dropping tables:', err);
    process.exit(1);
  } finally {
    connection.release();
  }

  await pool.end();

  console.log('Running migrations...');
  execSync('npm run migrate', { stdio: 'inherit' });

  console.log('Running seeds...');
  execSync('npm run seed', { stdio: 'inherit' });

  console.log('Database reset successfully.');
}

main().catch((err) => {
  console.error('Database reset failed:', err);
  process.exit(1);
});
