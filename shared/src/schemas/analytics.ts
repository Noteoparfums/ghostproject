import { z } from 'zod';
import { FUNNEL_TYPES } from '../constants/funnels.js';

/** Analytics consent state (GDPR). Stored per user/anonymous session. */
export const consentSchema = z.object({
  analytics: z.boolean(),
  marketing: z.boolean().optional().default(false),
});
export type ConsentInput = z.infer<typeof consentSchema>;

/** Date-range filter shared by admin analytics dashboards. */
export const analyticsRangeQuery = z
  .object({
    from: z.string().datetime().optional(),
    to: z.string().datetime().optional(),
    interval: z.enum(['day', 'week', 'month']).default('day'),
  })
  .refine(
    (v) => !(v.from && v.to) || new Date(v.from) <= new Date(v.to),
    'from must be before to',
  );
export type AnalyticsRangeQuery = z.infer<typeof analyticsRangeQuery>;

/** Funnel breakdown query for the admin analytics view. */
export const funnelBreakdownQuery = z.object({
  funnel_type: z.enum(FUNNEL_TYPES).optional(),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
});
export type FunnelBreakdownQuery = z.infer<typeof funnelBreakdownQuery>;
