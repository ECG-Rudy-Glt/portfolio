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
| **LAB** | Application services, reverse proxy, dev environment, future Kubernetes | Internet (outbound), TRUST for necessary application calls (e.g. reverse proxy → SSO) |
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
Dedicated firewall (OPNsense, bare metal)
   │  inter-VLAN routing, DHCP, DNS, Tailscale VPN, IDS/IPS
   │
Managed switch (802.1Q)
   │
   ├── VLAN MGMT   - hypervisor access only
   ├── VLAN LAB    - reverse proxy, internal DNS, dev, most services
   ├── VLAN TRUST  - SSO, secrets vault, password manager
   └── VLAN IoT    - isolated, DNS only
        │
        └── 2 Proxmox nodes (cluster) - VMs and LXC containers
             ├── node-1: permanent services
             └── node-2: dev, CI/CD, Kubernetes
```

## Remote access without opening a port

Tailscale (mesh VPN, running directly on the firewall) makes it possible to reach the lab from
anywhere without exposing a single inbound port on the WAN. The only deliberate exception is the
streaming service, publicly exposed with its own dedicated protection layers - full details in
[security](/en/projets/homelab/securite/) and [Jellyfin](/en/projets/homelab/jellyfin/).
