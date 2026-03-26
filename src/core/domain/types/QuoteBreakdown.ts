export interface QuoteBreakdown {
  setupCost: number;
  baseCost: number;
  volumeMultiplier: number;
  applicationCost: number;
  extraLocationsCost: number;
  addOnsCost: number;
  postalRatePct: number;
  subtotalBeforePostal: number;
  total: number;
  unitPrice: number;
}