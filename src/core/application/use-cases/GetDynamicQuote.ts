import type { QuoteInput } from "../../domain/types/QuoteInput";
import type { QuoteBreakdown } from "../../domain/types/QuoteBreakdown";
import { calculateQuote } from "../../domain/services/QuoteEngine";
import { resolveZone } from "../../domain/services/ZoneResolver";
import { getProductById } from "../../../infrastructure/repositories/ProductRepository";
import { getPriceBook } from "../../../infrastructure/repositories/PriceBookRepository";
import { getAllZoneRules } from "../../../infrastructure/repositories/ZoneRuleRepository";

export function getDynamicQuote(input: QuoteInput): QuoteBreakdown {
  const product = getProductById(input.productId);
  if (!product) {
    throw new Error(`Product not found: "${input.productId}"`);
  }

  const priceBook = getPriceBook();
  if (!priceBook) {
    throw new Error("Active price book is unavailable");
  }

  const zoneRules = getAllZoneRules();
  const zoneRule = resolveZone(zoneRules, input.location);

  return calculateQuote(priceBook, product, input, zoneRule);
}
