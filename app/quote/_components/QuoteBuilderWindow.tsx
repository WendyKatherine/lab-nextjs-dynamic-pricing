import type { Product } from "@/src/core/domain/entities/Product";
import { ThemeWindowControls, type Theme } from "@/app/_components/ThemeWindowControls";

// ── Local primitives ────────────────────────────────────────────────────────

function Dot({ color }: { color: string }) {
  return (
    <span style={{
      display: "block",
      width: 10,
      height: 10,
      borderRadius: "50%",
      background: color,
      opacity: 0.8,
    }} />
  );
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gap: "var(--rt-space-1)" }}>
      <span className="rt-toolbar__label">{label}</span>
      {children}
    </div>
  );
}

// ── Props ───────────────────────────────────────────────────────────────────

interface Props {
  products: Product[];
  selectedProduct: Product;
  productId: string;
  quantity: string;
  country: "US" | "CA";
  postalCode: string;
  postalCodeError: string | null;
  selectedAreaIds: string[];
  size: string;
  technique: string;
  isLoading: boolean;
  onProductChange: (id: string) => void;
  onQuantityChange: (q: string) => void;
  onCountryChange: (c: "US" | "CA") => void;
  onPostalCodeChange: (p: string) => void;
  onPostalCodeBlur: () => void;
  onAreaToggle: (id: string) => void;
  onSizeChange: (s: string) => void;
  onTechniqueChange: (t: string) => void;
  onSubmit: () => void;
  activeTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

// ── Component ───────────────────────────────────────────────────────────────

export function QuoteBuilderWindow({
  products, selectedProduct,
  productId, quantity, country, postalCode, postalCodeError,
  selectedAreaIds, size, technique, isLoading,
  onProductChange, onQuantityChange, onCountryChange, onPostalCodeChange, onPostalCodeBlur,
  onAreaToggle, onSizeChange, onTechniqueChange, onSubmit,
  activeTheme, onThemeChange,
}: Props) {
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <article className="rt-window rt-pixel-card">
      <header className="rt-window__titlebar">
        <div className="rt-window__controls">
          <ThemeWindowControls activeTheme={activeTheme} onThemeChange={onThemeChange} />
        </div>
        <h2 className="rt-window__title">quote-builder</h2>
        <span className="rt-badge">form</span>
      </header>

      <div className="rt-window__body">
        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "var(--rt-space-4)" }}>

          {/* Product + Quantity */}
          <div className="rt-panel rt-panel--inset quote-field-row">
            <FieldGroup label="Product">
              <select
                className="rt-input"
                value={productId}
                onChange={(e) => onProductChange(e.target.value)}
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </FieldGroup>
            <FieldGroup label="Quantity">
              <input
                type="number"
                className="rt-input"
                min="1"
                value={quantity}
                onChange={(e) => onQuantityChange(e.target.value)}
                required
              />
            </FieldGroup>
          </div>

          {/* Country + Postal Code */}
          <div className="rt-panel rt-panel--inset quote-field-row">
            <FieldGroup label="Country">
              <select
                className="rt-input"
                value={country}
                onChange={(e) => onCountryChange(e.target.value as "US" | "CA")}
              >
                <option value="US">United States</option>
                <option value="CA">Canada</option>
              </select>
            </FieldGroup>
            <FieldGroup label="Postal Code">
              <input
                type="text"
                className="rt-input"
                placeholder={country === "US" ? "90210 or 12345-6789" : "M5H 2N2"}
                value={postalCode}
                onChange={(e) => onPostalCodeChange(e.target.value)}
                onBlur={onPostalCodeBlur}
              />
              {postalCodeError && (
                <span style={{ fontSize: "var(--rt-text-xs)", color: "var(--rt-danger)" }}>
                  {postalCodeError}
                </span>
              )}
            </FieldGroup>
          </div>

          {/* Size + Technique — UX only in v1, not sent to API */}
          <div className="rt-panel rt-panel--inset quote-field-row">
            <FieldGroup label="Size">
              <select
                className="rt-input"
                value={size}
                onChange={(e) => onSizeChange(e.target.value)}
              >
                {selectedProduct.sizes.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </FieldGroup>
            <FieldGroup label="Technique">
              <select
                className="rt-input"
                value={technique}
                onChange={(e) => onTechniqueChange(e.target.value)}
              >
                {selectedProduct.allowedTechniques.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </FieldGroup>
          </div>

          {/* Print Areas */}
          <div className="rt-panel rt-panel--inset" style={{ maxHeight: "16rem", overflowY: "auto" }}>
            <span className="rt-toolbar__label" style={{ display: "block", marginBottom: "var(--rt-space-2)" }}>
              Print Areas
            </span>
            <div style={{ display: "grid", gap: "var(--rt-space-2)" }}>
              {selectedProduct.areas.map((area) => {
                const isSelected = selectedAreaIds.includes(area.id);
                return (
                  <label
                    key={area.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "var(--rt-space-2)",
                      padding: "var(--rt-space-2) var(--rt-space-3)",
                      borderRadius: "var(--rt-radius-md)",
                      border: `1px solid ${isSelected ? "var(--rt-primary)" : "var(--rt-glass-border-soft)"}`,
                      background: isSelected ? "var(--rt-tint-soft)" : "var(--rt-glass-bg)",
                      cursor: "pointer",
                      transition: "border-color var(--rt-duration-fast) var(--rt-ease-standard), background var(--rt-duration-fast) var(--rt-ease-standard)",
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => onAreaToggle(area.id)}
                      style={{ accentColor: "var(--rt-primary)", width: 14, height: 14 }}
                    />
                    <span style={{ flex: 1, fontSize: "var(--rt-text-sm)" }}>{area.label}</span>
                    <span style={{ fontSize: "var(--rt-text-xs)", color: "var(--rt-text-muted)", fontFamily: "var(--rt-font-mono)" }}>
                      +${area.addOnPerUnit.toFixed(2)}/unit
                    </span>
                    <span className="rt-badge" style={{ fontSize: "var(--rt-text-xs)" }}>{area.view}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <button
            type="submit"
            className="rt-btn rt-btn--primary"
            disabled={isLoading || selectedAreaIds.length === 0}
            style={{ width: "100%", padding: "var(--rt-space-3)" }}
          >
            {isLoading ? "calculating…" : "calculate quote →"}
          </button>

        </form>
      </div>
    </article>
  );
}
