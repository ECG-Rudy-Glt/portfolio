import { useEffect, useState } from "react";

type Mode = "clair" | "nuit" | "foret";

const modes: { value: Mode; fr: string; en: string; icon: string }[] = [
  { value: "clair", fr: "Clair (ivoire)", en: "Light (ivory)", icon: "☀" },
  { value: "nuit", fr: "Nuit (par défaut)", en: "Night (default)", icon: "☾" },
  { value: "foret", fr: "Forêt (vert sombre)", en: "Forest (dark green)", icon: "❦" },
];

function apply(mode: Mode) {
  const r = document.documentElement;
  r.classList.remove("clair", "pal-foret");
  if (mode === "clair") r.classList.add("clair");
  if (mode === "foret") r.classList.add("pal-foret");
  const tc = document.querySelector('meta[name="theme-color"]');
  if (tc) tc.setAttribute("content", mode === "clair" ? "#f3f1ea" : mode === "foret" ? "#16261c" : "#121310");
  try { localStorage.setItem("affichage", mode); } catch (e) { /* stockage indisponible */ }
}

export default function ModeSwitch({ lang = "fr" }: { lang?: "fr" | "en" }) {
  const [mode, setMode] = useState<Mode>("nuit");

  useEffect(() => {
    const c = document.documentElement.classList;
    setMode(c.contains("clair") ? "clair" : c.contains("pal-foret") ? "foret" : "nuit");
  }, []);

  function select(next: Mode) {
    setMode(next);
    apply(next);
  }

  return (
    <div role="group" aria-label={lang === "en" ? "Display mode" : "Mode d'affichage"} className="flex items-center gap-1 rounded-full border border-[var(--border)] p-1">
      {modes.map((m) => {
        const label = lang === "en" ? m.en : m.fr;
        const active = mode === m.value;
        return (
          <button
            key={m.value}
            type="button"
            onClick={() => select(m.value)}
            aria-label={label}
            aria-pressed={active}
            title={label}
            className="h-7 w-7 rounded-full text-sm leading-none transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-[var(--accent)]"
            style={{
              backgroundColor: active ? "var(--accent)" : "transparent",
              color: active ? "var(--accent-fg)" : "var(--fg-muted)",
            }}
          >
            {m.icon}
          </button>
        );
      })}
    </div>
  );
}
