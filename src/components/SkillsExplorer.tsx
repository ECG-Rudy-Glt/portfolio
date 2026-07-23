import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

interface Project {
  slug: string;
  title: string;
}

interface Skill {
  tag: string;
  count: number;
  pct: number;
  projects: Project[];
  included?: string[];
}

const SIZE = 240;
const CENTER = SIZE / 2;
const RADIUS = 84;
const STROKE = 32;
const GAP = 3;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Dégradé ordinal : du plein accent (rang 1) vers la surface (rangs suivants).
// "Autres" sort du dégradé — teinte neutre pour marquer que ce n'est pas un rang.
function colorFor(index: number, isOther: boolean) {
  if (isOther) return "var(--fg-muted)";
  const mix = Math.max(100 - index * 16, 30);
  return `color-mix(in srgb, var(--accent) ${mix}%, var(--bg-elevated))`;
}

export default function SkillsExplorer({ skills }: { skills: Skill[]; total: number }) {
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const shownTag = hovered ?? pinned;
  const shownSkill = skills.find((s) => s.tag === shownTag) ?? null;

  function togglePin(tag: string) {
    setPinned((cur) => (cur === tag ? null : tag));
  }

  let offset = 0;
  const slices = skills.map((skill, i) => {
    const rawLen = (skill.pct / 100) * CIRCUMFERENCE;
    const len = Math.max(rawLen - GAP, 1);
    const slice = { ...skill, color: colorFor(i, skill.tag === "Autres"), len, offset };
    offset += rawLen;
    return slice;
  });

  return (
    <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
      <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
        <svg viewBox={`0 0 ${SIZE} ${SIZE}`} width={SIZE} height={SIZE}>
          <circle cx={CENTER} cy={CENTER} r={RADIUS} fill="none" stroke="var(--border)" strokeWidth={STROKE} />
          <g transform={`rotate(-90 ${CENTER} ${CENTER})`}>
            {slices.map((s) => (
              <circle
                key={s.tag}
                cx={CENTER}
                cy={CENTER}
                r={RADIUS}
                fill="none"
                stroke={s.color}
                strokeWidth={shownTag === s.tag ? STROKE + 6 : STROKE}
                strokeDasharray={`${s.len} ${CIRCUMFERENCE - s.len}`}
                strokeDashoffset={-s.offset}
                tabIndex={0}
                role="button"
                aria-pressed={pinned === s.tag}
                aria-label={`${s.tag} : ${Math.round(s.pct)}%`}
                onMouseEnter={() => setHovered(s.tag)}
                onFocus={() => setHovered(s.tag)}
                onMouseLeave={() => setHovered(null)}
                onBlur={() => setHovered(null)}
                onClick={() => togglePin(s.tag)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    togglePin(s.tag);
                  }
                }}
                style={{ cursor: "pointer", transition: "stroke-width 0.15s", outline: "none" }}
              />
            ))}
          </g>
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          {shownSkill && (
            <>
              <span className="text-2xl font-bold text-[var(--fg)]">{Math.round(shownSkill.pct)}%</span>
              <span className="max-w-[7rem] text-xs text-[var(--fg-muted)]">{shownSkill.tag}</span>
            </>
          )}
        </div>
      </div>

      <div className="w-full">
        <ul className="flex flex-wrap gap-x-4 gap-y-2">
          {slices.map((s) => (
            <li key={s.tag}>
              <button
                onMouseEnter={() => setHovered(s.tag)}
                onFocus={() => setHovered(s.tag)}
                onMouseLeave={() => setHovered(null)}
                onBlur={() => setHovered(null)}
                onClick={() => togglePin(s.tag)}
                aria-pressed={pinned === s.tag}
                className="flex items-center gap-2 rounded-md px-1.5 py-1 text-sm transition-colors"
                style={{ backgroundColor: shownTag === s.tag ? "var(--bg-elevated)" : "transparent" }}
              >
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: s.color }} />
                <span style={{ color: shownTag === s.tag ? "var(--fg)" : "var(--fg-muted)" }}>{s.tag}</span>
                <span className="tabular-nums" style={{ color: "var(--fg-muted)" }}>
                  {Math.round(s.pct)}%
                </span>
              </button>
            </li>
          ))}
        </ul>

        <AnimatePresence mode="wait">
          {shownSkill && (
            <motion.div
              key={shownSkill.tag}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)] p-5">
                <p className="mb-3 text-sm text-[var(--fg-muted)]">
                  {shownSkill.count} projet{shownSkill.count > 1 ? "s" : ""} mobilisant{" "}
                  <span className="text-[var(--fg)]">{shownSkill.tag}</span>
                  {shownSkill.included && (
                    <>
                      {" "}
                      (<span className="text-[var(--fg)]">{shownSkill.included.join(", ")}</span>)
                    </>
                  )}{" "}
                  :
                </p>
                <div className="flex flex-wrap gap-2">
                  {shownSkill.projects.map((p) => (
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
    </div>
  );
}
