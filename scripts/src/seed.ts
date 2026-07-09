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

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    console.log('Seeding plans...');
    for (const plan of plansSeed) {
      await client.query(
        `INSERT INTO plans (slug, name, monthly_price_cents, annual_price_cents, monthly_credits, features, is_active, sort_order)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (slug) DO UPDATE SET
           name = EXCLUDED.name,
           monthly_price_cents = EXCLUDED.monthly_price_cents,
           annual_price_cents = EXCLUDED.annual_price_cents,
           monthly_credits = EXCLUDED.monthly_credits,
           features = EXCLUDED.features,
           is_active = EXCLUDED.is_active,
           sort_order = EXCLUDED.sort_order`,
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
      await client.query(
        `INSERT INTO tax_rates (country, rate_bps, label, is_eu)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (country) DO UPDATE SET
           rate_bps = EXCLUDED.rate_bps,
           label = EXCLUDED.label,
           is_eu = EXCLUDED.is_eu`,
        [rate.country, rate.rate_bps, rate.label, rate.is_eu ? 1 : 0]
      );
    }

    console.log('Seeding users...');
    const users = await getHashedUsers();
    for (const user of users) {
      const result = await client.query<{ id: number }>(
        `INSERT INTO users (email, password_hash, name, role, email_verified_at)
         VALUES ($1, $2, $3, $4, NOW())
         ON CONFLICT (email) DO NOTHING
         RETURNING id`,
        [user.email, user.passwordHash, user.name, user.role]
      );
      const userId = result.rows[0]?.id;
      if (userId) {
        await client.query(
          `INSERT INTO credit_ledger (user_id, delta, balance_after, source, note, idempotency_key)
           VALUES ($1, $2, $2, 'plan_grant', 'Initial seed grant', $3)
           ON CONFLICT (idempotency_key) DO NOTHING`,
          [userId, user.role === 'admin' ? 9999 : 10, `seed-initial-grant:${user.email}`]
        );
      }
    }

    await client.query('COMMIT');
    console.log('Database seeding complete.');
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});