import { ProductArea } from "../value-objects/ProductArea";
import { ProductCategoryCode } from "../types/ProductCategory";

export interface Product {
    id: string;
    slug: string;
    name: string;
    category: ProductCategoryCode;
    availableAreas: ProductArea[];
    createdAt: Date;
}