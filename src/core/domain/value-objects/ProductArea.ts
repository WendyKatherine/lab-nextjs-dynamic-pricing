import type { ProductView } from "./ProductView";

export interface ProductArea {
  id: string;
  view: ProductView;
  label: string;
  addOnPerUnit: number;
}
