import { useEffect, useMemo, useState } from "react";
import { modules, overlaps, repoUrl, type Module, type Track } from "../data/learningPath";

const STORAGE_KEY = "learning-path-progress-v1";

const pageSlug: Record<string, string> = {
  P1: "p1-platform-as-product", P2: "p2-kubernetes-gitops", P3: "p3-iac-control-planes",
  P4: "p4-idp-golden-paths", P5: "p5-securite-supply-chain", P6: "p6-observabilite-sre",
  H1: "h1-llm-api-fondamentaux", H2: "h2-boucle-agent-outils", H3: "h3-context-engineering",
  H4: "h4-evals", H5: "h5-sandboxing-securite", H6: "h6-long-running-multi-agent",
  C1: "c1-plateforme-agents", C2: "c2-agent-ops",
};

const trackMeta: Record<Track, { label: string; color: string }> = {
  platform: { label: "Platform", color: "var(--accent)" },
  harness: { label: "Harness", color: "var(--skill-2)" },
  convergence: { label: "Convergence", color: "var(--skill-3)" },
};

type Tab = "path" | "overlap" | "passk";

function loadProgress(): Record<string, boolean> {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress(p: Record<string, boolean>) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(p));
  } catch {
    /* navigation privée ou stockage bloqué : la progression reste en mémoire */
  }
}

const card = { background: "var(--bg-elevated)", borderColor: "var(--border)" } as const;

function ModuleButton({ m, active, done, onClick }: { m: Module; active: boolean; done: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="w-full rounded-lg p-3 text-left ring-1 transition-colors"
      style={{
        ...card,
        borderColor: active ? trackMeta[m.track].color : "var(--border)",
        boxShadow: active ? `inset 3px 0 0 ${trackMeta[m.track].color}` : undefined,
        background: active ? "var(--bg-deep)" : "var(--bg-elevated)",
      }}
    >
      <span className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs" style={{ color: trackMeta[m.track].color }}>
          {m.id}
        </span>
        {done && (
          <span className="text-xs" style={{ color: "var(--accent)" }} aria-label="validé">
            ✓
          </span>
        )}
      </span>
      <span className="mt-1 block text-sm font-medium" style={{ color: "var(--fg)" }}>
        {m.title}
      </span>
    </button>
  );
}

