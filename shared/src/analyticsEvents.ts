import { z } from 'zod';
import { FUNNEL_TYPES } from './funnels';

/**
 * Typed analytics event catalog — the single source of truth for event names
 * and property schemas (Section 14.C). The ingestion endpoint rejects any
 * event not present here with 422.
 */
export const EVENT_CATALOG = {
  // Marketing
  page_view: z.object({
    path: z.string(),
    referrer: z.string().nullable().optional(),
    utm: z.record(z.string()).nullable().optional(),
  }),
  cta_clicked: z.object({ cta_id: z.string(), location: z.string() }),
  pricing_toggle_switched: z.object({ interval: z.enum(['monthly', 'annual']) }),
  faq_opened: z.object({ question_id: z.string() }),
  newsletter_subscribed: z.object({}),
  demo_modal_opened: z.object({}),
  // Auth
  signup_started: z.object({}),
  signup_completed: z.object({ utm: z.record(z.string()).nullable().optional() }),
  email_verified: z.object({}),
  login_succeeded: z.object({}),
  identify: z.object({ user_id: z.number().int().positive() }),
  // Activation
  first_project_created: z.object({}),
  first_brand_voice_created: z.object({}),
  first_generation_started: z.object({}),
  first_generation_completed: z.object({}),
  // Engine
  generation_started: z.object({
    funnel_type: z.enum(FUNNEL_TYPES),
    has_brand_voice: z.boolean(),
    template_id: z.number().int().positive().optional(),
  }),
  generation_completed: z.object({
    duration_ms: z.number().nonnegative(),
    copy_score: z.number().min(0).max(100),
    credits: z.number().nonnegative(),
  }),
  generation_cancelled: z.object({}),
  generation_failed: z.object({ code: z.string().optional() }),
  angle_overridden: z.object({ angle_type: z.string().optional() }),
  section_regenerated: z.object({ asset_type: z.string() }),
  variant_created: z.object({ asset_type: z.string() }),
  asset_edited: z.object({ asset_type: z.string() }),
  export_downloaded: z.object({ format: z.enum(['md', 'txt', 'html']) }),
  copy_saved: z.object({}),
  // Monetization
  upgrade_modal_shown: z.object({
    trigger: z.enum(['credits', 'premium_template', 'watermark']),
  }),
  checkout_started: z.object({
    plan: z.string(),
    interval: z.enum(['monthly', 'annual']).optional(),
  }),
  checkout_completed: z.object({}),
  checkout_abandoned: z.object({}),
  topup_purchased: z.object({ pack: z.string() }),
  plan_changed: z.object({ from: z.string(), to: z.string() }),
  cancellation_started: z.object({}),
  retention_offer_shown: z.object({}),
  retention_offer_accepted: z.object({ offer_type: z.enum(['pause', 'coupon']) }),
  subscription_cancelled: z.object({}),
  refund_requested: z.object({}),
  // System (consent-exempt essential telemetry)
  client_error: z.object({
    message: z.string().max(500),
    route: z.string(),
    app_version: z.string().optional(),
  }),
  web_vital: z.object({
    metric: z.enum(['LCP', 'CLS', 'INP']),
    value: z.number(),
  }),
} as const;

export type EventName = keyof typeof EVENT_CATALOG;
export type EventProps<N extends EventName> = z.infer<(typeof EVENT_CATALOG)[N]>;

export const EVENT_NAMES = Object.keys(EVENT_CATALOG) as EventName[];

/** Events allowed without analytics consent (essential telemetry). */
export const CONSENT_EXEMPT_EVENTS: readonly EventName[] = ['client_error', 'web_vital'];

export function isKnownEvent(name: string): name is EventName {
  return Object.prototype.hasOwnProperty.call(EVENT_CATALOG, name);
}
