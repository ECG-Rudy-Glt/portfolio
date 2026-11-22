---
project: homelab
title: "The services - deployment order, and why"
summary: "The project page lists the active services. Here, the order in which they were deployed - because that order is itself an architecture decision, not chance."
order: 4
---

The list of active services is on the [project page](/en/projets/homelab/#services-in-production).
This page explains the deployment order, because none of these services could have been
put in place before the one that precedes it.

## Layer 0 - Network, before everything else

OPNsense, AdGuard Home (internal DNS), Tailscale. Nothing can be deployed before this layer -
it is what gives the rest of the network its structure and isolation (details in
[infrastructure](/en/projets/homelab/infrastructure/)).

## Layer 1 - The hypervisor

The Proxmox cluster, the foundation of all later provisioning - see
[Infrastructure as Code](/en/projets/homelab/iac/) for the Terraform part.

## Layer 2 - Core services, in this precise order

1. **Traefik** (reverse proxy) - single entry point for all internal web services
2. **OpenBao** (vault + internal PKI) - to stop storing secrets in plaintext and
   issue the internal TLS certificates; full details in the dedicated article
   [Building an internal PKI](/blog/homelab-pki-secrets/)
3. **Authentik** (SSO) - centralised authentication
4. **Vaultwarden** - family password manager
5. **Forgejo** - self-hosted Git hosting, source of truth for all the IaC code, with CI/CD
6. **Home Assistant** - home automation hub, the only service allowed to talk to the IoT VLAN (details of
   the network/camera extension in progress in [home automation, network and video surveillance](/en/projets/homelab/domotique-reseau/))
7. **Vikunja** - personal task management

Each service in this list depends on at least one of the previous ones: Authentik needs
OpenBao for its secrets, Vaultwarden is exposed through Traefik, and so on.

## Layer 3 - Development environment

**vm-dev**: a VM that serves as a remote workstation. My personal computer runs nothing
itself - it connects over SSH/Remote Dev to this VM, which has Docker, Terraform, Ansible and the
vault client installed. The laptop remains a simple terminal; all the computing load
and all the state live on the lab.

## Layer 4 - Kubernetes & CI/CD

k3s, FluxCD (GitOps), MetalLB, cert-manager, and the Forgejo Actions runner that runs the
CI/CD pipelines - each job in a disposable container.

## Layer 5 - Observability

Without this layer, an outage is discovered because a user complains - not acceptable for
an infrastructure that has to remain reliable day to day for my family. Prometheus, Grafana, Loki,
Alertmanager with real alerts configured (expiring certificate, service down, disk
SMART, NVMe temperature, storage filling up), sent by email and to Home Assistant.

## Layer 6 - Personal cloud

Immich for photos and Nextcloud for files, in service since November 2026. They came late on
purpose: a service where the family puts sensitive data only opens once backups, monitoring and
storage-filling alerts are in place. The first bulk photo upload (over 1,200 at once) pushed the
node's NVMe to 80 °C: photo analysis runs on CPU, with no GPU.

## Layer 7 - Media

Jellyfin, with an architecture unusual enough to deserve its own page - see
[Jellyfin without local storage](/en/projets/homelab/jellyfin/).

## Layer 8 - Applications and public sites

Once the platform was in place (Kubernetes, GitOps, registry, CI), adding an application only
takes a repository and a Flux Kustomization. That is what made it possible to run
[Patrimoine](/en/projets/patrimoine/), [COACH](/en/projets/coach/) and a CRM for my freelance
work, plus the public sites (this portfolio, my freelance site, the project showcases), deployed
on every push with no manual step.

## Layer 9 - The lab assistant

Last, and not by chance: Hermes, a Telegram bot backed by a language model, which explains alerts,
handles film requests and controls a few devices in the house. It comes last because it relies on
everything else (monitoring, home automation, media chain, secret vault), and because an agent
that acts on the house is only plugged in once its guardrails are designed - detail in
[AI tooling](/en/projets/homelab/outillage-ia/).

## What this order shows

Each layer depends on the previous one. It is not arbitrary: it is the direct consequence of
wanting a coherent infrastructure rather than a pile of independent services.
