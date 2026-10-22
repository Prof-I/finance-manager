import { describe, expect, it } from "vitest";
import { parseSettings } from "./store.ts";

describe("parseSettings", () => {
  it("keeps a valid currency", () => {
    expect(parseSettings({ currency: "GBP" })).toEqual({ currency: "GBP" });
  });
  it("falls back to INR for missing or invalid data", () => {
    expect(parseSettings(null)).toEqual({ currency: "INR" });
    expect(parseSettings({})).toEqual({ currency: "INR" });
    expect(parseSettings({ currency: "XYZ" })).toEqual({ currency: "INR" });
  });
});
