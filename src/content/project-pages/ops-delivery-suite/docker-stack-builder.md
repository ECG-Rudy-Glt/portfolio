---
project: ops-delivery-suite
title: "Docker Stack Builder"
summary: "Quatre environnements Docker complets, du poste du développeur à la production : Express, Laravel, Django, WordPress."
order: 9
---

## À quoi ça sert

« On met deux jours à installer le projet sur le PC d'un nouveau stagiaire. » Avec une stack prête, un développeur tape `make dev` et code cinq minutes plus tard, dans le même environnement que la production.

## Les stacks

| Stack | Services |
|---|---|
| Node.js Express | Node 20, PostgreSQL 16, Redis 7 |
| PHP Laravel | PHP-FPM 8.3, Nginx, MySQL 8, Redis 7 |
| Python Django | Python 3.12, PostgreSQL 16, Redis 7, Celery |
| WordPress | PHP-FPM, Nginx, MySQL 8, cache objet Redis |

Chaque stack a des healthchecks, un `.env.example` et un Makefile (`make dev`, `make logs`…). Les stacks Express, Laravel et Django ont un Dockerfile multi-étapes (développement et production) qui tourne sous un utilisateur non-root ; la stack WordPress s'appuie sur l'image officielle.

## Utilisation

```bash
cp -r docker-stack-builder/templates/php-laravel mon-projet/
cd mon-projet
cp .env.example .env
make dev
```

## Ce que j'ai corrigé avant publication

- Des fichiers `.env` étaient versionnés à côté des `.env.example` ; retirés.
- Les documents commerciaux (CGV, SLA, offres tarifées) ont été retirés : le dépôt est sous licence MIT, sans double licence.
- Attribut `version:` obsolète retiré des fichiers Compose ; correction d'une redirection fautive dans `wait-for-it.sh`.

[Voir le code sur GitHub](https://github.com/ECG-Rudy-Glt/ops-delivery-suite/tree/main/docker-stack-builder)
