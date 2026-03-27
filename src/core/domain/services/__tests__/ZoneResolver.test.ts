import { describe, expect, it } from "vitest";
import { resolveZone } from "../ZoneResolver";
import type { ZoneRule } from "../../value-objects/ZoneRule";

const rules: ZoneRule[] = [
  { country: "US", ratePct: 0 },
  { country: "CA", prefix: "V", ratePct: 8 },
  { country: "CA", ratePct: 5 },
];

describe("resolveZone", () => {
  it("matches a US country-level rule", () => {
    const result = resolveZone(rules, { country: "US", postalCode: "90210" });
    expect(result.ratePct).toBe(0);
  });

  it("matches a CA prefix rule when the postal code starts with the prefix", () => {
    const result = resolveZone(rules, { country: "CA", postalCode: "V6B 1A1" });
    expect(result.ratePct).toBe(8);
  });

  it("falls back to the CA country-level rule when no prefix matches", () => {
    const result = resolveZone(rules, { country: "CA", postalCode: "M5H 2N2" });
    expect(result.ratePct).toBe(5);
  });

  it("prefers a prefix match over the country-level fallback", () => {
    const result = resolveZone(rules, { country: "CA", postalCode: "V1A 2B3" });
    expect(result.prefix).toBe("V");
  });

  it("throws when the rule list is empty", () => {
    expect(() =>
      resolveZone([], { country: "US", postalCode: "10001" })
    ).toThrow();
  });

  it("throws when no rule matches the country", () => {
    const usOnly: ZoneRule[] = [{ country: "US", ratePct: 0 }];
    expect(() =>
      resolveZone(usOnly, { country: "CA", postalCode: "V6B" })
    ).toThrow();
  });
});
