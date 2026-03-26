import { ProductCategoryCode } from "../types/ProductCategory";
import { VolumeTier } from "../value-objects/VolumeTier";

export interface PriceBook {
  version: string;
  setupCost: number;
  applicationPerUnit: number;
  baseCostsByCategory: Record<ProductCategoryCode, number>;
  volumeTiers: VolumeTier[];
}