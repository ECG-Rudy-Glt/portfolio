---
project: parcours-platform-harness
title: "H3 — Context engineering"
summary: "Le contexte est une ressource finie : chaque token doit mériter sa place."
order: 9
---

## Objectifs
- Traiter le contexte comme une ressource finie : chaque token doit mériter sa place.
- Organiser l'information en couches : système, fichiers d'instructions (`CLAUDE.md` / `AGENTS.md`), skills, récupération just-in-time, mémoire.
- Maîtriser compaction, notes structurées et sous-agents pour isoler le contexte.

## Concepts clés
Context rot, « right data, right place, right time », divulgation progressive, compaction contre reset, mémoire fichier, sous-agents comme espaces de contexte jetables, réduction du bruit des sorties d'outils.

## Sources
- 🟢 [Anthropic — Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- 🟢 🇫🇷 [IFTTD #383 — *Contexte Engineering : Dresser ses agents IA*, avec Florian Bruniaux (4 nov. 2026)](https://www.ifttd.io/episodes/contexte-engineering) ([vidéo](https://www.youtube.com/watch?v=Le5K1WheyBE)). Le context engineering y est défini comme la discipline englobante, et le harness engineering comme sa partie outillage et vérification. On y suit aussi le passage du harness local à la CI (coûts, sécurité, volume), puis la question de la relecture du code selon le risque. Citation : *« Il vaut mieux un très bon harnais et un modèle plus low cost qu'un très bon modèle avec un mauvais harnais. »*
- 🔵 [Claude Code Guide — Florian Bruniaux](https://cc.bruniaux.com), cité dans l'épisode
- 🔵 [RTK — proxy CLI qui compresse les sorties de commandes pour les LLM](https://github.com/rtk-ai/rtk), déjà en place dans mon setup ; voir aussi [IFTTD #375 — RTK : le coût du token, avec Patrick Szymkowiak](https://www.ifttd.io/episodes/rtk)
- 🔵 [Claude Code — Best practices](https://code.claude.com/docs/en/best-practices)
- 🔵 [OpenAI — Harness engineering (fév. 2026)](https://openai.com/index/harness-engineering/) : *« give Codex a map, not a 1,000-page instruction manual »*, un `AGENTS.md` d'environ 100 lignes qui sert de sommaire vers `docs/`
- 🔵 [Chroma — Context Rot](https://research.trychroma.com/context-rot)
- 🟢 [Manus — Context Engineering for AI Agents: Lessons from Building Manus](https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus) (Yichao « Peak » Ji, 18 juil. 2025) : le taux de hit du KV-cache comme métrique n° 1, ne pas ajouter ou retirer d'outils en cours de route, le système de fichiers comme contexte
- 🟢 [Lost in the Middle](https://arxiv.org/abs/2307.03172) (Liu et al., 2023) : un modèle exploite mieux l'information placée au début ou à la fin du contexte qu'au milieu

## Lab homelab

**L-H3 — Contexte & mémoire de mes agents**

### Étapes
1. Auditer `HOMELAB/CLAUDE.md`, `~/.claude/CLAUDE.md` et la mémoire auto : pour chaque ligne, se demander si elle est utile à chaque session, à la demande seulement (à déplacer dans une skill), ou jamais (à supprimer).
2. Mesurer RTK : la même session type (diagnostic Flux) avec et sans proxy, en comparant tokens consommés et résultat.
3. Tester la compaction contre un reset avec fichier de progression, sur une tâche longue.
4. Réécouter [IFTTD #383](https://www.ifttd.io/episodes/contexte-engineering) et confronter ses recommandations à ton setup, par écrit.

### Livrable
CLAUDE.md allégé (diff), mesure RTK, fiche de lecture IFTTD dans `notes/`.

## Validation
- [ ] Mon `CLAUDE.md` du HOMELAB a été audité : chaque ligne est justifiée ou supprimée.
- [ ] J'ai mesuré l'effet de RTK (tokens avant/après) sur une session type.
- [ ] Je sais quand lancer un sous-agent plutôt que tout faire dans le contexte principal.
