import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "eco";

const themes: { value: Theme; label: string; icon: string }[] = [
  { value: "light", label: "Clair", icon: "☀" },
  { value: "dark", label: "Sombre", icon: "☾" },
  { value: "eco", label: "Éco (N&B)", icon: "◐" },
];

function applyTheme(theme: Theme) {
  document.documentElement.classList.remove("dark", "eco");
  if (theme !== "light") document.documentElement.classList.add(theme);
  localStorage.setItem("theme", theme);
}

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    if (stored) setTheme(stored);
  }, []);

  function select(next: Theme) {
    setTheme(next);
    applyTheme(next);
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-[var(--border)] p-1">
      {themes.map((t) => (
        <button
          key={t.value}
          onClick={() => select(t.value)}
          aria-label={t.label}
          title={t.label}
          className="h-7 w-7 rounded-full text-sm leading-none transition-colors"
          style={{
            backgroundColor: theme === t.value ? "var(--accent)" : "transparent",
            color: theme === t.value ? "var(--accent-fg)" : "var(--fg-muted)",
          }}
        >
          {t.icon}
        </button>
      ))}
    </div>
  );
}
