import { z } from 'zod';
import { PLAN_SLUGS, BILLING_INTERVALS, TOPUP_PACKS } from '../constants/plans.js';
import { isValidEuVatId, isEuVatCountry } from '../vat.js';

const topupPackSlugs = Object.keys(TOPUP_PACKS) as [string, ...string[]];

/**
 * Checkout body: either a plan subscription (plan_slug + interval, optional
 * coupon) or a one-time top-up pack. Exactly one mode is expressed.
 */
export const checkoutSchema = z
  .object({
    plan_slug: z.enum(PLAN_SLUGS).optional(),
    interval: z.enum(BILLING_INTERVALS).optional(),
    coupon_code: z.string().trim().min(1).max(64).optional(),
    topup_pack: z.enum(topupPackSlugs).optional(),
  })
  .refine(
    (v) => Boolean(v.topup_pack) !== Boolean(v.plan_slug),
    'Provide either a plan_slug or a topup_pack, not both',
  )
  .refine(
    (v) => (v.plan_slug ? Boolean(v.interval) : true),
    'interval is required when purchasing a plan',
  );
export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const changePlanSchema = z.object({
  plan_slug: z.enum(PLAN_SLUGS),
  interval: z.enum(BILLING_INTERVALS),
});
export type ChangePlanInput = z.infer<typeof changePlanSchema>;

export const cancelSubscriptionSchema = z.object({
  retention_choice: z.enum(['pause', 'coupon']).optional(),
});
export type CancelSubscriptionInput = z.infer<typeof cancelSubscriptionSchema>;

export const refundRequestSchema = z.object({
  reason: z.string().trim().min(5, 'Please give a brief reason').max(1000),
});
export type RefundRequestInput = z.infer<typeof refundRequestSchema>;

export const validateCouponSchema = z.object({
  code: z.string().trim().min(1).max(64),
});

/**
 * Billing details form. VAT ID is optional, but when provided it must be a
 * structurally valid EU VAT ID whose prefix matches the selected country.
 */
export const billingDetailsSchema = z
  .object({
    company: z.string().trim().max(200).optional().default(''),
    billing_email: z.string().trim().toLowerCase().email().optional(),
    address_line1: z.string().trim().max(200).optional().default(''),
    address_line2: z.string().trim().max(200).optional().default(''),
    city: z.string().trim().max(120).optional().default(''),
    postal_code: z.string().trim().max(40).optional().default(''),
    country: z.string().trim().length(2, 'Use a 2-letter country code').toUpperCase(),
    vat_id: z.string().trim().max(20).optional(),
  })
  .superRefine((v, ctx) => {
    if (v.vat_id && v.vat_id.length > 0) {
      if (!isEuVatCountry(v.country)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['vat_id'],
          message: 'VAT ID is only applicable to EU countries',
        });
      } else if (!isValidEuVatId(v.vat_id, v.country)) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['vat_id'],
          message: `Invalid VAT ID format for ${v.country}`,
        });
      }
    }
  });
export type BillingDetailsInput = z.infer<typeof billingDetailsSchema>;

export const invoiceIdParam = z.object({ id: z.coerce.number().int().positive() });
