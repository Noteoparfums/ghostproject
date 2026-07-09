import { z } from 'zod';
/**
 * Checkout body: either a plan subscription (plan_slug + interval, optional
 * coupon) or a one-time top-up pack. Exactly one mode is expressed.
 */
export declare const checkoutSchema: z.ZodEffects<z.ZodEffects<z.ZodObject<{
    plan_slug: z.ZodOptional<z.ZodEnum<["free", "pro", "agency"]>>;
    interval: z.ZodOptional<z.ZodEnum<["monthly", "annual"]>>;
    coupon_code: z.ZodOptional<z.ZodString>;
    topup_pack: z.ZodOptional<z.ZodEnum<[string, ...string[]]>>;
}, "strip", z.ZodTypeAny, {
    interval?: "monthly" | "annual" | undefined;
    plan_slug?: "free" | "pro" | "agency" | undefined;
    coupon_code?: string | undefined;
    topup_pack?: string | undefined;
}, {
    interval?: "monthly" | "annual" | undefined;
    plan_slug?: "free" | "pro" | "agency" | undefined;
    coupon_code?: string | undefined;
    topup_pack?: string | undefined;
}>, {
    interval?: "monthly" | "annual" | undefined;
    plan_slug?: "free" | "pro" | "agency" | undefined;
    coupon_code?: string | undefined;
    topup_pack?: string | undefined;
}, {
    interval?: "monthly" | "annual" | undefined;
    plan_slug?: "free" | "pro" | "agency" | undefined;
    coupon_code?: string | undefined;
    topup_pack?: string | undefined;
}>, {
    interval?: "monthly" | "annual" | undefined;
    plan_slug?: "free" | "pro" | "agency" | undefined;
    coupon_code?: string | undefined;
    topup_pack?: string | undefined;
}, {
    interval?: "monthly" | "annual" | undefined;
    plan_slug?: "free" | "pro" | "agency" | undefined;
    coupon_code?: string | undefined;
    topup_pack?: string | undefined;
}>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
export declare const changePlanSchema: z.ZodObject<{
    plan_slug: z.ZodEnum<["free", "pro", "agency"]>;
    interval: z.ZodEnum<["monthly", "annual"]>;
}, "strip", z.ZodTypeAny, {
    interval: "monthly" | "annual";
    plan_slug: "free" | "pro" | "agency";
}, {
    interval: "monthly" | "annual";
    plan_slug: "free" | "pro" | "agency";
}>;
export type ChangePlanInput = z.infer<typeof changePlanSchema>;
export declare const cancelSubscriptionSchema: z.ZodObject<{
    retention_choice: z.ZodOptional<z.ZodEnum<["pause", "coupon"]>>;
}, "strip", z.ZodTypeAny, {
    retention_choice?: "pause" | "coupon" | undefined;
}, {
    retention_choice?: "pause" | "coupon" | undefined;
}>;
export type CancelSubscriptionInput = z.infer<typeof cancelSubscriptionSchema>;
export declare const refundRequestSchema: z.ZodObject<{
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    reason: string;
}, {
    reason: string;
}>;
export type RefundRequestInput = z.infer<typeof refundRequestSchema>;
export declare const validateCouponSchema: z.ZodObject<{
    code: z.ZodString;
}, "strip", z.ZodTypeAny, {
    code: string;
}, {
    code: string;
}>;
/**
 * Billing details form. VAT ID is optional, but when provided it must be a
 * structurally valid EU VAT ID whose prefix matches the selected country.
 */
export declare const billingDetailsSchema: z.ZodEffects<z.ZodObject<{
    company: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    billing_email: z.ZodOptional<z.ZodString>;
    address_line1: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    address_line2: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    city: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    postal_code: z.ZodDefault<z.ZodOptional<z.ZodString>>;
    country: z.ZodString;
    vat_id: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    company: string;
    address_line1: string;
    address_line2: string;
    city: string;
    postal_code: string;
    country: string;
    billing_email?: string | undefined;
    vat_id?: string | undefined;
}, {
    country: string;
    company?: string | undefined;
    billing_email?: string | undefined;
    address_line1?: string | undefined;
    address_line2?: string | undefined;
    city?: string | undefined;
    postal_code?: string | undefined;
    vat_id?: string | undefined;
}>, {
    company: string;
    address_line1: string;
    address_line2: string;
    city: string;
    postal_code: string;
    country: string;
    billing_email?: string | undefined;
    vat_id?: string | undefined;
}, {
    country: string;
    company?: string | undefined;
    billing_email?: string | undefined;
    address_line1?: string | undefined;
    address_line2?: string | undefined;
    city?: string | undefined;
    postal_code?: string | undefined;
    vat_id?: string | undefined;
}>;
export type BillingDetailsInput = z.infer<typeof billingDetailsSchema>;
export declare const invoiceIdParam: z.ZodObject<{
    id: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    id: number;
}, {
    id: number;
}>;
//# sourceMappingURL=billing.d.ts.map