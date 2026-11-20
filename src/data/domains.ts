import { enProject } from "../i18n/projects-en";

export const DOMAINS = [
  { id: "virt", name: "Virtualisation & systèmes", blurb: "Hyperviseurs, machines virtuelles et conteneurs système, du poste de travail à la production : Proxmox au homelab, ESXi chez Cloud Temple.", keys: ["Proxmox", "VMware ESXi", "Vagrant", "Linux", "govc", "Virtualisation", "Haute disponibilité"] },
  { id: "iac", name: "Infrastructure as Code & automatisation", blurb: "Décrire l'infrastructure en code et l'automatiser : Terraform, Ansible, scripts. Rien ne se fait à la main, tout est rejouable.", keys: ["Terraform", "Ansible", "Infra as Code", "Automatisation", "Bash", "Scripting", "YAML", "DevOps"] },
  { id: "cicd", name: "CI/CD & livraison continue", blurb: "Pipelines de test, de construction et de déploiement, avec analyse de sécurité des images.", keys: ["CI/CD", "GitHub Actions", "GitLab CI", "Forgejo Actions", "Woodpecker CI", "Azure DevOps", "Git", "Gitea", "Forgejo", "Trivy"] },
  { id: "k8s", name: "Conteneurs & Kubernetes", blurb: "Docker au quotidien, orchestration avec Swarm et Kubernetes, déploiement en GitOps avec Flux.", keys: ["Docker", "Docker Compose", "K3s", "Kubernetes", "FluxCD", "Orchestration"] },
  { id: "sec", name: "Réseau & sécurité", blurb: "Segmentation par VLAN, pare-feu, détection d'intrusion, authentification unique, gestion de secrets et durcissement.", keys: ["Réseau", "Sécurité", "OPNsense", "CrowdSec", "Suricata", "Wazuh", "Tailscale", "SSO", "Authentik", "OpenBao", "Vaultwarden", "CCNA", "Traefik", "Caddy", "Nginx", "Sécurité applicative", "Conformité (RGPD/PCI-DSS)", "JWT"] },
  { id: "obs", name: "Supervision & observabilité", blurb: "Métriques, journaux et alertes pour savoir qu'une panne arrive avant les utilisateurs.", keys: ["Monitoring", "Observabilité", "Prometheus", "Grafana", "Loki", "Alertmanager", "Nagios", "SNMP", "ELK", "Grafana Alloy"] },
  { id: "cloud", name: "Cloud", blurb: "Services managés Azure et Google Cloud, stockage objet, accès publics sans port ouvert.", keys: ["Azure", "GCP", "Google Cloud Platform", "Cloudflare Tunnel", "S3"] },
  { id: "dev", name: "Développement & données", blurb: "Applications complètes : API, interfaces web et mobiles, bases relationnelles et documentaires.", keys: ["Full-stack", "Python", "Node.js", "React", "React Native", "FastAPI", "Flask", "PostgreSQL", "MySQL", "MongoDB", "GraphQL", "Mobile", "Bases de données", "NoSQL", "Go", "JavaScript", "Développement", "Next.js", "Astro", "Microservices", "Architecture"] },
  { id: "ia", name: "IA appliquée", blurb: "Assistants et agents encadrés : outils validés côté serveur, sources citées, usage maîtrisé des modèles.", keys: ["IA", "IA / Assistant conversationnel", "IA / AIOps", "IA / RAG", "LLM / tool-calling", "Ollama", "Mistral AI", "Gemini API", "MCP"] },
];

export const DOMAINS_EN: Record<string, { name: string; blurb: string }> = {
  virt: { name: "Virtualisation & systems", blurb: "Hypervisors, virtual machines and system containers, from the workstation to production: Proxmox at the homelab, ESXi at Cloud Temple." },
  iac: { name: "Infrastructure as Code & automation", blurb: "Describing infrastructure as code and automating it: Terraform, Ansible, scripts. Nothing is done by hand, everything can be replayed." },
  cicd: { name: "CI/CD & continuous delivery", blurb: "Test, build and deployment pipelines, with security scanning of images." },
  k8s: { name: "Containers & Kubernetes", blurb: "Docker every day, orchestration with Swarm and Kubernetes, GitOps deployment with Flux." },
  sec: { name: "Networking & security", blurb: "VLAN segmentation, firewalls, intrusion detection, single sign-on, secrets management and hardening." },
  obs: { name: "Monitoring & observability", blurb: "Metrics, logs and alerts so that a failure is known before users notice it." },
  cloud: { name: "Cloud", blurb: "Managed Azure and Google Cloud services, object storage, public access without an open port." },
  dev: { name: "Development & data", blurb: "Complete applications: APIs, web and mobile interfaces, relational and document databases." },
  ia: { name: "Applied AI", blurb: "Supervised assistants and agents: server-validated tools, cited sources, controlled use of models." },
};
const norm = (x: string) => x.toLowerCase();
export function buildDomains(projects: any[], en: boolean) {
  return DOMAINS.map((d) => {
    const keys = new Set(d.keys.map(norm));
    const hits = projects
      .map((p) => ({ p, matched: [...p.data.tags, ...p.data.stack].filter((t: string) => keys.has(norm(t))) }))
      .filter((x) => x.matched.length > 0);
    const toolCount = new Map<string, number>();
    hits.forEach((h) => new Set(h.matched as string[]).forEach((t) => toolCount.set(t, (toolCount.get(t) ?? 0) + 1)));
    return {
      id: d.id,
      name: en ? DOMAINS_EN[d.id].name : d.name,
      blurb: en ? DOMAINS_EN[d.id].blurb : d.blurb,
      tools: [...toolCount.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).map(([t]) => t),
      projects: hits
        .sort((a, b) => b.matched.length - a.matched.length)
        .map((h) => ({ slug: h.p.id, title: (en ? enProject(h.p.id, h.p.data).title : h.p.data.title).split(" - ")[0], cat: h.p.data.category })),
    };
  })
    .filter((d) => d.projects.length > 0)
    .sort((a, b) => b.projects.length - a.projects.length);
}
