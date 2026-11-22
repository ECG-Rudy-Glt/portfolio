---
project: ops-delivery-suite
title: "Traefik Edge Proxy"
summary: "A reverse proxy that obtains and renews Let's Encrypt certificates on its own, with security headers and Ansible deployment."
order: 7
---

## What it is for

Serving several applications on one server, each on its own domain and over HTTPS, without managing certificates by hand. Traefik reads Docker container labels and creates routes and certificates as containers come and go.

## What is included

- HTTP to HTTPS redirection (301), Let's Encrypt certificates (HTTP challenge, or DNS for wildcards)
- Ready-made middlewares: security headers (HSTS, `X-Frame-Options`, `nosniff`…), compression, rate limiting, IP allow list, CORS
- Dashboard served over HTTPS only, behind a bcrypt password
- `ansible/deploy_traefik.yml`: prepares the server (IP forwarding, UFW ports, Docker if missing, compatible with a server hardened by [VPS Shield](/en/projets/ops-delivery-suite/vps-shield/)), then deploys and checks the stack

## Usage

```bash
cd traefik-edge-proxy
make setup && cp .env.example .env
make password            # copy DASHBOARD_USERS='...' into .env, set DASHBOARD_DOMAIN
make start
```

Exposing an application:

```yaml
labels:
  - traefik.enable=true
  - traefik.http.routers.app.rule=Host(`app.example.com`)
  - traefik.http.routers.app.tls.certresolver=letsencrypt
  - traefik.http.routers.app.middlewares=secure-chain@file
```

## What I fixed before publishing

This tool merges two former repositories, Automate HTTPS (docs and configuration) and Traefik Edge Proxy (Ansible deployment). Actually starting it showed:

- **No route worked with a recent Docker.** Traefik v3.0 and v3.2 speak a Docker API version that Docker 29 refuses (`client version 1.24 is too old`): the provider saw no containers. Upgraded to Traefik v3.6.
- **Security headers were never applied.** A non-existent field (`frameDelay` instead of `frameDeny`) made Traefik reject the whole middlewares file. After the fix, HSTS, `X-Frame-Options` and `nosniff` are present.
- **Default credentials.** The dashboard was protected by `admin:admin` and a test middleware by `test:test`. There is no default any more: without `DASHBOARD_USERS`, the stack refuses to start.
- **Dead port.** The dashboard was advertised on port 8080, which Traefik did not serve (`insecure` mode disabled); the playbook waited for that port and hung.
- **SELinux.** The playbook switched SELinux to permissive mode, which has no place in a hardening suite: removed.
- The password generator doubled `$` signs for `middlewares.yml` too, where they must not be.

[See the code on GitHub](https://github.com/ECG-Rudy-Glt/ops-delivery-suite/tree/main/traefik-edge-proxy)
