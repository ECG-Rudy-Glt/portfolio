// Périodes des projets en années fractionnaires (sept. = .67), tirées de la frise du parcours
// (BTS 2022-2024, SUPINFO 3e/4e/5e année, Cloud Temple depuis 2024) et du champ « period » des projets.
export const NOW = 2026.88; // fin novembre 2026
const [BTS, Y3, Y4] = [[2022.67, 2024.5], [2024.67, 2025.5], [2025.67, 2026.5]] as const;
export const PERIODS: Record<string, readonly [number, number]> = {
  "ethan-consulting": [2022.67, 2024.67],
  "bts-sio": BTS,
  "3dokr": Y3,
  "supchat": Y3,
  "supinfo-formation": [2024.67, 2026.5],
  "4agql-proj": Y4,
  "4arcl": Y4,
  "4kube": Y4,
  "4webd-ticket": Y4,
  "supfile": Y4,
  "cloud-temple": [2024.67, NOW],
  "plateforme-automatisation": [2025.67, NOW],
  "ops-delivery-suite": [2025.0, NOW],
  "homelab": [2026.42, NOW], // premier journal : juin 2026
  "coach": [2026.0, NOW],
  "patrimoine": [2026.0, NOW],
  "relai": [2026.0, NOW],
  "rudy-ops": [2026.0, NOW],
  "supinfo-lab": [2026.0, NOW],
};
export interface Tool { name: string; keys: string[]; group: string; home?: boolean }
export const GROUPS: Record<string, { fr: string; en: string }> = {
  infra: { fr: "Infrastructure & automatisation", en: "Infrastructure & automation" },
  secu: { fr: "Réseau & sécurité", en: "Networking & security" },
  obs: { fr: "Supervision & observabilité", en: "Monitoring & observability" },
  dev: { fr: "Développement", en: "Development" },
  data: { fr: "Données", en: "Data" },
  ia: { fr: "IA appliquée", en: "Applied AI" },
  archi: { fr: "Architecture & méthode", en: "Architecture & method" },
};
export const TOOLS: Tool[] = [
  // Infrastructure & automatisation
  { group: "infra", name: "Docker", keys: ["Vagrant", "Docker", "Docker Compose", "Docker Swarm"], home: true },
  { group: "infra", name: "Ansible", keys: ["Ansible"], home: true },
  { group: "infra", name: "Terraform", keys: ["Terraform"], home: true },
  { group: "infra", name: "Proxmox", keys: ["Proxmox Backup Server", "Virtualisation", "Proxmox"], home: true },
  { group: "infra", name: "VMware ESXi", keys: ["govc", "VMware ESXi"] },
  { group: "infra", name: "Kubernetes", keys: ["FluxCD", "kubeadm", "containerd", "Calico", "Orchestration", "Kubernetes", "K3s"], home: true },
  { group: "infra", name: "CI/CD", keys: ["DevOps", "Azure DevOps", "CI/CD", "GitLab CI", "GitHub Actions", "Forgejo Actions", "Woodpecker CI"], home: true },
  { group: "infra", name: "Linux & scripts", keys: ["YAML", "Linux", "Bash", "Scripting", "Automatisation"] },
  { group: "infra", name: "Infrastructure as Code", keys: ["Infra as Code"] },
  { group: "infra", name: "Cloud (Azure, GCP, S3)", keys: ["Azure", "GCP", "Google Cloud Platform", "S3"] },
  { group: "infra", name: "Self-hosting & domotique", keys: ["Self-hosting", "Home Assistant", "Jellyfin", "ntfy"] },
  { group: "infra", name: "Git", keys: ["Git", "Forgejo", "Gitea"] },
  // Réseau & sécurité
  { group: "secu", name: "OPNsense & réseau", keys: ["OPNsense", "Réseau", "CCNA", "Tailscale"], home: true },
  { group: "secu", name: "Sécurité", keys: ["Grype", "Syft (SBOM)", "Checkov", "gitleaks", "Sécurité", "Sécurité applicative", "Suricata", "CrowdSec", "Wazuh", "Trivy", "Conformité (RGPD/PCI-DSS)"] },
  { group: "secu", name: "Secrets & identité", keys: ["OpenBao", "Authentik", "Authelia (SSO/OIDC)", "SSO", "Vaultwarden", "JWT"] },
  { group: "secu", name: "Reverse proxy", keys: ["Cloudflare Tunnel", "Traefik", "Caddy", "Nginx"] },
  // Observabilité
  { group: "obs", name: "Prometheus & Grafana", keys: ["Grafana Alloy", "SNMP", "ELK", "Zipkin", "Prometheus", "Grafana", "Loki", "Alertmanager", "Nagios", "Monitoring", "Observabilité"], home: true },
  // Développement
  { group: "dev", name: "Python", keys: ["Python", "FastAPI", "Flask"], home: true },
  { group: "dev", name: "Node.js", keys: ["Node.js", "Express"], home: true },
  { group: "dev", name: "JavaScript & TypeScript", keys: ["Scraping", "JavaScript", "TypeScript", "HTML/CSS/JS"] },
  { group: "dev", name: "React", keys: ["React", "React Native", "Next.js", "Ionic / React"] },
  { group: "dev", name: "API & GraphQL", keys: ["Enable Banking (DSP2)", "SendGrid", "GraphQL", "GraphQL Mesh", "Vikunja API", "Gemini API"] },
  { group: "dev", name: "Full-stack", keys: ["Full-stack", "Développement"] },
  { group: "dev", name: "Sites web & intégration", keys: ["Sites web", "Websites", "Astro", "TailwindCSS", "SEO", "HTML/CSS/JS"] },
  { group: "dev", name: "Tests automatisés (pytest, Playwright, Go)", keys: ["Tests automatisés", "Automated testing", "pytest", "Playwright"] },
  { group: "dev", name: "Temps réel (Socket.IO)", keys: ["Socket.IO", "Temps réel"] },
  { group: "dev", name: "C# / ASP.NET", keys: ["C# / ASP.NET"] },
  { group: "dev", name: "Go", keys: ["Go"] },
  { group: "dev", name: "Mobile & desktop", keys: ["Mobile", "Android", "Electron", "Desktop", "PWA"] },
  // Données
  { group: "data", name: "PostgreSQL", keys: ["PostgreSQL", "Patroni", "PgBouncer", "Prisma"] },
  { group: "data", name: "Modélisation de données (MCD, schémas, migrations)", keys: ["Modélisation de données", "Data modelling"] },
  { group: "data", name: "MySQL & NoSQL", keys: ["Bases de données", "Big Data", "MySQL", "MongoDB", "NoSQL", "Redis"] },
  // IA
  { group: "ia", name: "IA & LLM", keys: ["ChromaDB", "IA", "IA / Assistant conversationnel", "IA / AIOps", "IA / RAG", "LLM / tool-calling", "LLM / Claude (Anthropic)", "Mistral AI", "Gemini API", "Ollama", "MCP"], home: true },
  // Architecture
  { group: "archi", name: "Microservices", keys: ["Microservices", "Event Bus", "RabbitMQ", "ActiveMQ"] },
  { group: "archi", name: "Architecture & conception", keys: ["Excalidraw", "Architecture", "Architecture cloud", "Conception", "Haute disponibilité"], home: true },
  { group: "archi", name: "Gestion de projet", keys: ["Beads", "Confluence", "Gestion de projet", "Agile", "Projet de groupe", "Travail en équipe", "OpenSpec"] },
];
