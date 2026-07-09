import { query, queryOne, pool, type TransactionConnection } from '../lib/db.js';
import type { Plan, Subscription, Invoice, SubscriptionStatus, BillingInterval, InvoiceStatus, PaymentProviderKind } from '@ghostwriter/shared';

export const planRepository = {
  async listActive(tx?: TransactionConnection): Promise<Plan[]> {
    return query<Plan>('SELECT * FROM plans WHERE is_active = 1 ORDER BY sort_order ASC', [], tx);
  },

  async findBySlug(slug: string, tx?: TransactionConnection): Promise<Plan | null> {
    return queryOne<Plan>('SELECT * FROM plans WHERE slug = ?', [slug], tx);
  },

  async findById(id: number, tx?: TransactionConnection): Promise<Plan | null> {
    return queryOne<Plan>('SELECT * FROM plans WHERE id = ?', [id], tx);
  }
};

export const subscriptionRepository = {
  async findActiveByUserId(userId: number, tx?: TransactionConnection): Promise<Subscription | null> {
    return queryOne<Subscription>(`
      SELECT s.*, p.slug as plan_slug 
      FROM subscriptions s
      JOIN plans p ON s.plan_id = p.id
      WHERE s.user_id = ? AND s.status IN ('active', 'trialing', 'past_due', 'paused')
      ORDER BY s.created_at DESC LIMIT 1
    `, [userId], tx);
  },

  async findByProviderId(providerSubscriptionId: string, tx?: TransactionConnection): Promise<Subscription | null> {
    return queryOne<Subscription>(`
      SELECT s.*, p.slug as plan_slug
      FROM subscriptions s
      JOIN plans p ON s.plan_id = p.id
      WHERE s.provider_subscription_id = ?
    `, [providerSubscriptionId], tx);
  },

  async create(data: {
    userId: number;
    planId: number;
    interval: BillingInterval;
    status: SubscriptionStatus;
    provider: PaymentProviderKind;
    providerSubscriptionId?: string;
    currentPeriodStart?: Date;
    currentPeriodEnd?: Date;
  }, tx?: TransactionConnection): Promise<number> {
    const executor = tx || pool;
    const [result] = await executor.execute(
      `INSERT INTO subscriptions 
      (user_id, plan_id, interval_unit, status, provider, provider_subscription_id, current_period_start, current_period_end) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.userId, data.planId, data.interval, data.status, data.provider, 
        data.providerSubscriptionId || null, data.currentPeriodStart || null, data.currentPeriodEnd || null
      ]
    );
    return (result as any).insertId;
  },

  async update(id: number, updates: {
    status?: SubscriptionStatus;
    planId?: number;
    interval?: BillingInterval;
    currentPeriodStart?: Date;
    currentPeriodEnd?: Date;
    cancelAtPeriodEnd?: boolean;
    cancelledAt?: Date | null;
    pausedUntil?: Date | null;
    providerSubscriptionId?: string;
    dunningAttempts?: number;
    pastDueSince?: Date | null;
  }, tx?: TransactionConnection): Promise<void> {
    const executor = tx || pool;
    const fields: string[] = [];
    const params: any[] = [];

    const fieldMap: Record<string, string> = {
      status: 'status',
      planId: 'plan_id',
      interval: 'interval_unit',
      currentPeriodStart: 'current_period_start',
      currentPeriodEnd: 'current_period_end',
      cancelAtPeriodEnd: 'cancel_at_period_end',
      cancelledAt: 'cancelled_at',
      pausedUntil: 'paused_until',
      providerSubscriptionId: 'provider_subscription_id',
      dunningAttempts: 'dunning_attempts',
      pastDueSince: 'past_due_since'
    };

    for (const [k, v] of Object.entries(updates)) {
      if (v !== undefined) {
        fields.push(`${fieldMap[k]} = ?`);
        params.push(v === true ? 1 : v === false ? 0 : v);
      }
    }

    if (fields.length > 0) {
      params.push(id);
      await executor.execute(`UPDATE subscriptions SET ${fields.join(', ')} WHERE id = ?`, params);
    }
  }
};

export const invoiceRepository = {
  async create(data: {
    userId: number;
    subscriptionId?: number | null;
    number: string;
    kind: 'subscription' | 'topup';
    status: InvoiceStatus;
    currency: string;
    subtotalCents: number;
    taxCents: number;
    totalCents: number;
    taxRateBps: number;
    taxCountry?: string | null;
    reverseCharge?: boolean;
    provider: PaymentProviderKind;
    providerInvoiceId?: string | null;
    lineItems: any;
    billingSnapshot?: any;
    paidAt?: Date | null;
  }, tx?: TransactionConnection): Promise<number> {
    const executor = tx || pool;
    const [result] = await executor.execute(
      `INSERT INTO invoices (
        user_id, subscription_id, number, kind, status, currency, 
        subtotal_cents, tax_cents, total_cents, tax_rate_bps, tax_country, 
        reverse_charge, provider, provider_invoice_id, line_items, billing_snapshot, paid_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        data.userId, data.subscriptionId || null, data.number, data.kind, data.status, data.currency,
        data.subtotalCents, data.taxCents, data.totalCents, data.taxRateBps, data.taxCountry || null,
        data.reverseCharge || false, data.provider, data.providerInvoiceId || null, 
        JSON.stringify(data.lineItems), data.billingSnapshot ? JSON.stringify(data.billingSnapshot) : null,
        data.paidAt || null
      ]
    );
    return (result as any).insertId;
  },

  async findById(id: number, tx?: TransactionConnection): Promise<Invoice | null> {
    return queryOne<Invoice>('SELECT * FROM invoices WHERE id = ?', [id], tx);
  },

  async findByNumber(number: string, tx?: TransactionConnection): Promise<Invoice | null> {
    return queryOne<Invoice>('SELECT * FROM invoices WHERE number = ?', [number], tx);
  },

  async updateStatus(id: number, status: InvoiceStatus, updates?: { paidAt?: Date | null; refundedAt?: Date | null }, tx?: TransactionConnection): Promise<void> {
    const executor = tx || pool;
    const fields = ['status = ?'];
    const params: any[] = [status];
    if (updates?.paidAt !== undefined) {
      fields.push('paid_at = ?');
      params.push(updates.paidAt);
    }
    if (updates?.refundedAt !== undefined) {
      fields.push('refunded_at = ?');
      params.push(updates.refundedAt);
    }
    params.push(id);
    await executor.execute(`UPDATE invoices SET ${fields.join(', ')} WHERE id = ?`, params);
  },

  async listByUser(userId: number, limit = 20, tx?: TransactionConnection): Promise<Invoice[]> {
    return query<Invoice>('SELECT * FROM invoices WHERE user_id = ? ORDER BY created_at DESC LIMIT ?', [userId, limit], tx);
  }
};

