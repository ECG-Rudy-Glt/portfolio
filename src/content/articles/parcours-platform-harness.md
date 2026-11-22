---
title: "Platform engineer et harness engineer : mon parcours d'apprentissage, sources vérifiées"
summary: "Deux métiers qui se rejoignent : construire une plateforme pour des développeurs, et construire l'environnement d'un agent IA. Le parcours que je me suis fixé sur huit mois, les sources que j'ai vérifiées une par une, et les labs que je vais mener sur mon homelab."
date: 2026-11-22
tags: ["Platform engineering", "IA / Agents", "Homelab", "Apprentissage"]
type: article
interactive: "learning-path"
---

## Pourquoi ces deux métiers ensemble

Un **platform engineer** construit une plateforme interne gérée comme un produit : des chemins
pavés en self-service, de l'infrastructure déclarative, des garde-fous par défaut, de la mesure.
Ses utilisateurs sont des développeurs.

Un **harness engineer** construit l'environnement autour d'un modèle de langage pour qu'un agent
mène un travail en plusieurs étapes de façon fiable : la boucle d'agent, les outils, le contexte,
les tests que l'agent lance lui-même, l'isolation, la reprise d'une session à l'autre.

Ma conviction, c'est qu'**un harness est une plateforme dont l'utilisateur est un modèle**. On y
retrouve les mêmes questions : quelle interface stable exposer, quels garde-fous imposer par
défaut, comment donner un retour rapide, comment isoler, comment mesurer. Florian Bruniaux le
résume bien dans l'épisode
[#383 d'IFTTD](https://www.ifttd.io/episodes/contexte-engineering) :

> « Il vaut mieux un très bon harnais et un modèle plus low cost qu'un très bon modèle avec un
> mauvais harnais. »

Je travaille déjà tous les jours avec des agents sur mon [homelab](/projets/homelab/) et sur des
outils comme [Relai](/blog/relai/). Ce parcours sert à passer de l'usage à la conception.

## Comment le parcours est construit

Deux tracks avancent **en parallèle**, une semaine sur chaque, pendant six mois :

- **Platform** (P1 à P6) : platform as a product, Kubernetes et GitOps, IaC et control planes,
  portail développeur avec Backstage, supply chain, SRE.
- **Harness** (H1 à H6) : API des modèles, boucle d'agent et outils, context engineering, évals,
  sandboxing, agents longue durée.

Puis deux modules de **convergence** : une plateforme qui fait tourner des agents isolés,
observés et budgétés, et un agent de triage d'incident évalué sur mes vrais post-mortems.

Chaque module a le même format : objectifs, concepts, sources classées (à lire en premier ou
pour approfondir), un **lab sur mon homelab**, et une checklist qui dit si c'est acquis. Les labs
partent de l'existant (k3s, Flux, OpenBao, Forgejo, Prometheus) plutôt que d'un environnement
jetable : une erreur y a un vrai coût, et c'est ce qui fait apprendre.

## Des sources vérifiées, pas une liste de liens

Le 22 novembre 2026, j'ai testé chaque URL du parcours et relu les articles clés pour vérifier
ce que j'en disais. La vérification a corrigé plusieurs points de mon premier jet :

- L'article d'Anthropic
  [*Effective harnesses for long-running agents*](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
  (novembre 2025) décrit un agent d'initialisation et un agent de code qui se passent le relais
  par des fichiers. **Il n'y a pas d'évaluateur séparé.** L'évaluateur, avec un planner et un
  generator, vient de l'article suivant,
  [*Harness design for long-running apps*](https://www.anthropic.com/engineering/harness-design-long-running-apps)
  (mars 2026).
- La documentation Crossplane a changé avec la v2 (un lien était mort), et les conventions
  OpenTelemetry pour l'IA générative ont déménagé dans un
  [dépôt dédié](https://github.com/open-telemetry/semantic-conventions-genai).
- *Team Topologies* a une deuxième édition, parue en 2025.

En creusant, j'ai aussi ajouté une trentaine de sources, dont plusieurs qui contredisent
utilement les autres :

- [*Don't Build Multi-Agents*](https://cognition.com/blog/dont-build-multi-agents) (Cognition,
  juin 2025) défend un agent unique et linéaire, à l'opposé des architectures multi-agents.
  [Agentless](https://arxiv.org/abs/2407.01489) (2024) montre qu'un pipeline fixe, sans agent
  autonome, battait les agents open source de l'époque. Deux bonnes raisons de ne pas complexifier
  un harness trop tôt.
- Côté sécurité, [*Design Patterns for Securing LLM Agents against Prompt Injections*](https://arxiv.org/abs/2506.08837)
  (2025) et [CaMeL](https://arxiv.org/abs/2503.18813) (2025) traitent l'injection de prompt par
  l'architecture plutôt que par le filtrage.
- Dix autres épisodes d'IFTTD, dont
  [#384 sur l'usine logicielle 100 % IA](https://www.ifttd.io/episodes/usine-logicielle-100-ai),
  [#382 sur la CI qui doit suivre le rythme des agents](https://www.ifttd.io/episodes/rapprocher-la-ci)
  et [#360 sur Docker Sandbox](https://www.ifttd.io/episodes/docker-sandbox).

La bibliographie complète (livres, papiers, articles, documentations, podcasts, dépôts, avec
auteur, date et module) est dans le
[dépôt du parcours](https://github.com/ECG-Rudy-Glt/Learning_path_plateform-harness_inge), en
français et en anglais.

## Ce que je publierai ensuite

Ce parcours est un plan, pas un bilan : aucun lab n'est encore fait. Chaque lab terminé laissera
une trace vérifiable (une PR, un ADR ou un post-mortem), et les plus intéressants deviendront des
articles ici, avec ce qui a marché, ce qui a cassé et ce que j'ai mesuré.

Le module explorable ci-dessous reprend le parcours complet. Si tu veux suivre le même chemin,
tu peux cocher tes propres validations.
