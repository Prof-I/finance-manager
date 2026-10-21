import { monthlyRate } from "./emi.ts";

export interface AmortizationRow {
  month: number;
  payment: number;
  interest: number;
  principal: number;
  balance: number;
}

/**
 * Month-by-month repayment schedule.
 * Returns an empty array if the payment never clears the loan.
 */
export function buildAmortization(
  principal: number,
  annualRate: number,
  payment: number,
  maxMonths = 1200,
): AmortizationRow[] {
  const r = monthlyRate(annualRate);
  if (principal <= 0 || payment <= 0 || payment <= principal * r) return [];

  const rows: AmortizationRow[] = [];
  let balance = principal;
  while (balance > 0.005 && rows.length < maxMonths) {
    const interest = balance * r;
    const paid = Math.min(payment, balance + interest);
    const principalPart = paid - interest;
    balance = Math.max(0, balance - principalPart);
    rows.push({ month: rows.length + 1, payment: paid, interest, principal: principalPart, balance });
  }
  return balance > 0.005 ? [] : rows;
}
