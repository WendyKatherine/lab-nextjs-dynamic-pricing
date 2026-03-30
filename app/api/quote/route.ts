import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getDynamicQuote } from "@/src/core/application/use-cases/GetDynamicQuote";
import { validatePostalCodeFormat } from "@/src/core/domain/validation/postalCode";

// ------------------------------------------------------------
// Request schema
// ------------------------------------------------------------

const selectedAreaSchema = z.object({
  areaId: z.string().min(1),
});

const locationSchema = z
  .object({
    country: z.enum(["US", "CA"]),
    postalCode: z.string().min(1),
  })
  .superRefine((val, ctx) => {
    const result = validatePostalCodeFormat(val.country, val.postalCode);
    if (!result.valid) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["postalCode"],
        message: result.reason,
      });
    }
  });

export const quoteRequestSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().positive(),
  selectedAreas: z.array(selectedAreaSchema).min(1),
  location: locationSchema,
});

// ------------------------------------------------------------
// Route handler
// ------------------------------------------------------------

export async function POST(req: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = quoteRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid request", details: parsed.error.flatten().fieldErrors },
      { status: 422 }
    );
  }

  try {
    const breakdown = getDynamicQuote(parsed.data);
    return NextResponse.json(breakdown, { status: 200 });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unexpected error";
    const isNotFound =
      message.startsWith("Product not found") || message.startsWith("No zone rule found");

    return NextResponse.json({ error: message }, { status: isNotFound ? 404 : 500 });
  }
}
