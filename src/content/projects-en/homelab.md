---
title: "Homelab - Self-hosted infrastructure"
category: perso
summary: "A personal production infrastructure: 2 Proxmox nodes and an OPNsense firewall, 4 VLANs, internal PKI, SSO, full observability and a Jellyfin streaming stack, all driven as Infrastructure as Code."
period: "2026 - ongoing"
role: "Design, hardware purchase, deployment and operation, solo"
stack: ["Proxmox", "OPNsense", "Terraform", "Ansible", "Tailscale", "OpenBao", "Authentik", "Vaultwarden", "Traefik", "Prometheus", "Grafana", "Loki", "Grafana Alloy", "Alertmanager", "Forgejo", "Suricata", "CrowdSec", "Jellyfin", "Home Assistant", "K3s", "FluxCD", "Proxmox Backup Server"]
tags: ["Infrastructure as Code", "Networking", "Security", "Observability", "CI/CD", "Self-hosting", "Claude Code"]
links:
  demo: "https://homelab.gault-rudy.com/"
  repo: "https://github.com/ECG-Rudy-Glt/HOMELAB"
images: ["/projets/homelab/visite-3d-machine.webp", "/projets/homelab/visite-3d-flux.webp", "/projets/homelab/visite-3d-cluster.webp", "/projets/homelab/pile-mini-pcs.png"]
featured: true
relevance: "majeur"
order: 2
---

A self-hosted infrastructure designed as a production environment rather than a pile of containers: a segmented network, centralised management of secrets and certificates, unified authentication and complete monitoring - all as Infrastructure as Code, with a controlled budget and power consumption.

## Interactive 3D tour

The rack in 3D: click a machine to see the containers and virtual machines it hosts, start a guided tour, follow the path of a request and open the hosted projects. On mobile, the same content opens as a list. The data is sanitised: no address, no port, no identifier.

<iframe src="https://homelab.gault-rudy.com/?embed=1" title="Interactive 3D tour of the homelab" loading="lazy" allow="fullscreen" style="width:100%;height:min(78vh,720px);min-height:520px;border:1px solid var(--border);border-radius:0.75rem;background:var(--bg-elevated);"></iframe>

<p><a href="https://homelab.gault-rudy.com/">Open the tour full screen →</a></p>

## The hardware

A deliberate choice of mini-PCs rather than traditional rack servers, to stay under 80 W at idle. Total budget: about €735 for phase 1.

| Component | Model | Price | Specs |
|---|---|---|---|
| Firewall | N150 mini-PC (bare-metal OPNsense) | ~€170 | Intel N150 4c/3.6 GHz, 12 GB DDR4, 512 GB SSD, 2 NICs, 6-10 W idle |
| Compute ×2 | HP EliteDesk 800 G6 Mini ×2 | ~€370 | Intel Core i5-10500 6c/12t, 32 GB DDR4 each, 512 GB NVMe SSD, 10-20 W idle |
| RAM upgrade | 32 GB DDR4 ×2 nodes | ~€100 | 64 GB in total across the cluster |
| Switch | TP-Link TL-SG108E | ~€40 | 8-port managed Gigabit, 802.1Q |
| Cabling | 1U Cat6 patch panel + cables | ~€35 | |
| Network adapter | USB 3.0 → 2.5G (RTL8156B) | ~€20 | For the phase 1 NAS |
| Phase 1 NAS | 1 TB HDD (ex-iMac, USB) | ~€0 | Temporary storage until the final NAS |
| **Total** | | **~€735** | |

Target consumption: 46-73 W at idle, up to 90-120 W under load - about €50 to €80 per year in electricity.

## Network architecture

<pre class="mermaid">
flowchart TB
    INTERNET["Internet"]
    OPN["OPNsense<br/>firewall - VLANs 802.1Q - Tailscale VPN"]
    N1["node-1 (Proxmox)<br/>permanent services"]
    N2["node-2 (Proxmox)<br/>dev / CI-CD / K8s"]

    INTERNET --> OPN
    OPN --> N1
    OPN --> N2
</pre>

4 VLANs segmented by trust level, with explicit firewall rules between each zone:

| VLAN | Role |
|---|---|
| MGMT | Proxmox, OPNsense, infrastructure - unreachable from the other VLANs |
| LAB | Application services, reverse proxy, dev, future Kubernetes |
| TRUST | Sensitive services: SSO, secrets, password manager, home automation |
| IoT | Home automation devices, isolated from the rest of the network (DNS only) |

Remote administration exclusively through Tailscale (WireGuard mesh) - no administration port exposed to the Internet. Two deliberate exceptions for public uses: this portfolio goes through a Cloudflare Tunnel (no inbound port), and family streaming goes out through a hardened port-forward (GeoIP, CrowdSec, rate limiting) - see [security](/en/projets/homelab/securite/).

## Identity, secrets & PKI

OpenBao (the open-source fork of HashiCorp Vault) plays two roles: an internal certificate authority (10-year Root CA, 5-year Intermediate CA, service certificates renewed automatically every 30 days by a Vault Agent) and a KV secrets vault, consumed by Terraform and Ansible through AppRole - no more plaintext secrets in the Git repository. Authentik provides SSO: OIDC wired to Grafana and to the Proxmox VE administration interface (a dedicated realm, with an Authentik group separate from the default PAM login so as never to risk a lockout), and Vaultwarden serves as a personal password manager, also reachable on mobile through the internal CA installed in the iOS trust store.

