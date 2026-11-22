---
project: homelab
title: "What comes next"
summary: "Final NAS, making the network and quorum reliable, version upgrades, internal pentest, Linux migration of the client workstation - what remains, what has been done since, and the common thread behind it all: independence."
order: 10
---

The [project page](/en/projets/homelab/#what-remains-to-be-done) quickly lists what remains to be done.
This page details why these workstreams, in this order of priority.

## The common thread: no longer depending on Big Tech by default

It is not an absolute - some services remain simpler to consume as SaaS - but
taking back control of what reasonably can be is the logic behind each
new workstream of the lab. Every additional self-hosted service is one subscription fewer and one
dependency fewer on a third-party platform.

## What was "next" and is now done

- **Personal cloud**: Immich (photos) and Nextcloud (files) are in service, with alerts on storage
  filling up. They waited until backups and monitoring were ready.
- **A shared, locked Terraform state**: done in November (see [IaC](/en/projets/homelab/iac/)).
- **An AI agent plugged into the lab**: that is Hermes, which explains alerts, takes film requests
  and controls the house (see [AI tooling](/en/projets/homelab/outillage-ia/)). It does not run on a
  local LLM, unlike the original idea: measured on these GPU-less mini-PCs, it was too slow. The
  chosen trade-off is a remote model with a capped budget, behind guardrails that do not depend on it.
- **GitOps applications**: Patrimoine, COACH and a CRM run on Kubernetes, one repository per
  application.

## What was abandoned

**Self-hosted music streaming.** The goal was to replace Spotify with a lossless library, using
Navidrome and automated acquisition. The project was started, then abandoned in early November: its
VM loaded an NVMe drive that was already reaching 80 °C, and the gain did not justify adding load to
a lab that was running hot. Abandoning cleanly is part of the work too: VM removed through
Terraform, storage freed, roles and scripts removed from the repository.

## Final NAS

Proxmox Backup Server runs, with an encrypted off-site copy and a tested restore. But its datastore
lives on a disk salvaged from an iMac (see [storage](/en/projets/homelab/stockage-hdd/)), plugged in
over USB: one night every backup failed because it had been powered on after the backup server. A
dedicated NAS will replace it, without changing the backup chain itself.

## Making what exists reliable

- **The firewall's network card**: replace the Realtek cards with Intel ones, the real answer to
  the summer's outages under load (see [the real outages](/en/projets/homelab/incidents/)).
- **Cluster quorum**: an external QDevice, so that one node can fail without blocking the other.
- **A truly out-of-band alert channel**: today, email, Home Assistant and Telegram all depend on
  the lab's Internet connection.
- **Mini-PC heat dissipation**: the NVMe drives reach 80 °C under load. Read caps and
  temperature-aware placement are in place; cooling remains to be revisited.
- **Version upgrades**: Proxmox Backup Server 4, then Debian 13 guest by guest, with a new VM
  template alongside the current one.

## The internal pentest

The external pentest checked the public surface (see [security](/en/projets/homelab/securite/)).
The internal side - an attacker already present on a VLAN - is still to be done, and it is the next
security exercise.

## Linux migration of the client workstation

The personal Dell XPS 15 remains today a simple terminal into the lab (see
[the services](/en/projets/homelab/services/)) - all the computing and state live on the
infrastructure. The last planned step is to migrate this workstation itself to Linux, so as to
also take the daily typing machine out of the Windows ecosystem.

## And after - Platform Engineering

This homelab started as an end-of-4th-year project (see [why this project](/en/projets/homelab/pourquoi/)),
and today it is the ground for what comes next: my freelance work runs on it (site, booking, CRM),
and it is the test bench for my [Platform × Harness engineer learning path](/en/projets/parcours-platform-harness/),
where every module ends with a lab on this infrastructure: a Kubernetes operator, golden paths, a
signed supply chain, SLOs, and a platform for running isolated agents.
