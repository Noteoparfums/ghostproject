export interface PlanSeed {
    slug: 'free' | 'pro' | 'agency';
    name: string;
    monthly_price_cents: number;
    annual_price_cents: number;
    monthly_credits: number;
    features: string[];
    is_active: boolean;
    sort_order: number;
}
export declare const plansSeed: PlanSeed[];
//# sourceMappingURL=plans.d.ts.map