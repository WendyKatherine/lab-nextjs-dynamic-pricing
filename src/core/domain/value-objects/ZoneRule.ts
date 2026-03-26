import { CountryCode } from "./CountryCode";

export interface ZoneRule {
  country: CountryCode;
  prefix?: string;
  ratePct: number;
}