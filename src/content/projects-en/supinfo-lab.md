---
title: "SUPINFO Lab - Collaborative teaching lab"
category: perso
summary: "A personal initiative: designing and building a physical IT lab on the SUPINFO Tours campus so students can practise infrastructure end to end."
period: "2026 - ongoing"
role: "Project initiator - specification, budget, equipment; physical build carried by a team from the 5th year"
stack: ["Proxmox", "K3s", "Terraform", "Ansible", "OPNsense", "Ludus", "Gitea", "Woodpecker CI", "Wazuh", "ELK", "Authentik", "BookStack"]
tags: ["Initiative", "Project management", "Infrastructure as Code", "Kubernetes", "Security", "Teaching"]
featured: true
relevance: "majeur"
order: 3
---

## The problem

SUPINFO students (3rd to 5th year) learn infrastructure, cloud and cybersecurity mostly from slides and personal VMs with limited resources. Without shared physical hardware, it is impossible to practise real clustering, network segmentation or realistic cyber labs - you stay confined to theory or bits of simulation.

## The solution

Rather than waiting for someone to propose something to me, I took the initiative to set up a shared physical lab on the Tours campus: writing the specification, costing and managing the budget, choosing the equipment, up to the complete teaching proposal presented to the school. Nobody asked me to - which is what makes it a revealing project about initiative and project management, not just about technology.

## Technical choices & teaching content

- **Virtualisation & IaC**: Proxmox as the shared hypervisor, Terraform and Ansible so that students practise reproducible provisioning rather than point-and-click.
- **Kubernetes**: K3s, lighter than a classic Kubernetes cluster, suited to multi-user teaching use.
- **Networking**: OPNsense to practise VLAN segmentation in real conditions.
- **Offensive/defensive security**: ephemeral cyber labs through Ludus (disposable environments, reset at every session), SIEM monitoring with Wazuh and the ELK stack.
- **GitOps**: Gitea + Woodpecker CI so that each student has their own CI/CD pipeline without depending on an external cloud account.
- **Platform**: Authentik SSO for unified access, centralised documentation on BookStack.

## Deployment method

Four phases designed to deliver value from the start rather than wait for a "big bang": foundation (virtualisation/network), observability, cyber labs, then long-term enrichment based on feedback from the first users.

## Where the project stands today

The budget has just been released - a concrete step after the scoping and costing work. But between the work-study, personal work, sport and my own [homelab](/en/projets/homelab/), I cannot handle the physical build of the lab alone on top of everything else: that would be promising an execution I materially do not have the time to deliver. Rather than forcing a solo build at the expense of quality, the logical next step is to form a team to support on this subject from my 5th year - moving from the initiator/scoping role to a steering role, with other students taking part in the execution.

## What it demonstrates

This project has no "code" to show like the others - it demonstrates something else: the ability to identify a non-technical problem (a teaching gap), to frame it as a real project (budget, specification, milestones), and to carry it alone through to implementation. A skill rarely visible on a developer's portfolio, but directly transferable to a technical project management role.
