/**
 * The single money utility. Money always enters as integer cents; this is the
 * only place cents become a localized display string. Never use floats for money.
 */

export interface MoneyFormatOptions {
  /** BCP-47 locale, default en-US. */
  locale?: string;
}

/** Format integer cents as a localized currency string, e.g. 4900 -> "$49.00". */
export function formatCents(cents: number, currency = 'usd', opts: MoneyFormatOptions = {}): string {
  if (!Number.isInteger(cents)) {
    throw new TypeError(`formatCents expects integer cents, received ${cents}`);
  }
  const formatter = new Intl.NumberFormat(opts.locale ?? 'en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  });
  return formatter.format(cents / 100);
}

/** Parse a decimal money string (e.g. "49.00") to integer cents. Rounds half-up. */
export function parseToCents(amount: string | number): number {
  const value = typeof amount === 'string' ? Number(amount.replace(/[^0-9.-]/g, '')) : amount;
  if (!Number.isFinite(value)) {
    throw new TypeError(`parseToCents received a non-numeric value: ${amount}`);
  }
  return Math.round(value * 100);
}

/** Format a per-month price from an annual (per-year) cents figure. */
export function annualPerMonthCents(annualCents: number): number {
  return Math.round(annualCents / 12);
}

/** Annual savings percentage vs paying monthly, rounded to nearest integer. */
export function annualSavingsPercent(monthlyCents: number, annualCents: number): number {
  if (monthlyCents <= 0) return 0;
  const yearlyIfMonthly = monthlyCents * 12;
  if (yearlyIfMonthly <= 0) return 0;
  return Math.round(((yearlyIfMonthly - annualCents) / yearlyIfMonthly) * 100);
}
