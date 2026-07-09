export const FUNNEL_TYPES = [
  'vsl',
  'lead_magnet',
  'product_launch',
  'webinar',
  'ecom_pdp',
] as const;

export type FunnelType = (typeof FUNNEL_TYPES)[number];

export const PIPELINE_STAGES = [
  'analysis',
  'angles',
  'framework',
  'draft',
  'polish',
] as const;

export type PipelineStage = (typeof PIPELINE_STAGES)[number];

export interface FunnelMeta {
  type: FunnelType;
  label: string;
  description: string;
  assets: { key: string; label: string }[];
}

export const FUNNEL_MATRIX: Record<FunnelType, FunnelMeta> = {
  vsl: {
    type: 'vsl',
    label: 'VSL Funnel',
    description: 'Video sales letter funnel with hooks, script, page, emails & upsell.',
    assets: [
      { key: 'ad_hooks', label: '10 Ad Hooks' },
      { key: 'vsl_script', label: 'VSL Script' },
      { key: 'landing_page', label: 'Landing Page Copy' },
      { key: 'email_sequence', label: '3-Email Follow-up' },
      { key: 'upsell_page', label: 'Upsell Page' },
    ],
  },
  lead_magnet: {
    type: 'lead_magnet',
    label: 'Lead Magnet',
    description: 'Opt-in funnel with hooks, opt-in page, thank-you page & nurture.',
    assets: [
      { key: 'ad_hooks', label: '10 Hooks' },
      { key: 'optin_page', label: 'Opt-in Page' },
      { key: 'thankyou_page', label: 'Thank-you Page' },
      { key: 'email_sequence', label: '5-Email Nurture' },
    ],
  },
  product_launch: {
    type: 'product_launch',
    label: 'Product Launch',
    description: 'Full launch: hooks, sales page, launch emails & FAQ block.',
    assets: [
      { key: 'ad_hooks', label: '10 Hooks' },
      { key: 'sales_page', label: 'Long-form Sales Page' },
      { key: 'email_sequence', label: '3-Part Launch Emails' },
      { key: 'faq_block', label: 'FAQ Objection Block' },
    ],
  },
  webinar: {
    type: 'webinar',
    label: 'Webinar',
    description: 'Registration page, reminders, pitch outline & replay email.',
    assets: [
      { key: 'registration_page', label: 'Registration Page' },
      { key: 'email_sequence', label: '3 Reminder Emails' },
      { key: 'pitch_outline', label: 'Pitch-slide Outline' },
      { key: 'replay_email', label: 'Replay Email' },
    ],
  },
  ecom_pdp: {
    type: 'ecom_pdp',
    label: 'E-com PDP',
    description: 'Product page copy, ad texts, headlines & review request.',
    assets: [
      { key: 'product_title', label: 'Title + Bullets' },
      { key: 'description', label: 'Description' },
      { key: 'ad_primary_texts', label: '5 Ad Primary Texts' },
      { key: 'headlines', label: '3 Headlines' },
      { key: 'review_email', label: 'Review-request Email' },
    ],
  },
};
