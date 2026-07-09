import { pool } from './lib/db.js';
import { loadEnv } from '@ghostwriter/shared';
import { plansSeed } from '../../seeds/plans.js';
import { taxRatesSeed } from '../../seeds/tax-rates.js';
import { getHashedUsers } from '../../seeds/users.js';

const env = loadEnv();

async function main() {
  const force = process.argv.includes('--force-demo-data');
  if (env.NODE_ENV === 'production' && !force) {
    console.error('Error: Refusing to seed database in production environment without --force-demo-data');
    process.exit(1);
  }

  console.log('Seeding plans...');
  for (const plan of plansSeed) {
    await pool.execute(
      `INSERT INTO plans (slug, name, monthly_price_cents, annual_price_cents, monthly_credits, features, is_active, sort_order)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         name = VALUES(name),
         monthly_price_cents = VALUES(monthly_price_cents),
         annual_price_cents = VALUES(annual_price_cents),
         monthly_credits = VALUES(monthly_credits),
         features = VALUES(features),
         is_active = VALUES(is_active),
         sort_order = VALUES(sort_order)`,
      [
        plan.slug,
        plan.name,
        plan.monthly_price_cents,
        plan.annual_price_cents,
        plan.monthly_credits,
        JSON.stringify(plan.features),
        plan.is_active ? 1 : 0,
        plan.sort_order,
      ]
    );
  }

  console.log('Seeding tax rates...');
  for (const rate of taxRatesSeed) {
    await pool.execute(
      `INSERT INTO tax_rates (country, rate_bps, label, is_eu)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         rate_bps = VALUES(rate_bps),
         label = VALUES(label),
         is_eu = VALUES(is_eu)`,
      [rate.country, rate.rate_bps, rate.label, rate.is_eu ? 1 : 0]
    );
  }

  console.log('Seeding users...');
  const users = await getHashedUsers();
  for (const user of users) {
    // Check if user exists based on email
    const [rows] = await pool.execute('SELECT id FROM users WHERE email = ?', [user.email]);
    if ((rows as any[]).length === 0) {
      await pool.execute(
        `INSERT INTO users (email, password_hash, name, role, email_verified_at)
         VALUES (?, ?, ?, ?, NOW())`,
        [user.email, user.passwordHash, user.name, user.role]
      );
      // Give initial plan grants in ledger
      const [newRows] = await pool.execute('SELECT id FROM users WHERE email = ?', [user.email]);
      const userId = (newRows as any[])[0].id;
      await pool.execute(
        `INSERT INTO credit_ledger (user_id, delta, source, note)
         VALUES (?, ?, 'plan_grant', 'Initial seed grant')`,
        [userId, user.role === 'admin' ? 9999.00 : 10.00]
      );
    }
  }

  console.log('Database seeding complete.');
  await pool.end();
}

main().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
