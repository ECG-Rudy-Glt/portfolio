---
project: ops-delivery-suite
title: "CI/CD Templates"
summary: "Sept modèles de pipeline, chacun pour GitHub Actions et GitLab CI : Node, PHP, Python, Docker Compose, Go, Rust, site statique."
order: 10
---

## À quoi ça sert

Remplacer le déploiement à la main (FTP, SSH puis `git pull`) par un pipeline testé, sans réécrire un fichier de CI à chaque projet.

## Les modèles

| Modèle | Cible |
|---|---|
| node-pm2 | Application Node relancée par PM2 |
| php-laravel | Laravel : Composer, migrations, cache |
| python-systemd | Application Python servie par un service systemd |
| docker-compose | Build d'image, push, `docker compose up` sur le serveur |
| go-systemd, rust-systemd | Binaire compilé en CI puis copié et relancé |
| static-nginx | Site statique publié derrière Nginx |

Chaque dossier contient `github-action.yml`, `.gitlab-ci.yml` et un exemple de configuration serveur. Deux démos complètes sont dans `demos/`, et `docs/` couvre la préparation du serveur, les secrets et le retour arrière.

## Utilisation

```bash
# GitHub Actions
cp cicd-templates/templates/node-pm2/github-action.yml .github/workflows/deploy.yml
# Secrets du dépôt : SSH_PRIVATE_KEY, DEPLOY_HOST, DEPLOY_USER, DEPLOY_PATH

# GitLab CI
cp cicd-templates/templates/node-pm2/.gitlab-ci.yml .gitlab-ci.yml
```

Pour préparer un serveur neuf : `scripts/setup-server.sh` (utilisateur de déploiement, clé SSH, dépendances).

## Ce que j'ai corrigé avant publication

Peu de choses : ces modèles avaient déjà été audités. J'ai mis à jour les liens vers le nouveau dépôt et retiré les adresses de contact commerciales.

[Voir le code sur GitHub](https://github.com/ECG-Rudy-Glt/ops-delivery-suite/tree/main/cicd-templates)
