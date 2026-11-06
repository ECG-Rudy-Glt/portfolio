---
title: "COACH - Coach sportif auto-hébergé, open source"
category: perso
summary: "Application auto-hébergée de plans d'entraînement multisport et de suggestions nutritionnelles : un moteur de règles déterministe qui cite ses sources, un coach LLM optionnel bridé par validation serveur, synchronisation Garmin et PWA installable. Gratuit, publié en open source (AGPL-3.0)."
period: "2026 - en cours"
role: "Conception, développement, sécurité, déploiement et publication open source en solo"
stack: ["Python", "FastAPI", "PostgreSQL", "JavaScript", "PWA", "Docker Compose", "Caddy", "GitHub Actions", "Kubernetes", "Ollama", "LLM / tool-calling", "Garmin Connect"]
tags: ["Full-stack", "IA / Assistant conversationnel", "Sécurité applicative", "CI/CD", "Docker", "Self-hosting"]
links:
  repo: "https://github.com/ECG-Rudy-Glt/COACH"
  demo: "https://coach.gault-rudy.com"
  sandbox: "https://coach-demo.gault-rudy.com"
images: ["/projets/coach/home-light.png", "/projets/coach/plan-dark.png", "/projets/coach/nutrition-eco.png"]
featured: true
relevance: "majeur"
order: 1
---

## Le besoin

Je voulais une application capable d'assurer mon **suivi sportif** sans abonnement, et d'obtenir des **conseils personnalisés de coach pour pas cher** : c'est le point de départ du projet. Les offres payantes facturent chaque mois un suivi et des conseils que l'on peut produire soi-même, et les applications « IA » laissent souvent un modèle inventer des charges d'entraînement sans dire d'où elles viennent.

J'ai donc cherché à faire l'inverse : un outil que j'héberge chez moi, qui garde mes données de santé, dont **chaque séance s'explique par une règle**, qui reste utile sans IA, et dont la partie « coach » coûte quelques euros par mois au plus (plafond de dépense réglable) ou rien du tout avec un modèle local.

## La solution

Une application web installable sur téléphone (PWA, iPhone et Android) :

- un **questionnaire adaptatif** (une centaine de questions, qui ne posent que ce dont la décision suivante a besoin) ;
- un **moteur de plan déterministe** : mêmes données, même plan. Cycles de 3 semaines de montée + 1 allégée, phases vers un objectif (base, développement, pic, affûtage), gestion des blessures et des jours bloqués ;
- un **moteur de nutrition** (besoins, objectifs, tendance de poids) et la saisie de repas ;
- une **bibliothèque de 1 700+ exercices** (wger et free-exercise-db, auteur et licence affichés pour chaque média) ;
- la **synchronisation Garmin** avec rapprochement automatique des séances faites et des séances prévues ;
- un **coach LLM optionnel** (bilan hebdomadaire, discussion, notifications) qui commente la semaine sans jamais fixer un chiffre.

## Choix techniques & architecture

- **Le LLM n'est pas la source des chiffres.** Il explique et peut *proposer* quelques ajustements bornés ; le serveur les valide un par un (la règle citée doit exister, la charge ne peut jamais augmenter, la séance doit être future et non traitée). Une proposition hors limites est rejetée avec sa raison. Le contexte envoyé ne contient ni nom ni email.
- **Règles sourcées** : chaque règle a un identifiant, un niveau de preuve et un test ; 60 publications (résumés vérifiés, limites indiquées) y sont rattachées. La relecture humaine complète de cette base reste à faire et est suivie dans les tickets du dépôt.
- **Fournisseur d'IA interchangeable** : Anthropic, OpenAI, Gemini, Mistral, OpenRouter, Ollama (modèle 100 % local) ou n'importe quel serveur compatible OpenAI, avec un catalogue de modèles et un **plafond mensuel de dépense** appliqué côté serveur. Sans clé, l'application fonctionne sans la partie IA.
- **Docker Compose propre** : base PostgreSQL sur un réseau Docker *interne* (sans route vers Internet), secrets montés en fichiers (`NOM_FILE`, rien dans l'environnement ni dans `docker inspect`), conteneur applicatif non-root en lecture seule avec toutes les capacités Linux retirées, import des exercices automatique au premier démarrage, profils optionnels (HTTPS Caddy, sauvegardes, Ollama).
- **Sécurité applicative** : mots de passe scrypt, sessions en cookie HttpOnly dont seul le hash est stocké, limitation des essais par adresse et par compte, CSP sans script en ligne, refus des écritures cross-origin, isolation stricte des données par utilisateur, validation des images (octets magiques, taille) et liste blanche d'hôtes contre le SSRF, jetons Garmin chiffrés au repos (le mot de passe Garmin n'est jamais conservé).
- **Qualité** : plus de 160 tests (le moteur et l'API tournent sans base grâce à un dépôt en mémoire, la couche PostgreSQL est testée en CI), lint, audit des dépendances et scan de secrets sur chaque PR.
- **Publication** : dépôt public repartant d'un historique neuf après un balayage des secrets, `main` protégée (PR et CI obligatoires), CI GitHub Actions, images multi-architecture publiées sur le registre GitHub à chaque tag, documentation en anglais (architecture avec schémas, configuration, exposition par VPN / Cloudflare Tunnel / ngrok, installation de la PWA, ajout d'une source de données ou d'un fournisseur d'IA) et un guide `AGENTS.md` avec des « skills » pour contribuer avec un assistant de code.

## Résultat

Version **0.1.0** publiée sur [GitHub](https://github.com/ECG-Rudy-Glt/COACH), avec une feuille de route de 24 tickets (import de fichiers FIT pour Coros et autres montres, interface en anglais, double authentification, export et suppression des données, revue humaine des règles). En usage quotidien sur mon homelab (k3s, déploiement GitOps) en parallèle de la version publique.

L'application donne des suggestions générales et n'est ni un dispositif médical ni un avis diététique.

## Site et démonstration

Le projet a son propre site, avec documentation en français et en anglais : [coach.gault-rudy.com](https://coach.gault-rudy.com). Une **démonstration en lecture seule**, sans inscription et avec des données fictives, est accessible sur [coach-demo.gault-rudy.com](https://coach-demo.gault-rudy.com) : elle tourne sur la dernière version publiée de l'application. Le code est sur [GitHub](https://github.com/ECG-Rudy-Glt/COACH). Pour le raisonnement complet, voir l'article [COACH : un coach sportif auto-hébergé dont chaque séance s'explique par une règle](/blog/coach/). Même principe de chiffres calculés et d'IA qui cite ses sources dans [Patrimoine](/projets/patrimoine/).
