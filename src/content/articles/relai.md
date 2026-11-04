---
title: "Relai : reprendre un projet avec un agent IA sans tout relire"
summary: "Avec une quinzaine de projets menés en parallèle et des sessions d'agents qui repartent de zéro, j'ai construit Relai : un contrat de dépôt, un résumé de reprise compact et une vue de tous mes projets, dans git, sans serveur. Ce qui marche, ce qui ne marche pas encore, et ce que j'ai mesuré."
date: 2026-11-04
tags: ["IA / Assistant conversationnel", "Open source", "Git", "Outillage"]
type: article
---

## Le problème

Je travaille avec des agents IA sur une quinzaine de dépôts : mon [homelab](/projets/homelab/), des
applications comme [COACH](/projets/coach/), mon site de freelance, ce portfolio. Chaque nouvelle
session repart à froid. L'agent relit des dizaines de fichiers pour savoir où en est le projet,
parfois en se trompant, et il m'est arrivé de réécrire ce qu'un autre de mes projets fournissait
déjà. Deux sessions peuvent aussi travailler en même temps sur le même dépôt sans le savoir.

Je ne voulais ni un nouvel outil de gestion de tâches, ni un service à héberger : mes tâches
vivent déjà dans git (Beads, OpenSpec). Je voulais seulement que la reprise soit rapide et fiable.

## Ce que fait Relai

[Relai](https://relai.rudy-ops.fr) est un utilitaire en ligne de commande, open source (Apache 2.0),
et un ensemble de fichiers versionnés avec le code :

- un **contrat de dépôt** : `AGENTS.md`, un manifeste `relai.yaml` (ce que le projet fournit et
  consomme) et des notes sur les décisions et les pièges ;
- un **résumé de reprise** (`relai handoff`) généré à la demande, plafonné à environ 2 000 tokens :
  où en est le travail, les tâches ouvertes, les changements en cours ;
- une **vue de tous mes projets** (`relai workspace`) : dernière activité, travail ouvert et ce que
  chacun fournit, en quelques centaines de tokens, à partir des fichiers seuls ;
- un **index** des projets pour vérifier ce qui existe déjà avant d'écrire un doublon.

Le résumé est **déterministe** : il est construit à partir de git, des tâches et des specs, jamais
par un modèle. Quand deux sources se contredisent (une tâche ouverte qu'un commit dit terminée),
il montre les deux et dit de vérifier, au lieu de trancher. Cette règle vient d'un essai où un
petit modèle a fait confiance à une liste de tâches périmée et s'est arrêté avec une mauvaise réponse.

Relai ne remplace rien : il s'appuie sur AGENTS.md, Beads et OpenSpec, que j'utilisais déjà.

## Relai-Team, la couche d'équipe

Quand plusieurs personnes ou plusieurs agents travaillent en parallèle, un second projet,
[Relai-Team](https://github.com/ECG-Rudy-Glt/RELAI-TEAM), ajoute un **tableau en direct** et un
**registre de réservation** : un agent réserve une tâche, les autres voient qui la tient. La
réservation expire seule au bout de huit heures par défaut, pour qu'un agent planté ne bloque rien,
et les agents y accèdent par MCP. Je l'ai gardé séparé de Relai pour que celui-ci reste « git
seulement, sans serveur ».

## Ce que j'ai mesuré

J'ai fait tester les deux projets par des agents, y compris un test adversarial :

- sur 16 dépôts réels, `relai workspace` donne la vue d'ensemble en environ 400 tokens, là où il
  faudrait ouvrir chaque projet ;
- sur mon dépôt homelab, le résumé de reprise tient en environ 960 tokens, contre environ 2 300
  chargés aujourd'hui au démarrage d'une session ;
- le test adversarial a trouvé de vrais défauts dans Relai-Team (un journal rendu illisible après
  un disque plein, deux serveurs écrivant sur le même journal) : ils sont corrigés.

Ces chiffres sont des **indications**, mesurées une fois par cas, pas une garantie.

## Ce qui ne marche pas encore

- Pour un seul humain, le tableau d'équipe apporte peu ; c'est `workspace` et le résumé de
  reprise qui rapportent.
- Relai ne lit pas les tâches tenues dans un `TODO.md` libre : seulement Beads et OpenSpec.
- Les worktrees d'un même dépôt sont comptés comme des projets distincts, ce qui fausse certains
  liens.
- Les liens entre projets et les conventions partagées ne sont pas encore construits.

C'est une version 0.x : tout peut changer.

## Ce que j'en retiens

Le plus utile n'est pas l'outil mais la discipline qu'il impose : un dépôt qui dit clairement où il
en est se reprend aussi bien pour un agent que pour moi dans trois semaines. Je le déploie
maintenant sur mes propres dépôts, et je mettrai cet article à jour avec les mesures réelles.

Code : [Relai](https://github.com/ECG-Rudy-Glt/RELAI) et
[Relai-Team](https://github.com/ECG-Rudy-Glt/RELAI-TEAM). Documentation : [relai.rudy-ops.fr](https://relai.rudy-ops.fr/fr/docs/).
