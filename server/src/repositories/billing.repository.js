import { execute, query, queryOne } from '../lib/db.js';
export const planRepository = {
    async listActive(tx) {
        return query('SELECT * FROM plans WHERE is_active = 1 ORDER BY sort_order ASC', [], tx);
    },
    async findBySlug(slug, tx) {
        return queryOne('SELECT * FROM plans WHERE slug = ?', [slug], tx);
    },
    async findById(id, tx) {
        return queryOne('SELECT * FROM plans WHERE id = ?', [id], tx);
    }
};
export const subscriptionRepository = {
    async findActiveByUserId(userId, tx) {
        return queryOne(`
      SELECT s.*, p.slug as plan_slug 
      FROM subscriptions s
      JOIN plans p ON s.plan_id = p.id
      WHERE s.user_id = ? AND s.status IN ('active', 'trialing', 'past_due', 'paused')
      ORDER BY s.created_at DESC LIMIT 1
    `, [userId], tx);
    },
    async findByProviderId(providerSubscriptionId, tx) {
        return queryOne(`
      SELECT s.*, p.slug as plan_slug
      FROM subscriptions s
      JOIN plans p ON s.plan_id = p.id
      WHERE s.provider_subscription_id = ?
    `, [providerSubscriptionId], tx);
    },
    async create(data, tx) {
        const result = await execute(`INSERT INTO subscriptions 
      (user_id, plan_id, interval_unit, status, provider, provider_subscription_id, current_period_start, current_period_end) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`, [
            data.userId, data.planId, data.interval, data.status, data.provider,
            data.providerSubscriptionId || null, data.currentPeriodStart || null, data.currentPeriodEnd || null
        ], tx);
        return result.rows[0].id;
    },
    async update(id, updates, tx) {
        const fields = [];
        const params = [];
        const fieldMap = {
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
            await execute(`UPDATE subscriptions SET ${fields.join(', ')} WHERE id = ?`, params, tx);
        }
    }
};
export const invoiceRepository = {
    async create(data, tx) {
        const result = await execute(`INSERT INTO invoices (
        user_id, subscription_id, number, kind, status, currency, 
        subtotal_cents, tax_cents, total_cents, tax_rate_bps, tax_country, 
        reverse_charge, provider, provider_invoice_id, line_items, billing_snapshot, paid_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) RETURNING id`, [
            data.userId, data.subscriptionId || null, data.number, data.kind, data.status, data.currency,
            data.subtotalCents, data.taxCents, data.totalCents, data.taxRateBps, data.taxCountry || null,
            data.reverseCharge || false, data.provider, data.providerInvoiceId || null,
            JSON.stringify(data.lineItems), data.billingSnapshot ? JSON.stringify(data.billingSnapshot) : null,
            data.paidAt || null
        ], tx);
        return result.rows[0].id;
    },
    async findById(id, tx) {
        return queryOne('SELECT * FROM invoices WHERE id = ?', [id], tx);
    },
    async findByNumber(number, tx) {
        return queryOne('SELECT * FROM invoices WHERE number = ?', [number], tx);
    },
    async updateStatus(id, status, updates, tx) {
        const fields = ['status = ?'];
        const params = [status];
        if (updates?.paidAt !== undefined) {
            fields.push('paid_at = ?');
            params.push(updates.paidAt);
        }
        if (updates?.refundedAt !== undefined) {
            fields.push('refunded_at = ?');
            params.push(updates.refundedAt);
        }
        params.push(id);
        await execute(`UPDATE invoices SET ${fields.join(', ')} WHERE id = ?`, params, tx);
    },
    async listByUser(userId, limit = 20, tx) {
        return query('SELECT * FROM invoices WHERE user_id = ? ORDER BY created_at DESC LIMIT ?', [userId, limit], tx);
    }
};
export const billingProfileRepository = {
    async get(userId, tx) {
        return queryOne('SELECT * FROM billing_profiles WHERE user_id = ?', [userId], tx);
    },
    async upsert(userId, data, tx) {
        const existing = await this.get(userId, tx);
        if (existing) {
            await execute(`UPDATE billing_profiles SET company = ?, billing_email = ?, address_line1 = ?, address_line2 = ?, city = ?, postal_code = ?, country = ?, vat_id = ?, vat_valid = ? WHERE user_id = ?`, [data.company || null, data.billingEmail || null, data.addressLine1 || null, data.addressLine2 || null, data.city || null, data.postalCode || null, data.country || null, data.vatId || null, data.vatValid ? 1 : 0, userId], tx);
        }
        else {
            await execute(`INSERT INTO billing_profiles (user_id, company, billing_email, address_line1, address_line2, city, postal_code, country, vat_id, vat_valid) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, [userId, data.company || null, data.billingEmail || null, data.addressLine1 || null, data.addressLine2 || null, data.city || null, data.postalCode || null, data.country || null, data.vatId || null, data.vatValid ? 1 : 0], tx);
        }
    }
};
export const couponRepository = {
    async findByCode(code, tx) {
        return queryOne('SELECT * FROM coupons WHERE code = ? AND is_active = 1', [code], tx);
    }
};
export const taxRateRepository = {
    async findByCountry(country, tx) {
        return queryOne('SELECT * FROM tax_rates WHERE country = ?', [country], tx);
    }
};
export const refundRepository = {
    async create(data, tx) {
        const result = await execute('INSERT INTO refunds (invoice_id, user_id, amount_cents, reason, status) VALUES (?, ?, ?, ?, ?) RETURNING id', [data.invoiceId, data.userId, data.amountCents, data.reason || null, data.status], tx);
        return result.rows[0].id;
    },
    async findById(id, tx) {
        return queryOne('SELECT * FROM refunds WHERE id = ?', [id], tx);
    },
    async updateStatus(id, status, processedAt, tx) {
        const fields = ['status = ?'];
        const params = [status];
        if (processedAt !== undefined) {
            fields.push('processed_at = ?');
            params.push(processedAt);
        }
        params.push(id);
        await execute(`UPDATE refunds SET ${fields.join(', ')} WHERE id = ?`, params, tx);
    }
};
//# sourceMappingURL=billing.repository.js.map