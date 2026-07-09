/**
 * Funnel types, pipeline stages, the funnel→asset matrix (Section 6.D),
 * and the SSE event-name catalog. This is the single source of truth the
 * engine, mock copy banks, and QA all agree on.
 */
export const FUNNEL_TYPES = ['vsl', 'lead_magnet', 'product_launch', 'webinar', 'ecom_pdp'];
export const PIPELINE_STAGES = ['analysis', 'angles', 'framework', 'draft', 'polish'];
/** Angle categories produced in stage 2. */
export const ANGLE_TYPES = ['fear', 'aspiration', 'curiosity', 'social_proof', 'urgency'];
/** Eugene Schwartz awareness stages (1–5) surfaced in the Strategy Brief. */
export const AWARENESS_STAGES = [1, 2, 3, 4, 5];
/**
 * Every asset type the engine can emit. `asset_type` on generation_assets is one
 * of these. Numbered email slots (email_1…) are represented with an index suffix.
 */
export const ASSET_TYPES = [
    'ad_hooks',
    'vsl_script',
    'landing_page',
    'opt_in_page',
    'thank_you_page',
    'sales_page',
    'registration_page',
    'pitch_outline',
    'replay_email',
    'upsell_page',
    'faq_block',
    'product_title_bullets',
    'product_description',
    'ad_primary_texts',
    'ad_headlines',
    'review_request_email',
    'email_1',
    'email_2',
    'email_3',
    'email_4',
    'email_5',
];
/**
 * Funnel → asset matrix (Section 6.D). The exact, ordered deliverables per funnel
 * type. Mock copy banks must cover every cell of this matrix.
 */
export const FUNNEL_ASSET_MATRIX = {
    vsl: ['ad_hooks', 'vsl_script', 'landing_page', 'email_1', 'email_2', 'email_3', 'upsell_page'],
    lead_magnet: [
        'ad_hooks',
        'opt_in_page',
        'thank_you_page',
        'email_1',
        'email_2',
        'email_3',
        'email_4',
        'email_5',
    ],
    product_launch: ['ad_hooks', 'sales_page', 'email_1', 'email_2', 'email_3', 'faq_block'],
    webinar: ['registration_page', 'email_1', 'email_2', 'email_3', 'pitch_outline', 'replay_email'],
    ecom_pdp: [
        'product_title_bullets',
        'product_description',
        'ad_primary_texts',
        'ad_headlines',
        'review_request_email',
    ],
};
/** Human-readable count captions for the input panel funnel cards. */
export const FUNNEL_ASSET_COUNTS = {
    vsl: FUNNEL_ASSET_MATRIX.vsl.length,
    lead_magnet: FUNNEL_ASSET_MATRIX.lead_magnet.length,
    product_launch: FUNNEL_ASSET_MATRIX.product_launch.length,
    webinar: FUNNEL_ASSET_MATRIX.webinar.length,
    ecom_pdp: FUNNEL_ASSET_MATRIX.ecom_pdp.length,
};
/** Asset types eligible for A/B variant generation. */
export const VARIANT_ELIGIBLE_ASSETS = ['ad_hooks', 'ad_headlines', 'ad_primary_texts'];
/** Frameworks recorded per asset ("Why this works"). */
export const FRAMEWORKS = [
    'AIDA',
    'PAS',
    'Hook-Story-Offer',
    'Soap-Opera-Sequence',
    'Problem-Agitate-Mechanism-Proof-Offer-Scarcity',
];
/** SSE event names streamed by POST /api/generate. */
export const SSE_EVENTS = {
    QUEUED: 'queued',
    STAGE_START: 'stage_start',
    TOKEN: 'token',
    STAGE_COMPLETE: 'stage_complete',
    ANGLE_OPTIONS: 'angle_options',
    ASSET_START: 'asset_start',
    ASSET_COMPLETE: 'asset_complete',
    DONE: 'done',
    ERROR: 'error',
};
/** Angle-override countdown in seconds (stage 2 auto-continue). */
export const ANGLE_OVERRIDE_COUNTDOWN_S = 10;
//# sourceMappingURL=funnels.js.map