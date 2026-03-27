import type { ProductCategoryCode } from "../types/ProductCategory";
import type { PrintTechnique } from "../value-objects/PrintTechnique";
import type { ProductArea } from "../value-objects/ProductArea";
import type { ProductSize } from "../value-objects/ProductSize";
import type { ProductViews } from "../value-objects/ProductViews";

export interface ProductVariation {
  colorName: string;
  colorHex: string;
  views: ProductViews;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  pricingCategory: ProductCategoryCode;
  defaultTechnique: PrintTechnique;
  allowedTechniques: PrintTechnique[];
  sizes: ProductSize[];
  views: ProductViews;
  variations: ProductVariation[];
  areas: ProductArea[];
}
