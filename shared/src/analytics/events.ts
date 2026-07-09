/**
 * Typed analytics event catalog (Master Prompt §14.C) — the single source of
 * truth for event names and their property schemas. The ingestion endpoint
 * rejects unknown events (422); the client `track()` is typed against this.
 */
import { z } from 'zod';
import { FUNNEL_TYPES } from '../constants/funnels';
import { PLAN_SLUGS, BILLING_INTERVALS } from '../constants/plans';

const utmSchema = z
  .object({
    utm_source: z.string().optional(),
    utm_medium: z.string().optional(),
    utm_campaign: z.string().optional(),
    utm_term: z.string().optional(),
    utm_content: z.string().optional(),
  })
  .partial();

export type UtmSnapshot = z.infer<typeof utmSchema>;

/** Each event's property schema. Keys are the canonical event names. */
export const EVENT_CATALOG = {
  // Marketing
  page_view: z.object({
    path: z.string(),
    referrer: z.string().optional(),
    utm: utmSchema.optional(),
  }),
  cta_clicked: z.object({ cta_id: z.string(), location: z.string() }),
  pricing_toggle_switched: z.object({ interval: z.enum(BILLING_INTERVALS) }),
  faq_opened: z.object({ question_id: z.string() }),
  newsletter_subscribed: z.object({}).strict(),
  demo_modal_opened: z.object({}).strict(),

  // Auth
  signup_started: z.object({}).strict(),
  signup_completed: z.object({ utm: utmSchema.optional() }),
  email_verified: z.object({}).strict(),
  login_succeeded: z.object({}).strict(),
  identify: z.object({ user_id: z.number().int().positive() }),

  // Activation
  first_project_created: z.object({}).strict(),
  first_brand_voice_created: z.object({}).strict(),
  first_generation_started: z.object({}).strict(),
  first_generation_completed: z.object({}).strict(),

  // Engine
  generation_started: z.object({
    funnel_type: z.enum(FUNNEL_TYPES),
    has_brand_voice: z.boolean(),
    template_id: z.number().int().positive().optional(),
  }),
  generation_completed: z.object({
    duration_ms: z.number().int().nonnegative(),
    copy_score: z.number().int().min(0).max(100),
    credits: z.number().nonnegative(),
  }),
  generation_cancelled: z.object({}).strict(),
  generation_failed: z.object({ code: z.string().optional() }),
  angle_overridden: z.object({}).strict(),
  section_regenerated: z.object({ asset_type: z.string() }),
  variant_created: z.object({ asset_type: z.string() }),
  asset_edited: z.object({ asset_type: z.string() }),
  export_downloaded: z.object({ format: z.enum(['md', 'txt', 'html']) }),
  copy_saved: z.object({}).strict(),

  // Monetization
  upgrade_modal_shown: z.object({
    trigger: z.enum(['credits', 'premium_template', 'watermark']),
  }),
  checkout_started: z.object({
    plan: z.enum(PLAN_SLUGS),
    interval: z.enum(BILLING_INTERVALS),
  }),
  checkout_completed: z.object({}).strict(),
  checkout_abandoned: z.object({}).strict(),
  topup_purchased: z.object({ pack: z.string() }),
  plan_changed: z.object({ from: z.enum(PLAN_SLUGS), to: z.enum(PLAN_SLUGS) }),
  cancellation_started: z.object({}).strict(),
  retention_offer_shown: z.object({}).strict(),
  retention_offer_accepted: z.object({ offer_type: z.enum(['pause', 'coupon']) }),
  subscription_cancelled: z.object({}).strict(),
  refund_requested: z.object({}).strict(),

  // System (consent-exempt essential telemetry)
  client_error: z.object({
    message: z.string(),
    route: z.string(),
    app_version: z.string().optional(),
  }),
  web_vital: z.object({
    name: z.enum(['LCP', 'CLS', 'INP', 'FCP', 'TTFB']),
    value: z.number(),
  }),
} as const;

export type EventName = keyof typeof EVENT_CATALOG;
export type EventProps<N extends EventName> = z.infer<(typeof EVENT_CATALOG)[N]>;

export const EVENT_NAMES = Object.keys(EVENT_CATALOG) as EventName[];

/** Events allowed without analytics consent (essential telemetry). */
export const CONSENT_EXEMPT_EVENTS: EventName[] = ['client_error', 'web_vital'];

export function isKnownEvent(name: string): name is EventName {
  return name in EVENT_CATALOG;
}

/** Validate an event's properties against the catalog. Returns parsed props. */
export function parseEventProps<N extends EventName>(name: N, props: unknown): EventProps<N> {
  return EVENT_CATALOG[name].parse(props) as EventProps<N>;
}
