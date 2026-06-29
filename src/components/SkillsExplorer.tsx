import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Project {
  slug: string;
  title: string;
}

interface Skill {
  tag: string;
  count: number;
  color: string;
  projects: Project[];
}

export default function SkillsExplorer({ skills }: { skills: Skill[]; max: number }) {
  const [active, setActive] = useState<string | null>(null);
  const activeSkill = skills.find((s) => s.tag === active) ?? null;

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <button
            key={skill.tag}
            onClick={() => setActive(active === skill.tag ? null : skill.tag)}
            className="flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition-colors"
            style={{
              backgroundColor: active === skill.tag ? "var(--bg-elevated)" : "transparent",
              borderColor: "var(--border)",
              color: active === skill.tag ? "var(--fg)" : "var(--fg-muted)",
            }}
          >
            <span className="h-2 w-2 rounded-full" style={{ backgroundColor: skill.color }}></span>
            {skill.tag}
            <span
              className="rounded-full px-1.5 text-xs"
              style={{ backgroundColor: skill.color, color: "var(--accent-fg)" }}
            >
              {skill.count}
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeSkill && (
          <motion.div
            key={activeSkill.tag}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="mt-6 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5">
              <p className="mb-3 text-sm text-[var(--fg-muted)]">
                {activeSkill.count} projet{activeSkill.count > 1 ? "s" : ""} mobilisant{" "}
                <span className="text-[var(--fg)]">{activeSkill.tag}</span> :
              </p>
              <div className="flex flex-wrap gap-2">
                {activeSkill.projects.map((p) => (
                  <a
                    key={p.slug}
                    href={`/projets/${p.slug}/`}
                    className="rounded-full bg-[var(--bg)] px-3 py-1.5 text-sm text-[var(--fg)] ring-1 ring-[var(--border)] transition-colors hover:text-[var(--accent)]"
                  >
                    {p.title}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
