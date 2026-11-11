import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useReducedMotion } from "framer-motion";

interface Project { slug: string; title: string; cat: "entreprise" | "perso" | "ecole" }
export interface Domain {
  id: string;
  name: string;
  blurb: string;
  tools: string[];
  projects: Project[];
}

const CATS = [
  { key: "entreprise", label: "Entreprise", color: "var(--skill-0)" },
  { key: "perso", label: "Perso", color: "var(--skill-1)" },
  { key: "ecole", label: "École", color: "var(--skill-3)" },
] as const;

function Count({ to, run, reduced }: { to: number; run: boolean; reduced: boolean }) {
  const [v, setV] = useState(reduced ? to : 0);
  useEffect(() => {
    if (!run) return;
    if (reduced) { setV(to); return; }
    const c = animate(0, to, { duration: 0.9, ease: "easeOut", onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [run, to, reduced]);
  return <>{v}</>;
}

function Row({ d, total, index, open, onToggle }: { d: Domain; total: number; index: number; open: boolean; onToggle: () => void }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const reduced = !!useReducedMotion() || (typeof document !== "undefined" && document.documentElement.classList.contains("no-anim"));
  const n = d.projects.length;
  const counts = CATS.map((c) => ({ ...c, n: d.projects.filter((p) => p.cat === c.key).length }));
  return (
    <li ref={ref} className="rounded-xl border border-[var(--border)] bg-[var(--bg-elevated)]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full flex-col gap-3 p-4 text-left sm:p-5"
      >
        <div className="flex items-baseline justify-between gap-4">
          <span className="font-semibold text-[var(--fg)]">{d.name}</span>
          <span className="shrink-0 text-sm tabular-nums text-[var(--fg-muted)]">
            <b className="text-lg text-[var(--accent)]"><Count to={n} run={inView} reduced={reduced} /></b> projet{n > 1 ? "s" : ""} sur {total}
          </span>
        </div>
        <div className="flex h-3 w-full overflow-hidden rounded-full bg-[var(--bg)] ring-1 ring-[var(--border)]" role="img" aria-label={`${d.name} : ${counts.map((c) => `${c.n} ${c.label.toLowerCase()}`).join(", ")}`}>
          {counts.filter((c) => c.n > 0).map((c, i) => (
            <motion.div
              key={c.key}
              initial={{ width: reduced ? `${(c.n / total) * 100}%` : 0 }}
              animate={{ width: inView || reduced ? `${(c.n / total) * 100}%` : 0 }}
              transition={{ duration: 0.8, delay: reduced ? 0 : index * 0.06 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              style={{ background: c.color }}
            />
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[var(--fg-muted)]">
          {counts.filter((c) => c.n > 0).map((c) => (
            <span key={c.key} className="flex items-center gap-1.5"><i className="inline-block h-2 w-2 rounded-full" style={{ background: c.color }} />{c.n} {c.label.toLowerCase()}</span>
          ))}
          <span className="ml-auto">{open ? "Masquer" : "Voir le détail"} {open ? "−" : "+"}</span>
        </div>
      </button>
      <motion.div
        initial={false}
        animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
        transition={{ duration: reduced ? 0 : 0.25 }}
        className="overflow-hidden"
        aria-hidden={!open}
      >
        <div className="border-t border-[var(--border)] p-4 sm:p-5">
          <p className="mb-3 text-sm text-[var(--fg-muted)]">{d.blurb}</p>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--fg-muted)]">Outils et notions</p>
          <div className="mb-4 flex flex-wrap gap-2">
            {d.tools.map((t) => <span key={t} className="rounded-full bg-[var(--bg)] px-2.5 py-1 text-xs text-[var(--fg)] ring-1 ring-[var(--border)]">{t}</span>)}
          </div>
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-[var(--fg-muted)]">Où c'est mis en pratique</p>
          <div className="flex flex-wrap gap-2">
            {d.projects.map((p) => (
              <a key={p.slug} href={`/projets/${p.slug}/`} tabIndex={open ? 0 : -1} className="rounded-full bg-[var(--bg)] px-3 py-1.5 text-sm text-[var(--fg)] ring-1 ring-[var(--border)] transition-colors hover:text-[var(--accent)]">{p.title}</a>
            ))}
          </div>
        </div>
      </motion.div>
    </li>
  );
}

export default function SkillDomains({ domains, total }: { domains: Domain[]; total: number }) {
  const [openId, setOpenId] = useState<string | null>(null);
  return (
    <div>
      <ul className="mb-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-[var(--fg-muted)]" aria-label="Légende">
        {CATS.map((c) => <li key={c.key} className="flex items-center gap-1.5"><i className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: c.color }} />{c.label}</li>)}
      </ul>
      <ul className="grid gap-3">
        {domains.map((d, i) => (
          <Row key={d.id} d={d} total={total} index={i} open={openId === d.id} onToggle={() => setOpenId(openId === d.id ? null : d.id)} />
        ))}
      </ul>
    </div>
  );
}
