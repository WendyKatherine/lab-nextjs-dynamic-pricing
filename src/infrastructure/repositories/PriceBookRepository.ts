import type { PriceBook } from "../../core/domain/entities/PriceBook";
import priceBookData from "../../data/pricebook.v1.json";

const priceBook = priceBookData as PriceBook;

export function getPriceBook(): PriceBook {
  return priceBook;
}
