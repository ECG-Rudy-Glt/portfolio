---
title: "Homelab - Self-hosted infrastructure"
category: perso
summary: "A personal production infrastructure: 2 Proxmox nodes and an OPNsense firewall, 4 VLANs, internal PKI, SSO, full observability, 25 guests of which 22 in Terraform, GitOps applications on k3s and a guarded AI assistant - all driven as Infrastructure as Code."
period: "2026 - ongoing"
role: "Design, hardware purchase, deployment and operation, solo"
stack: ["Proxmox", "OPNsense", "Terraform", "Ansible", "Tailscale", "OpenBao", "Authentik", "Vaultwarden", "Traefik", "AdGuard Home", "Prometheus", "Grafana", "Loki", "Grafana Alloy", "Alertmanager", "Forgejo", "Harbor", "Suricata", "CrowdSec", "Jellyfin", "Home Assistant", "Immich", "Nextcloud", "K3s", "FluxCD", "Cloudflare Tunnel", "Proxmox Backup Server"]
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

A deliberate choice of mini-PCs rather than traditional rack servers, to keep power consumption under control. Total budget: about €735 for phase 1.

| Component | Model | Price | Specs |
|---|---|---|---|
| Firewall | N150 mini-PC (bare-metal OPNsense) | ~€170 | Intel N150 4c/3.6 GHz, 12 GB DDR4, 512 GB SSD, 2 NICs, 6-10W idle |
| Compute ×2 | HP EliteDesk 800 G6 Mini ×2 | ~€370 | Intel Core i5-10500 6c/12t, 32 GB DDR4 each, 512 GB NVMe SSD, 10-20W idle |
| RAM upgrade | 32 GB DDR4 ×2 nodes | ~€100 | 64 GB in total across the cluster |
| Switch | TP-Link TL-SG108E | ~€40 | 8-port managed Gigabit, 802.1Q |
| Cabling | 1U Cat6 patch panel + cables | ~€35 | |
| Network adapter | USB 3.0 → 2.5G (RTL8156B) | ~€20 | For the phase 1 NAS |
| Phase 1 NAS | 1 TB HDD (ex-iMac, USB) | ~€0 | Temporary storage until the final NAS |
| **Total** | | **~€735** | |

Consumption has been **measured** since November 2026 by a smart plug tracked in Home Assistant: about 70 W on average (50 W idle, 150 W at boot), roughly 610 kWh and €120 of electricity a year.

## In numbers (November 2026)

| | |
|---|---|
| Proxmox nodes | 2, plus a bare-metal firewall |
| Guests (VMs and LXC containers) | 25, of which 22 are described in Terraform |
| HTTPS routes behind the reverse proxy | 41 |
| Applications on Kubernetes (k3s) | 4 application namespaces, managed with GitOps |
| Ansible roles | 26 |

These numbers are not copied by hand: a script reads Proxmox, Terraform, Traefik, k3s and Ansible in read-only mode and **generates the lab inventory**. It has become the source of truth, with one card per guest listing its known pitfalls (see [AI tooling](/en/projets/homelab/outillage-ia/)).

## Architecture

<pre class="mermaid">
flowchart TB
    INTERNET["Internet"]
    CF["Cloudflare Tunnel<br/>public sites, no inbound port"]
    OPN["OPNsense (bare metal)<br/>802.1Q VLANs · Suricata · CrowdSec · GeoIP · Tailscale"]
    TRAEFIK["Traefik + CrowdSec<br/>single HTTPS reverse proxy"]
    N1["node-1 · permanent services<br/>SSO · secrets and PKI · DNS · monitoring<br/>Jellyfin · Home Assistant · photos and files · backups"]
    N2["node-2 · dev and platform<br/>dev workstation · Forgejo + runner · registry<br/>secondary DNS · AI assistant · public sites"]
    K3S["k3s on both nodes · FluxCD<br/>Patrimoine · COACH · CRM · media"]

    INTERNET --> OPN
    INTERNET -.-> CF
    CF -.-> N2
    OPN -->|"filtered port, family services"| TRAEFIK
    TRAEFIK --> N1
    TRAEFIK --> N2
    TRAEFIK --> K3S
    N1 --- K3S
    N2 --- K3S
