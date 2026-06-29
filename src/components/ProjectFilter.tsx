import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const categories = [
  { value: "all", label: "Tous" },
  { value: "perso", label: "Projets perso" },
  { value: "ecole", label: "Projets école" },
  { value: "entreprise", label: "Entreprise" },
] as const;

export default function ProjectFilter() {
  const [active, setActive] = useState<string>("all");

  useEffect(() => {
    const cards = document.querySelectorAll<HTMLElement>("[data-category]");
    cards.forEach((card) => {
      const matches = active === "all" || card.dataset.category === active;
      card.style.display = matches ? "" : "none";
    });
  }, [active]);

  return (
    <div className="mb-8 flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => setActive(cat.value)}
          className="relative rounded-full px-4 py-1.5 text-sm text-[var(--fg-muted)] transition-colors"
          style={{ color: active === cat.value ? "var(--accent-fg)" : undefined }}
        >
          {active === cat.value && (
            <motion.span
              layoutId="active-pill"
              className="absolute inset-0 rounded-full bg-[var(--accent)]"
              transition={{ type: "spring", duration: 0.4 }}
            />
          )}
          <span className="relative z-10">{cat.label}</span>
        </button>
      ))}
    </div>
  );
}
