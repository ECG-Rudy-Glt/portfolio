// Données du parcours Platform × Harness engineer, reprises du dépôt
// https://github.com/ECG-Rudy-Glt/Learning_path_plateform-harness_inge
// Sources vérifiées le 22/11/2026 (URL testées, auteurs et dates relevés sur la page).

export type Track = "platform" | "harness" | "convergence";

export interface Source {
  label: string;
  url: string;
  essential?: boolean;
  note?: string;
}

export interface Module {
  id: string;
  track: Track;
  month: number;
  title: string;
  pitch: string;
  goals: string[];
  sources: Source[];
  lab: { title: string; deliverable: string };
  validation: string[];
}

const REPO = "https://github.com/ECG-Rudy-Glt/Learning_path_plateform-harness_inge";

export const repoUrl = REPO;

export const modules: Module[] = [
  {
    id: "P1",
    track: "platform",
    month: 1,
    title: "Platform as a product",
    pitch: "Traiter la plateforme comme un produit, avec des utilisateurs, un contrat et des métriques.",
    goals: [
      "Identifier les utilisateurs, leurs parcours et leurs irritants",
      "Rédiger une charte : périmètre, contrat, hors périmètre",
      "Se situer sur le modèle de maturité CNCF",
    ],
    sources: [
      { label: "CNCF, Platforms white paper", url: "https://tag-app-delivery.cncf.io/whitepapers/platforms/", essential: true },
      { label: "CNCF, Platform Engineering Maturity Model", url: "https://tag-app-delivery.cncf.io/whitepapers/platform-eng-maturity-model/", essential: true },
      { label: "Evan Bottcher, What I talk about when I talk about platforms (2018)", url: "https://martinfowler.com/articles/talk-about-platforms.html", essential: true },
      { label: "DORA, State of AI-assisted Software Development 2025", url: "https://dora.dev/research/2025/dora-report/" },
      { label: "Team Topologies, 2e éd. (IT Revolution, 2025)", url: "https://teamtopologies.com/book", note: "livre" },
      { label: "Platform Engineering, C. Fournier & I. Nowland (O'Reilly, 2024)", url: "https://www.oreilly.com/library/view/platform-engineering/9781098153632/", note: "livre" },
    ],
    lab: { title: "Charte de la plateforme homelab", deliverable: "Charte + positionnement sur les 5 aspects du modèle de maturité" },
    validation: ["Homelab positionné sur les 5 aspects, avec preuves", "3 métriques choisies, avec leur source"],
  },
  {
    id: "P2",
    track: "platform",
    month: 2,
    title: "Kubernetes & GitOps avancé",
    pitch: "Comprendre la boucle de réconciliation et écrire son propre opérateur.",
    goals: ["Reconcile loop, finalizers, status", "Écrire un opérateur avec kubebuilder", "Flux multi-tenant"],
    sources: [
      { label: "Kubebuilder Book", url: "https://book.kubebuilder.io/", essential: true },
      { label: "Flux, Ways of structuring your repositories", url: "https://fluxcd.io/flux/guides/repository-structure/", essential: true },
      { label: "fluxcd/flux2-multi-tenancy", url: "https://github.com/fluxcd/flux2-multi-tenancy" },
    ],
    lab: { title: "Opérateur App", deliverable: "Une ressource App qui génère Deployment, Service, Ingress et Certificate" },
    validation: ["Création, mise à jour et suppression gérées", "Un tenant ne peut pas écrire hors de son namespace"],
  },
  {
    id: "P3",
    track: "platform",
    month: 3,
    title: "IaC & control planes",
    pitch: "Passer de Terraform lancé à la main à une API déclarative réconciliée en continu.",
    goals: ["State, verrou, détection de dérive", "Abstractions : modules, XRD, compositions"],
    sources: [
      { label: "Crossplane, What's Crossplane (v2)", url: "https://docs.crossplane.io/latest/whats-crossplane/", essential: true },
      { label: "OpenTofu docs", url: "https://opentofu.org/docs/", essential: true },
      { label: "Kratix, Promises", url: "https://docs.kratix.io/" },
    ],
    lab: { title: "Control plane pour VM Proxmox", deliverable: "Backend Terraform verrouillé, job de dérive, ADR Terraform vs Crossplane" },
    validation: ["Une ressource réconciliée sans apply manuel", "La dérive est détectée et signalée"],
  },
  {
    id: "P4",
    track: "platform",
    month: 4,
    title: "IDP & golden paths",
    pitch: "Nouvelle app → URL HTTPS en prod en moins de 15 minutes, sans ticket.",
    goals: ["Catalogue logiciel", "Software templates", "Portail ≠ orchestrateur"],
    sources: [
      { label: "backstage/backstage (CNCF incubating)", url: "https://github.com/backstage/backstage", essential: true },
      { label: "Backstage, Software Templates", url: "https://backstage.io/docs/features/software-templates/", essential: true },
      { label: "Spotify, How we use golden paths", url: "https://engineering.atspotify.com/2020/08/how-we-use-golden-paths-to-solve-fragmentation-in-our-software-ecosystem" },
    ],
    lab: { title: "Golden path & Backstage", deliverable: "Catalogue complet + template « nouvelle app », chronométré avant/après" },
    validation: ["Toutes les apps au catalogue", "Le template livre une app en HTTPS"],
  },
  {
    id: "P5",
    track: "platform",
    month: 5,
    title: "Sécurité & supply chain",
    pitch: "Signer, vérifier à l'admission, et remplacer les secrets statiques.",
    goals: ["Images signées et vérifiées", "SBOM et scan en CI", "Secrets dynamiques à courte durée"],
    sources: [
      { label: "SLSA", url: "https://slsa.dev/", essential: true },
      { label: "Sigstore, cosign", url: "https://docs.sigstore.dev/", essential: true },
      { label: "Kyverno docs", url: "https://kyverno.io/docs/", essential: true },
    ],
    lab: { title: "Supply chain signée", deliverable: "Pipeline signé, policies en Enforce, test de refus" },
    validation: ["Une image non signée est refusée", "Une app lit un secret dynamique"],
  },
  {
    id: "P6",
    track: "platform",
    month: 6,
    title: "Observabilité & SRE",
    pitch: "SLO, error budgets, DORA, et des post-mortems qui ferment leurs actions.",
    goals: ["SLO et alertes multi-burn-rate", "OpenTelemetry", "Mesurer DORA sur sa propre delivery"],
    sources: [
      { label: "Google SRE books (gratuits)", url: "https://sre.google/books/", essential: true },
      { label: "OpenTelemetry docs", url: "https://opentelemetry.io/docs/", essential: true },
      { label: "Observability Engineering, Majors, Fong-Jones & Miranda (O'Reilly, 2022 ; 2e éd. disponible)", url: "https://www.oreilly.com/library/view/observability-engineering/9781492076438/", note: "livre" },
    ],
    lab: { title: "SLO & DORA du homelab", deliverable: "SLO burn-rate, canal d'alerte hors bande, dashboard DORA" },
    validation: ["2 apps avec SLO", "Dashboard DORA alimenté automatiquement"],
  },
  {
    id: "H1",
    track: "harness",
    month: 1,
    title: "API LLM & fondamentaux",
    pitch: "Savoir ce qui se passe dans un appel : tokens, tool use, cache, raisons d'arrêt.",
    goals: ["Messages, tool use, streaming, prompt caching", "Coûts et latence par tour"],
    sources: [
      { label: "Anthropic, Building effective agents (déc. 2024)", url: "https://www.anthropic.com/engineering/building-effective-agents", essential: true },
      { label: "Claude, Tool use", url: "https://docs.claude.com/en/docs/agents-and-tools/tool-use/overview", essential: true },
      { label: "AI Engineering, Chip Huyen (O'Reilly, 2025)", url: "https://www.oreilly.com/library/view/ai-engineering/9781098166298/", note: "livre" },
    ],
    lab: { title: "Mini-agent en ~200 lignes", deliverable: "Une boucle d'agent sans framework, qui mesure tokens et coût" },
    validation: ["Je sais dire pourquoi le modèle s'est arrêté", "Gain du prompt caching mesuré"],
  },
  {
    id: "H2",
    track: "harness",
    month: 2,
    title: "Boucle d'agent & outils",
    pitch: "Concevoir des outils pour un agent, pas pour un humain : ACI, MCP, skills.",
    goals: ["Boucle robuste (erreurs, timeouts, limites)", "Outils nommés par intention, erreurs actionnables", "Skills composables"],
    sources: [
      { label: "Anthropic, Writing effective tools for agents (sept. 2025)", url: "https://www.anthropic.com/engineering/writing-tools-for-agents", essential: true },
      { label: "SWE-agent : Agent-Computer Interfaces (2024)", url: "https://arxiv.org/abs/2405.15793", essential: true },
      { label: "Simon Willison, Designing agentic loops (sept. 2025)", url: "https://simonwillison.net/2025/Sep/30/designing-agentic-loops/", essential: true },
      { label: "Agentless (2024) : un pipeline simple bat les agents", url: "https://arxiv.org/abs/2407.01489" },
      { label: "mattpocock/skills", url: "https://github.com/mattpocock/skills", essential: true },
      { label: "Model Context Protocol", url: "https://modelcontextprotocol.io/" },
    ],
    lab: { title: "Serveur MCP du homelab", deliverable: "MCP refactoré, mesuré avant/après sur 5 tâches, 2 skills perso" },
    validation: ["Outils utilisés correctement sans exemple", "Les erreurs disent quoi faire ensuite"],
  },
  {
    id: "H3",
    track: "harness",
    month: 3,
    title: "Context engineering",
    pitch: "Le contexte est une ressource finie : chaque token doit mériter sa place.",
    goals: ["Couches : système, AGENTS.md, skills, récupération, mémoire", "Compaction, reset, sous-agents"],
    sources: [
      { label: "Anthropic, Effective context engineering (sept. 2025)", url: "https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents", essential: true },
      { label: "IFTTD #383 : Contexte Engineering, avec Florian Bruniaux", url: "https://www.ifttd.io/episodes/contexte-engineering", essential: true, note: "podcast FR" },
      { label: "Manus, Context engineering for AI agents (juil. 2025)", url: "https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus", essential: true },
      { label: "Lost in the Middle (2023)", url: "https://arxiv.org/abs/2307.03172" },
      { label: "OpenAI, Harness engineering (fév. 2026)", url: "https://openai.com/index/harness-engineering/" },
      { label: "RTK", url: "https://github.com/rtk-ai/rtk" },
    ],
    lab: { title: "Contexte & mémoire de mes agents", deliverable: "Fichiers d'instructions audités, effet de RTK mesuré" },
    validation: ["Chaque ligne d'instruction est justifiée ou supprimée", "Je sais quand déléguer à un sous-agent"],
  },
  {
    id: "H4",
    track: "harness",
    month: 4,
    title: "Évals",
    pitch: "Mesurer un harness comme on mesure une plateforme : sur des tâches réelles, plusieurs fois.",
    goals: ["Tâches à état vérifiable, graders automatiques", "pass@k vs pass^k", "Analyse d'erreurs"],
    sources: [
      { label: "Anthropic, Demystifying evals for AI agents (janv. 2026)", url: "https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents", essential: true },
      { label: "Hamel Husain, Your AI product needs evals", url: "https://hamel.dev/blog/posts/evals/", essential: true },
      { label: "Inspect AI (UK AISI)", url: "https://inspect.aisi.org.uk/" },
    ],
    lab: { title: "Banc d'évals sur tâches homelab", deliverable: "20 tâches, 3 répétitions, comparaison de 2 variantes de harness" },
    validation: ["Chaque tâche a un grader automatique", "Une taxonomie d'échecs existe"],
  },
  {
    id: "H5",
    track: "harness",
    month: 5,
    title: "Sandboxing & sécurité",
    pitch: "Isoler le système de fichiers et le réseau : l'un sans l'autre ne suffit pas.",
    goals: ["Modéliser injection et exfiltration", "gVisor, egress allowlist", "Identifiants à durée courte"],
    sources: [
      { label: "Simon Willison, The lethal trifecta (juin 2025)", url: "https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/", essential: true },
      { label: "Anthropic, Making Claude Code safer with sandboxing (oct. 2025)", url: "https://www.anthropic.com/engineering/claude-code-sandboxing", essential: true },
      { label: "Design Patterns for Securing LLM Agents against Prompt Injections (2025)", url: "https://arxiv.org/abs/2506.08837", essential: true },
      { label: "IFTTD #360 : Docker Sandbox, avec Guillaume Lours", url: "https://www.ifttd.io/episodes/docker-sandbox", note: "podcast FR" },
      { label: "kubernetes-sigs/agent-sandbox", url: "https://github.com/kubernetes-sigs/agent-sandbox" },
    ],
    lab: { title: "Sandbox d'agent sur k3s", deliverable: "Pod gVisor, egress restreint, rapport de red-team" },
    validation: ["Une injection ne parvient pas à exfiltrer", "Les identifiants expirent en moins d'une heure"],
  },
  {
    id: "H6",
    track: "harness",
    month: 6,
    title: "Long-running & multi-agent",
    pitch: "Faire avancer un agent sur un projet plus grand qu'une fenêtre de contexte.",
    goals: ["Artefacts de handoff entre sessions", "Générateur et évaluateur séparés"],
    sources: [
      { label: "Anthropic, Effective harnesses for long-running agents (nov. 2025)", url: "https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents", essential: true },
      { label: "Anthropic, Harness design for long-running apps (mars 2026)", url: "https://www.anthropic.com/engineering/harness-design-long-running-apps", essential: true },
      { label: "Cognition, Don't build multi-agents (juin 2025), le contre-point", url: "https://cognition.com/blog/dont-build-multi-agents", essential: true },
      { label: "Anthropic, Multi-agent research system (juin 2025)", url: "https://www.anthropic.com/engineering/multi-agent-research-system" },
    ],
    lab: { title: "Agent longue durée sur un vrai projet", deliverable: "Une feature livrée sur plusieurs sessions, avec puis sans évaluateur" },
    validation: ["Plus de 5 sessions sans réexpliquer le contexte", "L'évaluateur a rejeté au moins un livrable"],
  },
  {
    id: "C1",
    track: "convergence",
    month: 7,
    title: "Une plateforme pour agents",
    pitch: "Le harness devient un produit de plateforme : isolé, observé, budgété.",
    goals: ["Une ressource AgentTask (repo, consigne, budget, permissions)", "Traces OTel GenAI et coût par tâche", "Évals du harness en CI"],
    sources: [
      { label: "OpenTelemetry, GenAI semantic conventions", url: "https://github.com/open-telemetry/semantic-conventions-genai", essential: true },
      { label: "kubernetes-sigs/agent-sandbox", url: "https://github.com/kubernetes-sigs/agent-sandbox", essential: true },
      { label: "IFTTD #384 : Usine logicielle 100 % AI, avec Nikolay Rodionov", url: "https://www.ifttd.io/episodes/usine-logicielle-100-ai", essential: true, note: "podcast FR" },
      { label: "IFTTD #382 : Rapprocher la CI, avec Yves Brissaud", url: "https://www.ifttd.io/episodes/rapprocher-la-ci", note: "podcast FR" },
    ],
    lab: { title: "Agent platform sur k3s", deliverable: "CRD AgentTask, dashboard de coûts, gate d'évals en CI" },
    validation: ["Une tâche d'agent se lance en self-service", "Une régression d'évals bloque le merge"],
  },
  {
    id: "C2",
    track: "convergence",
    month: 8,
    title: "Agent d'exploitation",
    pitch: "Un agent de triage d'incident, évalué sur mes vrais post-mortems.",
    goals: ["Diagnostic en lecture seule", "Post-mortems réels comme jeu d'évals", "Autonomie par paliers"],
    sources: [
      { label: "Google SRE, Effective Troubleshooting", url: "https://sre.google/sre-book/effective-troubleshooting/", essential: true },
      { label: "Anthropic, Building effective agents", url: "https://www.anthropic.com/engineering/building-effective-agents" },
    ],
    lab: { title: "Agent de triage", deliverable: "Score de l'agent sur 3 incidents réels rejoués" },
    validation: ["L'agent retrouve la cause racine", "Aucune action destructrice automatique"],
  },
];

export interface Overlap {
  concern: string;
  platform: string;
  harness: string;
  modules: string[];
}

export const overlaps: Overlap[] = [
  { concern: "Interface", platform: "API de plateforme, CRD", harness: "Schémas d'outils, MCP", modules: ["P2", "H2"] },
  { concern: "Garde-fous", platform: "Kyverno, RBAC, NetworkPolicy", harness: "Permissions d'outils, sandbox", modules: ["P5", "H5"] },
  { concern: "Feedback", platform: "CI, environnements de preview", harness: "Tests et vérificateurs dans la boucle", modules: ["P4", "H6"] },
  { concern: "Mesure", platform: "DORA, SLO", harness: "Évals, taux de réussite", modules: ["P6", "H4"] },
  { concern: "Charge cognitive", platform: "Golden paths", harness: "Context engineering", modules: ["P4", "H3"] },
  { concern: "Isolation", platform: "Namespaces, VM", harness: "gVisor, microVM, egress allowlist", modules: ["P5", "H5"] },
];
