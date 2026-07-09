/**
 * The single money-formatting utility. Integer cents in, localized string out.
 * Never use floats for money anywhere in the codebase; call these helpers.
 */

export interface MoneyFormatOptions {
  currency?: string;
  locale?: string;
}

/**
 * Format integer cents as a localized currency string.
 * @example formatCents(4900) => "$49.00"
 * @example formatCents(468000, { currency: 'eur', locale: 'de-DE' }) => "4.680,00 €"
 */
export function formatCents(cents: number, opts: MoneyFormatOptions = {}): string {
  if (!Number.isInteger(cents)) {
    throw new Error(`formatCents expects integer cents, got ${cents}`);
  }
  const currency = (opts.currency ?? 'usd').toUpperCase();
  const locale = opts.locale ?? 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(cents / 100);
}

/**
 * Parse a decimal currency amount (e.g. "49.00" or "49") into integer cents.
 * Rejects values with more than 2 decimal places.
 */
export function parseCents(amount: string | number): number {
  const str = typeof amount === 'number' ? String(amount) : amount.trim();
  if (!/^-?\d+(\.\d{1,2})?$/.test(str)) {
    throw new Error(`Cannot parse "${amount}" into cents`);
  }
  return Math.round(parseFloat(str) * 100);
}

/** Format a per-month price given an annual total in cents. */
export function annualPerMonthCents(annualCents: number): number {
  return Math.round(annualCents / 12);
}
