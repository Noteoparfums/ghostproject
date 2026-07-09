export interface ProrationResult {
  refundCents: number;
  chargeCents: number;
  netCents: number;
}

export function calculateProration(
  currentPriceCents: number,
  newPriceCents: number,
  periodStart: Date,
  periodEnd: Date,
  now: Date = new Date()
): ProrationResult {
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
