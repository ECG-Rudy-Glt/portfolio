---
project: homelab
title: "The network infrastructure, in detail"
summary: "The inspiration behind the architecture, the detail of the 4 VLANs and their inter-zone rules, and why segmentation went further than a simple split in principle."
order: 3
---

## The starting point

I did not design this architecture in a vacuum. The trigger was discovering
[Stéphane Robert's homelab](https://blog.stephane-robert.info/docs/homelab/) and its
[roadmap](https://blog.stephane-robert.info/docs/homelab/roadmap/) - a clear structure, with
justified choices rather than a pile of services. It served as a methodological foundation, not
as a copy: a separate bare-metal firewall, Proxmox as a cluster, VLAN segmentation as a
foundation rather than an afterthought, everything as Infrastructure as Code from the start. Each
choice was then adapted to my own constraints - notably that of never degrading the
family network (see [why this project](/en/projets/homelab/pourquoi/)).

## Why 4 VLANs and not 2 or 3

The project summary mentions 4 zones (MGMT, LAB, TRUST, IoT). The detail of the logic behind
this particular split:

| VLAN | Contains | Can reach |
|---|---|---|
| **MGMT** | Proxmox, OPNsense itself | Nothing else must reach it from another VLAN without an explicit rule |
| **LAB** | Application services, reverse proxy, dev environment, Kubernetes, a Wi-Fi access point dedicated to the lab | Internet (outbound), TRUST for necessary application calls (e.g. reverse proxy → SSO) |
| **TRUST** | SSO, secrets vault, password manager, home automation | Limited Internet, never an initiator towards MGMT |
| **IoT** | Home automation devices | DNS only - no Internet access, no access to the rest of the network |

The rule that structures everything: **a more sensitive VLAN never trusts a less
sensitive VLAN without an explicit reason.** LAB can call TRUST (the reverse proxy has to talk to the SSO),
but TRUST has no reason to initiate a connection towards LAB. It is this kind of rule that was
verified concretely during the pentest - see [security](/en/projets/homelab/securite/) for what
was found when testing this theory in real conditions.

## The family network, out of the lab's reach

The household (TV, phones, my partner's computer for remote work) does not live on these 4 VLANs -
it is a separate network, which never crosses the lab's firewall rules. This was a
design constraint from the very first diagram, not an adjustment after the fact: the risk of
experimentation had to remain confined to the lab, never affecting real professional use
under the same roof.

## Overview

```
Internet
   │
ISP box (double NAT)
   │
Dedicated firewall (OPNsense, bare metal)
   │  inter-VLAN routing, DHCP, IDS, CrowdSec, GeoIP, Tailscale VPN
   │
Managed switch (802.1Q)
   │
   ├── VLAN MGMT   - hypervisor access only
   ├── VLAN LAB    - reverse proxy, DNS, dev, Kubernetes, lab Wi-Fi
   ├── VLAN TRUST  - SSO, secret vault, passwords, home automation
   └── VLAN IoT    - isolated, DNS only
        │
        └── 2 Proxmox nodes (cluster) - 25 VMs and LXC containers
             ├── node-1: permanent services (SSO, secrets, DNS, monitoring,
             │           streaming, home automation, photos and files, backups)
             └── node-2: dev and platform (dev workstation, Forgejo and its runner,
                          registry, secondary DNS, AI assistant, public sites)
        k3s spans both nodes: the server on node-1, the worker on node-2
```

The split is not fixed. In November, node-2's NVMe drive reached 79 °C at idle, against 39 °C
for the same model on node-1: a heat dissipation problem, not wear. The k3s server was moved to
node-1, and placement now also follows temperature.

## Three entry paths, not one

Each use has its own path, from the most closed to the most open:

| Use | Path | Inbound ports |
|---|---|---|
| Administration | Tailscale (WireGuard mesh, on the firewall) | None |
| Public sites (portfolio, freelance site, project showcases) | Cloudflare Tunnel, outbound connection started from the lab | None |
| Family services (streaming, film requests, SSO, notifications, Patrimoine app) | Non-standard port to Traefik, filtered by CrowdSec, GeoIP and rate limiting | One |

Streaming cannot go through the tunnel (Cloudflare's terms forbid video at volume), hence this
single port, defended in depth and checked by an external pentest - detail in
[security](/en/projets/homelab/securite/) and [Jellyfin](/en/projets/homelab/jellyfin/).

## A DNS that no longer goes down with a single container

DNS is the service everything depends on without anyone seeing it. Since November 2026 there is
an AdGuard Home on each node, DHCP announces both, and the firewall redirects all DNS traffic on
the network to them, including devices that hard-code their DNS (the TV, notably). A node can
reboot without the house losing the Internet. Along the way, about 40% of requests are blocked
trackers or ads.
