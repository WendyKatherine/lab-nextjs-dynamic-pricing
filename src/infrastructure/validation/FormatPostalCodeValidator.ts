import type { CountryCode } from "../../core/domain/value-objects/CountryCode";
import type { PostalCodeValidator } from "../../core/application/ports/PostalCodeValidator";
import type { PostalValidationResult } from "../../core/domain/validation/postalCode";
import { validatePostalCodeFormat } from "../../core/domain/validation/postalCode";

/**
 * Format-only implementation of PostalCodeValidator.
 * Delegates entirely to the pure domain function — no I/O, no network.
 *
 * To upgrade to a provider-backed validator (e.g. Zippopotam), create a new
 * class that implements PostalCodeValidator and swap it in at the call site.
 */
export class FormatPostalCodeValidator implements PostalCodeValidator {
  validate(country: CountryCode, postalCode: string): Promise<PostalValidationResult> {
    return Promise.resolve(validatePostalCodeFormat(country, postalCode));
  }
}
