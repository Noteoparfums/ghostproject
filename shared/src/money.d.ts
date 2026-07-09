/**
 * The single money utility. Money always enters as integer cents; this is the
 * only place cents become a localized display string. Never use floats for money.
 */
export interface MoneyFormatOptions {
    /** BCP-47 locale, default en-US. */
    locale?: string;
}
/** Format integer cents as a localized currency string, e.g. 4900 -> "$49.00". */
export declare function formatCents(cents: number, currency?: string, opts?: MoneyFormatOptions): string;
/** Parse a decimal money string (e.g. "49.00") to integer cents. Rounds half-up. */
export declare function parseToCents(amount: string | number): number;
/** Format a per-month price from an annual (per-year) cents figure. */
export declare function annualPerMonthCents(annualCents: number): number;
/** Annual savings percentage vs paying monthly, rounded to nearest integer. */
export declare function annualSavingsPercent(monthlyCents: number, annualCents: number): number;
//# sourceMappingURL=money.d.ts.map