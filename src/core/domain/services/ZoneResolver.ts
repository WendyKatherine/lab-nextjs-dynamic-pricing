import type { ZoneRule } from "../value-objects/ZoneRule";
import type { LocationInput } from "../value-objects/LocationInput";

export function resolveZone(rules: ZoneRule[], location: LocationInput): ZoneRule {
  const prefixMatch = rules.find(
    (rule) =>
      rule.country === location.country &&
      rule.prefix !== undefined &&
      location.postalCode.startsWith(rule.prefix)
  );
  if (prefixMatch) return prefixMatch;

  const countryMatch = rules.find(
    (rule) => rule.country === location.country && rule.prefix === undefined
  );
  if (countryMatch) return countryMatch;

  throw new Error(
    `No zone rule found for country "${location.country}" postal code "${location.postalCode}"`
  );
}
