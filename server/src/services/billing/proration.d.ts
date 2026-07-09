export interface ProrationResult {
    refundCents: number;
    chargeCents: number;
    netCents: number;
}
export declare function calculateProration(currentPriceCents: number, newPriceCents: number, periodStart: Date, periodEnd: Date, now?: Date): ProrationResult;
//# sourceMappingURL=proration.d.ts.map