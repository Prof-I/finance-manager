import type { FinancialSnapshot, Suggestion } from "../types/index.ts";
import { rules } from "./rules.ts";

/**
 * Anything that turns a snapshot into advice.
 * The base app ships a rule-based advisor; an AI advisor can implement
 * the same interface and be swapped in without touching the UI.
 */
export interface Advisor {
  getAdvice(snapshot: FinancialSnapshot): Promise<Suggestion[]>;
}

export const ruleBasedAdvisor: Advisor = {
  async getAdvice(snapshot) {
    return rules.flatMap((rule) => rule(snapshot));
  },
};

/** Change this line to plug in a different advisor. */
export const advisor: Advisor = ruleBasedAdvisor;