function ModuleDetail({ m, progress, toggle }: { m: Module; progress: Record<string, boolean>; toggle: (key: string) => void }) {
  const doneCount = m.validation.filter((_, i) => progress[`${m.id}:${i}`]).length;
  return (
    <div className="rounded-xl p-5 ring-1" style={card}>
      <p className="font-mono text-xs" style={{ color: trackMeta[m.track].color }}>
        {m.id} · {trackMeta[m.track].label} · mois {m.month}
      </p>
      <h3 className="mt-1 text-lg font-semibold" style={{ color: "var(--fg)" }}>
        {m.title}
      </h3>
      <p className="mt-1 text-sm" style={{ color: "var(--fg-muted)" }}>
        {m.pitch}
      </p>
      <a
        href={`/projets/parcours-platform-harness/${pageSlug[m.id]}/`}
        className="mt-2 inline-block text-sm font-medium hover:underline"
        style={{ color: "var(--accent)" }}
      >
        Page complète du module (concepts, toutes les sources, lab détaillé) →
      </a>

      <div className="mt-4 grid gap-5 md:grid-cols-2">
        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--fg-soft)" }}>
            Objectifs
          </h4>
          <ul className="space-y-1 text-sm" style={{ color: "var(--fg-muted)" }}>
            {m.goals.map((g) => (
              <li key={g}>· {g}</li>
            ))}
          </ul>

          <h4 className="mb-2 mt-4 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--fg-soft)" }}>
            Lab homelab
          </h4>
          <p className="text-sm font-medium" style={{ color: "var(--fg)" }}>
            {m.lab.title}
          </p>
          <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
            Livrable : {m.lab.deliverable}
          </p>
        </div>

        <div>
          <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--fg-soft)" }}>
            Sources
          </h4>
          <ul className="space-y-1.5 text-sm">
            {m.sources.map((s) => (
              <li key={s.url} className="flex items-start gap-2">
                <span
                  className="mt-1.5 inline-block h-2 w-2 shrink-0 rounded-full"
                  style={{ background: s.essential ? "var(--accent)" : "var(--fg-muted)" }}
                  title={s.essential ? "À lire en premier" : "Pour approfondir"}
                />
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="hover:underline" style={{ color: "var(--fg)" }}>
                  {s.label}
                  {s.note && <span style={{ color: "var(--fg-muted)" }}> ({s.note})</span>}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-5 border-t pt-4" style={{ borderColor: "var(--border)" }}>
        <h4 className="mb-2 text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--fg-soft)" }}>
          Validation · {doneCount}/{m.validation.length}
        </h4>
        <ul className="space-y-2">
          {m.validation.map((v, i) => {
            const key = `${m.id}:${i}`;
            return (
              <li key={key}>
                <label className="flex cursor-pointer items-start gap-2 text-sm" style={{ color: "var(--fg-muted)" }}>
                  <input type="checkbox" checked={!!progress[key]} onChange={() => toggle(key)} className="mt-1 accent-[var(--accent)]" />
                  <span>{v}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function PathView({ progress, toggle }: { progress: Record<string, boolean>; toggle: (key: string) => void }) {
  const [selected, setSelected] = useState<string>("P1");
  const current = modules.find((m) => m.id === selected) ?? modules[0];
  const isDone = (m: Module) => m.validation.every((_, i) => progress[`${m.id}:${i}`]);
  const doneModules = modules.filter(isDone).length;
  const months = [1, 2, 3, 4, 5, 6];
  const convergence = modules.filter((m) => m.track === "convergence");

  return (
    <div className="space-y-5">
      <div>
        <div className="mb-1 flex justify-between text-xs" style={{ color: "var(--fg-muted)" }}>
          <span>Ta progression (enregistrée dans ce navigateur)</span>
          <span>
            {doneModules}/{modules.length} modules
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full" style={{ background: "var(--bg-deep)" }}>
          <div className="h-full rounded-full transition-all" style={{ width: `${(doneModules / modules.length) * 100}%`, background: "var(--accent)" }} />
        </div>
      </div>

      <div className="grid grid-cols-[2.5rem_1fr_1fr] gap-2 text-xs font-semibold" style={{ color: "var(--fg-soft)" }}>
        <span />
        <span style={{ color: trackMeta.platform.color }}>Platform</span>
        <span style={{ color: trackMeta.harness.color }}>Harness</span>
      </div>
      <div className="space-y-2">
        {months.map((month) => {
          const p = modules.find((m) => m.track === "platform" && m.month === month)!;
          const h = modules.find((m) => m.track === "harness" && m.month === month)!;
          return (
            <div key={month} className="grid grid-cols-[2.5rem_1fr_1fr] items-stretch gap-2">
              <span className="self-center font-mono text-xs" style={{ color: "var(--fg-muted)" }}>
                M{month}
              </span>
              <ModuleButton m={p} active={selected === p.id} done={isDone(p)} onClick={() => setSelected(p.id)} />
              <ModuleButton m={h} active={selected === h.id} done={isDone(h)} onClick={() => setSelected(h.id)} />
            </div>
          );
        })}
        <div className="grid grid-cols-[2.5rem_1fr_1fr] items-stretch gap-2">
          <span className="self-center font-mono text-xs" style={{ color: "var(--fg-muted)" }}>
            M7+
          </span>
          {convergence.map((c) => (
            <ModuleButton key={c.id} m={c} active={selected === c.id} done={isDone(c)} onClick={() => setSelected(c.id)} />
          ))}
        </div>
      </div>

      <ModuleDetail m={current} progress={progress} toggle={toggle} />
    </div>
  );
}

function OverlapView() {
  const [active, setActive] = useState(0);
  const o = overlaps[active];
  return (
    <div className="space-y-4">
      <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
        Choisis une préoccupation : la même question se pose des deux côtés, avec des outils différents.
      </p>
      <div className="flex flex-wrap gap-2">
        {overlaps.map((x, i) => (
          <button
            key={x.concern}
            type="button"
            onClick={() => setActive(i)}
            aria-pressed={i === active}
            className="rounded-full px-3 py-1 text-xs ring-1"
            style={{
              borderColor: i === active ? "var(--accent)" : "var(--border)",
              background: i === active ? "var(--accent)" : "transparent",
              color: i === active ? "var(--accent-fg)" : "var(--fg)",
            }}
          >
            {x.concern}
          </button>
        ))}
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <div className="rounded-xl p-4 ring-1" style={card}>
          <p className="text-xs font-semibold" style={{ color: trackMeta.platform.color }}>
            Côté plateforme · {o.modules[0]}
          </p>
          <p className="mt-1 text-sm" style={{ color: "var(--fg)" }}>
            {o.platform}
          </p>
        </div>
        <div className="rounded-xl p-4 ring-1" style={card}>
          <p className="text-xs font-semibold" style={{ color: trackMeta.harness.color }}>
            Côté harness · {o.modules[1]}
          </p>
          <p className="mt-1 text-sm" style={{ color: "var(--fg)" }}>
            {o.harness}
          </p>
        </div>
      </div>
    </div>
  );
}

function PassKView() {
  const [p, setP] = useState(75);
  const [k, setK] = useState(3);
  const rate = p / 100;
  const passAt = 1 - Math.pow(1 - rate, k);
  const passHat = Math.pow(rate, k);
  const pct = (x: number) => `${Math.round(x * 100)} %`;

  return (
    <div className="space-y-4">
      <p className="text-sm" style={{ color: "var(--fg-muted)" }}>
        Un agent qui réussit une tâche 3 fois sur 4 semble fiable. Tout dépend de ce qu'on mesure :{" "}
        <strong style={{ color: "var(--fg)" }}>pass@k</strong> (au moins un succès sur k essais) ou{" "}
        <strong style={{ color: "var(--fg)" }}>pass^k</strong> (k succès sur k).
      </p>
      <label className="block text-sm" style={{ color: "var(--fg)" }}>
        Taux de réussite par essai : <strong>{p} %</strong>
        <input type="range" min={5} max={99} value={p} onChange={(e) => setP(Number(e.target.value))} className="mt-1 w-full accent-[var(--accent)]" />
      </label>
      <label className="block text-sm" style={{ color: "var(--fg)" }}>
        Nombre d'essais k : <strong>{k}</strong>
        <input type="range" min={1} max={10} value={k} onChange={(e) => setK(Number(e.target.value))} className="mt-1 w-full accent-[var(--accent)]" />
      </label>
      <div className="grid gap-3 sm:grid-cols-2">
        {[
          { label: `pass@${k}`, value: passAt, hint: "Utile quand un humain choisit la meilleure tentative" },
          { label: `pass^${k}`, value: passHat, hint: "Ce qui compte quand l'agent tourne seul, en boucle" },
        ].map((r) => (
          <div key={r.label} className="rounded-xl p-4 ring-1" style={card}>
            <p className="font-mono text-xs" style={{ color: "var(--fg-muted)" }}>
              {r.label}
            </p>
            <p className="text-2xl font-semibold" style={{ color: "var(--fg)" }}>
              {pct(r.value)}
            </p>
            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full" style={{ background: "var(--bg-deep)" }}>
              <div className="h-full rounded-full" style={{ width: pct(r.value), background: "var(--accent)" }} />
            </div>
            <p className="mt-2 text-xs" style={{ color: "var(--fg-muted)" }}>
              {r.hint}
            </p>
          </div>
        ))}
      </div>
      <p className="text-xs" style={{ color: "var(--fg-muted)" }}>
        Exemple de l'article{" "}
        <a href="https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents" target="_blank" rel="noopener noreferrer" className="underline">
          Demystifying evals for AI agents
        </a>{" "}
        (Anthropic, janv. 2026) : à 75 % par essai, pass^3 ≈ 42 %.
      </p>
    </div>
  );
}

export default function LearningPath() {
  const [tab, setTab] = useState<Tab>("path");
  const [progress, setProgress] = useState<Record<string, boolean>>({});

  useEffect(() => setProgress(loadProgress()), []);

  const toggle = (key: string) =>
    setProgress((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      saveProgress(next);
      return next;
    });

  const tabs = useMemo(
    () => [
      { id: "path" as Tab, label: "Le parcours" },
      { id: "overlap" as Tab, label: "Ce qui se recoupe" },
      { id: "passk" as Tab, label: "pass@k vs pass^k" },
    ],
    []
  );

  return (
    <div className="space-y-5">
      <div role="tablist" className="flex flex-wrap gap-2 border-b pb-3" style={{ borderColor: "var(--border)" }}>
        {tabs.map((t) => (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className="rounded-md px-3 py-1.5 text-sm font-medium"
            style={{
              background: tab === t.id ? "var(--bg-deep)" : "transparent",
              color: tab === t.id ? "var(--fg)" : "var(--fg-muted)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "path" && <PathView progress={progress} toggle={toggle} />}
      {tab === "overlap" && <OverlapView />}
      {tab === "passk" && <PassKView />}

      <p className="text-xs" style={{ color: "var(--fg-muted)" }}>
        Tout le parcours (modules, labs, bibliographie, en français et en anglais) est sur{" "}
        <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: "var(--accent)" }}>
          GitHub
        </a>
        .
      </p>
    </div>
  );
}
