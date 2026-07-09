/**
 * Funnel types, pipeline stages, the funnel→asset matrix (Master Prompt §6.D),
 * and the SSE event names. The matrix is the single source of truth that both
 * the mock copy banks and the client asset-card ordering read from.
 */

export const FUNNEL_TYPES = ['vsl', 'lead_magnet', 'product_launch', 'webinar', 'ecom_pdp'] as const;
export type FunnelType = (typeof FUNNEL_TYPES)[number];

export const PIPELINE_STAGES = ['analysis', 'angles', 'framework', 'draft', 'polish'] as const;
export type PipelineStage = (typeof PIPELINE_STAGES)[number];

export const ANGLE_TYPES = ['fear', 'aspiration', 'curiosity', 'social_proof', 'urgency'] as const;
export type AngleType = (typeof ANGLE_TYPES)[number];

/**
 * Asset descriptor. `count` documents multi-instance assets (e.g. a 3-email
 * sequence expands to email_1..email_3). `key` is the stable asset_type stem.
 */
export interface AssetSpec {
  key: string;
  label: string;
  count: number;
  abTestable?: boolean;
}

/**
 * Funnel → asset matrix. Exactly the deliverables per §6.D. Multi-count assets
 * are expanded by `expandAssets()` below into concrete asset_type identifiers.
 */
export const FUNNEL_ASSET_MATRIX: Record<FunnelType, AssetSpec[]> = {
  vsl: [
    { key: 'ad_hooks', label: 'Ad Hooks', count: 10, abTestable: true },
    { key: 'vsl_script', label: 'VSL Script', count: 1 },
    { key: 'landing_page', label: 'Landing Page Copy', count: 1 },
    { key: 'email', label: 'Follow-up Email', count: 3 },
    { key: 'upsell_page', label: 'Upsell Page', count: 1 },
  ],
  lead_magnet: [
    { key: 'ad_hooks', label: 'Ad Hooks', count: 10, abTestable: true },
    { key: 'optin_page', label: 'Opt-in Page Copy', count: 1 },
    { key: 'thank_you_page', label: 'Thank-you Page', count: 1 },
    { key: 'email', label: 'Nurture Email', count: 5 },
  ],
  product_launch: [
    { key: 'ad_hooks', label: 'Ad Hooks', count: 10, abTestable: true },
    { key: 'sales_page', label: 'Long-form Sales Page', count: 1 },
    { key: 'email', label: 'Launch Email', count: 3 },
    { key: 'faq_block', label: 'FAQ Objection Block', count: 1 },
  ],
  webinar: [
    { key: 'registration_page', label: 'Registration Page', count: 1 },
    { key: 'reminder_email', label: 'Reminder Email', count: 3 },
    { key: 'pitch_outline', label: 'Pitch-slide Copy Outline', count: 1 },
    { key: 'replay_email', label: 'Replay Email', count: 1 },
  ],
  ecom_pdp: [
    { key: 'product_title_bullets', label: 'Product Title + Bullets', count: 1 },
    { key: 'description', label: 'Product Description', count: 1 },
    { key: 'ad_primary_text', label: 'Ad Primary Text', count: 5, abTestable: true },
    { key: 'ad_headline', label: 'Ad Headline', count: 3, abTestable: true },
    { key: 'review_request_email', label: 'Review-request Email', count: 1 },
  ],
};

/**
 * Expand a funnel's matrix into concrete ordered asset_type identifiers.
 * Multi-count assets become `email_1`, `email_2`, …; single assets keep the key.
 */
export function expandAssets(funnel: FunnelType): string[] {
  const out: string[] = [];
  for (const spec of FUNNEL_ASSET_MATRIX[funnel]) {
    if (spec.count === 1) {
      out.push(spec.key);
    } else {
      for (let i = 1; i <= spec.count; i++) out.push(`${spec.key}_${i}`);
    }
  }
  return out;
}

/** Total distinct asset cards rendered for a funnel. */
export function assetCount(funnel: FunnelType): number {
  return expandAssets(funnel).length;
}

/** SSE event names streamed by POST /api/generate. */
export const SSE_EVENTS = [
  'queued',
  'stage_start',
  'token',
  'stage_complete',
  'angle_options',
  'asset_start',
  'asset_complete',
  'done',
  'error',
] as const;
export type SseEventName = (typeof SSE_EVENTS)[number];

/** Framework labels recorded per asset (powers "Why this works"). */
export const FRAMEWORKS = ['AIDA', 'PAS', 'HSO', 'SOAP_OPERA', 'PAMPOS'] as const;
export type Framework = (typeof FRAMEWORKS)[number];