## Network security: detection, blocking, visibility

The OPNsense firewall (N150 mini-PC) hosts a full network security layer, on top of per-VLAN filtering:

- **Suricata** in detection mode (IDS, not IPS) on the WAN and the 4 VLANs, with ET Open + abuse.ch rulesets - the Hyperscan pattern matcher was needed to bring CPU load from ~50% down to under 20% on this 4-core hardware before all interfaces could be monitored simultaneously.
- **CrowdSec**: collaborative blocking of malicious IPs, enrolled in the community blocklist, with rules applied directly at the firewall level.
- **Geographic blocking (GeoIP)**: MaxMind GeoLite2 alias on the WAN for countries with a high volume of scanning/attacks.
- **ntopng**: "who talks to whom" visibility per VLAN, useful to spot unexpected inter-VLAN traffic.
- Suricata logs centralised in Loki via syslog, to correlate them with the rest of the observability stack rather than leaving them isolated on the firewall.

## Services in production

**Core infrastructure**
- **Traefik v3**: a single HTTPS reverse proxy for all internal services, with certificates fetched automatically from OpenBao.
- **AdGuard Home**: internal DNS with tracker/ad blocking.
- **OpenBao**: secrets vault + internal PKI (see [Identity, secrets & PKI](#identity-secrets--pki)).
- **Authentik**: OIDC/SAML SSO.
- **Vaultwarden**: family password manager.

**Dev, CI/CD & Kubernetes**
- **Forgejo + Actions**: self-hosted git and CI/CD, with a dedicated self-hosted runner (isolated LXC, Docker executor) - it builds and deploys this portfolio, and validates Terraform/Ansible on every push.
- **vm-dev**: a remote workstation (Debian, Docker, kubectl, Terraform, Ansible) so as never to develop directly on the production infrastructure.
- **k3s + FluxCD**: a lightweight Kubernetes cluster with GitOps (MetalLB, cert-manager), with a namespace dedicated to media streaming.
- **Harbor**: a private Docker/OCI registry with Trivy vulnerability scanning.

**Observability**
- **Prometheus, Grafana, Loki, Grafana Alloy, Alertmanager**: complete observability (metrics, logs, containers) with dedicated dashboards and real alerts (SMTP) - expiring certificate, service down, disk SMART.
- **Zabbix**: provisioned in an LXC, not continuously active (redundant with Prometheus/Grafana for now).

**Home automation & personal use**
- **Home Assistant**: home automation, the only service allowed to talk to the isolated IoT VLAN.
- **Vikunja**: personal task management.
- *Provisioned but not yet in service*: Nextcloud and Immich (personal cloud), Cal.com and an isolated VLAN for future client environments.

**Backup**
- **Proxmox Backup Server**: a dedicated datastore on a separate disk, with deduplication and permanent incremental backups (see [storage](/en/projets/homelab/stockage-hdd/) for details).
- **Encrypted off-site copy** (rclone crypt) of the sensitive services to S3 object storage.
- **Tested restoration** end to end: a backup that has never been restored does not count.

## Media streaming: Jellyfin without local storage

Rather than investing in several TB of disks, the media chain relies on a debrid cloud service: the files stay stored remotely. Radarr and Sonarr manage the library, a debrid client resolves requests, and a WebDAV mount (rclone) presents the files to Jellyfin as if they were local - with hardware transcoding through the mini-PC's integrated Intel GPU. Accessible internally through a Netflix-style web interface (Jellyfin-Vue) and through the native apps (Android TV, iOS). Full details on [the dedicated page](/en/projets/homelab/jellyfin/).

## Known limitations

A serious infrastructure is also judged by what is known about it. What is not yet up to standard, and why:

| Limitation | Risk | Planned follow-up |
|---|---|---|
| Local Terraform state, with no lock | Two administration machines can diverge | Locked remote backend |
| Single firewall, Realtek network cards | Single point of failure, failures under sustained load | Intel cards |
| 2-node Proxmox cluster with no third-party quorum | No automatic failover | External QDevice |
| Single-server k3s | Non-redundant control plane | Acceptable for a lab |
| Manual unsealing of the secrets vault | Dependent services blocked after a restart | Start order already in place, auto-unseal to be studied |
| E-mail-only alerts | No alert if the network itself goes down | Out-of-band channel |

## What remains to be done

A final NAS to replace the current salvaged disk, a self-hosted lossless music streaming service to replace Spotify, an exploration of automation driven by a local LLM (n8n + Ollama), and a WiFi network extension plus a 100% local CCTV camera (design completed, hardware to be ordered - details in [home automation, network and video surveillance](/en/projets/homelab/domotique-reseau/)). Network, security (PKI, SSO, IDS), observability, CI/CD, Kubernetes, backups and video streaming are already operational day to day; the personal cloud (Nextcloud, Immich) is provisioned but not yet open. Full details in [what comes next](/en/projets/homelab/perspectives/).
