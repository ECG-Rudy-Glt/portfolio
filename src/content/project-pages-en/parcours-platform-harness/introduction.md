---
project: parcours-platform-harness
title: "Introduction: two converging roles"
summary: "Platform engineer and harness engineer: what each does, what they share, and the eight-month plan."
group: "Start"
order: 0
---

## The path at a glance

Two tracks run **in parallel**, one week each, then converge:

| Month | Platform | Harness |
|---|---|---|
| M1 | [P1: Platform as a product](/en/projets/parcours-platform-harness/p1-platform-as-product/) | [H1: LLM API & fundamentals](/en/projets/parcours-platform-harness/h1-llm-api-fondamentaux/) |
| M2 | [P2: Kubernetes in depth & advanced GitOps](/en/projets/parcours-platform-harness/p2-kubernetes-gitops/) | [H2: Agent loop & tool design (ACI, MCP, skills)](/en/projets/parcours-platform-harness/h2-boucle-agent-outils/) |
| M3 | [P3: IaC & control planes](/en/projets/parcours-platform-harness/p3-iac-control-planes/) | [H3: Context engineering](/en/projets/parcours-platform-harness/h3-context-engineering/) |
| M4 | [P4: Internal Developer Portal & golden paths](/en/projets/parcours-platform-harness/p4-idp-golden-paths/) | [H4: Agent evals](/en/projets/parcours-platform-harness/h4-evals/) |
| M5 | [P5: Security, policy as code & supply chain](/en/projets/parcours-platform-harness/p5-securite-supply-chain/) | [H5: Agent sandboxing & security](/en/projets/parcours-platform-harness/h5-sandboxing-securite/) |
| M6 | [P6: Observability & SRE](/en/projets/parcours-platform-harness/p6-observabilite-sre/) | [H6: Long-running & multi-agent](/en/projets/parcours-platform-harness/h6-long-running-multi-agent/) |
| M7+ | [C1: A platform for running agents](/en/projets/parcours-platform-harness/c1-plateforme-agents/) | [C2: Homelab operations agent](/en/projets/parcours-platform-harness/c2-agent-ops/) |

Every module follows the same format: goals, key concepts, sources (🟢 read first, 🔵 go deeper, 📕 book, 🎧 podcast), a **lab on my homelab**, and a validation checklist. Every source was checked on 2026-11-22: see the [bibliography](/en/projets/parcours-platform-harness/bibliographie/).

## Platform Engineer

Builds and runs an **internal platform managed as a product**. It reduces the cognitive load on application teams through self-service golden paths.

Typical responsibilities:
- the platform API (CRDs, templates, IaC modules) and its contract with users;
- provisioning (clusters, network, databases, secrets) through declarative control planes;
- delivery (CI, GitOps, promotion between environments);
- default guardrails (policy as code, signed supply chain, secrets);
- observability, SLOs, on-call and post-mortems;
- measuring adoption and DevEx (DORA, SPACE, surveys).

## Harness Engineer

Designs **the environment around a model** so that an agent can carry out multi-step work reliably.

Typical responsibilities:
- the **agent loop**: model calls, tool execution, handling errors and stops;
- **tools**: agent-computer interface (ACI), MCP, schemas, useful error messages;
- **context**: system prompt, instruction files, retrieval, compaction, memory;
- **feedback loops**: tests, linters and checkers the agent can run on its own;
- **evals**: task suites, graders, regression measurement between two harness versions;
- **sandboxing**: permissions, filesystem and network isolation, secrets handling;
- **long-running**: handoff between sessions, progress artifacts, multi-agent orchestration;
- **costs and observability**: tokens, latency, tool-call traces.

## Overlap

| Concern | Platform side | Harness side |
|---|---|---|
| Interface | Platform API, CRDs | Tool schemas, MCP |
| Guardrails | Kyverno, RBAC, NetworkPolicy | Tool permissions, sandbox |
| Feedback | CI, preview envs | Tests and checkers in the loop |
| Measurement | DORA, SLOs | Evals, task success rate |
| Cognitive load | Golden paths | Context engineering |
| Isolation | Namespaces, VMs | gVisor, microVMs, egress allowlist |

## Cross-cutting sources

- 🟢 [CNCF, Platforms white paper](https://tag-app-delivery.cncf.io/whitepapers/platforms/)
- 🟢 [Thoughtworks, AI agent harness](https://www.thoughtworks.com/en-au/insights/blog/machine-learning-and-ai/ai-agent-harness)
- 🟢 [DigitalOcean, What is harness engineering?](https://www.digitalocean.com/resources/articles/what-is-harness-engineering)
- 🔵 [TechTarget, Agent harnesses as critical infrastructure](https://www.techtarget.com/it-infrastructure/tip/Harness-engineering-Agent-harnesses-as-critical-infrastructure)

## Exercise

Fill in the "Start" column of the self-assessment in [PROGRESSION.en.md](https://github.com/ECG-Rudy-Glt/Learning_path_plateform-harness_inge/blob/main/PROGRESSION.en.md). Then, for each row rated 2 or below, write one sentence on what is missing.
