import { describe, expect, it } from "vitest";
import { calculateQuote } from "../QuoteEngine";
import type { PriceBook } from "../../entities/PriceBook";
import type { Product } from "../../entities/Product";
import type { ZoneRule } from "../../value-objects/ZoneRule";
import type { QuoteInput } from "../../types/QuoteInput";

// ------------------------------------------------------------
// Shared fixtures
// ------------------------------------------------------------

const priceBook: PriceBook = {
  version: "v1",
  setupCost: 20,
  applicationPerUnit: 1,
  baseCostsByCategory: { tshirt: 5, hoodie: 8, hat: 4 },
  volumeTiers: [
    { minQty: 1, maxQty: 11, multiplier: 1.2 },
    { minQty: 12, multiplier: 1.0 },
  ],
};

const product: Product = {
  id: "prod-1",
  slug: "basic-tshirt",
  name: "Basic T-Shirt",
  pricingCategory: "tshirt",
  defaultTechnique: "screen-print",
  allowedTechniques: ["screen-print", "dtf"],
  sizes: ["S", "M", "L", "XL"],
  views: { front: "/mock/tshirt-front.png", back: "/mock/tshirt-back.png" },
  variations: [{ colorName: "White", colorHex: "#ffffff", views: { front: "/mock/tshirt-white-front.png", back: "/mock/tshirt-white-back.png" } }],
  areas: [
    { id: "front", view: "front", label: "Front Chest", addOnPerUnit: 0.5 },
    { id: "back",  view: "back",  label: "Back Center", addOnPerUnit: 0.75 },
  ],
};

const usZone: ZoneRule = { country: "US", ratePct: 0 };
const caZone: ZoneRule = { country: "CA", ratePct: 10 };

// ------------------------------------------------------------
// Tests
// ------------------------------------------------------------

describe("calculateQuote", () => {
  it("produces a correct breakdown for a single area with no zone rate", () => {
    // qty=10, tier multiplier=1.2, US rate=0
    // baseCost      = 10 * 5 * 1.2 = 60
    // applicationCost = 1 * 10     = 10
    // extraLocations = 0
    // addOns         = 0.5 * 10   = 5
    // subtotal       = 20 + 60 + 10 + 0 + 5 = 95
    // total          = 95 * 1.0   = 95
    // unitPrice      = 95 / 10    = 9.5
    const input: QuoteInput = {
      productId: "prod-1",
      quantity: 10,
      selectedAreas: [{ areaId: "front" }],
      location: { country: "US", postalCode: "90210" },
    };

    const result = calculateQuote(priceBook, product, input, usZone);

    expect(result.setupCost).toBe(20);
    expect(result.baseCost).toBe(60);
    expect(result.volumeMultiplier).toBe(1.2);
    expect(result.applicationCost).toBe(10);
    expect(result.extraLocationsCost).toBe(0);
    expect(result.addOnsCost).toBe(5);
    expect(result.subtotalBeforePostal).toBe(95);
    expect(result.postalRatePct).toBe(0);
    expect(result.total).toBe(95);
    expect(result.unitPrice).toBe(9.5);
  });

  it("adds extra location cost for each area beyond the first", () => {
    // extraLocations = (2-1) * (20 + 1*10) = 30
    // addOns         = (0.5 + 0.75) * 10  = 12.5
    // subtotal       = 20 + 60 + 10 + 30 + 12.5 = 132.5
    const input: QuoteInput = {
      productId: "prod-1",
      quantity: 10,
      selectedAreas: [{ areaId: "front" }, { areaId: "back" }],
      location: { country: "US", postalCode: "90210" },
    };

    const result = calculateQuote(priceBook, product, input, usZone);

    expect(result.extraLocationsCost).toBe(30);
    expect(result.addOnsCost).toBeCloseTo(12.5);
    expect(result.subtotalBeforePostal).toBeCloseTo(132.5);
    expect(result.total).toBeCloseTo(132.5);
    expect(result.unitPrice).toBeCloseTo(13.25);
  });

  it("applies the zone rate as a percentage multiplier on the pre-postal subtotal", () => {
    // subtotal = 95, CA rate = 10%
    // total    = 95 * 1.1 = 104.5
    const input: QuoteInput = {
      productId: "prod-1",
      quantity: 10,
      selectedAreas: [{ areaId: "front" }],
      location: { country: "CA", postalCode: "M5H 2N2" },
    };

    const result = calculateQuote(priceBook, product, input, caZone);

    expect(result.postalRatePct).toBe(10);
    expect(result.subtotalBeforePostal).toBe(95);
    expect(result.total).toBeCloseTo(104.5);
    expect(result.unitPrice).toBeCloseTo(10.45);
  });

  it("selects the correct volume multiplier for quantities in the higher tier", () => {
    // qty=12 → tier multiplier = 1.0
    // baseCost = 12 * 5 * 1.0 = 60
    const input: QuoteInput = {
      productId: "prod-1",
      quantity: 12,
      selectedAreas: [{ areaId: "front" }],
      location: { country: "US", postalCode: "90210" },
    };

    const result = calculateQuote(priceBook, product, input, usZone);

    expect(result.volumeMultiplier).toBe(1.0);
    expect(result.baseCost).toBe(60);
  });

  it("throws when quantity is zero", () => {
    const input: QuoteInput = {
      productId: "prod-1",
      quantity: 0,
      selectedAreas: [{ areaId: "front" }],
      location: { country: "US", postalCode: "90210" },
    };

    expect(() => calculateQuote(priceBook, product, input, usZone)).toThrow();
  });

  it("throws when quantity is negative", () => {
    const input: QuoteInput = {
      productId: "prod-1",
      quantity: -1,
      selectedAreas: [{ areaId: "front" }],
      location: { country: "US", postalCode: "90210" },
    };

    expect(() => calculateQuote(priceBook, product, input, usZone)).toThrow();
  });

  it("throws when a selected area is not available on the product", () => {
    const input: QuoteInput = {
      productId: "prod-1",
      quantity: 10,
      selectedAreas: [{ areaId: "sleeve" }],
      location: { country: "US", postalCode: "90210" },
    };

    expect(() => calculateQuote(priceBook, product, input, usZone)).toThrow();
  });
});
