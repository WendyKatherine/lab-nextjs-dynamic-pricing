import type { CountryCode } from "../../domain/value-objects/CountryCode";
import type { PostalValidationResult } from "../../domain/validation/postalCode";

/**
 * Contract for postal code validation.
 *
 * v1 is satisfied by FormatPostalCodeValidator (pure regex, no I/O).
 * Future providers (e.g. Zippopotam) implement this same interface
 * and are swapped in at the route-handler level — no other code changes.
 */
export interface PostalCodeValidator {
  validate(country: CountryCode, postalCode: string): Promise<PostalValidationResult>;
}
