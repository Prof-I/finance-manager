import { useSyncExternalStore } from "react";
import { DEFAULT_CURRENCY, isCurrencyCode } from "../engine/format.ts";
import type { FinancialSnapshot, Settings } from "../types/index.ts";

const KEY = "finance-manager:v1";
const SETTINGS_KEY = "finance-manager:settings";

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

/* ---- Settings: separate from the snapshot, so export/import and the engine are unaffected ---- */

export const defaultSettings: Settings = { currency: DEFAULT_CURRENCY };

/** Validates unknown JSON from storage. Anything invalid falls back to the default. */
export function parseSettings(data: unknown): Settings {
  const d = (data && typeof data === "object" ? data : {}) as Partial<Settings>;
  return { currency: isCurrencyCode(d.currency) ? d.currency : DEFAULT_CURRENCY };
}

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? parseSettings(JSON.parse(raw)) : defaultSettings;
  } catch {
    return defaultSettings;
  }
}

let settings = loadSettings();

export function updateSettings(patch: Partial<Settings>): void {
  settings = parseSettings({ ...settings, ...patch });
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    /* storage full or unavailable: keep working in memory */
  }
  listeners.forEach((l) => l());
}

/** React hook: returns the current settings and re-renders on change. */
export function useSettings(): Settings {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => settings,
  );
}

export const newId = (): string => crypto.randomUUID();
