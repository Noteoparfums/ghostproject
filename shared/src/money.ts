/**
 * The single money-formatting util. All amounts enter as integer cents.
 */
export function formatCents(cents: number, currency = 'usd', locale = 'en-US'): string {
  if (!Number.isInteger(cents)) {
    throw new Error(`formatCents expects integer cents, got ${cents}`);
  }
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(cents / 100);
}

/** Parse a decimal money string like "49.00" into integer cents. Throws on bad input. */
export function parseToCents(value: string): number {
  const trimmed = value.trim();
  if (!/^-?\d+(\.\d{1,2})?$/.test(trimmed)) {
    throw new Error(`Cannot parse money value: "${value}"`);
  }
  const negative = trimmed.startsWith('-');
  const [wholeRaw, fracRaw = ''] = trimmed.replace(/^-/, '').split('.');
  const whole = Number(wholeRaw);
  const frac = Number(fracRaw.padEnd(2, '0'));
  const cents = whole * 100 + frac;
  return negative ? -cents : cents;
}
