/** Amounts are plain numbers, per month unless stated otherwise. The display currency is a separate setting. */

export interface Income {
  salary: number;
  other: number;
}

export interface Expense {
  id: string;
  /** Broad category, e.g. "Rent", "Electricity". Not item-level. */
  category: string;
  amount: number;
  /** Fixed expenses (rent) vs variable ones (groceries). */
  fixed: boolean;
}

export interface Loan {
  id: string;
  name: string;
  /** Outstanding principal today. */
  principal: number;
  /** Annual interest rate in percent, e.g. 8.5 */
  annualRate: number;
  /** Monthly EMI being paid. */
  emi: number;
}

/**
 * The single data shape every feature reads from.
 * Calculations, rules and future AI features all take a FinancialSnapshot.
 */
export interface FinancialSnapshot {
  income: Income;
  expenses: Expense[];
  loans: Loan[];
}

export type Severity = "good" | "info" | "warn";

export interface Suggestion {
  id: string;
  severity: Severity;
  message: string;
}

/** Currencies the user can choose to display amounts in. Display only: no conversion. */
export type CurrencyCode = "INR" | "USD" | "EUR" | "GBP";

/** App preferences. Kept apart from FinancialSnapshot so the engine and future AI features never see them. */
export interface Settings {
  currency: CurrencyCode;
}
