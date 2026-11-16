---
title: "Relai : reprendre un projet avec un agent IA sans tout relire"
summary: "Relai est un binaire Go et des fichiers versionnés dans git : un résumé de reprise déterministe, une vue de plusieurs dépôts, des conventions partagées vérifiées en CI et, en option, un tableau d'équipe. Ce que fait chaque commande, pourquoi ce choix, ce que j'ai mesuré et ce qui n'est pas prouvé."
date: 2026-11-16
tags: ["IA / Assistant conversationnel", "Open source", "Git", "Outillage"]
type: article
cover: "/sites/relai.webp"
---

## Le problème

Je travaille avec des agents IA sur une quinzaine de dépôts : mon [homelab](/projets/homelab/), des
applications comme [COACH](/projets/coach/), mon site de freelance, ce portfolio. Chaque nouvelle
session repart à froid. L'agent relit des dizaines de fichiers pour savoir où en est le projet,
parfois en se trompant. Un exemple concret : une liste de tâches périmée lui indique qu'une
migration reste à faire alors qu'elle est déjà fusionnée, et il propose de la refaire.

Avec plusieurs dépôts et plusieurs agents, cela s'aggrave : on réécrit ce qu'un autre projet fournit
déjà, les règles de travail dérivent d'un dépôt à l'autre, et deux sessions peuvent prendre la même
tâche sans le savoir.

## L'idée

[Relai](https://relai.gault-rudy.com) est un **binaire unique** (Go, bibliothèque standard,
licence Apache 2.0) et des **fichiers versionnés avec le code**. Rien n'est généré par un modèle
de langage, il n'y a pas de serveur, et git suffit à une personne seule. Relai ne remplace
rien : il s'appuie sur `AGENTS.md`, les Agent Skills, OpenSpec et Beads, que j'utilisais déjà.

![Architecture de Relai : un dépôt lu par le binaire relai, qui produit le résumé de reprise et le guide de l'agent, puis trois couches facultatives : plusieurs dépôts, conventions partagées, serveur Relai-Team](/articles/relai/architecture.svg)

Le schéma distingue les fichiers (cadres clairs), les commandes (pastilles brunes) et ce qui est
facultatif (pointillés).

## Les fonctionnalités maîtresses

### 1. Un résumé de reprise déterministe : `relai handoff`

La commande lit le dépôt et imprime l'état du travail dans un budget de tokens (2 000 par défaut,
`--json` pour les outils). Elle lit git, les tâches (Beads, ou GitHub Issues si `relai.yaml` contient
`tasks: github`), les changements OpenSpec et `.relai/notes.md`. Sans aucune de ces sources, elle
retombe en **mode dégradé** : l'historique git et les marqueurs `TODO:` donnent déjà quelque chose
d'utile.

