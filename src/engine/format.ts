const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** 1234567 -> ₹12,34,567 */
export const formatINR = (n: number): string => inr.format(Math.round(n));

export const formatPercent = (fraction: number): string => `${Math.round(fraction * 100)}%`;

/** 30 -> "2 yr 6 mo" */
export function formatDuration(months: number): string {
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y === 0) return `${m} mo`;
  return m === 0 ? `${y} yr` : `${y} yr ${m} mo`;
}
