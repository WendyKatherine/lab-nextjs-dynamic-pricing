import { LocationInput } from "../value-objects/LocationInput";
import { SelectedArea } from "../value-objects/SelectedArea";

export interface QuoteInput {
  productId: string;
  quantity: number;
  selectedAreas: SelectedArea[];
  location: LocationInput;
}