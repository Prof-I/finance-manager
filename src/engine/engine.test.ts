import { describe, expect, it } from "vitest";
import { buildAmortization, calculateEmi, monthsToPayoff, summarize } from "./index.ts";

describe("calculateEmi", () => {
  it("matches the standard home-loan figure", () => {
    // ₹10,00,000 at 8.5% for 20 years ≈ ₹8,678
    expect(calculateEmi(1_000_000, 8.5, 240)).toBeCloseTo(8678.23, 1);
  });
  it("handles zero interest", () => {
    expect(calculateEmi(12_000, 0, 12)).toBe(1000);
  });
});

describe("monthsToPayoff", () => {
  it("returns the original tenure when paying the computed EMI", () => {
    const emi = calculateEmi(1_000_000, 8.5, 240);
    expect(monthsToPayoff(1_000_000, 8.5, emi)).toBe(240);
  });
  it("returns null when payment does not cover interest", () => {
    expect(monthsToPayoff(1_000_000, 12, 5_000)).toBeNull();
  });
  it("shortens with extra payment", () => {
    const base = monthsToPayoff(500_000, 10, 8_000)!;
    const extra = monthsToPayoff(500_000, 10, 10_000)!;
    expect(extra).toBeLessThan(base);
  });
});

describe("buildAmortization", () => {
  it("clears the balance and repays exactly the principal", () => {
    const rows = buildAmortization(100_000, 10, 5_000);
    expect(rows.at(-1)!.balance).toBeCloseTo(0, 2);
    expect(rows.reduce((a, r) => a + r.principal, 0)).toBeCloseTo(100_000, 2);
  });
  it("is empty when the loan can never be repaid", () => {
    expect(buildAmortization(1_000_000, 12, 5_000)).toEqual([]);
  });
});

describe("summarize", () => {
  it("computes savings and shares", () => {
    const s = summarize({
      income: { salary: 50_000, other: 0 },
      expenses: [
        { id: "1", category: "Rent", amount: 15_000, fixed: true },
        { id: "2", category: "Food", amount: 10_000, fixed: false },
      ],
      loans: [{ id: "l", name: "Bike", principal: 50_000, annualRate: 10, emi: 5_000 }],
    });
    expect(s.monthlySavings).toBe(20_000);
    expect(s.needsShare).toBeCloseTo(0.4);
    expect(s.wantsShare).toBeCloseTo(0.2);
    expect(s.emergencyFundTarget).toBe(180_000);
  });
});
