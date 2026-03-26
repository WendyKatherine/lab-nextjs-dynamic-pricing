type ProductView = "front" | "back" | "left" | "right";

export interface ProductArea {
  id: string;
  name: string;
  view: ProductView;
  addOnPerUnit: number;
}