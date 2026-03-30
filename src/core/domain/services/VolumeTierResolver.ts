import type { VolumeTier } from "../value-objects/VolumeTier";

export function resolveVolumeTier(tiers: VolumeTier[], quantity: number): VolumeTier {
  const match = tiers.find(
    (tier) => quantity >= tier.minQty && (tier.maxQty === undefined || quantity <= tier.maxQty)
  );
  if (!match) {
    throw new Error(`No volume tier found for quantity ${quantity}`);
  }
  return match;
}
