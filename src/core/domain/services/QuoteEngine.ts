import type { PriceBook } from "../entities/PriceBook";
import type { Product } from "../entities/Product";
import type { QuoteInput } from "../types/QuoteInput";
import type { QuoteBreakdown } from "../types/QuoteBreakdown";
import type { ZoneRule } from "../value-objects/ZoneRule";
import { resolveVolumeTier } from "./VolumeTierResolver";

export function calculateQuote(
  priceBook: PriceBook,
  product: Product,
  input: QuoteInput,
  zoneRule: ZoneRule
): QuoteBreakdown {
  if (input.quantity <= 0) {
    throw new Error("Quantity must be greater than 0");
  }

  const baseCostPerUnit = priceBook.baseCostsByCategory[product.pricingCategory];
  const volumeTier = resolveVolumeTier(priceBook.volumeTiers, input.quantity);
  const volumeMultiplier = volumeTier.multiplier;

  const setupCost = priceBook.setupCost;
  const baseCost = input.quantity * baseCostPerUnit * volumeMultiplier;
  const applicationCost = priceBook.applicationPerUnit * input.quantity;

  const locationCount = input.selectedAreas.length;
  const extraLocationsCost =
    Math.max(0, locationCount - 1) * (setupCost + priceBook.applicationPerUnit * input.quantity);

  const addOnsCost = input.selectedAreas.reduce((sum, selected) => {
    const area = product.areas.find((a) => a.id === selected.areaId);
    if (!area) {
      throw new Error(`Area "${selected.areaId}" is not available on product "${product.id}"`);
    }
    return sum + area.addOnPerUnit * input.quantity;
  }, 0);

  const subtotalBeforePostal =
    setupCost + baseCost + applicationCost + extraLocationsCost + addOnsCost;
  const postalRatePct = zoneRule.ratePct;
  const total = subtotalBeforePostal * (1 + postalRatePct / 100);
  const unitPrice = total / input.quantity;

  return {
    setupCost,
    baseCost,
    volumeMultiplier,
    applicationCost,
    extraLocationsCost,
    addOnsCost,
    postalRatePct,
    subtotalBeforePostal,
    total,
    unitPrice,
  };
}
