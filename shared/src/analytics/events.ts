import { z } from 'zod';
import { FUNNEL_TYPES } from '../constants/funnels.js';

/**
 * Typed analytics event catalog (Section 14.C) — the single source of truth for
 * event names and their property schemas. The ingestion endpoint rejects unknown
 * events (422); the client `track()` is typed against this catalog.
 */

const utm = z
  .object({
    source: z.string().nullable().optional(),
    medium: z.string().nullable().optional(),
    campaign: z.string().nullable().optional(),
    term: z.string().nullable().optional(),
    content: z.string().nullable().optional(),
  })
  .optional();

const funnelTypeEnum = z.enum(FUNNEL_TYPES);

/** Map of event name → zod schema for its `properties` payload. */
export const EVENT_CATALOG = {
  // Marketing
  page_view: z.object({ path: z.string(), referrer: z.string().nullable().optional(), utm }),
  cta_clicked: z.object({ cta_id: z.string(), location: z.string() }),
  pricing_toggle_switched: z.object({ interval: z.enum(['monthly', 'annual']) }),
  faq_opened: z.object({ question_id: z.string() }),
  newsletter_subscribed: z.object({}).passthrough(),
  demo_modal_opened: z.object({}).passthrough(),

  // Auth
  signup_started: z.object({}).passthrough(),
  signup_completed: z.object({ utm }),
  email_verified: z.object({}).passthrough(),
  login_succeeded: z.object({}).passthrough(),
  identify: z.object({ user_id: z.number().int() }),

  // Activation
  first_project_created: z.object({}).passthrough(),
  first_brand_voice_created: z.object({}).passthrough(),
  first_generation_started: z.object({}).passthrough(),
  first_generation_completed: z.object({}).passthrough(),

  // Engine
  generation_started: z.object({
    funnel_type: funnelTypeEnum,
    has_brand_voice: z.boolean(),
    template_id: z.number().int().nullable().optional(),
  }),
  generation_completed: z.object({
    duration_ms: z.number().int(),
    copy_score: z.number().int().optional(),
    credits: z.number(),
  }),
  generation_cancelled: z.object({}).passthrough(),
  generation_failed: z.object({ code: z.string() }),
  angle_overridden: z.object({ angle_id: z.string() }),
  section_regenerated: z.object({ asset_type: z.string() }),
  variant_created: z.object({ asset_type: z.string() }),
  asset_edited: z.object({ asset_type: z.string() }),
  export_downloaded: z.object({ format: z.enum(['md', 'txt', 'html']) }),
  copy_saved: z.object({}).passthrough(),

  // Monetization
  upgrade_modal_shown: z.object({
    trigger: z.enum(['credits', 'premium_template', 'watermark']),
  }),
  checkout_started: z.object({
    plan: z.string(),
    interval: z.enum(['monthly', 'annual']),
  }),
  checkout_completed: z.object({}).passthrough(),
  checkout_abandoned: z.object({}).passthrough(),
  topup_purchased: z.object({ pack: z.string() }),
  plan_changed: z.object({ from: z.string(), to: z.string() }),
  cancellation_started: z.object({}).passthrough(),
  retention_offer_shown: z.object({}).passthrough(),
  retention_offer_accepted: z.object({ offer_type: z.enum(['pause', 'coupon']) }),
  subscription_cancelled: z.object({}).passthrough(),
  refund_requested: z.object({}).passthrough(),

  // System (consent-exempt essential telemetry)
  client_error: z.object({
    message: z.string(),
    route: z.string(),
    app_version: z.string().optional(),
  }),
  web_vital: z.object({
    metric: z.enum(['LCP', 'CLS', 'INP', 'FID', 'TTFB', 'FCP']),
    value: z.number(),
  }),
} as const;

export type EventName = keyof typeof EVENT_CATALOG;

export type EventProps<N extends EventName> = z.infer<(typeof EVENT_CATALOG)[N]>;

/** Events allowed without analytics consent (essential telemetry). */
export const CONSENT_EXEMPT_EVENTS: EventName[] = ['client_error', 'web_vital'];

/** True when the event name exists in the catalog. */
export function isKnownEvent(name: string): name is EventName {
  return Object.prototype.hasOwnProperty.call(EVENT_CATALOG, name);
}

/** Validate a single event's properties against its catalog schema. */
export function validateEvent(name: string, properties: unknown):
  | { ok: true; name: EventName }
  | { ok: false; error: string } {
  if (!isKnownEvent(name)) {
    return { ok: false, error: `Unknown event: ${name}` };
  }
  const result = EVENT_CATALOG[name].safeParse(properties ?? {});
  if (!result.success) {
    return { ok: false, error: result.error.issues.map((i) => i.message).join('; ') };
  }
  return { ok: true, name };
}

/** Batch envelope schema accepted by POST /api/analytics/events. */
export const analyticsBatchSchema = z.object({
  events: z
    .array(
      z.object({
        event_name: z.string(),
        anonymous_id: z.string().uuid().nullable().optional(),
        session_id: z.string().uuid(),
        properties: z.record(z.unknown()).optional(),
        url_path: z.string(),
        referrer: z.string().nullable().optional(),
        utm,
        occurred_at: z.string().datetime(),
      }),
    )
    .min(1)
    .max(50),
});

export type AnalyticsBatch = z.infer<typeof analyticsBatchSchema>;
