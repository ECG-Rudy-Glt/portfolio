---
title: "Ops Delivery Suite - DevOps toolbox"
category: perso
summary: "A suite of 13 standalone DevOps tools: Ansible hardening, CI/CD templates, encrypted backups, Trivy security audits, Traefik reverse proxy, monitoring and runner provisioning."
period: "2025 - ongoing"
role: "Solo design and development"
stack: ["Ansible", "Docker", "Traefik", "Trivy", "Python", "GitLab CI", "GitHub Actions", "Prometheus", "Grafana"]
tags: ["DevOps", "Security", "CI/CD", "Automation", "Monitoring", "Infrastructure as Code"]
featured: true
relevance: "majeur"
order: 4
---

## The problem

This project came out of an attempt to put together an offer of packaged DevOps services (hardening, CI/CD, security audit) for small organisations, alongside my work-study - the combined workload was too high to take on both at once, but the technical need behind it remained real: on every assignment or project, the same operations tasks come back (hardening a new server, setting up CI/CD, backing up properly, auditing security, exposing a service over HTTPS, monitoring). Redoing them by hand every time wastes time and is a source of inconsistency.

## The solution

A collection of 13 independent tools, each packaged to be reused as is on any project, without depending on the others. Designed from the start to be production-ready rather than throwaway scripts.

## The tools

| Tool | Role | Status |
|---|---|---|
| VPS Shield | Ansible hardening (SSH, firewall, fail2ban, sysctl, PAM, auditd) - ANSSI-BP-028/CIS profiles | Done |
| CI/CD Universal Templates | 7 templates × GitHub Actions/GitLab CI (Node, PHP, Python, Docker, Go, Rust, static) | Done |
| Data Sentinel | "Fire & Forget" backup: DB + files, GPG encryption, S3 export, Discord/Slack notification | Done |
| Docker Stack Builder | "Gold Standard" Docker stacks (Express, Laravel, Django, WordPress) | Done |
| Server Migration Kit | Complete server migration (files, databases, configs, cron) with Ansible | In progress |
| Disaster Recovery Plan | Disaster recovery plan | In preparation |
| Infra Flash Audit | Agentless security audit, HTML/PDF report, OpenSCAP CIS | Done |
| Traefik Edge Proxy | Reverse proxy with automatic SSL/TLS (Let's Encrypt) | Done |
| Staging Cloner Sync | Automated cloning of a staging environment from production | In preparation |
| Automate HTTPS | HTTPS automation with Traefik and Let's Encrypt | Done |
| GitLab Runner Provisioner | One-liner provisioning of GitLab runners | Done |
| Ops Vision | Lightweight monitoring (Uptime Kuma, Prometheus, Grafana) | Done |
| Trivy Audit | Advanced security audit (OS/image/IaC scan, CycloneDX SBOM, AI-assisted remediation) | Done |
| CI Hardening | Continuous hardening through scheduled CI: drift detection + auto-remediation | Done |

## Assessment

11 of the 13 tools are finished and usable in production; the remaining 2 are being finalised. The commercial side packaged around this suite has not been abandoned but is on hold while I finish a site dedicated to my freelance activity and services - a separate project, which will be able to build on this suite as its technical foundation. In the meantime, it is already used to run the [homelab](/en/projets/homelab/) and deploy this portfolio. The lesson learned: knowing how to arbitrate your workload rather than trying to run everything at once.
