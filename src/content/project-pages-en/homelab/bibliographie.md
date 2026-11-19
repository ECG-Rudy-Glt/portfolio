---
project: homelab
title: "Bibliography - sources and technologies"
summary: "The guides that laid the foundations of this project, and the complete list of technologies used, layer by layer."
order: 11
---

This page is not just another article: it is the reference list. On one side, the sources that
shaped the architecture before the very first hardware purchase. On the other, the complete
inventory of the technologies actually deployed on the lab, rather than scattered throughout the
pages.

## The main source of inspiration: Stéphane Robert

The trigger for the project was discovering [Stéphane Robert's blog](https://blog.stephane-robert.info/docs/homelab/)
and his [homelab roadmap](https://blog.stephane-robert.info/docs/homelab/roadmap/) - a clear
structure, with justified choices rather than a pile of services (details in
[the infrastructure](/en/projets/homelab/infrastructure/)). It served as a methodological foundation, not as a
copy: each choice was then adapted to my own constraints. The guides actually followed,
over the different phases:

- [Hardware choice - OPNsense/pfSense mini-PC](https://blog.stephane-robert.info/docs/homelab/materiel/mini-pc-opnsense-pfsense/)
- [Tailscale on OPNsense](https://blog.stephane-robert.info/docs/homelab/opnsense-tailscale/)
- [Proxmox administration node](https://blog.stephane-robert.info/docs/homelab/noeud-admin-proxmox/)
- [Authentik installation with Docker Compose](https://blog.stephane-robert.info/docs/services/identite/authentik/installation-docker-compose/)
- [Securing with CrowdSec](https://blog.stephane-robert.info/docs/securiser/reseaux/crowdsec/)
- [Exposure via Cloudflare Tunnel](https://blog.stephane-robert.info/docs/securiser/acces/cloudflared/)
- [Ansible modules for Proxmox](https://blog.stephane-robert.info/docs/virtualiser/type1/proxmox/ansible-modules/)
- Vault initialisation script - the basis of the lab's OpenBao bootstrap, adapted to the `bao` binary and
  to the project's actual values (see [the internal PKI](/blog/homelab-pki-secrets/))

## The technologies, layer by layer

**Virtualisation & IaC**
[Proxmox VE](https://www.proxmox.com/en/products/proxmox-virtual-environment/overview) ·
[Terraform](https://www.terraform.io/) · [Ansible](https://www.ansible.com/)

**Network & perimeter security**
[OPNsense](https://opnsense.org/) · [Tailscale](https://tailscale.com/) ·
[Suricata](https://suricata.io/) · [CrowdSec](https://www.crowdsec.net/) ·
[ntopng](https://www.ntop.org/products/traffic-analysis/ntop/) ·
[MaxMind GeoLite2](https://www.maxmind.com/en/geoip2-databases) ·
[AdGuard Home](https://adguard.com/en/adguard-home/overview.html)

**Identity, secrets & access**
[OpenBao](https://openbao.org/) · [Authentik](https://goauthentik.io/) ·
[Vaultwarden](https://github.com/dani-garcia/vaultwarden) · [Traefik](https://traefik.io/traefik/)

**CI/CD & Kubernetes**
[Forgejo](https://forgejo.org/) (+ Actions) · [k3s](https://k3s.io/) · [FluxCD](https://fluxcd.io/) ·
[MetalLB](https://metallb.universe.tf/) · [cert-manager](https://cert-manager.io/) ·
[Harbor](https://goharbor.io/) (+ [Trivy](https://trivy.dev/)) ·
[Cloudflare Tunnel](https://www.cloudflare.com/products/tunnel/)

**Observability**
[Prometheus](https://prometheus.io/) · [Grafana](https://grafana.com/) ·
[Loki](https://grafana.com/oss/loki/) · [Grafana Alloy](https://grafana.com/docs/alloy/latest/) ·
[Alertmanager](https://prometheus.io/docs/alerting/latest/alertmanager/) ·
[Zabbix](https://www.zabbix.com/) (provisioned, not continuously active)

**Backup**
[Proxmox Backup Server](https://www.proxmox.com/en/products/proxmox-backup-server/overview)

**Media streaming**
[Jellyfin](https://jellyfin.org/) · [Jellyseerr](https://github.com/Fallenbagel/jellyseerr) ·
[Riven](https://github.com/rivenmedia/riven) · Torrentio · Zilean ·
[Prowlarr](https://prowlarr.com/) · [Streamyfin](https://streamyfin.app/) · Wholphin ·
[Jellyfin-Enhanced](https://github.com/n00bcodr/Jellyfin-Enhanced) ·
[JellyBridge](https://github.com/kinggeorges12/JellyBridge) ·
[ElegantFin](https://github.com/lscambo13/ElegantFin) (theme)

**Security testing (pentest on my own infrastructure)**
[testssl.sh](https://testssl.sh/) · [nuclei](https://github.com/projectdiscovery/nuclei) ·
[nikto](https://cirt.net/Nikto2)

**Home automation & productivity**
[Home Assistant](https://www.home-assistant.io/) · [Vikunja](https://vikunja.io/) ·
[Nextcloud](https://nextcloud.com/) · [Immich](https://immich.app/) · [Cal.com](https://cal.com/)

**Local AI automation (explored)**
[n8n](https://n8n.io/) · [Ollama](https://ollama.com/)

## Working tools

A good part of the code (Terraform, Ansible), documentation and incident diagnosis of
this project was produced with [Claude Code](https://claude.com/claude-code) as an assistant -
details and acknowledged limits in [On using Claude Code](/en/projets/homelab/outillage-ia/).
