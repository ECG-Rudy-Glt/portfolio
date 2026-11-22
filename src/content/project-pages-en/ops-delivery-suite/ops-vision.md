---
project: ops-delivery-suite
title: "Ops Vision"
summary: "Lightweight monitoring: uptime and certificates with Uptime Kuma, metrics with Prometheus and Grafana, alerts."
order: 8
---

## What it is for

Getting told when a site goes down at 3 am or a certificate is about to expire, without deploying a full observability platform.

## Two levels

| File | Content |
|---|---|
| `docker-compose.yml` | Uptime Kuma only: HTTP, TCP and ping probes, SSL expiry, public status page, Discord, Slack, Telegram or e-mail alerts |
| `docker-compose.full.yml` | + provisioned Prometheus and Grafana, alert rules (CPU, RAM, disk, host down) |
| `client-agent/` | node-exporter to install on every monitored server |

## Usage

```bash
cd ops-vision
cp .env.example .env                              # GRAFANA_ADMIN_PASSWORD is required
docker compose up -d                              # Uptime Kuma: http://<server>:3001
docker compose -f docker-compose.full.yml up -d   # + Grafana: http://<server>:3000
```

On every monitored server:

```bash
cd ops-vision/client-agent
echo "NODE_EXPORTER_BIND=10.0.0.5" > .env         # private or VPN IP
docker compose up -d
```

## What I fixed before publishing

- **Grafana** started with `admin` / `admin` when no password was set: it is now required.
- **Prometheus**, which has no authentication, was published on every interface: it now only listens locally.
- **Wrong firewall advice.** The agent docs recommended protecting port 9100 with UFW. But a port published by Docker bypasses UFW, so the metrics stayed reachable from the Internet. The agent now listens on a configurable address, and the docs explain the `DOCKER-USER` chain.

[See the code on GitHub](https://github.com/ECG-Rudy-Glt/ops-delivery-suite/tree/main/ops-vision)