export const billingProfileRepository = {
  async get(userId: number, tx?: TransactionConnection): Promise<any> {
    return queryOne('SELECT * FROM billing_profiles WHERE user_id = ?', [userId], tx);
  },

  async upsert(userId: number, data: any, tx?: TransactionConnection): Promise<void> {
    const executor = tx || pool;
    const existing = await this.get(userId, tx);
    if (existing) {
      await executor.execute(
        `UPDATE billing_profiles SET company = ?, billing_email = ?, address_line1 = ?, address_line2 = ?, city = ?, postal_code = ?, country = ?, vat_id = ?, vat_valid = ? WHERE user_id = ?`,
        [data.company || null, data.billingEmail || null, data.addressLine1 || null, data.addressLine2 || null, data.city || null, data.postalCode || null, data.country || null, data.vatId || null, data.vatValid ? 1 : 0, userId]
      );
    } else {
      await executor.execute(
        `INSERT INTO billing_profiles (user_id, company, billing_email, address_line1, address_line2, city, postal_code, country, vat_id, vat_valid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [userId, data.company || null, data.billingEmail || null, data.addressLine1 || null, data.addressLine2 || null, data.city || null, data.postalCode || null, data.country || null, data.vatId || null, data.vatValid ? 1 : 0]
      );
    }
  }
};

export const couponRepository = {
  async findByCode(code: string, tx?: TransactionConnection): Promise<any> {
    return queryOne('SELECT * FROM coupons WHERE code = ? AND is_active = 1', [code], tx);
  }
};

export const taxRateRepository = {
  async findByCountry(country: string, tx?: TransactionConnection): Promise<any> {
    return queryOne('SELECT * FROM tax_rates WHERE country = ?', [country], tx);
  }
};

export const refundRepository = {
  async create(data: {
    invoiceId: number;
    userId: number;
    amountCents: number;
    reason?: string | null;
    status: 'requested' | 'approved' | 'rejected' | 'processed';
  }, tx?: TransactionConnection): Promise<number> {
    const executor = tx || pool;
    const [result] = await executor.execute(
      'INSERT INTO refunds (invoice_id, user_id, amount_cents, reason, status) VALUES (?, ?, ?, ?, ?)',
      [data.invoiceId, data.userId, data.amountCents, data.reason || null, data.status]
    );
    return (result as any).insertId;
  },

  async findById(id: number, tx?: TransactionConnection): Promise<any> {
    return queryOne('SELECT * FROM refunds WHERE id = ?', [id], tx);
  },

  async updateStatus(id: number, status: 'requested' | 'approved' | 'rejected' | 'processed', processedAt?: Date | null, tx?: TransactionConnection): Promise<void> {
    const executor = tx || pool;
    const fields = ['status = ?'];
    const params: any[] = [status];
    if (processedAt !== undefined) {
      fields.push('processed_at = ?');
      params.push(processedAt);
    }
    params.push(id);
    await executor.execute(`UPDATE refunds SET ${fields.join(', ')} WHERE id = ?`, params);
  }
};
