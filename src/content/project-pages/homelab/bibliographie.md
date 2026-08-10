---
project: homelab
title: "Bibliographie - sources et technologies"
summary: "Les guides qui ont posé les fondations de ce projet, et la liste complète des technologies utilisées, couche par couche."
order: 11
---

Cette page n'est pas un article de plus : c'est la liste de référence. D'un côté, les sources qui
ont façonné l'architecture avant même le premier achat de matériel. De l'autre, l'inventaire
complet des technologies effectivement déployées sur le lab, plutôt que dispersées au fil des
pages.

## La source d'inspiration principale : Stéphane Robert

Le déclencheur du projet a été la découverte du [blog de Stéphane Robert](https://blog.stephane-robert.info/docs/homelab/)
et de sa [roadmap homelab](https://blog.stephane-robert.info/docs/homelab/roadmap/) - une
structure claire, avec des choix justifiés plutôt qu'un empilement de services (détail en
[l'infrastructure](/projets/homelab/infrastructure/)). Ça a servi de socle méthodologique, pas de
copie conforme : chaque choix a ensuite été adapté à mes contraintes propres. Les guides suivis
concrètement, au fil des différentes phases :

- [Choix du matériel - mini-PC OPNsense/pfSense](https://blog.stephane-robert.info/docs/homelab/materiel/mini-pc-opnsense-pfsense/)
- [Tailscale sur OPNsense](https://blog.stephane-robert.info/docs/homelab/opnsense-tailscale/)
- [Nœud d'administration Proxmox](https://blog.stephane-robert.info/docs/homelab/noeud-admin-proxmox/)
- [Installation Authentik en Docker Compose](https://blog.stephane-robert.info/docs/services/identite/authentik/installation-docker-compose/)
- [Sécuriser avec CrowdSec](https://blog.stephane-robert.info/docs/securiser/reseaux/crowdsec/)
- [Exposition via Cloudflare Tunnel](https://blog.stephane-robert.info/docs/securiser/acces/cloudflared/)
- [Modules Ansible pour Proxmox](https://blog.stephane-robert.info/docs/virtualiser/type1/proxmox/ansible-modules/)
- Script d'initialisation Vault - base du bootstrap OpenBao du lab, adapté au binaire `bao` et aux
  valeurs réelles du projet (voir [la PKI interne](/blog/homelab-pki-secrets/))

## Les technologies, couche par couche

**Virtualisation & IaC**
[Proxmox VE](https://www.proxmox.com/en/products/proxmox-virtual-environment/overview) ·
[Terraform](https://www.terraform.io/) · [Ansible](https://www.ansible.com/)

**Réseau & sécurité périmètre**
[OPNsense](https://opnsense.org/) · [Tailscale](https://tailscale.com/) ·
[Suricata](https://suricata.io/) · [CrowdSec](https://www.crowdsec.net/) ·
[ntopng](https://www.ntop.org/products/traffic-analysis/ntop/) ·
[MaxMind GeoLite2](https://www.maxmind.com/en/geoip2-databases) ·
[AdGuard Home](https://adguard.com/en/adguard-home/overview.html)

**Identité, secrets & accès**
[OpenBao](https://openbao.org/) · [Authentik](https://goauthentik.io/) ·
[Vaultwarden](https://github.com/dani-garcia/vaultwarden) · [Traefik](https://traefik.io/traefik/)

**CI/CD & Kubernetes**
[Forgejo](https://forgejo.org/) (+ Actions) · [k3s](https://k3s.io/) · [FluxCD](https://fluxcd.io/) ·
[MetalLB](https://metallb.universe.tf/) · [cert-manager](https://cert-manager.io/) ·
[Harbor](https://goharbor.io/) (+ [Trivy](https://trivy.dev/)) ·
[Cloudflare Tunnel](https://www.cloudflare.com/products/tunnel/)

**Observabilité**
[Prometheus](https://prometheus.io/) · [Grafana](https://grafana.com/) ·
[Loki](https://grafana.com/oss/loki/) · [Grafana Alloy](https://grafana.com/docs/alloy/latest/) ·
[Alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager/) ·
[Zabbix](https://www.zabbix.com/) (provisionné, non actif en continu)

**Sauvegarde**
[Proxmox Backup Server](https://www.proxmox.com/en/products/proxmox-backup-server/overview)

**Streaming média**
[Jellyfin](https://jellyfin.org/) · [Jellyseerr](https://github.com/Fallenbagel/jellyseerr) ·
[Riven](https://github.com/rivenmedia/riven) · Torrentio · Zilean ·
[Prowlarr](https://prowlarr.com/) · [Streamyfin](https://streamyfin.app/) · Wholphin ·
[Jellyfin-Enhanced](https://github.com/n00bcodr/Jellyfin-Enhanced) ·
[JellyBridge](https://github.com/kinggeorges12/JellyBridge) ·
[ElegantFin](https://github.com/lscambo13/ElegantFin) (thème)

**Tests de sécurité (pentest sur ma propre infra)**
[testssl.sh](https://testssl.sh/) · [nuclei](https://github.com/projectdiscovery/nuclei) ·
[nikto](https://cirt.net/Nikto2)

**Domotique & productivité**
[Home Assistant](https://www.home-assistant.io/) · [Vikunja](https://vikunja.io/) ·
[Nextcloud](https://nextcloud.com/) · [Immich](https://immich.app/) · [Cal.com](https://cal.com/)

**Automatisation par IA locale (exploré)**
[n8n](https://n8n.io/) · [Ollama](https://ollama.com/)

## Outillage de travail

Une bonne partie du code (Terraform, Ansible), de la documentation et du diagnostic d'incidents de
ce projet a été produite avec [Claude Code](https://claude.com/claude-code) comme assistant -
détail et limites assumées en [Sur l'usage de Claude Code](/projets/homelab/outillage-ia/).
