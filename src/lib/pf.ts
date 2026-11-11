import { getCollection } from "astro:content";

export const PALETTES = ["Parchemin", "Nuit", "Éco", "Forêt", "Ardoise"] as const;

const weight = { majeur: 0, pertinent: 1, secondaire: 2 } as const;
const CODE = { entreprise: "E", perso: "P", ecole: "É" } as const;
export const ZONE = { entreprise: "Entreprise", perso: "Projets personnels", ecole: "École (SUPINFO)" } as const;

export async function loadPortfolio() {
  const projects = (await getCollection("projects"))
    .sort((a, b) => weight[a.data.relevance] - weight[b.data.relevance] || a.data.order - b.data.order)
    .map((p) => ({
      id: p.id,
      title: p.data.title.split(" - ")[0],
      subtitle: (p.data.title.split(" - ")[1] ?? "").replace(/^./, (c) => c.toLowerCase()),
      summary: p.data.summary.length > 120 ? p.data.summary.slice(0, 117).trimEnd() + "…" : p.data.summary,
      cat: p.data.category,
      code: CODE[p.data.category],
      site: p.data.links.demo,
      demo: p.data.links.sandbox,
      repo: p.data.links.repo,
      fiche: `/projets/${p.id}/`,
    }));
  const articles = (await getCollection("articles"))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf())
    .map((a) => ({
      title: a.data.title,
      date: a.data.date.toISOString().slice(0, 10),
      tag: a.data.type === "linkedin" ? "linkedin" : (a.data.tags[0] ?? "article"),
      href: a.data.type === "linkedin" ? a.data.externalUrl! : `/blog/${a.id}/`,
      external: a.data.type === "linkedin",
    }));
  const demos = projects.filter((p) => p.demo);
  const path = [
    { when: "2024", what: "Diplôme du BTS SIO" },
    { when: "3 ans", what: "Alternance chez Cloud Temple : infrastructure et automatisation" },
    { when: "SUPINFO", what: "4e année, fin de cursus prévue en septembre 2027" },
  ];
  const skills = ["Proxmox", "Terraform", "Ansible", "Kubernetes", "Docker", "CI/CD", "Azure", "Sécurité", "Observabilité", "Automatisation"];
  return { projects, articles, demos, path, skills, HOMELAB: "https://homelab.gault-rudy.com/" };
}
