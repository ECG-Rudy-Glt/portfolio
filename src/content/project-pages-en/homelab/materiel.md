---
project: homelab
title: "The equipment - the choices and their reasons"
summary: "The hardware detail is on the project page. Here, the why of each choice: the alternatives ruled out, the trade-offs, and what it replaces in real cost."
order: 2
---

The figures (components, prices, specs) are on the
[main project page](/en/projets/homelab/#the-hardware). This page covers the reasoning
behind each choice - what does not fit in a table.

## Why a dedicated firewall rather than an OPNsense VM

The simplest option would have been an OPNsense VM on one of the Proxmox nodes - zero extra
hardware. Deliberately ruled out: if the hypervisor goes down, the network goes down with it, with no
more access to diagnose anything. A dedicated mini-PC (~€170) isolates this risk. This
choice was verified in real conditions: during an outage where both Proxmox nodes were
unreachable, the firewall stayed up and served as an observation post throughout the
diagnosis (see [the incidents](/en/projets/homelab/incidents/)).

## Why 2 nodes rather than a single more powerful one

A single, sturdier server would have been cheaper at equal performance. The choice of 2 machines
answers a different need: splitting roles (permanent services / dev-CI-K8s) and practising
real cluster reflexes - VM migration, partial fault tolerance, quorum. It is
an educational choice as much as a technical one - also made easier by a good deal that came along at the right
time: the two EliteDesks were found as a lot at ~€370, a price that finished settling the question between
"one big server" and "two machines to practise clustering".

## Why mini-PCs rather than classic rack server hardware

Power consumption. The 7U rack could have housed real 1U servers, but their idle consumption
(often 60-100 W per unit) would have blown up the electricity bill for a home use
that does not justify this power around the clock. The mini-PCs (EliteDesk, N150) run at
6-25 W each - the compromise chosen between real computing capacity and frugality.

## Powerline rather than WiFi for the living-room TV

A telling detail of the project's main constraint: never degrade the use of the rest
of the household, notably my partner's remote work (see [why this project](/en/projets/homelab/pourquoi/)).
The WiFi shared with the rest of the house may suffice for streaming, but a dedicated wired
powerline avoids any contention with household traffic - reliability takes priority over price (~€35
per adapter).
