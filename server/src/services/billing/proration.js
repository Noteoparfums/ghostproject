export function calculateProration(currentPriceCents, newPriceCents, periodStart, periodEnd, now = new Date()) {
    const totalDuration = periodEnd.getTime() - periodStart.getTime();
    if (totalDuration <= 0) {
        return {
            refundCents: currentPriceCents,
            chargeCents: newPriceCents,
            netCents: newPriceCents - currentPriceCents
        };
    }
    const elapsed = Math.max(0, Math.min(totalDuration, now.getTime() - periodStart.getTime()));
    const usedFraction = elapsed / totalDuration;
    const unusedFraction = 1 - usedFraction;
    const refundCents = Math.round(currentPriceCents * unusedFraction);
    const chargeCents = Math.round(newPriceCents * unusedFraction);
    const netCents = chargeCents - refundCents;
    return {
        refundCents,
        chargeCents,
        netCents
    };
}
//# sourceMappingURL=proration.js.map