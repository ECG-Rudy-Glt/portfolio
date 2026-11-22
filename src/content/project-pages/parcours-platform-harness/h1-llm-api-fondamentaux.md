---
project: parcours-platform-harness
title: "H1 : API LLM & fondamentaux"
summary: "Ce qui se passe dans un appel : tokens, tool use, cache, raisons d'arrêt."
group: "Track Harness"
order: 7
---

## Objectifs
- Appeler un modèle par API : messages, système, streaming, tool use, prompt caching.
- Comprendre tokens, fenêtre de contexte, coûts et latence.
- Savoir pourquoi un modèle « hallucine » un appel d'outil, et comment le harness le rattrape.

## Concepts clés
Messages API, rôles, `tool_use` / `tool_result`, `stop_reason`, structured outputs, prompt caching, extended thinking, batch, rate limits, choix du modèle (coût / capacité).

## Sources
- 🟢 [Anthropic, Documentation API](https://docs.claude.com/)
- 🟢 [Anthropic, Tool use](https://docs.claude.com/en/docs/agents-and-tools/tool-use/overview)
- 🟢 [Anthropic, Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) : workflows vs agents, à relire souvent
- 🔵 [Lilian Weng, LLM Powered Autonomous Agents](https://lilianweng.github.io/posts/2023-06-23-agent/)
- 🔵 [ReAct (Yao et al., 2022)](https://arxiv.org/abs/2210.03629)
- 📕 *AI Engineering: Building Applications with Foundation Models*, Chip Huyen (O'Reilly, janv. 2025)

## Lab homelab

**L-H1 : Mini-agent en ~200 lignes**

**But** : écrire sa propre boucle sans framework, pour savoir ce que font Claude Code ou Codex sous le capot.

### Étapes
1. Python ou Go, SDK Anthropic, 3 outils : `read_file`, `run_command` (avec allowlist), `edit_file` (remplacement exact).
2. Boucle : appel → `tool_use` → exécution → `tool_result` (avec `is_error` si besoin) → répéter jusqu'à `end_turn` ou une limite de N tours.
3. Logger, à chaque tour, les tokens in/out, les tokens lus et écrits en cache, et le coût.
4. Tâche test : « ajoute un test unitaire manquant dans un petit repo jouet et fais-le passer ».
5. Faire varier la description des outils et observer l'effet sur le résultat.

### Livrable
Repo `mini-agent`, journal des expériences dans `notes/`.

## Validation
- [ ] Je sais lire une réponse brute et dire pourquoi le modèle s'est arrêté.
- [ ] Mon script mesure les tokens et le coût de chaque tour.
- [ ] Le prompt caching est activé, et j'en ai mesuré le gain.
