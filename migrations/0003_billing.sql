-- 0003: Billing & Credits
-- Prices live here (single source of truth). Balances are ALWAYS derived from
-- credit_ledger (SUM(delta)); never store a mutable balance counter.

CREATE TABLE IF NOT EXISTS plans (
  id BIGSERIAL PRIMARY KEY,
  slug VARCHAR(20) NOT NULL CHECK (slug IN ('free','pro','agency')),
  name VARCHAR(80) NOT NULL,
  monthly_price_cents INT NOT NULL DEFAULT 0,
  annual_price_cents INT NOT NULL DEFAULT 0,
  monthly_credits NUMERIC(8,2) NOT NULL DEFAULT 0,
  features JSONB NULL,
  is_active SMALLINT NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_plans_slug UNIQUE (slug)
);

CREATE OR REPLACE TRIGGER trg_plans_updated_at
  BEFORE UPDATE ON plans
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS subscriptions (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  plan_id BIGINT NOT NULL,
  interval_unit VARCHAR(20) NOT NULL CHECK (interval_unit IN ('monthly','annual')),
  status VARCHAR(20) NOT NULL DEFAULT 'active' CHECK (status IN ('trialing','active','past_due','paused','cancelled','expired')),
  current_period_start TIMESTAMP NULL,
  current_period_end TIMESTAMP NULL,
  cancel_at_period_end SMALLINT NOT NULL DEFAULT 0,
  cancelled_at TIMESTAMP NULL,
  paused_until TIMESTAMP NULL,
  provider VARCHAR(40) NOT NULL DEFAULT 'mock',
  provider_subscription_id VARCHAR(120) NULL,
  dunning_attempts INT NOT NULL DEFAULT 0,
  past_due_since TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_subscriptions_provider UNIQUE (provider_subscription_id),
  CONSTRAINT fk_subscriptions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_subscriptions_plan FOREIGN KEY (plan_id) REFERENCES plans(id)
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions (user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions (status);

CREATE OR REPLACE TRIGGER trg_subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS coupons (
  id BIGSERIAL PRIMARY KEY,
  code VARCHAR(64) NOT NULL,
  kind VARCHAR(20) NOT NULL CHECK (kind IN ('percent','amount')),
  value INT NOT NULL,
  duration VARCHAR(20) NOT NULL DEFAULT 'once' CHECK (duration IN ('once','repeating','forever')),
  duration_months INT NULL,
  max_redemptions INT NULL,
  times_redeemed INT NOT NULL DEFAULT 0,
  expires_at TIMESTAMP NULL,
  is_active SMALLINT NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_coupons_code UNIQUE (code)
);

CREATE OR REPLACE TRIGGER trg_coupons_updated_at
  BEFORE UPDATE ON coupons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS tax_rates (
  id BIGSERIAL PRIMARY KEY,
  country CHAR(2) NOT NULL,
  rate_bps INT NOT NULL,
  label VARCHAR(80) NOT NULL,
  is_eu SMALLINT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_tax_rates_country UNIQUE (country)
);

CREATE OR REPLACE TRIGGER trg_tax_rates_updated_at
  BEFORE UPDATE ON tax_rates
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS billing_profiles (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  company VARCHAR(200) NULL,
  billing_email VARCHAR(255) NULL,
  address_line1 VARCHAR(200) NULL,
  address_line2 VARCHAR(200) NULL,
  city VARCHAR(120) NULL,
  postal_code VARCHAR(40) NULL,
  country CHAR(2) NULL,
  vat_id VARCHAR(20) NULL,
  vat_valid SMALLINT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_billing_profiles_user UNIQUE (user_id),
  CONSTRAINT fk_billing_profiles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE OR REPLACE TRIGGER trg_billing_profiles_updated_at
  BEFORE UPDATE ON billing_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS invoices (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  subscription_id BIGINT NULL,
  number VARCHAR(40) NOT NULL,
  kind VARCHAR(20) NOT NULL DEFAULT 'subscription' CHECK (kind IN ('subscription','topup')),
  status VARCHAR(20) NOT NULL DEFAULT 'open' CHECK (status IN ('draft','open','paid','void','refunded','uncollectible')),
  currency CHAR(3) NOT NULL DEFAULT 'EUR',
  subtotal_cents INT NOT NULL DEFAULT 0,
  discount_cents INT NOT NULL DEFAULT 0,
  tax_cents INT NOT NULL DEFAULT 0,
  total_cents INT NOT NULL DEFAULT 0,
  tax_rate_bps INT NOT NULL DEFAULT 0,
  tax_country CHAR(2) NULL,
  reverse_charge SMALLINT NOT NULL DEFAULT 0,
  coupon_id BIGINT NULL,
  provider VARCHAR(40) NOT NULL DEFAULT 'mock',
  provider_invoice_id VARCHAR(120) NULL,
  paid_at TIMESTAMP NULL,
  refunded_at TIMESTAMP NULL,
  line_items JSONB NOT NULL,
  billing_snapshot JSONB NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_invoices_number UNIQUE (number),
  CONSTRAINT fk_invoices_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_invoices_subscription FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE SET NULL,
  CONSTRAINT fk_invoices_coupon FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_invoices_user ON invoices (user_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices (status);

CREATE OR REPLACE TRIGGER trg_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS refunds (
  id BIGSERIAL PRIMARY KEY,
  invoice_id BIGINT NOT NULL,
  user_id BIGINT NOT NULL,
  amount_cents INT NOT NULL,
  reason VARCHAR(1000) NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'requested' CHECK (status IN ('requested','approved','rejected','processed')),
  processed_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_refunds_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
  CONSTRAINT fk_refunds_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_refunds_invoice ON refunds (invoice_id);
CREATE INDEX IF NOT EXISTS idx_refunds_user ON refunds (user_id);

CREATE OR REPLACE TRIGGER trg_refunds_updated_at
  BEFORE UPDATE ON refunds
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Append-only credit ledger. Balance = SUM(delta) WHERE user_id = ?.
CREATE TABLE IF NOT EXISTS credit_ledger (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  delta NUMERIC(10,2) NOT NULL,
  source VARCHAR(20) NOT NULL CHECK (source IN ('plan_grant','topup','generation','section_regen','variant','refund','admin_adjust','expiry')),
  generation_id BIGINT NULL,
  invoice_id BIGINT NULL,
  note VARCHAR(500) NULL,
  expires_at TIMESTAMP NULL,
  idempotency_key VARCHAR(120) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_credit_ledger_idem UNIQUE (idempotency_key),
  CONSTRAINT fk_credit_ledger_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_credit_ledger_gen FOREIGN KEY (generation_id) REFERENCES generations(id) ON DELETE SET NULL,
  CONSTRAINT fk_credit_ledger_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_credit_ledger_user ON credit_ledger (user_id);
CREATE INDEX IF NOT EXISTS idx_credit_ledger_source ON credit_ledger (source);

CREATE OR REPLACE TRIGGER trg_credit_ledger_updated_at
  BEFORE UPDATE ON credit_ledger
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Raw provider webhook events, processed idempotently by event_id.
CREATE TABLE IF NOT EXISTS payment_events (
  id BIGSERIAL PRIMARY KEY,
  provider VARCHAR(40) NOT NULL DEFAULT 'mock',
  event_id VARCHAR(120) NOT NULL,
  type VARCHAR(80) NOT NULL,
  payload JSONB NOT NULL,
  processed_at TIMESTAMP NULL,
  error_message TEXT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_payment_events_event UNIQUE (provider, event_id)
);

CREATE INDEX IF NOT EXISTS idx_payment_events_type ON payment_events (type);

CREATE OR REPLACE TRIGGER trg_payment_events_updated_at
  BEFORE UPDATE ON payment_events
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
