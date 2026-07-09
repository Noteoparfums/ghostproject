-- 0003: Billing & Credits
-- Prices live here (single source of truth). Balances are ALWAYS derived from
-- credit_ledger (SUM(delta)); never store a mutable balance counter.

CREATE TABLE IF NOT EXISTS plans (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  slug ENUM('free','pro','agency') NOT NULL,
  name VARCHAR(80) NOT NULL,
  monthly_price_cents INT UNSIGNED NOT NULL DEFAULT 0,
  annual_price_cents INT UNSIGNED NOT NULL DEFAULT 0,
  monthly_credits DECIMAL(8,2) NOT NULL DEFAULT 0,
  features JSON NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  sort_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_plans_slug (slug)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS subscriptions (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  plan_id BIGINT UNSIGNED NOT NULL,
  interval_unit ENUM('monthly','annual') NOT NULL,
  status ENUM('trialing','active','past_due','paused','cancelled','expired') NOT NULL DEFAULT 'active',
  current_period_start TIMESTAMP NULL,
  current_period_end TIMESTAMP NULL,
  cancel_at_period_end TINYINT(1) NOT NULL DEFAULT 0,
  cancelled_at TIMESTAMP NULL,
  paused_until TIMESTAMP NULL,
  provider VARCHAR(40) NOT NULL DEFAULT 'mock',
  provider_subscription_id VARCHAR(120) NULL,
  dunning_attempts INT NOT NULL DEFAULT 0,
  past_due_since TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_subscriptions_user (user_id),
  KEY idx_subscriptions_status (status),
  UNIQUE KEY uq_subscriptions_provider (provider_subscription_id),
  CONSTRAINT fk_subscriptions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_subscriptions_plan FOREIGN KEY (plan_id) REFERENCES plans(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS coupons (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(64) NOT NULL,
  kind ENUM('percent','amount') NOT NULL,
  value INT UNSIGNED NOT NULL,
  duration ENUM('once','repeating','forever') NOT NULL DEFAULT 'once',
  duration_months INT UNSIGNED NULL,
  max_redemptions INT UNSIGNED NULL,
  times_redeemed INT UNSIGNED NOT NULL DEFAULT 0,
  expires_at TIMESTAMP NULL,
  is_active TINYINT(1) NOT NULL DEFAULT 1,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_coupons_code (code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS tax_rates (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  country CHAR(2) NOT NULL,
  rate_bps INT UNSIGNED NOT NULL,
  label VARCHAR(80) NOT NULL,
  is_eu TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_tax_rates_country (country)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS billing_profiles (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  company VARCHAR(200) NULL,
  billing_email VARCHAR(255) NULL,
  address_line1 VARCHAR(200) NULL,
  address_line2 VARCHAR(200) NULL,
  city VARCHAR(120) NULL,
  postal_code VARCHAR(40) NULL,
  country CHAR(2) NULL,
  vat_id VARCHAR(20) NULL,
  vat_valid TINYINT(1) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_billing_profiles_user (user_id),
  CONSTRAINT fk_billing_profiles_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS invoices (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  subscription_id BIGINT UNSIGNED NULL,
  number VARCHAR(40) NOT NULL,
  kind ENUM('subscription','topup') NOT NULL DEFAULT 'subscription',
  status ENUM('draft','open','paid','void','refunded','uncollectible') NOT NULL DEFAULT 'open',
  currency CHAR(3) NOT NULL DEFAULT 'EUR',
  subtotal_cents INT NOT NULL DEFAULT 0,
  discount_cents INT NOT NULL DEFAULT 0,
  tax_cents INT NOT NULL DEFAULT 0,
  total_cents INT NOT NULL DEFAULT 0,
  tax_rate_bps INT UNSIGNED NOT NULL DEFAULT 0,
  tax_country CHAR(2) NULL,
  reverse_charge TINYINT(1) NOT NULL DEFAULT 0,
  coupon_id BIGINT UNSIGNED NULL,
  provider VARCHAR(40) NOT NULL DEFAULT 'mock',
  provider_invoice_id VARCHAR(120) NULL,
  paid_at TIMESTAMP NULL,
  refunded_at TIMESTAMP NULL,
  line_items JSON NOT NULL,
  billing_snapshot JSON NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_invoices_number (number),
  KEY idx_invoices_user (user_id),
  KEY idx_invoices_status (status),
  CONSTRAINT fk_invoices_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_invoices_subscription FOREIGN KEY (subscription_id) REFERENCES subscriptions(id) ON DELETE SET NULL,
  CONSTRAINT fk_invoices_coupon FOREIGN KEY (coupon_id) REFERENCES coupons(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS refunds (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  invoice_id BIGINT UNSIGNED NOT NULL,
  user_id BIGINT UNSIGNED NOT NULL,
  amount_cents INT NOT NULL,
  reason VARCHAR(1000) NULL,
  status ENUM('requested','approved','rejected','processed') NOT NULL DEFAULT 'requested',
  processed_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_refunds_invoice (invoice_id),
  KEY idx_refunds_user (user_id),
  CONSTRAINT fk_refunds_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE,
  CONSTRAINT fk_refunds_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Append-only credit ledger. Balance = SUM(delta) WHERE user_id = ?.
CREATE TABLE IF NOT EXISTS credit_ledger (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id BIGINT UNSIGNED NOT NULL,
  delta DECIMAL(10,2) NOT NULL,
  source ENUM('plan_grant','topup','generation','section_regen','variant','refund','admin_adjust','expiry') NOT NULL,
  generation_id BIGINT UNSIGNED NULL,
  invoice_id BIGINT UNSIGNED NULL,
  note VARCHAR(500) NULL,
  expires_at TIMESTAMP NULL,
  idempotency_key VARCHAR(120) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_credit_ledger_user (user_id),
  KEY idx_credit_ledger_source (source),
  UNIQUE KEY uq_credit_ledger_idem (idempotency_key),
  CONSTRAINT fk_credit_ledger_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_credit_ledger_gen FOREIGN KEY (generation_id) REFERENCES generations(id) ON DELETE SET NULL,
  CONSTRAINT fk_credit_ledger_invoice FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Raw provider webhook events, processed idempotently by event_id.
CREATE TABLE IF NOT EXISTS payment_events (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  provider VARCHAR(40) NOT NULL DEFAULT 'mock',
  event_id VARCHAR(120) NOT NULL,
  type VARCHAR(80) NOT NULL,
  payload JSON NOT NULL,
  processed_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY uq_payment_events_event (provider, event_id),
  KEY idx_payment_events_type (type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
