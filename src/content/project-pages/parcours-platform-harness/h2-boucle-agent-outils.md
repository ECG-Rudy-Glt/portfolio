---
project: parcours-platform-harness
title: "H2 — Boucle d'agent & conception d'outils (ACI, MCP, skills)"
summary: "Concevoir des outils pour un agent : ACI, MCP, skills."
order: 8
---

## Objectifs
- Écrire une boucle d'agent robuste : erreurs d'outils, timeouts, limite de tours, interruption.
- Concevoir des outils pour un agent plutôt que pour un humain : nommage, granularité, erreurs actionnables, pagination.
- Exposer des capacités via MCP, et empaqueter du savoir-faire en **skills**.

## Concepts clés
Agent-Computer Interface (ACI), outils « poka-yoke », réponses concises plutôt qu'exhaustives, MCP (tools, resources, prompts, transports), skills (instructions chargées à la demande, divulgation progressive), permissions par outil.

## Sources
- 🟢 [Anthropic — Writing effective tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents)
- 🟢 [Model Context Protocol — spec & docs](https://modelcontextprotocol.io/)
- 🟢 [SWE-agent : Agent-Computer Interfaces (Yang et al., 2024)](https://arxiv.org/abs/2405.15793) : la preuve que l'interface change le résultat à modèle constant
- 🟢 [mattpocock/skills — *Skills for Real Engineers*](https://github.com/mattpocock/skills) : skills petites et composables (`tdd`, `diagnosing-bugs`, `to-spec`, `handoff`, `writing-for-agents`, `git-guardrails-claude-code`…). À lire comme des **exemples de conception de contexte et d'outils**, et à comparer avec les frameworks qui « possèdent le process » (GSD, BMAD, Spec-Kit).
- 🔵 [12-Factor Agents (HumanLayer)](https://github.com/humanlayer/12-factor-agents)
- 🔵 [Anthropic — Agent Skills](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview)
- 🟢 [Simon Willison — Designing agentic loops](https://simonwillison.net/2025/Sep/30/designing-agentic-loops/) (30 sept. 2025) : un agent, c'est des outils dans une boucle ; ça marche sur les problèmes à critère de succès clair, et en sandbox
- 🟢 [Anthropic — Code execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp) (A. Jones, C. Kelly, 4 nov. 2025) : exposer les serveurs MCP comme du code pour ne charger que les outils utiles ; 150 000 → 2 000 tokens dans leur exemple
- 🔵 [Anthropic — Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) (16 oct. 2025) : `SKILL.md`, divulgation progressive, n'installer que des skills de confiance
- 🔵 [CodeAct — Executable Code Actions Elicit Better LLM Agents](https://arxiv.org/abs/2402.01030) (Wang et al., ICML 2024) : du code Python comme espace d'actions, jusqu'à +20 % de réussite
- 🔵 [Agentless](https://arxiv.org/abs/2407.01489) (Xia et al., 2024) : un pipeline fixe localisation → réparation → validation, sans agent autonome, bat les agents open source de l'époque sur SWE-bench Lite. À relire avant de complexifier un harness

## Lab homelab

**L-H2 — Serveur MCP du homelab & skills**

**But** : revoir le serveur MCP homelab existant avec les principes de [Writing effective tools for agents](https://www.anthropic.com/engineering/writing-tools-for-agents).

### Étapes
1. Inventorier les outils exposés : nom, description, granularité, taille des réponses.
2. Pour chaque outil, vérifier : est-il nommé par intention ? les réponses sont-elles paginées ou tronquées ? les erreurs sont-elles actionnables ? les opérations dangereuses sont-elles séparées ?
3. Ajouter des outils de haut niveau (`app_status(app)`, qui agrège pods, Flux et dernier déploiement) plutôt que d'exposer `kubectl` brut.
4. Mettre le MCP derrière Authentik, avec des scopes read et write séparés.
5. Écrire 2 skills perso (ex. `homelab-deploy-check`, qui suit la mémoire « vérifier le rollout avant d'annoncer », et `postmortem`), en t'inspirant de la structure de [mattpocock/skills](https://github.com/mattpocock/skills).

### Livrable
MCP refactoré, avant/après mesuré sur 5 tâches, 2 skills dans `~/.claude/skills`.

## Validation
- [ ] Chaque outil a une description testée : l'agent l'utilise correctement sans exemple.
- [ ] Les messages d'erreur disent à l'agent quoi faire ensuite.
- [ ] J'ai écrit au moins 2 skills perso, en m'inspirant de `mattpocock/skills`, et je les utilise vraiment.
