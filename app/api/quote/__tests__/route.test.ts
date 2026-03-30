import { describe, expect, it } from "vitest";
import { quoteRequestSchema } from "../route";

// Minimal valid body — postal code is the field under test.
// Other fields use fixed values that satisfy the schema without touching pricing logic.
function makeBody(country: "US" | "CA", postalCode: string) {
  return {
    productId: "any-product",
    quantity: 10,
    selectedAreas: [{ areaId: "front" }],
    location: { country, postalCode },
  };
}

function postalErrors(country: "US" | "CA", postalCode: string): string[] {
  const result = quoteRequestSchema.safeParse(makeBody(country, postalCode));
  if (result.success) return [];
  return result.error.issues
    .filter((issue) => issue.path[0] === "location" && issue.path[1] === "postalCode")
    .map((issue) => issue.message);
}

// ── Valid formats ─────────────────────────────────────────────────────────────

describe("quoteRequestSchema — valid postal codes", () => {
  it("accepts a US 5-digit code", () => {
    expect(postalErrors("US", "90210")).toEqual([]);
  });

  it("accepts a CA code with the canonical space", () => {
    expect(postalErrors("CA", "M5H 2N2")).toEqual([]);
  });
});

// ── Invalid formats ───────────────────────────────────────────────────────────

describe("quoteRequestSchema — invalid postal codes", () => {
  it("rejects an invalid US code and returns a field error on location.postalCode", () => {
    expect(postalErrors("US", "ABCDE")).toEqual(["Use 12345 or 12345-6789"]);
  });

  it("rejects an invalid CA code and returns a field error on location.postalCode", () => {
    expect(postalErrors("CA", "12345")).toEqual(["Use A1A 1A1"]);
  });
});
