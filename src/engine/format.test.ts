import { describe, expect, it } from "vitest";
import { currencySymbol, formatMoney, isCurrencyCode } from "./index.ts";

describe("formatMoney", () => {
  it("uses lakh grouping for INR", () => {
    expect(formatMoney(1234567, "INR")).toBe("₹12,34,567");
  });
  it("uses thousands grouping for USD, EUR and GBP", () => {
    expect(formatMoney(1234567, "USD")).toBe("$1,234,567");
    expect(formatMoney(1234567, "EUR")).toBe("€1,234,567");
    expect(formatMoney(1234567, "GBP")).toBe("£1,234,567");
  });
  it("rounds to whole units", () => {
    expect(formatMoney(1234.6, "USD")).toBe("$1,235");
  });
  it("formats negatives and zero", () => {
    expect(formatMoney(-1234, "INR")).toBe("-₹1,234");
    expect(formatMoney(0, "USD")).toBe("$0");
  });
  it("does not convert the amount, only changes the display", () => {
    expect(formatMoney(5000, "INR")).toContain("5,000");
    expect(formatMoney(5000, "USD")).toContain("5,000");
  });
});

describe("currencySymbol", () => {
  it("returns the symbol for each currency", () => {
    expect(currencySymbol("INR")).toBe("₹");
    expect(currencySymbol("USD")).toBe("$");
    expect(currencySymbol("EUR")).toBe("€");
    expect(currencySymbol("GBP")).toBe("£");
  });
});

describe("isCurrencyCode", () => {
  it("accepts supported codes only", () => {
    expect(isCurrencyCode("EUR")).toBe(true);
    expect(isCurrencyCode("JPY")).toBe(false);
    expect(isCurrencyCode(undefined)).toBe(false);
    expect(isCurrencyCode("toString")).toBe(false);
  });
});
