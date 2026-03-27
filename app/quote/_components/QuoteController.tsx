"use client";

import { useState } from "react";
import type { Product } from "@/src/core/domain/entities/Product";
import type { QuoteBreakdown } from "@/src/core/domain/types/QuoteBreakdown";
import { QuoteBuilderWindow } from "./QuoteBuilderWindow";
import { QuoteBreakdownWindow } from "./QuoteBreakdownWindow";
import { QuoteConsole } from "./QuoteConsole";

export type QuoteStatus = "idle" | "loading" | "success" | "error";

interface Props {
  products: Product[];
}

export function QuoteController({ products }: Props) {
  const first = products[0];

  // ── Form state ──────────────────────────────────────────────
  const [productId, setProductId] = useState(first?.id ?? "");
  const [quantity, setQuantity] = useState("24");
  const [country, setCountry] = useState<"US" | "CA">("US");
  const [postalCode, setPostalCode] = useState("90210");
  const [selectedAreaIds, setSelectedAreaIds] = useState<string[]>(
    first?.areas[0] ? [first.areas[0].id] : []
  );
  const [size, setSize] = useState<string>(first?.sizes[0] ?? "");
  const [technique, setTechnique] = useState<string>(first?.defaultTechnique ?? "");

  // ── Request state ────────────────────────────────────────────
  const [status, setStatus] = useState<QuoteStatus>("idle");
  const [breakdown, setBreakdown] = useState<QuoteBreakdown | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>(["ready — configure your order above"]);

  const selectedProduct = products.find((p) => p.id === productId) ?? first;

  function addLog(line: string) {
    setLog((prev) => [...prev.slice(-9), line]);
  }

  function handleProductChange(id: string) {
    const product = products.find((p) => p.id === id);
    if (!product) return;
    setProductId(id);
    setSelectedAreaIds(product.areas[0] ? [product.areas[0].id] : []);
    setSize(product.sizes[0] ?? "");
    setTechnique(product.defaultTechnique);
  }

  function handleAreaToggle(id: string) {
    setSelectedAreaIds((prev) => {
      if (prev.includes(id)) {
        if (prev.length === 1) return prev; // always keep at least one selected
        return prev.filter((a) => a !== id);
      }
      return [...prev, id];
    });
  }

  async function handleSubmit() {
    if (!selectedProduct || selectedAreaIds.length === 0) return;

    setStatus("loading");
    setBreakdown(null);
    setError(null);
    addLog(`resolving quote → ${selectedProduct.name} × ${quantity}`);

    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId,
          quantity: Number(quantity),
          selectedAreas: selectedAreaIds.map((id) => ({ areaId: id })),
          location: { country, postalCode },
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setError((data as { error?: string }).error ?? "Unknown error");
        addLog(`error → ${(data as { error?: string }).error ?? "unknown"}`);
      } else {
        const bd = data as QuoteBreakdown;
        setStatus("success");
        setBreakdown(bd);
        addLog(`zone: ${country} / ${postalCode} → ${bd.postalRatePct}% rate`);
        addLog(`total: $${bd.total.toFixed(2)} | unit: $${bd.unitPrice.toFixed(2)}`);
      }
    } catch {
      setStatus("error");
      setError("Network error — is the dev server running?");
      addLog("network error — check console");
    }
  }

  function handleThemeChange(theme: string) {
    document.documentElement.setAttribute("data-rt-theme", theme);
  }

  return (
    <main className="rt-app-shell">
      {/* ── Header ─────────────────────────────────────────────── */}
      <div style={{ marginBottom: "var(--rt-space-6)" }}>
        <div className="rt-toolbar" style={{ marginBottom: "var(--rt-space-3)" }}>
          <div className="rt-toolbar__group">
            <span className="rt-badge">demo</span>
            <h1 style={{
              margin: 0,
              fontFamily: "var(--rt-font-display)",
              fontSize: "var(--rt-text-xl)",
              letterSpacing: "0.03em",
              lineHeight: "var(--rt-line-tight)",
            }}>
              dynamic-pricing
            </h1>
          </div>
          <div className="rt-toolbar__group">
            <span className="rt-toolbar__label">theme</span>
            {(["phosphor", "ivory", "bigblue"] as const).map((t) => (
              <button
                key={t}
                className="rt-btn rt-btn--ghost"
                onClick={() => handleThemeChange(t)}
                style={{ fontSize: "var(--rt-text-xs)", padding: "6px 10px" }}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
        <p style={{
          margin: 0,
          color: "var(--rt-text-muted)",
          fontSize: "var(--rt-text-sm)",
          paddingInline: "var(--rt-space-1)",
        }}>
          select a product, configure your order, and get a live price breakdown · US / CA only
        </p>
      </div>

      {/* ── 2-window grid ──────────────────────────────────────── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "var(--rt-space-5)",
        marginBottom: "var(--rt-space-5)",
      }}>
        <QuoteBuilderWindow
          products={products}
          selectedProduct={selectedProduct}
          productId={productId}
          quantity={quantity}
          country={country}
          postalCode={postalCode}
          selectedAreaIds={selectedAreaIds}
          size={size}
          technique={technique}
          isLoading={status === "loading"}
          onProductChange={handleProductChange}
          onQuantityChange={setQuantity}
          onCountryChange={setCountry}
          onPostalCodeChange={setPostalCode}
          onAreaToggle={handleAreaToggle}
          onSizeChange={setSize}
          onTechniqueChange={setTechnique}
          onSubmit={handleSubmit}
        />
        <QuoteBreakdownWindow status={status} breakdown={breakdown} error={error} />
      </div>

      {/* ── Console ────────────────────────────────────────────── */}
      <QuoteConsole lines={log} status={status} />
    </main>
  );
}
