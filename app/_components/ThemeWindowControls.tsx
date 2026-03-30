export type Theme = "phosphor" | "ivory" | "bigblue";

interface ThemeDot {
  id: Theme;
  label: string;
  color: string;
  ringColor: string;
}

const THEME_DOTS: ThemeDot[] = [
  {
    id: "phosphor",
    label: "Switch to phosphor theme",
    color: "#c7d95a",
    ringColor: "#4f6f13",
  },
  {
    id: "ivory",
    label: "Switch to ivory theme",
    color: "#e8e5dd",
    ringColor: "#5f7488",
  },
  {
    id: "bigblue",
    label: "Switch to bigblue theme",
    color: "#4ea0e8",
    ringColor: "#0f66b8",
  },
];

interface Props {
  activeTheme: Theme;
  onThemeChange: (theme: Theme) => void;
  className?: string;
}

export function ThemeWindowControls({ activeTheme, onThemeChange, className = "" }: Props) {
  return (
    <div
      className={`rt-window__controls rt-theme-controls ${className}`.trim()}
      role="group"
      aria-label="Theme selector"
    >
      {THEME_DOTS.map(({ id, label, color, ringColor }) => {
        const isActive = activeTheme === id;

        return (
          <button
            key={id}
            type="button"
            className={`rt-theme-control ${isActive ? "is-active" : ""}`}
            aria-label={label}
            aria-pressed={isActive}
            title={label}
            onClick={() => onThemeChange(id)}
            style={
              {
                "--rt-theme-dot-color": color,
                "--rt-theme-dot-ring": ringColor,
              } as React.CSSProperties
            }
          >
            <span className="rt-theme-control__dot" aria-hidden="true" />
          </button>
        );
      })}
    </div>
  );
}
