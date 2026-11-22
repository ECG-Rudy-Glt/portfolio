---
project: parcours-platform-harness
title: "H6 : Agents longue durée & multi-agent"
summary: "Faire avancer un agent sur un projet plus grand qu'une fenêtre de contexte."
group: "Track Harness"
order: 12
---

## Objectifs
- Faire progresser un agent sur un projet qui dépasse une fenêtre de contexte.
- Concevoir les artefacts de handoff : liste de features en JSON (`"passes": false`), `claude-progress.txt`, `init.sh`, historique git.
- Séparer générateur et évaluateur, et orchestrer des sous-agents en parallèle.

## Concepts clés
Deux générations de harness, à ne pas confondre :
- **Nov. 2025** (*Effective harnesses*) : un *initializer agent* prépare l'environnement (plus de 200 features en JSON, car le modèle réécrit moins volontiers un JSON qu'un Markdown), puis un *coding agent* avance feature par feature et commit. Les deux ont le même harness et ne diffèrent que par le prompt initial. **Il n'y a pas d'évaluateur séparé.**
- **Mars 2026** (*Harness design*) : trois agents (**planner**, **generator**, **evaluator**). L'évaluateur teste via Playwright MCP, avec des critères notés et calibrés par few-shot. Le document décrit aussi la *context anxiety* (le modèle bâcle quand il croit approcher sa limite de contexte), et les *context resets* contre la compaction. Avec Opus 4.5, les resets ont pu être retirés au profit de la compaction automatique.

Autres notions : orchestrateur-workers, coût multi-agent.

## Sources
- 🟢 [Anthropic, Effective harnesses for long-running agents (Justin Young, 26 nov. 2025)](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- 🟢 [Anthropic, Harness design for long-running application development (Prithvi Rajasekaran, 24 mars 2026)](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- 🟢 [OpenAI, Harness engineering: leveraging Codex in an agent-first world (Ryan Lopopolo, 11 fév. 2026)](https://openai.com/index/harness-engineering/) : humains qui pilotent et agents qui exécutent, repo comme système de référence, *« enforcing invariants, not micromanaging implementations »* (linters et tests structurels), agents de nettoyage en continu
- 🔵 [Anthropic, How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)
- 🔵 [InfoQ, Anthropic three-agent harness](https://www.infoq.com/news/2026/04/anthropic-three-agent-harness-ai/)
- 🔵 [mattpocock/skills, `handoff`, `to-spec`, `to-tickets`, `implement-spec`](https://github.com/mattpocock/skills/tree/main/skills), un pipeline spec → tickets → implémentation en skills
- 🟢 [Cognition, Don't Build Multi-Agents](https://cognition.com/blog/dont-build-multi-agents) (Walden Yan, 12 juin 2025) : le contre-point indispensable. Partager le contexte complet, car *« les actions portent des décisions implicites »* ; un agent linéaire mono-thread reste le choix par défaut
- 🔵 [Measuring AI Ability to Complete Long Software Tasks](https://arxiv.org/abs/2503.14499) (Kwa et al., NeurIPS 2025) : l'horizon de tâche à 50 % de réussite double environ tous les sept mois depuis 2019
- 🔵 [Reflexion](https://arxiv.org/abs/2303.11366) (Shinn et al., 2023) : l'agent s'améliore par auto-critique écrite gardée en mémoire, sans réentraînement
- 🎧 🇫🇷 [IFTTD #381 : AI Coding : réécrire des applications legacy, avec Quentin Pleplé (21 oct. 2026)](https://www.ifttd.io/episodes/ai-coding) : méthode en trois phases (spec, migration, Kaizen) et harness engineering

## Lab homelab

**L-H6 : Agent longue durée sur un vrai projet**

**But** : reproduire d'abord le schéma initializer + coding agent (Anthropic, nov. 2025), puis ajouter l'évaluateur séparé (Anthropic, mars 2026), sur un projet réel du backlog. Candidat possible : une feature du `patrimoine/TODO.md`, sur une branche.

### Étapes
1. Session d'init : spec, `features.json` (toutes `"passes": false`), `claude-progress.txt`, `init.sh` (démarrage + tests), commit initial.
2. Sessions de travail : une feature à la fois, commit, mise à jour de `claude-progress.txt`, et **reset** du contexte entre deux sessions.
3. Ajouter ensuite un agent évaluateur séparé (critères notés avec seuil, calibrés par few-shot, tests via Playwright), qui valide ou rejette chaque feature (tests E2E, captures).
4. Comparer avec et sans évaluateur, puis tester compaction contre reset. Mesurer le nombre de sessions, le coût, les rejets de l'évaluateur et les retouches humaines.

### Livrable
Feature livrée, artefacts de handoff versionnés, retour d'expérience dans `notes/`.

## Validation
- [ ] Un agent a livré un projet sur plus de 5 sessions, sans que j'aie à réexpliquer le contexte.
- [ ] L'évaluateur séparé a rejeté au moins un livrable que le générateur jugeait fini.
- [ ] Coût total, temps et taux de retouche humaine sont mesurés.
