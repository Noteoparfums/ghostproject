/**
 * Per-country EU VAT-ID format validation. Structural (regex) validation only —
 * not a VIES check. Used by the billing details form and the invoice tax logic.
 *
 * Patterns follow the standard EU VAT number formats (country prefix + national
 * block). The check-digit maths of individual states is out of scope.
 */
/** Map of EU country code → VAT-ID regex (case-insensitive, no spaces). */
export const EU_VAT_PATTERNS = {
    AT: /^ATU\d{8}$/,
    BE: /^BE0\d{9}$/,
    BG: /^BG\d{9,10}$/,
    CY: /^CY\d{8}[A-Z]$/,
    CZ: /^CZ\d{8,10}$/,
    DE: /^DE\d{9}$/,
    DK: /^DK\d{8}$/,
    EE: /^EE\d{9}$/,
    EL: /^EL\d{9}$/, // Greece (EL is the VAT prefix for GR)
    ES: /^ES[A-Z0-9]\d{7}[A-Z0-9]$/,
    FI: /^FI\d{8}$/,
    FR: /^FR[A-Z0-9]{2}\d{9}$/,
    HR: /^HR\d{11}$/,
    HU: /^HU\d{8}$/,
    IE: /^IE\d{7}[A-W][A-I]?$|^IE\d[A-Z*+]\d{5}[A-W]$/,
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
/** Normalize a VAT ID: uppercase, strip spaces, dots and dashes. */
export function normalizeVatId(vatId) {
    return vatId.toUpperCase().replace(/[\s.-]/g, '');
}
/**
 * Validate a VAT ID against the format for a given country.
 * If `countryCode` is provided, the VAT prefix must match it (with the GR→EL
 * special case). Returns true only when the normalized value matches the pattern.
 */
export function isValidEuVatId(vatId, countryCode) {
    const normalized = normalizeVatId(vatId);
    if (normalized.length < 3)
        return false;
    if (countryCode) {
        const cc = countryCode.toUpperCase();
        const vatPrefix = cc === 'GR' ? 'EL' : cc;
        const pattern = EU_VAT_PATTERNS[vatPrefix];
        if (!pattern)
            return false;
        return pattern.test(normalized);
    }
    // No country hint: accept if it matches any known EU pattern.
    const prefix = normalized.slice(0, 2);
    const pattern = EU_VAT_PATTERNS[prefix];
    return pattern ? pattern.test(normalized) : false;
}
/** Extract the ISO country code implied by a VAT ID prefix (EL→GR). */
export function countryFromVatId(vatId) {
    const normalized = normalizeVatId(vatId);
    const prefix = normalized.slice(0, 2);
    if (!EU_VAT_PATTERNS[prefix])
        return null;
    return prefix === 'EL' ? 'GR' : prefix;
}
/** True when the country participates in EU VAT (has a pattern here). */
export function isEuVatCountry(countryCode) {
    const cc = countryCode.toUpperCase();
    const vatPrefix = cc === 'GR' ? 'EL' : cc;
    return Boolean(EU_VAT_PATTERNS[vatPrefix]);
}
//# sourceMappingURL=vat.js.map