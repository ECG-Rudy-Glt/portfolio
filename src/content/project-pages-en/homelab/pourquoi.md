---
project: homelab
title: "Why this project"
summary: "The motivation behind €735 and several months of evenings: building skills across a whole infrastructure, preparing for life after the work-study and for independence."
order: 1
---

## The starting point

This project started as part of the end of my 4th year at Supinfo (DevOps track, on a
work-study contract) - but it does not stop at an academic deliverable. A work-study contract teaches a trade
within a company: a stack, processes, a scope. I needed to step outside
that scope to touch layers that my position does not give me the chance to practise:
bare-metal networking, internal PKI, offensive security.

## What I wanted to get out of it

**The whole chain, not a single link.** A DevOps position in a company rarely touches network,
hypervisor, IaC, security and observability all at once. Here, I am solely responsible for
the whole stack - from the VLAN to the TLS certificate, including the inter-service firewall. It is
uncomfortable at first (nobody to hand a network bug to at 11 pm) but it is exactly what
builds an overall vision.

**Training in practice, not in theory.** Reading documentation on network segmentation and configuring
VLANs with firewall rules that actually have to hold (see
[security](/en/projets/homelab/securite/)) - not the same understanding.

**Complementing what the work-study does not cover.** Offensive security, internal PKI, GitOps on a
real K8s cluster, secrets management with a vault - all subjects practised here with
complete autonomy, decisions and mistakes included.

**Preparing for independence and life after the work-study.** In the long run, the goal is to be able to operate
an infrastructure end to end on my own, and to prepare a freelance activity - notably in security.
A pentest run on your own infrastructure, with the fullest possible authorisation
since it is yours, is a realistic training ground that no CTF quite reproduces.

**No longer depending on Big Tech by default.** Taking back control of what reasonably can be
(passwords, photos, files, music, DNS) - a common thread detailed in
[what comes next](/en/projets/homelab/perspectives/).

## A non-negotiable constraint from the start

This homelab runs at home, on the same network as my partner - who works remotely
on a regular basis. No way my network experiments would disturb her connection
while she works. This constraint weighed on the architecture from the first diagram: the
lab had to be cleanly isolated from the rest of the household, not the other way round. See
[the infrastructure](/en/projets/homelab/infrastructure/) for the detail of this segmentation.
