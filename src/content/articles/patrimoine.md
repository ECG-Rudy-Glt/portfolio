---
title: "Suivre son patrimoine en auto-hébergé : des chiffres fiables et une IA qui cite ses sources"
summary: "Patrimoine est une application open source qui agrège les comptes d'un foyer, calcule budget, allocation et fiscalité avec des services déterministes, et confie à une IA la seule tâche de formuler des conseils, dont chaque citation est vérifiée par le serveur. Principes, architecture, état réel et limites."
date: 2026-11-06
tags: ["IA / Assistant conversationnel", "Open source", "Self-hosting", "Finance personnelle"]
type: article
---

## Le problème

Mon patrimoine est éparpillé : comptes courants, livrets, assurance-vie, bourse. Les applications de suivi existantes demandent de leur confier mes identifiants ou mes données, et celles qui ajoutent de l'« IA » laissent souvent un modèle de langage commenter des chiffres qu'il a parfois inventés. Pour de l'argent, une erreur plausible est pire qu'une absence de réponse.

Je voulais donc un outil que j'héberge, qui agrège les comptes de tout le foyer, et dont les conseils sont **vérifiables**. C'est le projet [Patrimoine](https://patrimoine-open.gault-rudy.com), dont le code est sur [GitHub](https://github.com/ECG-Rudy-Glt/PATRIMOINE) (Apache 2.0, publié le 6 novembre 2026). Une [démonstration interactive](https://patrimoine-demo.gault-rudy.com) avec des données fictives permet de le voir sans rien installer, et la [fiche projet](/projets/patrimoine/) en donne le résumé.

## Les principes

**Le modèle n'invente aucun chiffre.** Tous les montants viennent de services déterministes : même situation, mêmes résultats. L'IA interprète et formule, elle ne calcule pas. Quand une valeur est une estimation, l'interface la marque « ≈ ».

**Chaque conseil cite ses faits.** Le conseiller reçoit des faits chiffrés, chacun identifié par une clé, et répond en JSON avec des recommandations qui citent ces clés. Le serveur vérifie chaque citation et **rejette celles qui n'existent pas**. Un conseil qui s'appuie sur un fait inventé n'arrive jamais jusqu'à l'utilisateur. C'est la même idée que dans [COACH](/blog/coach/), mon coach sportif : un moteur de règles qui produit les chiffres, une IA bornée qui les explique.

**Les données restent chez soi.** Les comptes sont lus par les API DSP2 officielles via Enable Banking, en lecture seule, avec l'accès restreint gratuit à ses propres comptes. Les identifiants bancaires ne sont jamais stockés.

## Comment un conseil est fabriqué

Concrètement, le flux est en quatre temps. Les services de calcul produisent des faits chiffrés (par exemple un montant épargnable sur le cycle de paie en cours, ou l'écart entre l'allocation réelle et la cible), chacun avec une clé. Le conseiller transmet ces faits au modèle et lui demande des recommandations en JSON, où chaque recommandation référence les clés sur lesquelles elle s'appuie. Le serveur contrôle alors que toutes les clés citées existent, puis ne conserve que les recommandations valides. Enfin, le digest mensuel les met en forme et les envoie par e-mail à chaque paie, pour chaque personne du foyer.

L'intérêt de cette séparation est qu'une erreur du modèle devient une recommandation rejetée, et non un chiffre faux dans votre boîte mail. Elle ne protège pas contre tout : un conseil bien cité peut rester discutable. C'est pourquoi les textes se présentent comme des suggestions à relire.

## L'architecture

Patrimoine est un ensemble de petits services Python (FastAPI) autour d'une base PostgreSQL, avec une interface React et Grafana, le tout en Docker Compose :

- `ingestion-bank` et `ingestion-market` récupèrent les comptes et les prix ;
- `ledger` porte l'API et les migrations ;
- `budget-engine` et `allocation-engine` calculent ;
- `advisor` fait le pont avec le modèle de langage ;
- `reporting` produit le digest et le classeur Excel.

Séparer calcul et conseil permet de tester chaque calcul seul, et de limiter ce que le modèle voit : uniquement les faits qu'on lui passe. L'installation tient en deux commandes : `./scripts/setup.sh` puis `docker compose up -d --build`.

## Ce qui marche aujourd'hui

- **Budget** : catégorisation par règles, cycle de paie, montant épargnable, objectifs d'épargne.
- **Placements** : positions, prix de revient, allocation contre cible, filtre fiscal, coût des frais.
- **Fiscalité** : éligibilité LEP, plafond PER, ancienneté de l'assurance-vie et du PEA.
- **Alertes** : solde bas, via ntfy, notification web ou Home Assistant.
- **Rapports** : un digest mensuel par e-mail à chaque paie, et un classeur Excel.
- **Foyer** : plusieurs personnes, avec une quote-part par compte.
- **Conseiller IA** : fonctionnel avec Claude (Anthropic), avec la vérification des citations décrite plus haut.

Je l'utilise moi-même, mais le projet est **ouvert et en construction** : l'interface et les schémas peuvent encore évoluer.

## Ce qui reste à faire, et ce qu'il faut savoir

- **Autres modèles.** L'ouverture à d'autres modèles, en ligne ou locaux, est en cours : ce n'est **pas disponible** aujourd'hui. C'est déjà le cas dans COACH, qui accepte plusieurs fournisseurs et un modèle local ; l'objectif est le même ici.
- **Pas d'authentification intégrée.** L'application doit être placée derrière un reverse proxy qui authentifie. L'exposer telle quelle sur Internet serait une erreur.
- **Pas de chiffrement des données au repos** fourni par l'application. Si le disque ou la sauvegarde doivent être protégés, c'est à l'installation de s'en charger (chiffrement du volume, par exemple).
- **Ce n'est pas un conseil financier.** Les recommandations sont des suggestions générées à partir de vos chiffres, pas l'avis d'un professionnel agréé.

## Pourquoi je l'ai publié

Le sujet touche des données sensibles : autant que le code soit lisible et que chacun puisse l'auditer avant de s'en servir. Dans le même esprit que [Relai](/blog/relai/), mon outil de reprise de projet pour agents IA, la démarche est de travailler avec des IA en faisant passer la vérification avant la confiance. Retours et contributions sont les bienvenus sur le [dépôt](https://github.com/ECG-Rudy-Glt/PATRIMOINE).
