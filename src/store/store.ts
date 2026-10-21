import { useSyncExternalStore } from "react";
import type { FinancialSnapshot } from "../types/index.ts";

const KEY = "finance-manager:v1";

export const emptySnapshot: FinancialSnapshot = {
  income: { salary: 0, other: 0 },
  expenses: [],
  loans: [],
};

function load(): FinancialSnapshot {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? parseSnapshot(JSON.parse(raw)) : emptySnapshot;
  } catch {
    return emptySnapshot;
  }
}

/** Validates unknown JSON (from storage or an imported file). Throws if invalid. */
export function parseSnapshot(data: unknown): FinancialSnapshot {
  const d = data as Partial<FinancialSnapshot>;
  if (!d || typeof d !== "object" || !d.income || !Array.isArray(d.expenses) || !Array.isArray(d.loans)) {
    throw new Error("Not a valid Finance Manager file.");
  }
  return {
    income: { salary: Number(d.income.salary) || 0, other: Number(d.income.other) || 0 },
    expenses: d.expenses,
    loans: d.loans,
  };
}

let state = load();
const listeners = new Set<() => void>();

export function update(fn: (s: FinancialSnapshot) => FinancialSnapshot): void {
  state = fn(state);
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage full or unavailable: keep working in memory */
  }
  listeners.forEach((l) => l());
}

export function replace(next: FinancialSnapshot): void {
  update(() => next);
}

/** React hook: returns the current snapshot and re-renders on change. */
export function useSnapshot(): FinancialSnapshot {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => state,
  );
}

export const newId = (): string => crypto.randomUUID();
