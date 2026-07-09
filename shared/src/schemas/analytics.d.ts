import { z } from 'zod';
/** Analytics consent state (GDPR). Stored per user/anonymous session. */
export declare const consentSchema: z.ZodObject<{
    analytics: z.ZodBoolean;
    marketing: z.ZodDefault<z.ZodOptional<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    analytics: boolean;
    marketing: boolean;
}, {
    analytics: boolean;
    marketing?: boolean | undefined;
}>;
export type ConsentInput = z.infer<typeof consentSchema>;
/** Date-range filter shared by admin analytics dashboards. */
export declare const analyticsRangeQuery: z.ZodEffects<z.ZodObject<{
    from: z.ZodOptional<z.ZodString>;
    to: z.ZodOptional<z.ZodString>;
    interval: z.ZodDefault<z.ZodEnum<["day", "week", "month"]>>;
}, "strip", z.ZodTypeAny, {
    interval: "week" | "day" | "month";
    to?: string | undefined;
    from?: string | undefined;
}, {
    to?: string | undefined;
    interval?: "week" | "day" | "month" | undefined;
    from?: string | undefined;
}>, {
    interval: "week" | "day" | "month";
    to?: string | undefined;
    from?: string | undefined;
}, {
    to?: string | undefined;
    interval?: "week" | "day" | "month" | undefined;
    from?: string | undefined;
}>;
export type AnalyticsRangeQuery = z.infer<typeof analyticsRangeQuery>;
/** Funnel breakdown query for the admin analytics view. */
export declare const funnelBreakdownQuery: z.ZodObject<{
    funnel_type: z.ZodOptional<z.ZodEnum<["vsl", "lead_magnet", "product_launch", "webinar", "ecom_pdp"]>>;
    from: z.ZodOptional<z.ZodString>;
    to: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    to?: string | undefined;
    funnel_type?: "vsl" | "lead_magnet" | "product_launch" | "webinar" | "ecom_pdp" | undefined;
    from?: string | undefined;
}, {
    to?: string | undefined;
    funnel_type?: "vsl" | "lead_magnet" | "product_launch" | "webinar" | "ecom_pdp" | undefined;
    from?: string | undefined;
}>;
export type FunnelBreakdownQuery = z.infer<typeof funnelBreakdownQuery>;
//# sourceMappingURL=analytics.d.ts.map