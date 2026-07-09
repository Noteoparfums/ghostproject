import { z } from 'zod';
/** Map of event name → zod schema for its `properties` payload. */
export declare const EVENT_CATALOG: {
    readonly page_view: z.ZodObject<{
        path: z.ZodString;
        referrer: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        utm: z.ZodOptional<z.ZodObject<{
            source: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            medium: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            campaign: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            term: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            content: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            content?: string | null | undefined;
            source?: string | null | undefined;
            medium?: string | null | undefined;
            campaign?: string | null | undefined;
            term?: string | null | undefined;
        }, {
            content?: string | null | undefined;
            source?: string | null | undefined;
            medium?: string | null | undefined;
            campaign?: string | null | undefined;
            term?: string | null | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        path: string;
        referrer?: string | null | undefined;
        utm?: {
            content?: string | null | undefined;
            source?: string | null | undefined;
            medium?: string | null | undefined;
            campaign?: string | null | undefined;
            term?: string | null | undefined;
        } | undefined;
    }, {
        path: string;
        referrer?: string | null | undefined;
        utm?: {
            content?: string | null | undefined;
            source?: string | null | undefined;
            medium?: string | null | undefined;
            campaign?: string | null | undefined;
            term?: string | null | undefined;
        } | undefined;
    }>;
    readonly cta_clicked: z.ZodObject<{
        cta_id: z.ZodString;
        location: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        cta_id: string;
        location: string;
    }, {
        cta_id: string;
        location: string;
    }>;
    readonly pricing_toggle_switched: z.ZodObject<{
        interval: z.ZodEnum<["monthly", "annual"]>;
    }, "strip", z.ZodTypeAny, {
        interval: "monthly" | "annual";
    }, {
        interval: "monthly" | "annual";
    }>;
    readonly faq_opened: z.ZodObject<{
        question_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        question_id: string;
    }, {
        question_id: string;
    }>;
    readonly newsletter_subscribed: z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>;
    readonly demo_modal_opened: z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>;
    readonly signup_started: z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>;
    readonly signup_completed: z.ZodObject<{
        utm: z.ZodOptional<z.ZodObject<{
            source: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            medium: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            campaign: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            term: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            content: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            content?: string | null | undefined;
            source?: string | null | undefined;
            medium?: string | null | undefined;
            campaign?: string | null | undefined;
            term?: string | null | undefined;
        }, {
            content?: string | null | undefined;
            source?: string | null | undefined;
            medium?: string | null | undefined;
            campaign?: string | null | undefined;
            term?: string | null | undefined;
        }>>;
    }, "strip", z.ZodTypeAny, {
        utm?: {
            content?: string | null | undefined;
            source?: string | null | undefined;
            medium?: string | null | undefined;
            campaign?: string | null | undefined;
            term?: string | null | undefined;
        } | undefined;
    }, {
        utm?: {
            content?: string | null | undefined;
            source?: string | null | undefined;
            medium?: string | null | undefined;
            campaign?: string | null | undefined;
            term?: string | null | undefined;
        } | undefined;
    }>;
    readonly email_verified: z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>;
    readonly login_succeeded: z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>;
    readonly identify: z.ZodObject<{
        user_id: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        user_id: number;
    }, {
        user_id: number;
    }>;
    readonly first_project_created: z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>;
    readonly first_brand_voice_created: z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>;
    readonly first_generation_started: z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>;
    readonly first_generation_completed: z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>;
    readonly generation_started: z.ZodObject<{
        funnel_type: z.ZodEnum<["vsl", "lead_magnet", "product_launch", "webinar", "ecom_pdp"]>;
        has_brand_voice: z.ZodBoolean;
        template_id: z.ZodOptional<z.ZodNullable<z.ZodNumber>>;
    }, "strip", z.ZodTypeAny, {
        funnel_type: "vsl" | "lead_magnet" | "product_launch" | "webinar" | "ecom_pdp";
        has_brand_voice: boolean;
        template_id?: number | null | undefined;
    }, {
        funnel_type: "vsl" | "lead_magnet" | "product_launch" | "webinar" | "ecom_pdp";
        has_brand_voice: boolean;
        template_id?: number | null | undefined;
    }>;
    readonly generation_completed: z.ZodObject<{
        duration_ms: z.ZodNumber;
        copy_score: z.ZodNumber;
        credits: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        duration_ms: number;
        copy_score: number;
        credits: number;
    }, {
        duration_ms: number;
        copy_score: number;
        credits: number;
    }>;
    readonly generation_cancelled: z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>;
    readonly generation_failed: z.ZodObject<{
        code: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        code: string;
    }, {
        code: string;
    }>;
    readonly angle_overridden: z.ZodObject<{
        angle_id: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        angle_id: string;
    }, {
        angle_id: string;
    }>;
    readonly section_regenerated: z.ZodObject<{
        asset_type: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        asset_type: string;
    }, {
        asset_type: string;
    }>;
    readonly variant_created: z.ZodObject<{
        asset_type: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        asset_type: string;
    }, {
        asset_type: string;
    }>;
    readonly asset_edited: z.ZodObject<{
        asset_type: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        asset_type: string;
    }, {
        asset_type: string;
    }>;
    readonly export_downloaded: z.ZodObject<{
        format: z.ZodEnum<["md", "txt", "html"]>;
    }, "strip", z.ZodTypeAny, {
        format: "md" | "txt" | "html";
    }, {
        format: "md" | "txt" | "html";
    }>;
    readonly copy_saved: z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>;
    readonly upgrade_modal_shown: z.ZodObject<{
        trigger: z.ZodEnum<["credits", "premium_template", "watermark"]>;
    }, "strip", z.ZodTypeAny, {
        trigger: "credits" | "premium_template" | "watermark";
    }, {
        trigger: "credits" | "premium_template" | "watermark";
    }>;
    readonly checkout_started: z.ZodObject<{
        plan: z.ZodString;
        interval: z.ZodEnum<["monthly", "annual"]>;
    }, "strip", z.ZodTypeAny, {
        interval: "monthly" | "annual";
        plan: string;
    }, {
        interval: "monthly" | "annual";
        plan: string;
    }>;
    readonly checkout_completed: z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>;
    readonly checkout_abandoned: z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>;
    readonly topup_purchased: z.ZodObject<{
        pack: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        pack: string;
    }, {
        pack: string;
    }>;
    readonly plan_changed: z.ZodObject<{
        from: z.ZodString;
        to: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        to: string;
        from: string;
    }, {
        to: string;
        from: string;
    }>;
    readonly cancellation_started: z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>;
    readonly retention_offer_shown: z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>;
    readonly retention_offer_accepted: z.ZodObject<{
        offer_type: z.ZodEnum<["pause", "coupon"]>;
    }, "strip", z.ZodTypeAny, {
        offer_type: "pause" | "coupon";
    }, {
        offer_type: "pause" | "coupon";
    }>;
    readonly subscription_cancelled: z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>;
    readonly refund_requested: z.ZodObject<{}, "passthrough", z.ZodTypeAny, z.objectOutputType<{}, z.ZodTypeAny, "passthrough">, z.objectInputType<{}, z.ZodTypeAny, "passthrough">>;
    readonly client_error: z.ZodObject<{
        message: z.ZodString;
        route: z.ZodString;
        app_version: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        message: string;
        route: string;
        app_version?: string | undefined;
    }, {
        message: string;
        route: string;
        app_version?: string | undefined;
    }>;
    readonly web_vital: z.ZodObject<{
        metric: z.ZodEnum<["LCP", "CLS", "INP", "FID", "TTFB", "FCP"]>;
        value: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        value: number;
        metric: "LCP" | "CLS" | "INP" | "FID" | "TTFB" | "FCP";
    }, {
        value: number;
        metric: "LCP" | "CLS" | "INP" | "FID" | "TTFB" | "FCP";
    }>;
};
export type EventName = keyof typeof EVENT_CATALOG;
export type EventProps<N extends EventName> = z.infer<(typeof EVENT_CATALOG)[N]>;
/** Events allowed without analytics consent (essential telemetry). */
export declare const CONSENT_EXEMPT_EVENTS: EventName[];
/** True when the event name exists in the catalog. */
export declare function isKnownEvent(name: string): name is EventName;
/** Validate a single event's properties against its catalog schema. */
export declare function validateEvent(name: string, properties: unknown): {
    ok: true;
    name: EventName;
} | {
    ok: false;
    error: string;
};
/** Batch envelope schema accepted by POST /api/analytics/events. */
export declare const analyticsBatchSchema: z.ZodObject<{
    events: z.ZodArray<z.ZodObject<{
        event_name: z.ZodString;
        anonymous_id: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        session_id: z.ZodString;
        properties: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>;
        url_path: z.ZodString;
        referrer: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        utm: z.ZodOptional<z.ZodObject<{
            source: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            medium: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            campaign: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            term: z.ZodOptional<z.ZodNullable<z.ZodString>>;
            content: z.ZodOptional<z.ZodNullable<z.ZodString>>;
        }, "strip", z.ZodTypeAny, {
            content?: string | null | undefined;
            source?: string | null | undefined;
            medium?: string | null | undefined;
            campaign?: string | null | undefined;
            term?: string | null | undefined;
        }, {
            content?: string | null | undefined;
            source?: string | null | undefined;
            medium?: string | null | undefined;
            campaign?: string | null | undefined;
            term?: string | null | undefined;
        }>>;
        occurred_at: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        event_name: string;
        session_id: string;
        url_path: string;
        occurred_at: string;
        referrer?: string | null | undefined;
        utm?: {
            content?: string | null | undefined;
            source?: string | null | undefined;
            medium?: string | null | undefined;
            campaign?: string | null | undefined;
            term?: string | null | undefined;
        } | undefined;
        anonymous_id?: string | null | undefined;
        properties?: Record<string, unknown> | undefined;
    }, {
        event_name: string;
        session_id: string;
        url_path: string;
        occurred_at: string;
        referrer?: string | null | undefined;
        utm?: {
            content?: string | null | undefined;
            source?: string | null | undefined;
            medium?: string | null | undefined;
            campaign?: string | null | undefined;
            term?: string | null | undefined;
        } | undefined;
        anonymous_id?: string | null | undefined;
        properties?: Record<string, unknown> | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    events: {
        event_name: string;
        session_id: string;
        url_path: string;
        occurred_at: string;
        referrer?: string | null | undefined;
        utm?: {
            content?: string | null | undefined;
            source?: string | null | undefined;
            medium?: string | null | undefined;
            campaign?: string | null | undefined;
            term?: string | null | undefined;
        } | undefined;
        anonymous_id?: string | null | undefined;
        properties?: Record<string, unknown> | undefined;
    }[];
}, {
    events: {
        event_name: string;
        session_id: string;
        url_path: string;
        occurred_at: string;
        referrer?: string | null | undefined;
        utm?: {
            content?: string | null | undefined;
            source?: string | null | undefined;
            medium?: string | null | undefined;
            campaign?: string | null | undefined;
            term?: string | null | undefined;
        } | undefined;
        anonymous_id?: string | null | undefined;
        properties?: Record<string, unknown> | undefined;
    }[];
}>;
export type AnalyticsBatch = z.infer<typeof analyticsBatchSchema>;
//# sourceMappingURL=events.d.ts.map