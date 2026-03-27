import { describe, expect, it } from "vitest";
import { getDynamicQuote } from "../GetDynamicQuote";
import type { QuoteInput } from "../../../domain/types/QuoteInput";

describe("getDynamicQuote", () => {
  it("returns a correct breakdown for a US order with a single area", () => {
    // prod-hoodie-001: baseCost=18, setupCost=25, applicationPerUnit=2.50
    // qty=10 → tier multiplier=1.00 (minQty:1, maxQty:11)
    // baseCost          = 10 * 18 * 1.00 = 180
    // applicationCost   = 2.50 * 10      = 25
    // extraLocationsCost = 0
    // addOnsCost        = 0.00 * 10      = 0  (front-chest addOnPerUnit=0)
    // subtotal          = 25 + 180 + 25 + 0 + 0 = 230
    // US zone rate      = 0%
    // total             = 230
    // unitPrice         = 23
    const input: QuoteInput = {
      productId: "prod-hoodie-001",
      quantity: 10,
      selectedAreas: [{ areaId: "front-chest" }],
      location: { country: "US", postalCode: "90210" },
    };

    const result = getDynamicQuote(input);

    expect(result.setupCost).toBe(25);
    expect(result.baseCost).toBe(180);
    expect(result.volumeMultiplier).toBe(1.0);
    expect(result.applicationCost).toBe(25);
    expect(result.extraLocationsCost).toBe(0);
    expect(result.addOnsCost).toBe(0);
    expect(result.subtotalBeforePostal).toBe(230);
    expect(result.postalRatePct).toBe(0);
    expect(result.total).toBe(230);
    expect(result.unitPrice).toBe(23);
  });

  it("applies the CA prefix zone rate for an Ontario postal code", () => {
    // Same order as above but CA/M prefix → 13% zone rate
    // total = 230 * 1.13 = 259.9
    const input: QuoteInput = {
      productId: "prod-hoodie-001",
      quantity: 10,
      selectedAreas: [{ areaId: "front-chest" }],
      location: { country: "CA", postalCode: "M5H 2N2" },
    };

    const result = getDynamicQuote(input);

    expect(result.postalRatePct).toBe(13);
    expect(result.subtotalBeforePostal).toBe(230);
    expect(result.total).toBeCloseTo(259.9);
  });

  it("throws when the product does not exist", () => {
    const input: QuoteInput = {
      productId: "prod-does-not-exist",
      quantity: 10,
      selectedAreas: [{ areaId: "front-chest" }],
      location: { country: "US", postalCode: "90210" },
    };

    expect(() => getDynamicQuote(input)).toThrow('Product not found: "prod-does-not-exist"');
  });
});
