import type { CountryCode } from "../value-objects/CountryCode";

// ── Result type ──────────────────────────────────────────────────────────────

export type PostalValidationResult =
  | { valid: true; normalized: string }
  | { valid: false; reason: string };

// ── Patterns ─────────────────────────────────────────────────────────────────

const US_POSTAL_RE = /^\d{5}(-\d{4})?$/;

// Accepts with or without the middle space; both formats are valid input.
const CA_POSTAL_RE = /^[A-Za-z]\d[A-Za-z]\s?\d[A-Za-z]\d$/;

// ── Normalizers ───────────────────────────────────────────────────────────────

function normalizeCA(raw: string): string {
  const stripped = raw.trim().toUpperCase().replace(/\s/g, "");
  return `${stripped.slice(0, 3)} ${stripped.slice(3)}`;
}

// ── Per-country validators ────────────────────────────────────────────────────

function validateUS(postalCode: string): PostalValidationResult {
  const trimmed = postalCode.trim();
  if (!US_POSTAL_RE.test(trimmed)) {
    return {
      valid: false,
      reason: "Use 12345 or 12345-6789",
    };
  }
  return { valid: true, normalized: trimmed };
}

function validateCA(postalCode: string): PostalValidationResult {
  if (!CA_POSTAL_RE.test(postalCode.trim())) {
    return {
      valid: false,
      reason: "Use A1A 1A1",
    };
  }
  return { valid: true, normalized: normalizeCA(postalCode) };
}

// ── Public API ────────────────────────────────────────────────────────────────

export function validatePostalCodeFormat(
  country: CountryCode,
  postalCode: string,
): PostalValidationResult {
  if (!postalCode || postalCode.trim().length === 0) {
    return { valid: false, reason: "Postal code is required" };
  }
  switch (country) {
    case "US": return validateUS(postalCode);
    case "CA": return validateCA(postalCode);
  }
}
