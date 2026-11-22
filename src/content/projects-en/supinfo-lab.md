---
title: "SUPINFO Lab - Collaborative teaching lab"
category: perso
summary: "A personal initiative: designing a physical IT lab on the SUPINFO Tours campus so students can practise infrastructure end to end. The project was not completed."
period: "2026 - ended (not completed)"
role: "Project initiator - specification, budget, equipment"
stack: ["Proxmox", "K3s", "Terraform", "Ansible", "OPNsense", "Ludus", "Gitea", "Woodpecker CI", "Wazuh", "ELK", "Authentik", "BookStack"]
tags: ["Initiative", "Project management", "Infrastructure as Code", "Kubernetes", "Security", "Teaching"]
featured: true
ended: true
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

## Why the project was not completed

The budget was released, but the lab was never built. I could not handle the physical build alone on top of the work-study, personal work, sport and my own [homelab](/en/projets/homelab/), so the plan was to form a team of students to take part in the execution. That team never came together: there was not enough student involvement, and I did not have the time to carry the project anyway.

## What I take from it

The scoping, costing and teaching proposal were carried through, up to getting a budget approved. The weak point was elsewhere: a project that depends on other people's commitment has to secure that commitment before it starts, not after. And it is better to admit you do not have the time to carry a subject than to let it drag on while calling it "ongoing".
