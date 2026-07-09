/**
 * The single money utility. Money always enters as integer cents; this is the
 * only place cents become a localized display string. Never use floats for money.
 */
/** Format integer cents as a localized currency string, e.g. 4900 -> "$49.00". */
export function formatCents(cents, currency = 'usd', opts = {}) {
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
export function parseToCents(amount) {
    const value = typeof amount === 'string' ? Number(amount.replace(/[^0-9.-]/g, '')) : amount;
    if (!Number.isFinite(value)) {
        throw new TypeError(`parseToCents received a non-numeric value: ${amount}`);
    }
    return Math.round(value * 100);
}
/** Format a per-month price from an annual (per-year) cents figure. */
export function annualPerMonthCents(annualCents) {
    return Math.round(annualCents / 12);
}
/** Annual savings percentage vs paying monthly, rounded to nearest integer. */
export function annualSavingsPercent(monthlyCents, annualCents) {
    if (monthlyCents <= 0)
        return 0;
    const yearlyIfMonthly = monthlyCents * 12;
    if (yearlyIfMonthly <= 0)
        return 0;
    return Math.round(((yearlyIfMonthly - annualCents) / yearlyIfMonthly) * 100);
}
//# sourceMappingURL=money.js.map