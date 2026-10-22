import { describe, expect, it } from "vitest";
import { ruleBasedAdvisor } from "./index.ts";
import type { FinancialSnapshot } from "../types/index.ts";

const overspender: FinancialSnapshot = {
  income: { salary: 50_000, other: 0 },
  expenses: [{ id: "1", category: "Rent", amount: 1_050_000, fixed: true }],
  loans: [],
};

describe("advisor messages", () => {
  it("show amounts in the selected currency", async () => {
    const inr = await ruleBasedAdvisor.getAdvice(overspender, { currency: "INR" });
    const usd = await ruleBasedAdvisor.getAdvice(overspender, { currency: "USD" });
    expect(inr.find((a) => a.id === "overspending")!.message).toContain("₹10,00,000");
    expect(usd.find((a) => a.id === "overspending")!.message).toContain("$1,000,000");
  });
});
