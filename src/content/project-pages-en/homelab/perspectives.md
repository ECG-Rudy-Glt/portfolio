---
project: homelab
title: "What comes next"
summary: "Final NAS, personal cloud, self-hosted music streaming, local AI automation, Linux migration of the client workstation - and the common thread behind all of it: independence."
order: 10
---

The [project page](/en/projets/homelab/#what-remains-to-be-done) quickly lists what remains to be done.
This page details why these workstreams, in this order of priority.

## The common thread: no longer depending on Big Tech by default

It is not an absolute - some services remain simpler to consume as SaaS - but
taking back control of what reasonably can be is the logic behind each
new workstream of the lab. Every additional self-hosted service is one subscription fewer and one
dependency fewer on a third-party platform.

## Personal cloud - Nextcloud and Immich

Taking back control of file storage and family photos rather than depending on
a third-party cloud. Technically already provisioned, not yet made available with real
data - priority was given to the foundations (network, security, observability) before
exposing a service that the family would use daily with sensitive data.

## Final NAS

Proxmox Backup Server already runs, with an encrypted off-site copy and a tested restore.
But its datastore lives on a disk salvaged from an iMac (see [storage](/en/projets/homelab/stockage-hdd/)):
a phase 1 solution, not the final target. A dedicated NAS will replace it, without changing the
backup chain itself.

## Self-hosted music streaming

Replacing Spotify (family plan) with a lossless stack, with algorithmic discovery and
free search - without depending on a generative AI engine for recommendations. A lead
seriously explored: a lightweight streaming server compatible with a wide ecosystem of
mobile clients, coupled with an automated acquisition mechanism in the style of Jellyfin
(see [the Jellyfin page](/en/projets/homelab/jellyfin/)), and a recommendation engine based on
collaborative filtering rather than on an LLM. The real challenge identified is not the tooling but the
availability of content: a debrid service has a much lower immediate availability rate for lossless music
than for mainstream video - the solution is to intelligently pre-fill the library rather than
going fully on demand.

## Local AI automation

A lead explored but deliberately set aside for now: wiring a local LLM
(self-hosted, no third-party API) to concrete automations of the lab - incident summaries,
alert triage, diagnostic assistance. The principle retained: if AI has to touch the infrastructure,
it runs locally, on the lab itself, consistent with the project's general philosophy of
independence.

## Linux migration of the client workstation

The personal Dell XPS 15 remains today a simple terminal into the lab (see
[the services](/en/projets/homelab/services/)) - all the computing and state live on the
infrastructure. The last planned step is to migrate this workstation itself to Linux, so as to
also take the daily typing machine out of the Windows ecosystem.

## And after - freelancing

This homelab started as an end-of-4th-year project (see
[why this project](/en/projets/homelab/pourquoi/)), but its goal goes beyond the academic framework:
preparing an independent activity, notably in security. The pentest carried out on my own
infrastructure (see [security](/en/projets/homelab/securite/)) is the first concrete exercise
in that direction - the logical next step is to reproduce this rigour on infrastructures
that are not mine.
