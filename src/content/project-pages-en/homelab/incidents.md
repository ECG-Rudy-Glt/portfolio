---
project: homelab
title: "The real outages"
summary: "An infrastructure that has never had a serious incident has never really run. The story of a few formative outages, with the diagnostic method used."
order: 6
---

A homelab that has never had a serious incident has never really run. What follows is not
a list of services that work - it is the diagnostic method used when
something breaks, often more revealing than a 100% uptime.

## The total network outage

The most stressful scenario to date: no more access to the infrastructure, all
family services (streaming, passwords) unreachable. Method, from the simplest to the most thorough:

1. **Isolate what still responds** - the firewall (a machine separate from the cluster, see
   [the equipment](/en/projets/homelab/materiel/)) remained reachable, which immediately ruled out
   a general power cut
2. **Use this surviving machine as an observation post** - its ARP table showed
   no entry for the two Proxmox nodes, while the other VLANs responded normally
   for their own gateways
3. **Read the network traffic graphs** (RRD) to date the incident precisely - a sharp
   drop in throughput at a precise timestamp, making it possible to cross-reference with the system logs instead of
   searching blindly over 24 hours
4. **Conclusion**: the two physical virtualisation machines were down simultaneously,
   with no network explanation - on to physical access

The lesson is not the cause itself, but the method: isolate what still responds before
assuming everything is broken, and use the surviving elements as observation points
rather than guessing.

## The VLAN migration - the real post-mortem

Moving from a flat network to 4 segmented VLANs (see [the infrastructure](/en/projets/homelab/infrastructure/))
broke several things before it worked:
- Swapped switch ports (wrong VLAN on the wrong physical port)
- A missing `bridge-vids` setting on the Proxmox side, which silently limited the VLANs
  allowed to cross the network bridge
- A blocking firewall rule discovered late, which filtered legitimate traffic with no
  explicit error message

Each of these three problems, taken in isolation, was a simple configuration oversight. Together,
they turned a migration planned for one evening into several days of diagnosis - the real lesson being that a network change must be split into
steps verifiable one by one,
not applied in one go.

## The Jellyfin chain of failures

A cascading incident that shows how a first minor problem can trigger
others if the automatic recovery mechanisms are not themselves made reliable - detailed
in [the Jellyfin page](/en/projets/homelab/jellyfin/). In short: a backup job freezes on
the FUSE mount point used for streaming, the container ends up locked, a
forced restart resolves the lock but crashes a plugin along the way, and the first
fix moves the problem rather than solving it - the generated archives fill the
host's disk. The lesson: a fix that only addresses the visible symptom leaves the real
structural cause intact, and it comes back in another form.

## The night-time network instability

An instability on the network switch caused cascading outages on several
independent services (frozen password manager, streaming service in a restart loop)
the same night - a good reminder that in a segmented infrastructure, a single shared layer
(here the physical network) remains a common point of failure for everything that depends on it, despite the
logical segmentation into VLANs.

## The complete credential rotation

Before any serious pentest, all passwords and secrets created during the construction of the
lab were considered "burned" and methodically rotated - see
[security](/en/projets/homelab/securite/) for why this step comes before the pentest rather than
the other way round.
