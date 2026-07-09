import { billingService } from '../services/billing.service.js';
import { creditService } from '../services/credit.service.js';
import { invoiceRepository } from '../repositories/billing.repository.js';
import { AppError } from '../lib/errors.js';
import { z } from 'zod';
const createSubscriptionSchema = z.object({
    planSlug: z.string(),
    interval: z.enum(['monthly', 'annual'])
});
const topupSchema = z.object({
    amountCents: z.number().int().min(500)
});
const mockCheckoutCompleteSchema = z.object({
    type: z.enum(['subscription', 'topup']),
    planSlug: z.string().optional(),
    interval: z.enum(['monthly', 'annual']).optional(),
    amountCents: z.number().int().optional()
});
export const billingController = {
    async getBillingState(req, res) {
        if (!req.user)
            throw new AppError('UNAUTHORIZED', 'Not authenticated');
        const [planData, balance] = await Promise.all([
            billingService.getActivePlan(req.user.id),
            creditService.balance(req.user.id)
        ]);
        res.json({
            data: {
                subscription: planData.subscription,
                plan: planData.plan,
                credit_balance: balance
            }
        });
    },
    async createSubscriptionCheckout(req, res) {
        if (!req.user)
            throw new AppError('UNAUTHORIZED', 'Not authenticated');
        const { planSlug, interval } = createSubscriptionSchema.parse(req.body);
        const session = await billingService.createSubscriptionCheckout(req.user.id, planSlug, interval);
        res.json({ data: session });
    },
    async createTopupCheckout(req, res) {
        if (!req.user)
            throw new AppError('UNAUTHORIZED', 'Not authenticated');
        const { amountCents } = topupSchema.parse(req.body);
        const session = await billingService.createTopupCheckout(req.user.id, amountCents);
        res.json({ data: session });
    },
    async completeMockCheckout(req, res) {
        if (!req.user)
            throw new AppError('UNAUTHORIZED', 'Not authenticated');
        const data = mockCheckoutCompleteSchema.parse(req.body);
        await billingService.handleCheckoutCompleted(req.user.id, data.type, data.planSlug, data.interval, data.amountCents);
        res.json({ success: true });
    },
    async createPortal(req, res) {
        if (!req.user)
            throw new AppError('UNAUTHORIZED', 'Not authenticated');
        const url = await billingService.createCustomerPortal(req.user.id);
        res.json({ data: { url } });
    },
    async getInvoices(req, res) {
        if (!req.user)
            throw new AppError('UNAUTHORIZED', 'Not authenticated');
        const invoices = await invoiceRepository.listByUser(req.user.id);
        res.json({ data: invoices });
    },
    async cancelSubscription(req, res) {
        if (!req.user)
            throw new AppError('UNAUTHORIZED', 'Not authenticated');
        await billingService.cancelSubscription(req.user.id);
        res.json({ success: true });
    }
};
//# sourceMappingURL=billing.controller.js.map