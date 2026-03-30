import type { QuoteBreakdown } from "@/src/core/domain/types/QuoteBreakdown";
import type { QuoteStatus } from "./QuoteController";
import { ThemeWindowControls, type Theme } from "@/app/_components/ThemeWindowControls";

// ── Local primitives ────────────────────────────────────────────────────────

function Dot({ color }: { color: string }) {
  return (
    <span
      style={{
        display: "block",
        width: 10,
        height: 10,
        borderRadius: "50%",
        background: color,
        opacity: 0.8,
      }}
    />
  );
}

function KpiItem({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rt-panel rt-panel--inset rt-kpi">
      <span className="rt-kpi__label">{label}</span>
      <strong
        className="rt-kpi__value"
        style={mono ? { fontFamily: "var(--rt-font-mono)", fontSize: "var(--rt-text-lg)" } : {}}
      >
        {value}
      </strong>
    </div>
  );
}

const statusColor: Record<QuoteStatus, string> = {
  idle: "var(--rt-text-muted)",
  loading: "var(--rt-warning)",
  success: "var(--rt-success)",
  error: "var(--rt-danger)",
};

// ── Component ───────────────────────────────────────────────────────────────

interface Props {
  status: QuoteStatus;
  breakdown: QuoteBreakdown | null;
  error: string | null;
  activeTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export function QuoteBreakdownWindow({
  status,
  breakdown,
  error,
  activeTheme,
  onThemeChange,
}: Props) {
  return (
    <article className="rt-window">
      <header className="rt-window__titlebar">
        <div className="rt-window__controls">
          <ThemeWindowControls activeTheme={activeTheme} onThemeChange={onThemeChange} />
        </div>
        <h2 className="rt-window__title">quote-breakdown</h2>
        <span className="rt-badge" style={{ color: statusColor[status] }}>
          {status}
        </span>
      </header>

      <div className="rt-window__body">
        {(status === "idle" || status === "loading") && (
          <div
            className="rt-panel rt-panel--inset"
            style={{ textAlign: "center", padding: "var(--rt-space-7)" }}
          >
            <p
              style={{
                margin: 0,
                color: "var(--rt-text-muted)",
                fontFamily: "var(--rt-font-mono)",
                fontSize: "var(--rt-text-sm)",
              }}
            >
              {status === "idle" ? "awaiting input_" : "resolving zone + calculating…"}
            </p>
          </div>
        )}

        {status === "error" && error && (
          <div
            className="rt-panel rt-panel--inset"
            style={{
              padding: "var(--rt-space-5)",
              borderColor: "var(--rt-danger)",
            }}
          >
            <span
              className="rt-toolbar__label"
              style={{
                display: "block",
                marginBottom: "var(--rt-space-2)",
                color: "var(--rt-danger)",
              }}
            >
              error
            </span>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--rt-font-mono)",
                fontSize: "var(--rt-text-sm)",
                color: "var(--rt-danger)",
              }}
            >
              {error}
            </p>
          </div>
        )}

        {status === "success" && breakdown && (
          <div style={{ display: "grid", gap: "var(--rt-space-4)" }}>
            {/* Cost components */}
            <div className="quote-kpi-row">
              <KpiItem label="Setup Cost" value={`$${breakdown.setupCost.toFixed(2)}`} />
              <KpiItem
                label="Volume Multiplier"
                value={`×${breakdown.volumeMultiplier.toFixed(2)}`}
                mono
              />
              <KpiItem label="Base Cost" value={`$${breakdown.baseCost.toFixed(2)}`} />
              <KpiItem
                label="Application Cost"
                value={`$${breakdown.applicationCost.toFixed(2)}`}
              />
              <KpiItem
                label="Extra Locations"
                value={`$${breakdown.extraLocationsCost.toFixed(2)}`}
              />
              <KpiItem label="Add-ons Cost" value={`$${breakdown.addOnsCost.toFixed(2)}`} />
            </div>

            {/* Subtotal + zone rate */}
            <div className="quote-kpi-row">
              <KpiItem label="Subtotal" value={`$${breakdown.subtotalBeforePostal.toFixed(2)}`} />
              <KpiItem label="Postal Rate" value={`${breakdown.postalRatePct}%`} mono />
            </div>

            {/* Total + Unit Price — emphasized */}
            <div className="quote-kpi-row">
              <div
                className="rt-panel rt-panel--inset rt-kpi"
                style={{ borderColor: "var(--rt-primary)" }}
              >
                <span className="rt-kpi__label">Total</span>
                <strong
                  className="rt-kpi__value"
                  style={{
                    fontSize: "var(--rt-text-2xl)",
                    color: "var(--rt-primary-strong)",
                  }}
                >
                  ${breakdown.total.toFixed(2)}
                </strong>
              </div>
              <div
                className="rt-panel rt-panel--inset rt-kpi"
                style={{ borderColor: "var(--rt-primary)" }}
              >
                <span className="rt-kpi__label">Unit Price</span>
                <strong
                  className="rt-kpi__value"
                  style={{
                    fontSize: "var(--rt-text-2xl)",
                    color: "var(--rt-primary-strong)",
                  }}
                >
                  ${breakdown.unitPrice.toFixed(2)}
                </strong>
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}
