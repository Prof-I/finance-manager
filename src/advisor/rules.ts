import type { FinancialSnapshot, Suggestion } from "../types/index.ts";
import { formatINR, formatPercent, summarize } from "../engine/index.ts";

/** A rule inspects the snapshot and returns zero or more suggestions. */
export type Rule = (s: FinancialSnapshot) => Suggestion[];

const overspending: Rule = (s) => {
  const b = summarize(s);
  if (b.totalIncome > 0 && b.monthlySavings < 0) {
    return [{ id: "overspending", severity: "warn", message: `You spend ${formatINR(-b.monthlySavings)} more than you earn each month. Cut variable expenses first.` }];
  }
  return [];
};

const emiBurden: Rule = (s) => {
  const b = summarize(s);
  if (b.totalIncome > 0 && b.totalEmi / b.totalIncome > 0.4) {
    return [{ id: "emi-burden", severity: "warn", message: `EMIs take ${formatPercent(b.totalEmi / b.totalIncome)} of your income. Lenders usually prefer under 40%.` }];
  }
  return [];
};

const savingsRate: Rule = (s) => {
  const b = summarize(s);
  if (b.totalIncome === 0 || b.monthlySavings < 0) return [];
  return b.savingsShare >= 0.2
    ? [{ id: "savings-good", severity: "good", message: `You save ${formatPercent(b.savingsShare)} of your income, which meets the 20% guideline.` }]
    : [{ id: "savings-low", severity: "info", message: `You save ${formatPercent(b.savingsShare)} of your income. The 50/30/20 guideline suggests 20%.` }];
};

const emergencyFund: Rule = (s) => {
  const b = summarize(s);
  if (b.totalSpending === 0) return [];
  return [{ id: "emergency-fund", severity: "info", message: `Build an emergency fund of about ${formatINR(b.emergencyFundTarget)} (6 months of spending) before investing.` }];
};

export const rules: Rule[] = [overspending, emiBurden, savingsRate, emergencyFund];
