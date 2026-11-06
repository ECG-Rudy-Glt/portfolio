---
title: "Relai - Passer le relais entre humains et agents IA"
category: perso
summary: "Contrat de dépôt, résumé de reprise compact et vue de tous mes projets pour travailler avec des agents IA sans tout relire à chaque session ; plus un tableau d'équipe optionnel qui évite que deux agents prennent la même tâche. Open source, sans serveur."
period: "2026 - en cours"
role: "Conception, développement, tests avec de vrais agents et publication open source en solo"
stack: ["Go", "Git", "MCP", "Docker", "OpenSpec", "Beads", "GitHub Actions"]
tags: ["IA / Assistant conversationnel", "CI/CD", "Docker", "Git"]
links:
  repo: "https://github.com/ECG-Rudy-Glt/RELAI"
  demo: "https://relai.gault-rudy.com"
featured: false
relevance: "pertinent"
order: 3
---

## Le besoin

Une quinzaine de projets menés en parallèle avec des agents IA : chaque session repart à froid et
relit des dizaines de fichiers, et deux sessions peuvent écrire en même temps dans le même dépôt.

## La solution

- **Relai** (CLI en Go, un seul binaire, sans serveur) : contrat de dépôt (`AGENTS.md`,
  `relai.yaml`, notes), résumé de reprise généré et plafonné à environ 2 000 tokens
  (`relai handoff`), vue de tous les projets (`relai workspace`), index « vérifier avant de
  construire » (`relai find`).
- **Relai-Team** : tableau en direct et registre de réservation de tâches, avec baux qui expirent,
  jetons par personne et outils MCP pour les agents. Séparé de Relai pour que celui-ci reste
  « git seulement ».

## Choix techniques

- Résumé **déterministe** (git, tâches, specs), jamais écrit par un modèle ; les contradictions
  entre sources sont montrées, pas tranchées.
- S'appuie sur des standards existants (AGENTS.md, Beads, OpenSpec) au lieu de les remplacer.
- Journal d'événements en ajout seul plutôt qu'une base de données ; reprise automatique après
  crash par expiration des réservations.
- Testé avec de vrais agents, y compris un test adversarial qui a révélé des défauts corrigés
  depuis (journal corrompu après un disque plein, deux serveurs sur le même journal).

## Résultat et limites

Version 0.x publiée sur GitHub, avec documentation en français et en anglais sur
[relai.gault-rudy.com](https://relai.gault-rudy.com). Les gains en tokens sont mesurés une fois par cas et
restent des indications ; le tableau d'équipe apporte peu à une seule personne. Voir l'article
[Relai : reprendre un projet avec un agent IA sans tout relire](/blog/relai/).

Site et documentation (français et anglais) : [relai.gault-rudy.com](https://relai.gault-rudy.com). Code : [Relai](https://github.com/ECG-Rudy-Glt/RELAI) et [Relai-Team](https://github.com/ECG-Rudy-Glt/RELAI-TEAM).
