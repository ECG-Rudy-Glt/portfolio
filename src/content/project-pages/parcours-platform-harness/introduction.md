---
project: parcours-platform-harness
title: "Introduction : deux métiers qui convergent"
summary: "Platform engineer et harness engineer : ce que fait chacun, ce qu'ils partagent, et le plan sur huit mois."
group: "Démarrer"
order: 0
---

## Le parcours en un coup d'œil

Deux tracks avancent **en parallèle**, une semaine chacun, puis convergent :

| Mois | Platform | Harness |
|---|---|---|
| M1 | [P1 : Platform as a product](/projets/parcours-platform-harness/p1-platform-as-product/) | [H1 : API LLM & fondamentaux](/projets/parcours-platform-harness/h1-llm-api-fondamentaux/) |
| M2 | [P2 : Kubernetes en profondeur & GitOps avancé](/projets/parcours-platform-harness/p2-kubernetes-gitops/) | [H2 : Boucle d'agent & conception d'outils (ACI, MCP, skills)](/projets/parcours-platform-harness/h2-boucle-agent-outils/) |
| M3 | [P3 : IaC & control planes](/projets/parcours-platform-harness/p3-iac-control-planes/) | [H3 : Context engineering](/projets/parcours-platform-harness/h3-context-engineering/) |
| M4 | [P4 : Internal Developer Portal & golden paths](/projets/parcours-platform-harness/p4-idp-golden-paths/) | [H4 : Évals d'agents](/projets/parcours-platform-harness/h4-evals/) |
| M5 | [P5 : Sécurité, policy as code & supply chain](/projets/parcours-platform-harness/p5-securite-supply-chain/) | [H5 : Sandboxing & sécurité des agents](/projets/parcours-platform-harness/h5-sandboxing-securite/) |
| M6 | [P6 : Observabilité & SRE](/projets/parcours-platform-harness/p6-observabilite-sre/) | [H6 : Agents longue durée & multi-agent](/projets/parcours-platform-harness/h6-long-running-multi-agent/) |
| M7+ | [C1 : Une plateforme pour faire tourner des agents](/projets/parcours-platform-harness/c1-plateforme-agents/) | [C2 : Agent d'exploitation du homelab](/projets/parcours-platform-harness/c2-agent-ops/) |

Chaque module suit le même format : objectifs, concepts clés, sources (🟢 à lire en premier, 🔵 pour approfondir, 📕 livre, 🎧 podcast), un **lab sur mon homelab**, et une checklist de validation. Toutes les sources ont été vérifiées le 22/11/2026 : voir la [bibliographie](/projets/parcours-platform-harness/bibliographie/).

## Platform Engineer

Construit et opère une **plateforme interne gérée comme un produit**. Elle réduit la charge cognitive des équipes applicatives grâce à des chemins pavés (golden paths) en self-service.

Les responsabilités types :
- l'API de la plateforme (CRD, templates, modules IaC) et son contrat avec les utilisateurs ;
- le provisioning (clusters, réseau, bases, secrets) par control planes déclaratifs ;
- la delivery (CI, GitOps, promotion entre environnements) ;
- des garde-fous par défaut (policy as code, supply chain signée, secrets) ;
- l'observabilité, les SLO, l'astreinte et les post-mortems ;
- la mesure de l'adoption et de la DevEx (DORA, SPACE, enquêtes).

## Harness Engineer

Conçoit **l'environnement autour d'un modèle** pour qu'un agent accomplisse un travail multi-étapes de façon fiable. La documentation est rédigée en français, mais le vocabulaire reste celui des sources, souvent anglais.

Les responsabilités types :
- la **boucle d'agent** : appels modèle, exécution d'outils, gestion des erreurs et des arrêts ;
- les **outils** : interface agent-machine (ACI), MCP, schémas, messages d'erreur utiles ;
- le **contexte** : prompt système, fichiers d'instructions, récupération, compaction, mémoire ;
- les **feedback loops** : tests, linters et vérificateurs que l'agent peut lancer lui-même ;
- les **évals** : jeux de tâches, graders, mesure de régression entre deux versions du harness ;
- le **sandboxing** : permissions, isolation du système de fichiers et du réseau, gestion des secrets ;
- le **long-running** : handoff entre sessions, artefacts de progression, orchestration multi-agent ;
- les **coûts et l'observabilité** : tokens, latence, traces des appels d'outils.

## Recouvrement

| Préoccupation | Côté plateforme | Côté harness |
|---|---|---|
| Interface | API de plateforme, CRD | Schémas d'outils, MCP |
| Garde-fous | Kyverno, RBAC, NetworkPolicy | Permissions d'outils, sandbox |
| Feedback | CI, preview envs | Tests et vérificateurs dans la boucle |
| Mesure | DORA, SLO | Évals, taux de réussite des tâches |
| Charge cognitive | Golden paths | Context engineering |
| Isolation | Namespaces, VM | gVisor, microVM, egress allowlist |

## Sources transverses

- 🟢 [CNCF, Platforms white paper](https://tag-app-delivery.cncf.io/whitepapers/platforms/)
- 🟢 [Thoughtworks, AI agent harness](https://www.thoughtworks.com/en-au/insights/blog/machine-learning-and-ai/ai-agent-harness)
- 🟢 [DigitalOcean, What is harness engineering?](https://www.digitalocean.com/resources/articles/what-is-harness-engineering)
- 🔵 [TechTarget, Agent harnesses as critical infrastructure](https://www.techtarget.com/it-infrastructure/tip/Harness-engineering-Agent-harnesses-as-critical-infrastructure)

## Exercice

Remplir la colonne « Départ » de l'auto-évaluation dans [PROGRESSION.md](https://github.com/ECG-Rudy-Glt/Learning_path_plateform-harness_inge/blob/main/PROGRESSION.md). Ensuite, pour chaque ligne notée 2 ou moins, écrire en une phrase ce qui manque.
