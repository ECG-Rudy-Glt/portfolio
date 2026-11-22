---
project: ops-delivery-suite
title: "CI/CD Templates"
summary: "Seven pipeline templates, each for GitHub Actions and GitLab CI: Node, PHP, Python, Docker Compose, Go, Rust, static site."
order: 10
---

## What it is for

Replacing manual deployment (FTP, or SSH then `git pull`) with a tested pipeline, without rewriting a CI file for every project.

## The templates

| Template | Target |
|---|---|
| node-pm2 | Node application restarted by PM2 |
| php-laravel | Laravel: Composer, migrations, cache |
| python-systemd | Python application served by a systemd unit |
| docker-compose | Image build, push, `docker compose up` on the server |
| go-systemd, rust-systemd | Binary compiled in CI, then copied and restarted |
| static-nginx | Static site published behind Nginx |

Each folder contains `github-action.yml`, `.gitlab-ci.yml` and an example server configuration. Two complete demos are in `demos/`, and `docs/` covers server preparation, secrets and rollback.

## Usage

```bash
# GitHub Actions
cp cicd-templates/templates/node-pm2/github-action.yml .github/workflows/deploy.yml
# Repository secrets: SSH_PRIVATE_KEY, DEPLOY_HOST, DEPLOY_USER, DEPLOY_PATH

# GitLab CI
cp cicd-templates/templates/node-pm2/.gitlab-ci.yml .gitlab-ci.yml
```

To prepare a new server: `scripts/setup-server.sh` (deploy user, SSH key, dependencies).

## What I fixed before publishing

Not much: these templates had already been audited. I updated the links to the new repository and removed the commercial contact addresses.

[See the code on GitHub](https://github.com/ECG-Rudy-Glt/ops-delivery-suite/tree/main/cicd-templates)
