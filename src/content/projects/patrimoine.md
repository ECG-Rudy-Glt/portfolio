---
title: "Patrimoine - Suivi de patrimoine auto-hébergé avec conseiller IA sourcé"
category: perso
summary: "Application auto-hébergée de suivi de patrimoine pour un foyer : comptes agrégés par les API DSP2 officielles, budget, placements, fiscalité, alertes et rapports, avec des chiffres calculés par des services déterministes et un conseiller IA dont chaque citation est vérifiée par le serveur. Open source (Apache 2.0), en construction."
period: "2026 - en cours"
role: "Conception, développement, sécurité, déploiement et publication open source en solo"
stack: ["Python", "FastAPI", "PostgreSQL", "React", "Grafana", "Docker Compose", "Enable Banking (DSP2)", "LLM / Claude (Anthropic)", "ntfy", "Home Assistant"]
tags: ["Full-stack", "IA / Assistant conversationnel", "Sécurité applicative", "Docker", "Self-hosting"]
links:
  repo: "https://github.com/ECG-Rudy-Glt/PATRIMOINE"
  demo: "https://patrimoine-open.gault-rudy.com"
  sandbox: "https://patrimoine-demo.gault-rudy.com"
featured: false
relevance: "pertinent"
order: 4
---

## Le besoin

Suivre l'ensemble du patrimoine d'un foyer (comptes courants, épargne, assurance-vie, bourse, crypto, immobilier) sans confier ses données à un service tiers, et recevoir des conseils d'épargne et d'allocation sans qu'un modèle de langage invente des chiffres.

## La solution

- **Comptes** agrégés par les API DSP2 officielles via Enable Banking (lecture seule, accès restreint gratuit à ses propres comptes) ; les identifiants bancaires ne sont jamais stockés.
- **Budget** : catégorisation par règles, cycle de paie, montant épargnable ; **objectifs d'épargne**.
- **Placements** : positions, prix de revient, allocation contre cible, filtre fiscal, coût des frais.
- **Fiscalité** : éligibilité LEP, plafond PER, ancienneté assurance-vie et PEA.
- **Alertes** (solde bas, ntfy, notification web, Home Assistant) et **rapports** (digest mensuel par e-mail à chaque paie, classeur Excel).
- **Foyer** : plusieurs personnes, quote-part par compte.

## Choix techniques & architecture

- **Le LLM n'invente aucun chiffre.** Le conseiller reçoit des faits chiffrés identifiés par une clé et produit des recommandations en JSON ; le serveur vérifie chaque citation et rejette celles qui sont inventées. Les estimations sont marquées « ≈ ».
- **Services Python (FastAPI)** : ledger, budget-engine, allocation-engine, advisor, reporting, ingestion-bank, ingestion-market, autour de PostgreSQL, avec une interface React et Grafana, le tout en Docker Compose.
- **Modèle d'IA** : Claude (Anthropic) aujourd'hui ; l'ouverture à d'autres modèles, en ligne ou locaux, est en cours et n'est pas encore disponible.

## Résultat et limites

Dépôt public depuis le 6 novembre 2026, licence Apache 2.0, utilisé par son auteur. Le projet est **ouvert et en construction** : l'interface et les schémas peuvent encore évoluer. L'application n'a **pas d'authentification intégrée** (à placer derrière un reverse proxy qui authentifie) et **ne chiffre pas les données au repos** : ces protections sont à la charge de l'installation.

Pour le raisonnement complet, voir l'article [Suivre son patrimoine en auto-hébergé : des chiffres fiables et une IA qui cite ses sources](/blog/patrimoine/). Dans la même veine : [COACH](/projets/coach/) (coach sportif, même principe de règles sourcées) et [Relai](/projets/relai/).

## Site et démonstration

Site du projet : [patrimoine-open.gault-rudy.com](https://patrimoine-open.gault-rudy.com). Démonstration interactive avec données fictives : [patrimoine-demo.gault-rudy.com](https://patrimoine-demo.gault-rudy.com). Code : [GitHub](https://github.com/ECG-Rudy-Glt/PATRIMOINE).