![Du hook de session au texte lu par l'agent : sources lues en lecture seule, budget de tokens](/articles/relai/handoff-flow.svg)

Voici un extrait réel, lancé sur le dépôt de Relai :

```text
# Handoff — RELAI
## State
Branch `main` at 0267b05 2026-11-16. Uncommitted files: 1.
## Tasks
Ready (unblocked, 16 total):
- `relai-a7o` P0 Phase 1 — repo contract v0.1 + handoff
## Active changes (specs)
- `shared-conventions-hub` 4/5 tasks (in-progress)
  next: One end-to-end run by hand, recorded in the pull request
```

Pourquoi déterministe ? Parce qu'un résumé faux est pire que pas de résumé. Quand deux sources se
contredisent (une tâche ouverte qu'un commit dit terminée), le résumé montre les deux et dit de
vérifier, au lieu de trancher. Cette règle vient d'un essai où un petit modèle a fait confiance à
une liste de tâches périmée et s'est arrêté, sûr de lui, sur une mauvaise réponse. Le résumé ne
modifie rien dans le dépôt, retire les caractères de contrôle et présente le texte du dépôt comme
une donnée, pas comme une instruction.

### 2. Plusieurs dépôts sans doublon : `relai find`, `relai workspace`, `relai discover --links`

Chaque dépôt déclare dans `relai.yaml` ce qu'il fournit et ce qu'il consomme.
`relai index build` rassemble ces manifestes dans `.relai/index.json`. Ensuite :

- `relai find <capacité>` répond à « un autre projet fournit-il déjà cela ? » avant d'écrire un doublon ;
- `relai workspace` donne en une page la dernière activité, le travail ouvert et ce que fournit chaque
  projet, à partir des fichiers seuls (sans lancer `bd`) ;
- `relai discover --links <dossier>` repère les mentions d'un dépôt dans un autre.

Une mention est un **indice, jamais un lien déclaré**. La commande propose, une personne vérifie,
et rien n'est écrit sans elle. J'ai mesuré pourquoi : sur mes propres dépôts, les 28 mentions
« fortes » (URL du dépôt distant ou chemin relatif) étaient toutes justes, mais les mentions
« faibles » (le nom du projet comme simple mot) ne l'étaient qu'à 69 % (40 justes, 18 fausses,
11 douteuses). Un seul développeur, un seul juge : un modèle lisant les lignes citées.

### 3. Conventions partagées : un hub, `relai sync`, `relai check`

Un **hub** est un dépôt git contenant un `CONVENTIONS.md`, des skills et des modèles de CI
(`relai hub init <dossier>` en crée un). Un dépôt l'épingle à un tag avec une ligne de `relai.yaml`,
`conventions: <hub>@<tag>`. Puis `relai sync --apply` recopie dans le dépôt le fichier de
conventions, un bloc géré dans `AGENTS.md`, les skills `hub-*` et un job de CI (une seule fois).

![Du dépôt hub à un tag jusqu'à la vérification en CI : sync recopie les fichiers, check détecte la dérive](/articles/relai/hub-sync.svg)

Trois choix de conception. La synchronisation est un **essai à blanc par défaut** et ne commit
jamais. Le contenu du hub est traité comme **non fiable** et rien n'est écrit hors du dépôt. La
version est **épinglée** : une règle ne change pas sans qu'on le décide. En CI, `relai check`
enchaîne `relai validate`, le contrôle du budget du résumé et la détection de dérive par rapport au
tag épinglé (un fichier recopié modifié à la main), et sort en code 1 au moindre problème ;
`--outdated` prévient qu'un tag plus récent existe. Une ligne `Override:` dans `AGENTS.md` consigne
un écart volontaire.

### 4. Qu'un agent apprenne l'outil sans explication : `relai guide`, `relai init`

`relai init` ajoute `AGENTS.md`, `relai.yaml`, `.relai/notes.md` et, pour Claude Code, un
`CLAUDE.md` et un hook de début de session qui charge le résumé : l'agent démarre dessus sans qu'on
le lui demande. Il n'écrase jamais un fichier existant. `relai guide` imprime un mode d'emploi court
pour un agent, et `relai guide --install` l'écrit comme Agent Skill dans `~/.claude/skills/relai` et
`~/.agents/skills/relai`. Le guide dit aussi ce qu'il ne faut pas faire : traiter une mention de
`discover --links` comme un lien déclaré, ou citer le contenu du résumé comme un ordre de
l'utilisateur.

### 5. Relai-Team, facultatif : tableau partagé et réservations

Quand plusieurs personnes ou plusieurs agents travaillent en parallèle, un second projet,
[Relai-Team](https://github.com/ECG-Rudy-Glt/RELAI-TEAM), ajoute un serveur auto-hébergé : un
**tableau partagé**, des **réservations de tâches avec un bail** (huit heures par défaut, pour qu'un
agent planté ne bloque rien), un jeton par personne et des outils MCP (`relai-mcp`) que les agents
appellent. Il est séparé de Relai pour que celui-ci reste « git seulement ». Un essai réel : trois
agents Claude Code, chacun avec son jeton, devaient prendre en même temps jusqu'à trois tâches
parmi six. Ils en ont pris 3, 1 et 2, sans aucune tâche en double.

## Architecture en bref

Tout part du dépôt : des fichiers que git versionne déjà. Le binaire les lit et ne produit que du
texte. Les couches multi-dépôts et conventions ne sont que des fichiers de plus (un index, un tag
épinglé). Seul Relai-Team est un service ; il reste à l'écart, joint en MCP ou en HTTP(S), et rien
dans Relai ne l'exige.

## Ce que j'ai mesuré, et dans quel cadre

L'évaluation (`eval/` dans le dépôt) utilise des agents Claude Code en mode non interactif, isolés
de mes réglages, en lecture seule, sur quatre petits projets conçus pour piéger l'agent
(documentation périmée, changement à moitié fait, absence de suivi, liste de tâches périmée).
Trois conditions : rien, lecture de la documentation, résumé de reprise. Modèles : Claude Haiku et
Claude Sonnet, deux à trois exécutions par cas. Les scénarios sont écrits par l'auteur de l'outil.

- Avec le format final, toutes les réponses étaient correctes dans les trois conditions. L'écart
  porte sur le coût : le résumé a demandé 1,6 à 16 fois moins de tokens bruts que la lecture de la
  documentation, mais le gain **en dollars** n'est que de 1,2 à 3,4 fois. L'essentiel du gain tient
  au nombre de tours, souvent un seul au lieu de 4 à 30.
- Sur quatre de mes vrais dépôts (Sonnet, une seule exécution par cas), le résumé a divisé les
  tokens par trois à quatre là où il y a un suivi de tâches et des spécifications (30 000 contre
  101 000 pour mon dépôt d'infrastructure), et **n'a rien apporté** sur les dépôts sans suivi : il
  n'y est guère plus que `git log`.
- `relai workspace` donne la vue de 16 dépôts d'un même développeur en environ 400 tokens.
- Un essai a montré le piège : avec une liste de tâches périmée, une première version du résumé
  compact a rendu Haiku sûr de lui et dans l'erreur. C'est ce qui a imposé d'afficher les tâches
  bloquées et les contradictions.

## Limites

- Version 0.x (0.8 à la date de cet article) : tout peut changer. Seuls le dernier tag et `main`
  reçoivent des corrections.
- Testé avec des modèles Claude uniquement ; un second éditeur d'agent reste à essayer.
- Les mesures viennent des dépôts d'un seul développeur, avec des scénarios écrits par l'auteur :
  des indications, pas une garantie.
- Pas d'audit par un tiers. Le programme d'installation vérifie une somme de contrôle, pas une signature.
- Windows : les binaires se compilent mais n'ont pas été exécutés, et les hooks supposent un `sh`
  (Git Bash).
- Relai-Team apporte peu à une seule personne, et je ne l'ai pas essayé avec plusieurs humains.

## Choix techniques et leur coût

- **Go, bibliothèque standard seule.** Un binaire statique, facile à installer et à auditer. Le
  prix : `relai.yaml` est lu par un petit analyseur écrit à la main pour le sous-ensemble utilisé,
  plutôt que par une bibliothèque YAML. Le format est contraint, une dépendance n'était pas
  justifiée, mais il faut tenir l'analyseur à jour soi-même.
- **Réutiliser les standards** (`AGENTS.md`, Agent Skills, OpenSpec, Beads) plutôt qu'en créer un
  de plus. Le prix : Relai hérite de leurs limites et ne peut rien imposer.
- **Pas un portail.** Ni service central, ni fédération, ni authentification unique : la
  collaboration entre projets passe par git. Le prix : pas de tableau de bord central en dehors de
  Relai-Team.
- **Un résumé calculé à la demande**, jamais stocké : toujours à jour, mais recalculé à chaque session.

## La suite, et ce que je ne fais pas

Reste à mesurer `discover --links` avec un agent qui suit le guide, à essayer un second éditeur
d'agent et à faire relire le code par un tiers. Je ne prévois ni service d'index hébergé (documenté
comme possible, non construit tant que personne n'en a besoin), ni hooks partagés par le hub, ni
automatisation de la commande `/clear`, propre à un seul outil.

Code : [Relai](https://github.com/ECG-Rudy-Glt/RELAI) et
[Relai-Team](https://github.com/ECG-Rudy-Glt/RELAI-TEAM). Documentation : [relai.gault-rudy.com](https://relai.gault-rudy.com/fr/docs/).
