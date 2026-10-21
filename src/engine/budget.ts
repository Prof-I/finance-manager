import type { FinancialSnapshot } from "../types/index.ts";

export interface BudgetSummary {
  totalIncome: number;
  fixedExpenses: number;
  variableExpenses: number;
  totalEmi: number;
  totalSpending: number;
  monthlySavings: number;
  /** Fractions of income (0–1). Used for the 50/30/20 comparison. */
  needsShare: number;
  wantsShare: number;
  savingsShare: number;
  /** Rule of thumb: 6 months of spending. */
  emergencyFundTarget: number;
}

const sum = (xs: number[]) => xs.reduce((a, b) => a + b, 0);

export function summarize(s: FinancialSnapshot): BudgetSummary {
  const totalIncome = s.income.salary + s.income.other;
  const fixedExpenses = sum(s.expenses.filter((e) => e.fixed).map((e) => e.amount));
  const variableExpenses = sum(s.expenses.filter((e) => !e.fixed).map((e) => e.amount));
  const totalEmi = sum(s.loans.map((l) => l.emi));
  const totalSpending = fixedExpenses + variableExpenses + totalEmi;
  const share = (x: number) => (totalIncome > 0 ? x / totalIncome : 0);

  return {
    totalIncome,
    fixedExpenses,
    variableExpenses,
    totalEmi,
    totalSpending,
    monthlySavings: totalIncome - totalSpending,
    needsShare: share(fixedExpenses + totalEmi),
    wantsShare: share(variableExpenses),
    savingsShare: share(totalIncome - totalSpending),
    emergencyFundTarget: totalSpending * 6,
  };
}