</pre>

The full interactive diagram, with six request paths (admin access, public site, streaming, film request, alert, deployment), is on the [flow map](https://homelab.gault-rudy.com/flux/) of the homelab site.

4 VLANs separated by trust level, with explicit firewall rules between every zone:

| VLAN | Role |
|---|---|
| MGMT | Proxmox, OPNsense, infrastructure - unreachable from the other VLANs |
| LAB | Application services, reverse proxy, dev, Kubernetes, the lab's Wi-Fi access point |
| TRUST | Sensitive services: SSO, secrets, password manager, home automation |
| IoT | Home automation devices, isolated from the rest of the network (DNS only) |

**Three entry paths, chosen by use** (decision documented in an ADR):

- **Administration**: never exposed, Tailscale only (a WireGuard mesh running on the firewall).
- **Public sites** (this portfolio, my freelance site, my project showcases): Cloudflare Tunnel. The container opens an outbound connection itself; no inbound port is opened for them.
- **Family services** (streaming, film requests, SSO, notifications, the Patrimoine app): a non-standard port to Traefik, filtered by CrowdSec, GeoIP and rate limiting. Streaming cannot go through the tunnel: Cloudflare's terms forbid it.

Internal DNS has been **redundant** since November: one AdGuard Home on each node, both announced by DHCP, and all DNS traffic on the network redirected to them, including devices that hard-code their DNS.

## Identity, secrets & PKI

OpenBao (the open-source fork of HashiCorp Vault) plays two roles: internal certificate authority (10-year Root CA, 5-year Intermediate CA, 30-day service certificates renewed automatically) and KV secret store, consumed by Terraform and Ansible through AppRole - no plain-text secret in the Git repository. Since November, even the Proxmox admin interface presents a certificate signed by OpenBao, renewed daily by an AppRole that can only issue it. Authentik provides SSO: OIDC wired into Grafana and Proxmox VE (a dedicated realm, with no lockout risk), and it authenticates access to the exposed Patrimoine app. Vaultwarden is the family password manager. Full detail in the article [Building an internal PKI](/blog/homelab-pki-secrets/) (in French).

## Network security: detection, blocking, visibility

The OPNsense firewall (N150 mini-PC) hosts a full network security layer on top of VLAN filtering:

- **Suricata** in detection mode (IDS) on the WAN and the 4 VLANs, ET Open + abuse.ch rulesets - the Hyperscan pattern matcher was needed to bring CPU load from ~50% down to under 20% on this 4-core hardware.
- **CrowdSec**: collaborative blocking of malicious IPs, at the firewall and as a bouncer in front of Traefik for exposed services.
- **Geographic blocking (GeoIP)**: MaxMind GeoLite2 aliases on the WAN.
- **ntopng**: "who talks to whom" visibility per VLAN.
- Suricata logs centralised in Loki, to correlate them with the rest of the observability stack.

## Services in production

**Core infrastructure**
- **Traefik v3**: single HTTPS reverse proxy (41 routes), certificates issued by OpenBao, CrowdSec bouncer.
- **AdGuard Home ×2**: redundant internal DNS, blocking trackers and ads (about 40% of requests blocked over 24 hours).
- **OpenBao**, **Authentik**, **Vaultwarden**: secrets and PKI, SSO, passwords.

**Dev, CI/CD & platform**
- **Forgejo + Actions**: self-hosted git and CI/CD, with a dedicated runner (isolated LXC, Docker executor). It builds and deploys this portfolio, the project sites and the applications, and validates Terraform and Ansible on every push.
- **vm-dev**: a remote workstation, so I never develop directly on the production infrastructure.
- **Harbor**: private OCI registry with Trivy vulnerability scanning.
- **k3s + FluxCD** (MetalLB, cert-manager): each application has its own repository, which Flux follows. Today: [Patrimoine](/en/projets/patrimoine/) (household budget and wealth tracking, as microservices, with its ntfy notifications), [COACH](/en/projets/coach/) (sports coaching), a CRM for my freelance work, and the request and indexing part of the media chain.
- **Public sites**: this portfolio, my freelance site and the showcases of [Relai](/en/projets/relai/), COACH, Patrimoine and the homelab, deployed automatically by CI.

**Observability**
- **Prometheus, Grafana, Loki + Alloy, Blackbox, Alertmanager**: metrics, logs and probes, with real alerts (expiring certificate, service down, SMART health, NVMe temperature, storage pools filling up).
- Alerts go out by **email**, to **Home Assistant** (a notification on the phone) and are **explained on Telegram** by the lab assistant (below).

**The lab's AI assistant: Hermes**
- A Telegram bot that answers the family and me: the state of the house, film requests with quotas, allowlisted home commands, an explanation of every new alert, and a weekly technical watch (new versions and known vulnerabilities of the lab's tools).
- Model: Claude Haiku, behind a local budget guard capped at $1 a month. The bot has **no direct access** to Home Assistant or the rest of the lab: it goes through a separate policy service, which holds the tokens, enforces roles and asks for out-of-band confirmation of sensitive actions. Detail in [AI tooling](/en/projets/homelab/outillage-ia/).

**Home & personal use**
- **Home Assistant**: Zigbee, Matter over Thread, energy (the lab's own consumption is tracked continuously), the only service allowed to talk to the IoT VLAN. Detail in the article [Home Assistant in my homelab](/blog/home-assistant/) (in French).
- **Immich** (photos) and **Nextcloud** (files): in service, with alerts on storage filling up.
- **Vikunja** (tasks), **Cal.com** (booking for my freelance work), **Shelfmark** (books sent straight to an e-reader), a home portal and a few tools (PDF, utilities).

**Backups**
- **Proxmox Backup Server**: a dedicated datastore on a separate disk, deduplicated and incremental (see [storage](/en/projets/homelab/stockage-hdd/)).
- **Encrypted off-site copy** (rclone crypt) of sensitive services to S3 object storage.
- **Restores tested** end to end, and an automatic check after every node reboot.

## Media streaming: Jellyfin without local storage

The media chain relies on a cloud debrid service: no video file is stored locally. Radarr and Sonarr manage the library as links to a WebDAV mount (rclone), Jellyfin reads them with hardware transcoding on the integrated Intel GPU, and requests go through Jellyseerr (on Kubernetes, with indexing behind a VPN). A set of systemd guards watches the mount and stops Jellyfin if it disappears, so the library is never emptied. Full detail on [the dedicated page](/en/projets/homelab/jellyfin/).

## Known limitations

A serious infrastructure is also judged by what you know about it. What is not yet up to standard, and why:

| Limitation | Risk | Next step |
|---|---|---|
| Single firewall, Realtek network cards | Single point of failure; three outages under load between August and September (see [the real outages](/en/projets/homelab/incidents/)) | Intel network card |
| 2-node Proxmox cluster without a third quorum vote | No automatic failover | External QDevice |
| k3s with a single server | Control plane not redundant | Acceptable for a lab |
| Manual unsealing of the secret store | Dependent services blocked after a reboot | Boot order already set, auto-unseal to study |
| Every alert depends on the WAN | Email, Home Assistant and Telegram all go down with the Internet | A truly out-of-band channel |
| Heat dissipation in the mini-PCs | NVMe drives reach 80 °C under load (photos, large scans) | Read caps in place, cooling to revisit |
| Wi-Fi devices on the lab VLAN | The access point does not allow the planned multi-SSID (firmware cannot be replaced) | Per-device rules until a compatible access point |
| Backups on a USB disk | The disk must be mounted before the backup server | Final NAS |

**Recently solved**: the Terraform state moved to a locked S3 backend shared between workstations (November 2026, see [IaC](/en/projets/homelab/iac/)).

## What remains to be done

A final NAS to replace the current salvaged disk, the Intel network card for the firewall, a QDevice for quorum, the move to Proxmox Backup Server 4 then Debian 13 guest by guest, and the internal side of the pentest. Self-hosted music streaming was started then abandoned in early November: its VM loaded an NVMe drive that was already reaching 80 °C, for a gain that did not justify the load. Detail in [what comes next](/en/projets/homelab/perspectives/).
