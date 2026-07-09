/**
 * Per-country EU VAT-ID format validation. Structural (regex) validation only —
 * not a VIES check. Used by the billing details form and the invoice tax logic.
 *
 * Patterns follow the standard EU VAT number formats (country prefix + national
 * block). The check-digit maths of individual states is out of scope.
 */
/** Map of EU country code → VAT-ID regex (case-insensitive, no spaces). */
export declare const EU_VAT_PATTERNS: Record<string, RegExp>;
/** Normalize a VAT ID: uppercase, strip spaces, dots and dashes. */
export declare function normalizeVatId(vatId: string): string;
/**
 * Validate a VAT ID against the format for a given country.
 * If `countryCode` is provided, the VAT prefix must match it (with the GR→EL
 * special case). Returns true only when the normalized value matches the pattern.
 */
export declare function isValidEuVatId(vatId: string, countryCode?: string): boolean;
/** Extract the ISO country code implied by a VAT ID prefix (EL→GR). */
export declare function countryFromVatId(vatId: string): string | null;
/** True when the country participates in EU VAT (has a pattern here). */
export declare function isEuVatCountry(countryCode: string): boolean;
//# sourceMappingURL=vat.d.ts.map