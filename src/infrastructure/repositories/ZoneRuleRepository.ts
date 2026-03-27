import type { ZoneRule } from "../../core/domain/value-objects/ZoneRule";
import zoneRulesData from "../../data/zone-rules.json";

const zoneRules = zoneRulesData as ZoneRule[];

export function getAllZoneRules(): ZoneRule[] {
  return zoneRules;
}
