
interface Project { slug: string; title: string; cat: "entreprise" | "perso" | "ecole" }
export interface Domain {
  id: string;
  name: string;
  blurb: string;
  tools: string[];
  projects: Project[];
}

const CATS_EN: Record<string, string> = { entreprise: "Professional", perso: "Personal", ecole: "School" };
const CATS = [
  { key: "entreprise", label: "Entreprise", color: "var(--skill-0)" },
  { key: "perso", label: "Perso", color: "var(--skill-1)" },
  { key: "ecole", label: "École", color: "var(--skill-3)" },
] as const;

export default function SkillDomains({ domains, total, lang = "fr" }: { domains: Domain[]; total: number; lang?: "fr" | "en" }) {
  const en = lang === "en";
  const base = en ? "/en" : "";
  return (
    <div>
      <p className="mb-4 max-w-2xl text-xs text-[var(--fg-muted)]">
        {en ? `A filled dot means the area is put into practice in that setting; the number is how many of the ${total} projects do it.` : `Un point plein : le domaine est mis en pratique dans ce cadre ; le chiffre indique dans combien des ${total} projets.`}
      </p>
      <div className="overflow-x-auto">
        <div className="min-w-[640px]">
          <div className="grid grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,0.7fr))_minmax(0,1.4fr)] items-center gap-x-3 pb-2 font-mono text-[11px] uppercase tracking-[0.04em] text-[var(--fg-muted)]">
            <span>{en ? "Area" : "Domaine"}</span>
            {CATS.map((c) => <span key={c.key} className="text-center">{en ? CATS_EN[c.key] : c.label}</span>)}
            <span>{en ? "Proof" : "Preuve"}</span>
          </div>
          <ul>
            {domains.map((d) => (
              <li key={d.id} className="grid grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,0.7fr))_minmax(0,1.4fr)] items-center gap-x-3 border-t border-[var(--border)] py-4">
                <div className="min-w-0 pr-2">
                  <p className="font-semibold text-[var(--fg)]">{d.name}</p>
                  <p className="mt-0.5 truncate font-mono text-xs text-[var(--fg-muted)]" title={d.tools.join(" · ")}>{d.tools.slice(0, 4).join(" · ")}</p>
                </div>
                {CATS.map((c) => {
                  const n = d.projects.filter((p) => p.cat === c.key).length;
                  return (
                    <span key={c.key} className="flex justify-center">
                      {n > 0 ? (
                        <span className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold tabular-nums text-[var(--accent-fg)]" style={{ background: c.color }} aria-label={`${n} ${en ? "projects" : "projets"}`}>{n}</span>
                      ) : (
                        <span className="h-7 w-7 rounded-full border border-dashed border-[var(--border)]" aria-label={en ? "none" : "aucun"} />
                      )}
                    </span>
                  );
                })}
                <div className="flex min-w-0 flex-col gap-0.5 text-sm">
                  {d.projects.slice(0, 2).map((p) => (
                    <a key={p.slug} href={`${base}/projets/${p.slug}/`} className="truncate border-b border-transparent text-[var(--fg)] hover:text-[var(--accent)]">{p.title}</a>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
