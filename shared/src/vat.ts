/**
 * Per-country EU VAT-ID format validation. Format-only (regex) validation — not
 * a live VIES lookup. Mirrored on client and server so a valid ID is accepted
 * identically on both sides.
 */

/** EU-27 VAT-ID format patterns, keyed by ISO country code. */
export const EU_VAT_PATTERNS: Record<string, RegExp> = {
  AT: /^ATU\d{8}$/,
  BE: /^BE0\d{9}$/,
  BG: /^BG\d{9,10}$/,
  CY: /^CY\d{8}[A-Z]$/,
  CZ: /^CZ\d{8,10}$/,
  DE: /^DE\d{9}$/,
  DK: /^DK\d{8}$/,
  EE: /^EE\d{9}$/,
  ES: /^ES[A-Z0-9]\d{7}[A-Z0-9]$/,
  FI: /^FI\d{8}$/,
  FR: /^FR[A-Z0-9]{2}\d{9}$/,
  GR: /^EL\d{9}$/, // Greece uses the EL prefix
  HR: /^HR\d{11}$/,
  HU: /^HU\d{8}$/,
  IE: /^IE(\d{7}[A-Z]{1,2}|\d[A-Z]\d{5}[A-Z])$/,
  IT: /^IT\d{11}$/,
  LT: /^LT(\d{9}|\d{12})$/,
  LU: /^LU\d{8}$/,
  LV: /^LV\d{11}$/,
  MT: /^MT\d{8}$/,
  NL: /^NL\d{9}B\d{2}$/,
  PL: /^PL\d{10}$/,
  PT: /^PT\d{9}$/,
  RO: /^RO\d{2,10}$/,
  SE: /^SE\d{12}$/,
  SI: /^SI\d{8}$/,
  SK: /^SK\d{10}$/,
};

/** ISO country codes that have an EU VAT format pattern. */
export const EU_VAT_COUNTRIES = Object.keys(EU_VAT_PATTERNS);

export function isEuVatCountry(countryCode: string): boolean {
  return countryCode.toUpperCase() in EU_VAT_PATTERNS;
}

/**
 * Validate a VAT ID string. If `countryCode` is provided, the ID must match that
 * country's pattern (and — except for Greece's EL prefix — carry its prefix).
 * If omitted, the ID matches when any known pattern accepts it.
 */
export function isValidVatId(vatId: string, countryCode?: string): boolean {
  const normalized = vatId.replace(/[\s-]/g, '').toUpperCase();
  if (countryCode) {
    const pattern = EU_VAT_PATTERNS[countryCode.toUpperCase()];
    if (!pattern) return false;
    return pattern.test(normalized);
  }
  return Object.values(EU_VAT_PATTERNS).some((p) => p.test(normalized));
}
