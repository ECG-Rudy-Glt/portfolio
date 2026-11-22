---
project: ops-delivery-suite
title: "Docker Stack Builder"
summary: "Four complete Docker environments, from the developer's laptop to production: Express, Laravel, Django, WordPress."
order: 9
---

## What it is for

"It takes two days to set the project up on a new intern's laptop." With a ready-made stack, a developer types `make dev` and is coding five minutes later, in the same environment as production.

## The stacks

| Stack | Services |
|---|---|
| Node.js Express | Node 20, PostgreSQL 16, Redis 7 |
| PHP Laravel | PHP-FPM 8.3, Nginx, MySQL 8, Redis 7 |
| Python Django | Python 3.12, PostgreSQL 16, Redis 7, Celery |
| WordPress | PHP-FPM, Nginx, MySQL 8, Redis object cache |

Every stack has healthchecks, a `.env.example` and a Makefile (`make dev`, `make logs`…). The Express, Laravel and Django stacks have a multi-stage Dockerfile (development and production) running as a non-root user; the WordPress stack builds on the official image.

## Usage

```bash
cp -r docker-stack-builder/templates/php-laravel my-project/
cd my-project
cp .env.example .env
make dev
```

## What I fixed before publishing

- `.env` files were committed next to the `.env.example` files; removed.
- Commercial documents (terms, SLA, priced offers) were removed: the repository is MIT-licensed, with no dual licence.
- Removed the obsolete `version:` attribute from Compose files; fixed a faulty redirection in `wait-for-it.sh`.

[See the code on GitHub](https://github.com/ECG-Rudy-Glt/ops-delivery-suite/tree/main/docker-stack-builder)
