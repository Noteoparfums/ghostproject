/**
 * Per-country EU VAT-ID format validation (format-level only, no VIES lookup).
 * Patterns follow the official EU VAT number structures.
 */
export const EU_VAT_PATTERNS: Record<string, RegExp> = {
  AT: /^ATU\d{8}$/,
  BE: /^BE[01]\d{9}$/,
  BG: /^BG\d{9,10}$/,
  CY: /^CY\d{8}[A-Z]$/,
  CZ: /^CZ\d{8,10}$/,
  DE: /^DE\d{9}$/,
  DK: /^DK\d{8}$/,
  EE: /^EE\d{9}$/,
  EL: /^EL\d{9}$/,
  ES: /^ES[A-Z0-9]\d{7}[A-Z0-9]$/,
  FI: /^FI\d{8}$/,
  FR: /^FR[A-Z0-9]{2}\d{9}$/,
  HR: /^HR\d{11}$/,
  HU: /^HU\d{8}$/,
  IE: /^IE(\d{7}[A-Z]{1,2}|\d[A-Z0-9+*]\d{5}[A-Z])$/,
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

/** Country codes whose VAT lookups use a different prefix (Greece uses EL). */
const COUNTRY_TO_VAT_PREFIX: Record<string, string> = { GR: 'EL' };

export interface VatValidationResult {
  valid: boolean;
  reason?: 'unsupported_country' | 'bad_format' | 'prefix_mismatch';
}

/**
 * Validate an EU VAT ID for a given ISO country code.
 * The VAT ID must carry the country prefix (e.g. "DE123456789").
 */
export function validateVatId(countryCode: string, vatId: string): VatValidationResult {
  const cc = countryCode.toUpperCase();
  const prefix = COUNTRY_TO_VAT_PREFIX[cc] ?? cc;
  const pattern = EU_VAT_PATTERNS[prefix];
  if (!pattern) return { valid: false, reason: 'unsupported_country' };
  const normalized = vatId.replace(/[\s.-]/g, '').toUpperCase();
  if (!normalized.startsWith(prefix)) return { valid: false, reason: 'prefix_mismatch' };
  if (!pattern.test(normalized)) return { valid: false, reason: 'bad_format' };
  return { valid: true };
}
