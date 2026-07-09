/**
 * Funnel types, pipeline stages, the funnel→asset matrix (Section 6.D),
 * and the SSE event-name catalog. This is the single source of truth the
 * engine, mock copy banks, and QA all agree on.
 */
export declare const FUNNEL_TYPES: readonly ["vsl", "lead_magnet", "product_launch", "webinar", "ecom_pdp"];
export type FunnelType = (typeof FUNNEL_TYPES)[number];
export declare const PIPELINE_STAGES: readonly ["analysis", "angles", "framework", "draft", "polish"];
export type PipelineStage = (typeof PIPELINE_STAGES)[number];
/** Angle categories produced in stage 2. */
export declare const ANGLE_TYPES: readonly ["fear", "aspiration", "curiosity", "social_proof", "urgency"];
export type AngleType = (typeof ANGLE_TYPES)[number];
/** Eugene Schwartz awareness stages (1–5) surfaced in the Strategy Brief. */
export declare const AWARENESS_STAGES: readonly [1, 2, 3, 4, 5];
export type AwarenessStage = (typeof AWARENESS_STAGES)[number];
/**
 * Every asset type the engine can emit. `asset_type` on generation_assets is one
 * of these. Numbered email slots (email_1…) are represented with an index suffix.
 */
export declare const ASSET_TYPES: readonly ["ad_hooks", "vsl_script", "landing_page", "opt_in_page", "thank_you_page", "sales_page", "registration_page", "pitch_outline", "replay_email", "upsell_page", "faq_block", "product_title_bullets", "product_description", "ad_primary_texts", "ad_headlines", "review_request_email", "email_1", "email_2", "email_3", "email_4", "email_5"];
export type AssetType = (typeof ASSET_TYPES)[number];
/**
 * Funnel → asset matrix (Section 6.D). The exact, ordered deliverables per funnel
 * type. Mock copy banks must cover every cell of this matrix.
 */
export declare const FUNNEL_ASSET_MATRIX: Record<FunnelType, AssetType[]>;
/** Human-readable count captions for the input panel funnel cards. */
export declare const FUNNEL_ASSET_COUNTS: Record<FunnelType, number>;
/** Asset types eligible for A/B variant generation. */
export declare const VARIANT_ELIGIBLE_ASSETS: AssetType[];
/** Frameworks recorded per asset ("Why this works"). */
export declare const FRAMEWORKS: readonly ["AIDA", "PAS", "Hook-Story-Offer", "Soap-Opera-Sequence", "Problem-Agitate-Mechanism-Proof-Offer-Scarcity"];
export type Framework = (typeof FRAMEWORKS)[number];
/** SSE event names streamed by POST /api/generate. */
export declare const SSE_EVENTS: {
    readonly QUEUED: "queued";
    readonly STAGE_START: "stage_start";
    readonly TOKEN: "token";
    readonly STAGE_COMPLETE: "stage_complete";
    readonly ANGLE_OPTIONS: "angle_options";
    readonly ASSET_START: "asset_start";
    readonly ASSET_COMPLETE: "asset_complete";
    readonly DONE: "done";
    readonly ERROR: "error";
};
export type SseEventName = (typeof SSE_EVENTS)[keyof typeof SSE_EVENTS];
/** Angle-override countdown in seconds (stage 2 auto-continue). */
export declare const ANGLE_OVERRIDE_COUNTDOWN_S = 10;
//# sourceMappingURL=funnels.d.ts.map