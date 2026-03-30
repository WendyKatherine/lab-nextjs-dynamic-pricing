import { useEffect, useRef } from "react";
import type { QuoteStatus } from "./QuoteController";
import { ThemeWindowControls, type Theme } from "@/app/_components/ThemeWindowControls";

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

const statusColor: Record<QuoteStatus, string> = {
  idle: "var(--rt-text-muted)",
  loading: "var(--rt-warning)",
  success: "var(--rt-success)",
  error: "var(--rt-danger)",
};

interface Props {
  lines: string[];
  status: QuoteStatus;
  activeTheme: Theme;
  onThemeChange: (theme: Theme) => void;
}

export function QuoteConsole({ lines, status, activeTheme, onThemeChange }: Props) {
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  return (
    <div className="rt-terminal">
      <header className="rt-terminal__header">
        <div className="rt-window__controls">
          <ThemeWindowControls activeTheme={activeTheme} onThemeChange={onThemeChange} />
        </div>
        <h3 className="rt-terminal__title">request-log</h3>
        <span className="rt-badge" style={{ color: statusColor[status] }}>
          {status}
        </span>
      </header>
      <div className="rt-terminal__body" ref={bodyRef}>
        {lines.map((line, i) => (
          <div key={i} className="rt-terminal__line">
            <span className="rt-terminal__prompt">$</span>
            <span>{line}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
