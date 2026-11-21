---
title: "Relai - Passer le relais entre humains et agents IA"
category: perso
summary: "Binaire Go et fichiers versionnés dans git pour travailler avec des agents IA sans tout relire à chaque session : résumé de reprise déterministe, vue de plusieurs dépôts, conventions partagées vérifiées en CI, guide pour les agents. Tableau d'équipe optionnel en projet séparé. Open source, version 0.x."
period: "2026 - en cours"
role: "Conception, développement, tests avec de vrais agents et publication open source en solo"
stack: ["Go", "Git", "MCP", "Docker", "OpenSpec", "Beads", "GitHub Actions"]
tags: ["IA / Assistant conversationnel", "CI/CD", "Docker", "Git", "Sites web", "Tests automatisés", "Multi-agents", "Agents IA", "Claude Code"]
links:
  repo: "https://github.com/ECG-Rudy-Glt/RELAI"
  demo: "https://relai.gault-rudy.com"
featured: false
relevance: "pertinent"
order: 3
images: ["/projets/relai/fonctionnement.webp"]
---

## Le besoin

Une quinzaine de projets menés en parallèle avec des agents IA : chaque session repart à froid et
relit des dizaines de fichiers, les règles de travail dérivent d'un dépôt à l'autre, et on réécrit
parfois ce qu'un autre projet fournit déjà.

## La solution

- **`relai handoff`** : résumé de reprise déterministe (git, Beads ou GitHub Issues, OpenSpec,
  `.relai/notes.md`) dans un budget de tokens, avec un mode dégradé sans aucune de ces sources.
- **Plusieurs dépôts** : `relai find` (vérifier avant de construire), `relai workspace` (une page pour
  tous les projets), `relai discover --links` (les mentions entre dépôts, comme indices à confirmer).
- **Conventions partagées** : un dépôt hub épinglé à un tag, `relai sync` pour les recopier,
  `relai check` en CI pour détecter la dérive.
- **`relai init` et `relai guide`** : `AGENTS.md`, hook de début de session et Agent Skill, pour
  qu'un agent apprenne l'outil sans explication.
- **Relai-Team** (projet séparé, facultatif) : tableau partagé, réservations de tâches avec un bail
  qui expire, jetons par personne et outils MCP.

## Choix techniques

- Résumé **déterministe**, jamais écrit par un modèle ; les contradictions entre sources sont
  montrées, pas tranchées.
- Go, bibliothèque standard seule, un binaire statique ; analyseur écrit à la main pour le format
  contraint de `relai.yaml`.
- S'appuie sur des standards existants (AGENTS.md, Agent Skills, OpenSpec, Beads) au lieu d'en créer
  un de plus ; pas un portail, tout passe par git.
- Contenu du hub traité comme non fiable, synchronisation à blanc par défaut.

## Résultat et limites

Version 0.x publiée sur GitHub, avec documentation en français et en anglais sur
[relai.gault-rudy.com](https://relai.gault-rudy.com). Évalué avec des agents Claude uniquement, sur
les dépôts d'un seul développeur : gain de 1,2 à 3,4 fois en dollars, et rien sur les dépôts sans
suivi de tâches. Pas d'audit par un tiers, Windows non vérifié. Voir l'article
[Relai : reprendre un projet avec un agent IA sans tout relire](/blog/relai/).

Code : [Relai](https://github.com/ECG-Rudy-Glt/RELAI) et [Relai-Team](https://github.com/ECG-Rudy-Glt/RELAI-TEAM).
