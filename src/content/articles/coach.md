---
title: "COACH : un coach sportif auto-hébergé dont chaque séance s'explique par une règle"
summary: "COACH construit des plans multisport avec un moteur de règles déterministe qui cite ses sources, et n'ajoute un coach LLM qu'en option, bridé par validation serveur. Pourquoi ce choix, comment c'est construit, ce qui marche et ce qui reste à faire."
date: 2026-11-06
tags: ["IA / Assistant conversationnel", "Open source", "Self-hosting", "Sport"]
type: article
cover: "/sites/coach.webp"
---

## Le problème

Je voulais suivre mon entraînement sans abonnement et obtenir des conseils de coach pour pas cher. Les offres payantes facturent chaque mois ce qu'on peut produire soi-même, et beaucoup d'applications « IA » laissent un modèle inventer des charges d'entraînement sans dire d'où elles viennent. Sur de la santé et du sport, un chiffre sans source n'est pas acceptable.

[COACH](https://coach.gault-rudy.com) est ma réponse : un coach sportif **auto-hébergé**, open source (AGPL-3.0), dont le code est sur [GitHub](https://github.com/ECG-Rudy-Glt/COACH). Une [démonstration en lecture seule](https://coach-demo.gault-rudy.com), sans inscription et avec des données fictives, permet de l'essayer. Le résumé est sur la [fiche projet](/projets/coach/).

## Le principe : le moteur décide, le LLM explique

Les volumes, les intensités et les objectifs nutritionnels viennent d'un **moteur de règles déterministe** : mêmes données, même plan. Il construit des cycles de trois semaines de montée et une semaine allégée, des phases vers un objectif (base, développement, pic, affûtage), et gère les blessures et les jours bloqués. Il couvre la course, le trail, le vélo, la musculation et le hybride.

Chaque règle a un identifiant, un niveau de preuve et un test, et chaque séance cite les règles qui l'ont produite. Soixante publications y sont rattachées, avec un résumé et leurs limites. La relecture humaine complète de cette base n'est pas terminée : c'est une tâche ouverte du dépôt.

L'application fonctionne donc **sans IA**. Le coach LLM est un ajout optionnel : bilan hebdomadaire, discussion, notifications.

## Un LLM sur une laisse

Le modèle ne fixe jamais un chiffre. Il peut tout au plus **proposer quelques ajustements bornés**, et le serveur les valide un par un : la règle citée doit exister, la charge ne peut jamais augmenter, la séance doit être à venir et non traitée. Une proposition hors limites est rejetée avec sa raison. Le contexte envoyé au modèle ne contient ni nom ni e-mail.

Le fournisseur est interchangeable : Anthropic, OpenAI, Gemini, Mistral, OpenRouter, Ollama (modèle 100 % local) ou tout serveur compatible OpenAI, avec un **plafond mensuel de dépense** appliqué côté serveur. Avec un modèle local, rien ne quitte la machine. J'ai repris la même idée, des chiffres calculés et une IA qui doit citer des faits vérifiés, dans [Patrimoine](/blog/patrimoine/), mon application de suivi de patrimoine.

## Ce que fait l'application

Une PWA installable sur iPhone et Android :

- un questionnaire adaptatif d'environ cent questions, qui ne pose que ce dont la décision suivante a besoin ;
- un moteur de nutrition (besoins, objectifs, tendance de poids) et la saisie de repas ;
- une bibliothèque de plus de 1 700 exercices, avec l'auteur et la licence de chaque média ;
- la synchronisation Garmin, avec rapprochement automatique des séances faites et prévues, et l'import de fichiers FIT, TCX et GPX pour d'autres marques.

## Architecture et sécurité

Un seul processus FastAPI, une base PostgreSQL, une PWA servie par le même processus, le tout en Docker Compose. La base est sur un réseau Docker interne sans route vers Internet, les secrets sont montés en fichiers, le conteneur applicatif est non-root, en lecture seule, sans capacités Linux. Côté application : mots de passe scrypt, sessions en cookie HttpOnly, limitation des essais, CSP sans script en ligne, isolation des données par utilisateur, jetons Garmin chiffrés au repos.

Plus de 160 tests tournent sans base grâce à un dépôt en mémoire ; la couche PostgreSQL est testée en CI, avec lint, audit des dépendances et scan de secrets. C'est le même esprit d'outillage que dans mon [homelab](/projets/homelab/) et que dans [Relai](/blog/relai/), l'outil que j'ai construit pour reprendre un projet avec un agent IA sans tout relire.

## Ce qui marche, ce qui reste à faire

La version **0.1.0** est publiée et je l'utilise tous les jours sur mon homelab. Le moteur, le plan, la nutrition, la synchronisation Garmin et le coach sont implémentés et testés.

Reste à faire, suivi dans les tickets du dépôt : l'interface, le questionnaire et les prompts sont **en français** seulement (la traduction est une tâche ouverte), la double authentification, l'export et la suppression des données, et la revue humaine des règles. COACH est aussi la première brique d'une suite d'outils santé et sport auto-hébergés prévue, pas encore réalisée.

COACH donne des suggestions générales : ce n'est ni un dispositif médical, ni un avis diététique, et il ne remplace pas un médecin, un kiné ou un diététicien. Toute douleur ou signal d'alerte appelle un avis professionnel.
