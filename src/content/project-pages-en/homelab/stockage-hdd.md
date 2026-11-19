---
project: homelab
title: "Storage - from a dismantled iMac to Proxmox Backup Server"
summary: "The hard drive serving as phase 1 NAS comes from a salvaged, dismantled iMac. The detail of putting it back into service: health check, USB stability, and the switch to real deduplicated backup."
order: 8
---

## Where this disk comes from

The project budget (see [the equipment](/en/projets/homelab/materiel/)) prioritises the core of the
infrastructure before dedicated storage. Rather than wait for a new NAS to have real
backups, the solution chosen was a hard drive salvaged from a dismantled iMac - a chance to
give it a second life rather than leave it for the skip. The complete dismantling (extracting
the disk from an all-in-one iMac, not designed to be opened easily) is the subject of a
dedicated article: [Turning a 27" iMac into an external display](/blog/imac-ecran/).

## Do not trust a salvaged disk without checking it

A disk coming from an unknown use over several years does not go straight into
production. Method followed before any use:

1. **Complete S.M.A.R.T. check** - not just the overall "PASSED" status, but the
   counters that really matter: reallocated sectors, pending suspect sectors, uncorrectable
   errors. All at zero was the condition to continue.
2. **Active test, not only passive** - a short test then an extended test of several hours
   that actually reads the whole surface of the disk, rather than relying on the declarative
   history alone.
3. **USB connection stability** - an external disk on a server running continuously
   may be put to sleep by the system or disconnect depending on the enclosure's chipset;
   checked before considering the disk reliable.

Result: a disk with a real usage history (several thousand hours of
operation, many power cycles) but without a single defective sector -
usable, with ongoing vigilance rather than blind trust.

## From simple backup to Proxmox Backup Server

The first option - a basic "directory" storage on the hypervisor side - works but makes a
**full backup on every run**, with no deduplication. The chosen target is
**Proxmox Backup Server**: block-level deduplication, permanent incremental backups, native integrity
verification. The disk is handled there as a removable datastore, with direct USB passthrough
to a dedicated VM rather than a simple directory mount - which gives PBS native block
access rather than an extra abstraction layer.

## The 3-2-1 rule, partially

The goal: 3 copies of the data, on 2 different media, 1 of them off-site.
- **Copy 1**: the data in production (VMs, containers)
- **Copy 2**: this phase 1 NAS, on a disk physically distinct from the SSDs running the
  VMs
- **Copy 3 (off-site)**: client-side encrypted synchronisation to cloud object storage,
  restricted to services with real state to lose - configuration, secrets, databases.
  Media content explicitly does not need to be backed up: see
  [Jellyfin without local storage](/en/projets/homelab/jellyfin/) to understand why.

Encryption of the off-site copy is done **before** the data leaves the local
network - nothing in plaintext is sent to the third-party cloud storage.

## A backup that has never been restored is only a hope

A backup job that runs without errors proves nothing by itself - only a real restore
proves it. Test carried out in real conditions: complete restore of a production
container (Vikunja) from PBS, then again from the encrypted off-site copy - both
restores succeeded without data loss. It is this verification, more than the existence of the
job itself, that makes the 3-2-1 strategy above credible rather than theoretical.
