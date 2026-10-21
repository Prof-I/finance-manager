/** Monthly rate from an annual percentage. */
export const monthlyRate = (annualRate: number): number => annualRate / 12 / 100;

/** EMI = P·r·(1+r)^n / ((1+r)^n − 1) */
export function calculateEmi(principal: number, annualRate: number, months: number): number {
  if (months <= 0) throw new Error("months must be positive");
  const r = monthlyRate(annualRate);
  if (r === 0) return principal / months;
  const f = Math.pow(1 + r, months);
  return (principal * r * f) / (f - 1);
}

/**
 * Months needed to clear a loan paying `payment` each month.
 * Returns null if the payment never covers the monthly interest.
 */
export function monthsToPayoff(principal: number, annualRate: number, payment: number): number | null {
  if (principal <= 0) return 0;
  if (payment <= 0) return null;
  const r = monthlyRate(annualRate);
  if (r === 0) return Math.ceil(principal / payment);
  if (payment <= principal * r) return null;
  return Math.ceil(-Math.log(1 - (principal * r) / payment) / Math.log(1 + r));
}
