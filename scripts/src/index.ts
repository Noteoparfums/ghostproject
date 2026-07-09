import mysql from 'mysql2/promise';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to load env variables from root .env manually
function loadEnv() {
  const rootDir = path.resolve(__dirname, '../..');
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

loadEnv();

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('DATABASE_URL is not set in environment or .env file');
  process.exit(1);
}

// Extract database name from connection URL to support raw reset
function parseDbUrl(url: string) {
  // Pattern: mysql://user:pass@host:port/dbname or mysql://root@localhost:3306/ghostwriter
  const matches = url.match(/mysql:\/\/(?:([^:]+)(?::([^@]+))?@)?([^:/]+)(?::(\d+))?\/(.+)/);
  if (!matches) {
    throw new Error('Could not parse DATABASE_URL: ' + url);
  }
  const [, user, password, host, port, dbName] = matches;
  const baseUrl = `mysql://${user || 'root'}${password ? `:${password}` : ''}@${host || 'localhost'}:${port || '3306'}/`;
  return { baseUrl, dbName, user: user || 'root', password, host: host || 'localhost', port: Number(port || '3306') };
}

const parsedDb = parseDbUrl(dbUrl);

async function getClient(withDb = true) {
  const config: mysql.ConnectionOptions = {
    host: parsedDb.host,
    user: parsedDb.user,
    password: parsedDb.password,
    port: parsedDb.port,
    multipleStatements: true,
  };
  if (withDb) {
    config.database = parsedDb.dbName;
  }
  return mysql.createConnection(config);
}

