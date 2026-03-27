import { describe, expect, it } from "vitest";
import { resolveVolumeTier } from "../VolumeTierResolver";
import type { VolumeTier } from "../../value-objects/VolumeTier";

const tiers: VolumeTier[] = [
  { minQty: 1, maxQty: 11, multiplier: 1.2 },
  { minQty: 12, maxQty: 47, multiplier: 1.0 },
  { minQty: 48, multiplier: 0.85 },
];

describe("resolveVolumeTier", () => {
  it("returns the tier for a quantity in the lower range", () => {
    expect(resolveVolumeTier(tiers, 6).multiplier).toBe(1.2);
  });

  it("returns the tier for a quantity in the middle range", () => {
    expect(resolveVolumeTier(tiers, 24).multiplier).toBe(1.0);
  });

  it("returns the open-ended tier for large quantities", () => {
    expect(resolveVolumeTier(tiers, 100).multiplier).toBe(0.85);
  });

  it("matches exactly at minQty boundary", () => {
    expect(resolveVolumeTier(tiers, 12).multiplier).toBe(1.0);
  });

  it("matches exactly at maxQty boundary", () => {
    expect(resolveVolumeTier(tiers, 11).multiplier).toBe(1.2);
  });

  it("matches exactly at the open-ended tier minQty", () => {
    expect(resolveVolumeTier(tiers, 48).multiplier).toBe(0.85);
  });

  it("returns the full tier object", () => {
    expect(resolveVolumeTier(tiers, 1)).toEqual({
      minQty: 1,
      maxQty: 11,
      multiplier: 1.2,
    });
  });

  it("throws when no tier matches the quantity", () => {
    expect(() => resolveVolumeTier([], 10)).toThrow();
  });
});
