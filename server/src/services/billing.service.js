import { paymentAdapter } from '../adapters/payment.adapter.js';
import { subscriptionRepository, planRepository, invoiceRepository, billingProfileRepository } from '../repositories/billing.repository.js';
import { creditService } from './credit.service.js';
import { userRepository } from '../repositories/user.repository.js';
import { AppError } from '../lib/errors.js';
import { randomUUID } from 'node:crypto';
import { withTransaction } from '../lib/db.js';
import { webhookEventsRepository } from '../repositories/webhookEvents.repository.js';
import { transitionSubscription } from './billing/stateMachine.js';
import { logger } from '../lib/logger.js';
export const billingService = {
    async getActivePlan(userId, tx) {
        const sub = await subscriptionRepository.findActiveByUserId(userId, tx);
        if (!sub) {
            const freePlan = await planRepository.findBySlug('free', tx);
            return { subscription: null, plan: freePlan };
        }
        const plan = await planRepository.findById(sub.plan_id, tx);
        return { subscription: sub, plan };
    },
    async createSubscriptionCheckout(userId, planSlug, interval) {
        const user = await userRepository.findById(userId);
        if (!user)
            throw new AppError('NOT_FOUND', 'User not found');
        const plan = await planRepository.findBySlug(planSlug);
        if (!plan || !plan.is_active || plan.slug === 'free') {
            throw new AppError('VALIDATION_ERROR', 'Invalid plan selection');
        }
        return paymentAdapter.createSubscriptionCheckout(userId, user.email, plan, interval);
    },
    async createTopupCheckout(userId, amountCents) {
        const user = await userRepository.findById(userId);
        if (!user)
            throw new AppError('NOT_FOUND', 'User not found');
        if (amountCents < 500) {
            throw new AppError('VALIDATION_ERROR', 'Minimum top-up amount is $5.00');
        }
        return paymentAdapter.createTopupCheckout(userId, user.email, amountCents);
    },
    async createCustomerPortal(userId) {
        const profile = await billingProfileRepository.get(userId);
        const sub = await subscriptionRepository.findActiveByUserId(userId);
        const customerId = profile?.provider_customer_id || `mock_cus_${userId}`;
        return paymentAdapter.createCustomerPortal(userId, customerId);
    },
    async cancelSubscription(userId) {
        const sub = await subscriptionRepository.findActiveByUserId(userId);
        if (!sub)
            throw new AppError('VALIDATION_ERROR', 'No active subscription found');
        if (sub.provider_subscription_id) {
            await paymentAdapter.cancelSubscription(sub.provider_subscription_id);
        }
        await subscriptionRepository.update(sub.id, { cancelAtPeriodEnd: true });
    },
    async handleCheckoutCompleted(userId, type, planSlug, interval, amountCents) {
        await withTransaction(async (tx) => {
            if (type === 'subscription' && planSlug && interval) {
                const plan = await planRepository.findBySlug(planSlug, tx);
                if (!plan)
                    throw new AppError('NOT_FOUND', 'Plan not found');
                const start = new Date();
                const end = new Date();
                if (interval === 'monthly') {
                    end.setMonth(end.getMonth() + 1);
                }
                else {
                    end.setFullYear(end.getFullYear() + 1);
                }
                const subId = await subscriptionRepository.create({
                    userId,
                    planId: plan.id,
                    interval,
                    status: 'active',
                    provider: 'mock',
                    providerSubscriptionId: `mock_sub_${randomUUID()}`,
                    currentPeriodStart: start,
                    currentPeriodEnd: end
                }, tx);
                // Grant credits
                const baseCredits = Number(plan.monthly_credits);
                const credits = interval === 'monthly' ? baseCredits : baseCredits * 12;
                await creditService.grant(userId, credits, 'plan_grant', {}, `Granted ${credits} credits for ${plan.name} (${interval})`);
                // Create invoice
                const price = interval === 'monthly' ? plan.monthly_price_cents : plan.annual_price_cents;
                await invoiceRepository.create({
                    userId,
                    subscriptionId: subId,
                    number: `INV-${Date.now()}`,
                    kind: 'subscription',
                    status: 'paid',
                    currency: 'usd',
                    subtotalCents: price,
                    taxCents: 0,
                    totalCents: price,
                    taxRateBps: 0,
                    provider: 'mock',
                    providerInvoiceId: `mock_inv_${randomUUID()}`,
                    lineItems: [{ description: `${plan.name} (${interval})`, amount_cents: price }],
                    paidAt: new Date()
                }, tx);
            }
            else if (type === 'topup' && amountCents) {
                const credits = Math.floor(amountCents / 10); // $10 = 1000 cents = 100 credits
                const invId = await invoiceRepository.create({
                    userId,
                    number: `INV-${Date.now()}`,
                    kind: 'topup',
                    status: 'paid',
                    currency: 'usd',
                    subtotalCents: amountCents,
                    taxCents: 0,
                    totalCents: amountCents,
                    taxRateBps: 0,
                    provider: 'mock',
                    providerInvoiceId: `mock_pi_${randomUUID()}`,
                    lineItems: [{ description: `${credits} Credits Top-up`, amount_cents: amountCents }],
                    paidAt: new Date()
                }, tx);
                await creditService.grant(userId, credits, 'topup', {}, `Top-up of ${credits} credits`);
            }
        });
    },
    async handleWebhookEvent(provider, eventId, type, payload) {
        const inserted = await webhookEventsRepository.insertIfNew({
            provider,
            eventId,
            type,
            payload
        });
        if (!inserted) {
            logger.info({ provider, eventId }, 'Skipping duplicate payment event');
            return { duplicate: true };
        }
        try {
            await withTransaction(async (tx) => {
                if (type === 'checkout.session.completed') {
                    const session = payload.object || payload;
                    const userId = Number(session.client_reference_id || session.metadata?.user_id);
                    const mode = session.mode;
                    if (mode === 'subscription') {
                        const planSlug = session.metadata?.plan_slug;
                        const interval = session.metadata?.interval;
                        const providerSubId = session.subscription;
                        const plan = await planRepository.findBySlug(planSlug, tx);
                        if (!plan)
                            throw new Error(`Plan slug ${planSlug} not found in database`);
                        const start = new Date();
                        const end = new Date();
                        if (interval === 'monthly')
                            end.setMonth(end.getMonth() + 1);
                        else
                            end.setFullYear(end.getFullYear() + 1);
                        const subId = await subscriptionRepository.create({
                            userId,
                            planId: plan.id,
                            interval,
                            status: 'active',
                            provider: 'stripe',
                            providerSubscriptionId: providerSubId || `mock_sub_${randomUUID()}`,
                            currentPeriodStart: start,
                            currentPeriodEnd: end
                        }, tx);
                        const price = interval === 'monthly' ? plan.monthly_price_cents : plan.annual_price_cents;
                        await invoiceRepository.create({
                            userId,
                            subscriptionId: subId,
                            number: `INV-${Date.now()}`,
                            kind: 'subscription',
                            status: 'paid',
                            currency: 'usd',
                            subtotalCents: price,
                            taxCents: 0,
                            totalCents: price,
                            taxRateBps: 0,
                            provider: 'stripe',
                            providerInvoiceId: session.invoice || `mock_inv_${randomUUID()}`,
                            lineItems: [{ description: `${plan.name} (${interval})`, amount_cents: price }],
                            paidAt: new Date()
                        }, tx);
                        const credits = Number(plan.monthly_credits);
                        await creditService.write(userId, credits, 'plan_grant', { invoiceId: subId }, `Granted ${credits} credits for plan ${plan.name} signup`);
                    }
                    else if (mode === 'payment') {
                        const amountTotal = Number(session.amount_total);
                        const credits = Math.floor(amountTotal / 10);
                        const invId = await invoiceRepository.create({
                            userId,
                            number: `INV-${Date.now()}`,
                            kind: 'topup',
                            status: 'paid',
                            currency: 'usd',
                            subtotalCents: amountTotal,
                            taxCents: 0,
                            totalCents: amountTotal,
                            taxRateBps: 0,
                            provider: 'stripe',
                            providerInvoiceId: session.payment_intent || `mock_pi_${randomUUID()}`,
                            lineItems: [{ description: `${credits} Credits Top-up`, amount_cents: amountTotal }],
                            paidAt: new Date()
                        }, tx);
                        await creditService.write(userId, credits, 'topup', { invoiceId: invId }, `Top-up of ${credits} credits`);
                    }
                }
                else if (type === 'invoice.paid') {
                    const invoice = payload.object || payload;
                    const providerSubId = invoice.subscription;
                    if (providerSubId) {
                        const sub = await subscriptionRepository.findByProviderId(providerSubId, tx);
                        if (sub) {
                            const plan = await planRepository.findById(sub.plan_id, tx);
                            if (plan) {
                                const start = new Date((invoice.lines?.data?.[0]?.period?.start || Date.now() / 1000) * 1000);
                                const end = new Date((invoice.lines?.data?.[0]?.period?.end || (Date.now() / 1000 + 30 * 24 * 60 * 60)) * 1000);
                                await transitionSubscription(sub.id, 'active', tx, {
                                    currentPeriodStart: start,
                                    currentPeriodEnd: end
                                });
                                const credits = Number(plan.monthly_credits);
                                await creditService.write(sub.user_id, credits, 'plan_grant', { invoiceId: sub.id }, `Granted ${credits} credits for plan renewal`);
                            }
                        }
                    }
                }
                else if (type === 'invoice.payment_failed') {
                    const invoice = payload.object || payload;
                    const providerSubId = invoice.subscription;
                    if (providerSubId) {
                        const sub = await subscriptionRepository.findByProviderId(providerSubId, tx);
                        if (sub) {
                            const currentAttempts = sub.dunning_attempts || 0;
                            const nextAttempts = currentAttempts + 1;
                            if (nextAttempts >= 4) {
                                await transitionSubscription(sub.id, 'cancelled', tx, {
                                    dunningAttempts: nextAttempts
                                });
                            }
                            else {
                                await transitionSubscription(sub.id, 'past_due', tx, {
                                    dunningAttempts: nextAttempts
                                });
                            }
                        }
                    }
                }
                else if (type === 'customer.subscription.deleted') {
                    const stripeSub = payload.object || payload;
                    const sub = await subscriptionRepository.findByProviderId(stripeSub.id, tx);
                    if (sub) {
                        await transitionSubscription(sub.id, 'cancelled', tx);
                    }
                }
                else if (type === 'customer.subscription.updated') {
                    const stripeSub = payload.object || payload;
                    const sub = await subscriptionRepository.findByProviderId(stripeSub.id, tx);
                    if (sub) {
                        const status = stripeSub.status;
                        let targetStatus = null;
                        if (status === 'paused')
                            targetStatus = 'paused';
                        else if (status === 'active')
                            targetStatus = 'active';
                        else if (status === 'past_due')
                            targetStatus = 'past_due';
                        else if (status === 'unpaid')
                            targetStatus = 'expired';
                        else if (status === 'canceled')
                            targetStatus = 'cancelled';
                        if (targetStatus && targetStatus !== sub.status) {
                            await transitionSubscription(sub.id, targetStatus, tx);
                        }
                    }
                }
            });
            await webhookEventsRepository.markProcessed(provider, eventId);
            return { duplicate: false };
        }
        catch (err) {
            await webhookEventsRepository.markFailed(provider, eventId, err?.message || 'Error processing webhook');
            throw err;
        }
    }
};
//# sourceMappingURL=billing.service.js.map