async function ensureMigrationTable(conn: mysql.Connection) {
  await conn.query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      filename VARCHAR(255) NOT NULL,
      applied_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      UNIQUE KEY uq_migrations_filename (filename)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
  `);
}

async function getMigrationFiles() {
  const migrationsDir = path.resolve(__dirname, '../../migrations');
  if (!fs.existsSync(migrationsDir)) {
    return [];
  }
  return fs.readdirSync(migrationsDir)
    .filter(f => f.endsWith('.sql'))
    .sort();
}

async function runMigrations() {
  const conn = await getClient(true);
  try {
    await ensureMigrationTable(conn);
    const files = await getMigrationFiles();
    
    const [rows] = await conn.query('SELECT filename FROM migrations');
    const applied = new Set((rows as any[]).map(r => r.filename));
    
    console.log(`Checking migrations in: ${path.resolve(__dirname, '../../migrations')}`);
    
    let ranAny = false;
    for (const file of files) {
      if (applied.has(file)) {
        continue;
      }
      
      console.log(`Applying migration: ${file}...`);
      const filePath = path.resolve(__dirname, '../../migrations', file);
      const sql = fs.readFileSync(filePath, 'utf8');
      
      await conn.query(sql);
      await conn.query('INSERT INTO migrations (filename) VALUES (?)', [file]);
      console.log(`Migration ${file} applied successfully.`);
      ranAny = true;
    }
    
    if (!ranAny) {
      console.log('Database is up to date. No pending migrations.');
    }
  } finally {
    await conn.end();
  }
}

async function printStatus() {
  const conn = await getClient(true);
  try {
    await ensureMigrationTable(conn);
    const files = await getMigrationFiles();
    const [rows] = await conn.query('SELECT filename, applied_at FROM migrations');
    const appliedMap = new Map((rows as any[]).map(r => [r.filename, r.applied_at]));
    
    console.log('\nMigration Status:');
    console.log('-----------------');
    for (const file of files) {
      if (appliedMap.has(file)) {
        console.log(`[ X ] ${file} (applied at ${appliedMap.get(file)})`);
      } else {
        console.log(`[   ] ${file} (PENDING)`);
      }
    }
    console.log('');
  } finally {
    await conn.end();
  }
}

async function resetDb() {
  console.log(`Dropping and recreating database: ${parsedDb.dbName}`);
  const tempConn = await getClient(false);
  try {
    await tempConn.query(`DROP DATABASE IF EXISTS \`${parsedDb.dbName}\``);
    await tempConn.query(`CREATE DATABASE \`${parsedDb.dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
    console.log(`Database ${parsedDb.dbName} recreated.`);
  } finally {
    await tempConn.end();
  }
  
  await runMigrations();
}

async function runSeed() {
  const conn = await getClient(true);
  try {
    console.log('Seeding initial data...');
    
    // 1. Seed plans
    const [planRows] = await conn.query('SELECT COUNT(*) as count FROM plans');
    if ((planRows as any)[0].count === 0) {
      console.log('Seeding plans...');
      await conn.query(`
        INSERT INTO plans (slug, name, monthly_price_cents, annual_price_cents, monthly_credits, features, sort_order) VALUES
        ('free', 'Free Starter', 0, 0, 10.00, '{"generations": 10, "voices": 1, "templates": "basic"}', 0),
        ('pro', 'Pro Copywriter', 4900, 47000, 100.00, '{"generations": 100, "voices": 5, "templates": "all", "api_access": true}', 1),
        ('agency', 'Agency Scale', 19900, 191000, 500.00, '{"generations": 500, "voices": 99, "templates": "all", "api_access": true, "unlimited_variants": true}', 2);
      `);
    }
    
    // 2. Seed tax rates
    const [taxRows] = await conn.query('SELECT COUNT(*) as count FROM tax_rates');
    if ((taxRows as any)[0].count === 0) {
      console.log('Seeding EU VAT tax rates...');
      await conn.query(`
        INSERT INTO tax_rates (country, rate_bps, label, is_eu) VALUES
        ('DE', 1900, '19% VAT', 1),
        ('FR', 2000, '20% TVA', 1),
        ('NL', 2100, '21% BTW', 1),
        ('IE', 2300, '23% VAT', 1),
        ('ES', 2100, '21% IVA', 1),
        ('GB', 2000, '20% VAT', 0),
        ('US', 0, 'No Tax', 0);
      `);
    }
    
    // 3. Seed templates
    const [templateRows] = await conn.query('SELECT COUNT(*) as count FROM templates');
    if ((templateRows as any)[0].count === 0) {
      console.log('Seeding marketing templates...');
      await conn.query(`
        INSERT INTO templates (name, category, description, funnel_type, prompt_scaffold, is_premium) VALUES
        ('High-Converting VSL Hook', 'VSL', 'Hook structures that keep viewers watching beyond the first 5 seconds.', 'vsl', '{"system": "You are a master copywriter.", "prompt": "Write a VSL hook about: {{product}}"}', 0),
        ('Lead Magnet Optin Page', 'Lead Magnet', 'Landing page copy optimized for lead conversions.', 'lead_magnet', '{"system": "You are a master landing page copywriter.", "prompt": "Write page copy for: {{product}}"}', 0),
        ('Product Launch Email 1', 'Launch', 'Gain attention with a powerful story-driven launch email.', 'product_launch', '{"system": "You are an email marketing specialist.", "prompt": "Write a launch email for: {{product}}"}', 1),
        ('Webinar Registration Title & Copy', 'Webinar', 'Compelling headlines and bullet points for webinar registrations.', 'webinar', '{"system": "You are an event copywriter.", "prompt": "Write registration page copy for: {{product}}"}', 0),
        ('E-commerce PDP Hero Pitch', 'PDP', 'Product description page hero sections focused on customer desires.', 'ecom_pdp', '{"system": "You are an e-commerce PDP copywriter.", "prompt": "Write hero description for: {{product}}"}', 1);
      `);
    }
    
    // 4. Seed demo user
    const [userRows] = await conn.query('SELECT * FROM users WHERE email = ?', ['demo@ghostwriter.os']);
    if ((userRows as any).length === 0) {
      console.log('Seeding demo user: demo@ghostwriter.os...');
      // bcrypt hash for password "password123" with 10 salt rounds
      const passwordHash = '$2a$10$tM9sQz.2dGzYqF/DkKEXbe14TqY5hL0b.d3JgV4w0/o4yR0P7aCye';
      
      const [userResult] = await conn.query(
        'INSERT INTO users (email, password_hash, name, role, email_verified_at) VALUES (?, ?, ?, ?, NOW())',
        ['demo@ghostwriter.os', passwordHash, 'Demo Copywriter', 'user']
      );
      const userId = (userResult as any).insertId;
      
      // Seed billing profile
      await conn.query(
        'INSERT INTO billing_profiles (user_id, company, address_line1, city, postal_code, country) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, 'Demo Studio LLC', '123 Copy Street', 'Dublin', 'D02', 'IE']
      );
      
      // Seed subscription (active Pro monthly)
      const [[proPlan]] = await conn.query('SELECT id FROM plans WHERE slug = "pro"') as any;
      const start = new Date();
      const end = new Date();
      end.setMonth(end.getMonth() + 1);
      
      const [subResult] = await conn.query(
        'INSERT INTO subscriptions (user_id, plan_id, interval_unit, status, current_period_start, current_period_end, provider, provider_subscription_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [userId, proPlan.id, 'monthly', 'active', start, end, 'mock', 'mock_sub_demo_123']
      );
      const subId = (subResult as any).insertId;
      
      // Seed invoices
      await conn.query(
        'INSERT INTO invoices (user_id, subscription_id, number, kind, status, currency, subtotal_cents, tax_cents, total_cents, paid_at, line_items) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)',
        [
          userId, 
          subId, 
          'GW-2026-0001', 
          'subscription', 
          'paid', 
          'EUR', 
          4900, 
          1127, // 23% IE VAT
          6027, 
          JSON.stringify([{ description: 'Pro Copywriter Plan (Monthly)', amount_cents: 4900 }])
        ]
      );
      
      // Seed credit ledger (SUM of delta will be the current balance)
      await conn.query(`
        INSERT INTO credit_ledger (user_id, delta, source, note) VALUES
        (${userId}, 100.00, 'plan_grant', 'Initial plan grant: 100 credits'),
        (${userId}, 25.00, 'topup', 'Top-up pack: 25 credits'),
        (${userId}, -1.00, 'generation', 'VSL generation charge'),
        (${userId}, -0.25, 'section_regen', 'Regenerate hook section'),
        (${userId}, -0.10, 'variant', 'A/B hook variant'),
        (${userId}, 1.00, 'refund', 'Refund for failed generation');
      `);
      
      console.log('Demo user seeded successfully.');
    } else {
      console.log('Demo user demo@ghostwriter.os already exists.');
    }
    
    console.log('Seeding completed successfully.');
  } finally {
    await conn.end();
  }
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'migrate';
  
  try {
    if (command === 'migrate') {
      await runMigrations();
    } else if (command === 'migrate:status') {
      await printStatus();
    } else if (command === 'reset') {
      await resetDb();
    } else if (command === 'seed') {
      await runSeed();
    } else {
      console.error(`Unknown command: ${command}`);
      console.error('Available commands: migrate, migrate:status, reset, seed');
      process.exit(1);
    }
  } catch (err) {
    console.error('Script command failed:', err);
    process.exit(1);
  }
}

main();
