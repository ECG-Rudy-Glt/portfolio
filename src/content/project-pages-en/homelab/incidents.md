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

## The firewall swamped by its own interrupts (August-September)

Three total outages of the same kind, the last on 25 September: no LAN, no VPN, no public services
for over an hour, and **no alert received**. The firewall had not crashed: one of its four cores
was saturated at 100% by interrupts from its Realtek network cards, under a sustained inbound
flow. The trigger was internal: a health-check script that re-read part of every file in the
remote library, whose cache downloaded tens of MB instead of a few KB - an estimate made by hand,
never measured. The rate limiter held nothing back: it was set per IP, and the traffic came from
six or seven IPs at once.

The post-mortem found a second outage hidden inside the first: the reverse proxy, restarted
during the cut, had not been able to download its CrowdSec plugin, and had silently disabled every
public route, which stayed broken for several more hours. And no alert went out, because the alert
emails went through the failed firewall.

Fixed since: the script reads only the bytes it needs (0.6 Mbit/s on average instead of 120), the
plugin is embedded in the reverse proxy's configuration, DNS and the secret vault start first after
a reboot, and probes watch the public routes and DNS. Still open: the Intel network card, a
rate limiter with a global cap, and an alert channel that does not depend on the firewall.

## The library emptied by a vanished mount (October)

One night in October, the library's remote mount dropped during a Jellyfin scan. Jellyfin saw
empty folders and removed 788 items from its database. Nothing was lost (the files are remote), but
everything had to be rescanned. Since then, a guard watches the mount **during** the scan and stops
Jellyfin if it disappears: better a stopped service than an emptied library.

## The automatic maintenance that froze streaming (November)

The nightly maintenance script took a snapshot of the Jellyfin container before updating it. The
container freeze never finished, because of the FUSE mount - exactly as in a July incident that I
had not cross-checked when writing the script. Jellyfin was down all night, the backup failed, and
no node was updated. The fix did not stop at the script: the rule "never snapshot this container"
is now written in the repository's instructions **and** blocked by a hook that refuses the
command, whether it comes from me or from an agent (see [AI tooling](/en/projets/homelab/outillage-ia/)).

## The dev workstation that overheated a disk (November)

The development VM froze twice in three days, with an NVMe at 82 °C. Measurements showed over
400 GB read in a few minutes for 55 GB of data: the VM was running out of memory and endlessly
re-reading its disk. The first answer (a read cap) treated the symptom; the recurrence forced me to
find the cause, and the VM got more memory, compressed memory and a guard. The disk itself was not
worn (5%): it was a heat dissipation problem in a mini-PC case, which later led to moving the
Kubernetes server to the other node.

## One night's backups, all failed (November)

Every backup of one night failed at once. The USB disk used as the datastore had been powered back
on **after** the backup server booted, and the server does not remount it by itself. Nothing was
lost, but it is exactly the kind of silent failure a daily check must catch: the mount is now
automatic, and it is one more argument for the final NAS.

## The complete credential rotation

Before any serious pentest, all passwords and secrets created during the construction of the
lab were considered "burned" and methodically rotated - see
[security](/en/projets/homelab/securite/) for why this step comes before the pentest rather than
the other way round.
