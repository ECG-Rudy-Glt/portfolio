// Titres, résumés et périodes des projets en anglais (les fiches détaillées restent en français).
export const projectsEn: Record<string, { title: string; summary: string; period: string }> = {
  "3dokr": {
    title: "3DOKR - Docker Swarm orchestration",
    summary: "A Docker Swarm cluster deployable three ways: automated with Vagrant, manually on 3 VMs, or locally with Docker Compose.",
    period: "SUPINFO - 3rd year",
  },
  "4agql-proj": {
    title: "SchoolInc - School management on GraphQL microservices",
    summary: "A school management app (students, classes, grades) built on 3 independent GraphQL microservices, stitched together with GraphQL Mesh.",
    period: "SUPINFO - 4th year",
  },
  "4arcl": {
    title: "4ARCL - FlyAway Airlines architecture",
    summary: "Design of a full architecture (frontend, backend, data, storage) for an airline serving millions of users, with SLO and compliance requirements.",
    period: "SUPINFO - 4th year",
  },
  "4kube": {
    title: "4KUBE - Highly available Kubernetes cluster",
    summary: "Deployment of a microservices application (FleetMan, real-time GPS tracking) on a 3-node Kubernetes cluster with high availability.",
    period: "SUPINFO - 4th year",
  },
  "4webd-ticket": {
    title: "TicketApp - Highly available ticketing SaaS",
    summary: "An event ticketing SaaS designed to absorb a small school event as well as an international tour, with no overselling and no downtime on payments.",
    period: "SUPINFO - 4th year",
  },
  "bts-sio": {
    title: "BTS SIO - First projects",
    summary: "Three end-of-BTS projects (static portfolio, medical visit management, rental management): the starting point of my journey, graded 15.5/20.",
    period: "BTS SIO",
  },
  "cloud-temple": {
    title: "Work-study at Cloud Temple - Infrastructure & Automation",
    summary: "Three-year work-study contract at Cloud Temple: ESXi/Ansible automation, large-scale network monitoring (~1,000 devices) and AIOps (AI applied to CI/CD and reporting).",
    period: "2024 - Sept. 2027 (planned)",
  },
  coach: {
    title: "COACH - Self-hosted open source sports coach",
    summary: "A self-hosted app for multisport training plans and nutrition suggestions: a deterministic rules engine that cites its sources, an optional LLM coach constrained by server-side validation, Garmin sync and an installable PWA. Free and open source (AGPL-3.0).",
    period: "2026 - ongoing",
  },
  "ethan-consulting": {
    title: "Work-study at Ethan Consulting - First steps in development",
    summary: "First work-study contract, during the BTS SIO SLAM: a medical-oriented crawler in TypeScript/Node.js, database modelling, and in-house advice on building a website.",
    period: "2022 - 2024",
  },
  homelab: {
    title: "Homelab - Self-hosted infrastructure",
    summary: "A personal production infrastructure: 2 Proxmox nodes and an OPNsense firewall, 4 VLANs, internal PKI, SSO, full observability and a Jellyfin streaming stack, all driven as Infrastructure as Code.",
    period: "2026 - ongoing",
  },
  "ops-delivery-suite": {
    title: "Ops Delivery Suite - DevOps toolbox",
    summary: "A suite of 13 standalone DevOps tools: Ansible hardening, CI/CD templates, encrypted backups, Trivy security audits, Traefik reverse proxy, monitoring and runner provisioning.",
    period: "2025 - ongoing",
  },
  patrimoine: {
    title: "Patrimoine - Self-hosted wealth tracking with a sourced AI advisor",
    summary: "A self-hosted wealth tracking app for a household: accounts aggregated through the official PSD2 APIs, budget, investments, taxes, alerts and reports, with figures computed by deterministic services and an AI advisor whose every citation is verified by the server. Open source (Apache 2.0), under construction.",
    period: "2026 - ongoing",
  },
  "plateforme-automatisation": {
    title: "Internal automation platform - Portal & microservices",
    summary: "Unifying some twenty isolated automation tools (audit, monitoring, reporting, AI) behind a single web portal: secured edge, SSO, containerised microservices and a hardened CI/CD chain.",
    period: "2025 - 2026 (ongoing)",
  },
  relai: {
    title: "Relai - Handing over between humans and AI agents",
    summary: "A Go binary and git-versioned files to work with AI agents without rereading everything each session: deterministic resume summary, multi-repository view, shared conventions checked in CI, a guide for agents. Optional team board as a separate project. Open source, version 0.x.",
    period: "2026 - ongoing",
  },
  "rudy-ops": {
    title: "rudy-ops.fr - Freelance DevOps/DevSecOps showcase site",
    summary: "Showcase and contact site for my freelance activity (DevOps, Platform Engineering, DevSecOps): Astro/React frontend, Flask backend with an AI quoting assistant, Vikunja integration, deployed through CI/CD on my homelab.",
    period: "2026 - ongoing",
  },
  supchat: {
    title: "SUPCHAT - Communication platform",
    summary: "A real-time cross-platform chat platform (web, iOS, Android) with built-in Mistral AI, workspaces, file sharing and push notifications.",
    period: "SUPINFO - 3rd year",
  },
  supfile: {
    title: "SUPFile - Sovereign cloud storage",
    summary: "A French alternative to Dropbox/Drive: end-to-end encryption, vault, advanced sharing, MFA and an embedded document AI (Bobby), on web, mobile and desktop.",
    period: "SUPINFO - 4th year",
  },
  "supinfo-formation": {
    title: "SUPINFO - 3rd & 4th year curriculum",
    summary: "Modules taken in the 3rd and 4th years at SUPINFO: multi-cloud (Azure, GCP), networking (CCNA), Linux, application security, mobile, NoSQL/Big Data and project management.",
    period: "SUPINFO - 3rd & 4th year",
  },
  "supinfo-lab": {
    title: "SUPINFO Lab - Collaborative teaching lab",
    summary: "A personal initiative: designing and building a physical IT lab on the SUPINFO Tours campus so students can practise infrastructure end to end.",
    period: "2026 - ongoing",
  },
};

export const enProject = (id: string, fr: { title: string; summary: string; period: string }) => projectsEn[id] ?? fr;
