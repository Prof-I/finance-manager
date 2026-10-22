import type { CurrencyCode } from "../types/index.ts";

/** Locale chosen per currency so grouping matches local convention. */
export const CURRENCIES: Record<CurrencyCode, { label: string; locale: string }> = {
  INR: { label: "Indian Rupee (INR)", locale: "en-IN" }, // lakh grouping
  USD: { label: "US Dollar (USD)", locale: "en-US" },
  EUR: { label: "Euro (EUR)", locale: "en-IE" }, // thousands grouping, symbol first
  GBP: { label: "British Pound (GBP)", locale: "en-GB" },
};

export const DEFAULT_CURRENCY: CurrencyCode = "INR";

export const isCurrencyCode = (v: unknown): v is CurrencyCode =>
  typeof v === "string" && Object.prototype.hasOwnProperty.call(CURRENCIES, v);

const formatters = new Map<CurrencyCode, Intl.NumberFormat>();

function formatterFor(currency: CurrencyCode): Intl.NumberFormat {
  let f = formatters.get(currency);
  if (!f) {
    f = new Intl.NumberFormat(CURRENCIES[currency].locale, { style: "currency", currency, maximumFractionDigits: 0 });
    formatters.set(currency, f);
  }
  return f;
}

/**
 * Display only, no conversion.
 * (1234567, "INR") -> ₹12,34,567    (1234567, "USD") -> $1,234,567
 */
export const formatMoney = (n: number, currency: CurrencyCode = DEFAULT_CURRENCY): string =>
  formatterFor(currency).format(Math.round(n));

/** "INR" -> "₹", "USD" -> "$". Used in form labels. */
export function currencySymbol(currency: CurrencyCode): string {
  const parts = new Intl.NumberFormat(CURRENCIES[currency].locale, {
    style: "currency",
    currency,
    currencyDisplay: "narrowSymbol",
  }).formatToParts(0);
  return parts.find((p) => p.type === "currency")?.value ?? currency;
}

export const formatPercent = (fraction: number): string => `${Math.round(fraction * 100)}%`;

/** 30 -> "2 yr 6 mo" */
export function formatDuration(months: number): string {
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y === 0) return `${m} mo`;
  return m === 0 ? `${y} yr` : `${y} yr ${m} mo`;
}
