---
project: ops-delivery-suite
title: "Ops Vision"
summary: "Supervision légère : disponibilité et certificats avec Uptime Kuma, métriques avec Prometheus et Grafana, alertes."
order: 8
---

## À quoi ça sert

Être prévenu quand un site tombe à 3 h du matin ou qu'un certificat va expirer, sans déployer une plateforme d'observabilité complète.

## Deux niveaux

| Fichier | Contenu |
|---|---|
| `docker-compose.yml` | Uptime Kuma seul : sondes HTTP, TCP, ping, expiration SSL, page de statut publique, alertes Discord, Slack, Telegram ou e-mail |
| `docker-compose.full.yml` | + Prometheus et Grafana provisionnés, règles d'alerte (CPU, RAM, disque, hôte injoignable) |
| `client-agent/` | node-exporter à installer sur chaque serveur surveillé |

## Utilisation

```bash
cd ops-vision
cp .env.example .env                              # GRAFANA_ADMIN_PASSWORD obligatoire
docker compose up -d                              # Uptime Kuma : http://<serveur>:3001
docker compose -f docker-compose.full.yml up -d   # + Grafana : http://<serveur>:3000
```

Sur chaque serveur surveillé :

```bash
cd ops-vision/client-agent
echo "NODE_EXPORTER_BIND=10.0.0.5" > .env         # IP privée ou VPN
docker compose up -d
```

## Ce que j'ai corrigé avant publication

- **Grafana** démarrait avec `admin` / `admin` si le mot de passe n'était pas défini : il est désormais obligatoire.
- **Prometheus**, qui n'a pas d'authentification, était publié sur toutes les interfaces : il n'écoute plus qu'en local.
- **Conseil de pare-feu erroné.** La doc de l'agent recommandait de protéger le port 9100 avec UFW. Or un port publié par Docker contourne UFW : les métriques restaient accessibles depuis Internet. L'agent écoute maintenant sur une adresse configurable, et la doc explique la chaîne `DOCKER-USER`.

[Voir le code sur GitHub](https://github.com/ECG-Rudy-Glt/ops-delivery-suite/tree/main/ops-vision)
