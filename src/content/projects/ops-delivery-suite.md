---
title: "Ops Delivery Suite - Boîte à outils DevOps"
category: perso
summary: "Suite de 13 outils DevOps autonomes : hardening Ansible, templates CI/CD, backup chiffré, audit de sécurité Trivy, reverse proxy Traefik, monitoring, provisioning de runners."
period: "2025 - en cours"
role: "Conception et développement en solo"
stack: ["Ansible", "Docker", "Traefik", "Trivy", "Python", "GitLab CI", "GitHub Actions", "Prometheus", "Grafana"]
tags: ["DevOps", "Sécurité", "CI/CD", "Automatisation", "Monitoring", "Infra as Code"]
featured: true
relevance: "majeur"
order: 4
---

## Le problème

Ce projet est né d'un essai de monter une offre de services DevOps packagés (hardening, CI/CD, audit de sécurité) pour des petites structures, en parallèle de l'alternance - la charge de travail combinée était trop élevée pour assumer les deux de front, mais le besoin technique derrière restait réel : sur chaque mission ou projet, les mêmes tâches d'exploitation reviennent (durcir un serveur neuf, mettre en place une CI/CD, sauvegarder proprement, auditer la sécurité, exposer un service en HTTPS, superviser). Les refaire à la main à chaque fois est une perte de temps et une source d'incohérence.

## La solution

Une collection de 13 outils indépendants, chacun packagé pour être réutilisé tel quel sur n'importe quel projet, sans dépendre des autres. Pensés dès le départ pour être production-ready plutôt que des scripts jetables.

## Les outils

| Outil | Rôle | Statut |
|---|---|---|
| VPS Shield | Hardening Ansible (SSH, firewall, fail2ban, sysctl, PAM, auditd) - profils ANSSI-BP-028/CIS | Terminé |
| CI/CD Universal Templates | 7 templates × GitHub Actions/GitLab CI (Node, PHP, Python, Docker, Go, Rust, statique) | Terminé |
| Data Sentinel | Backup "Fire & Forget" : DB + fichiers, chiffrement GPG, export S3, notif Discord/Slack | Terminé |
| Docker Stack Builder | Stacks Docker "Gold Standard" (Express, Laravel, Django, WordPress) | Terminé |
| Server Migration Kit | Migration serveur complète (fichiers, bases, configs, cron) via Ansible | En cours |
| Disaster Recovery Plan | Plan de reprise d'activité | En préparation |
| Infra Flash Audit | Audit sécurité agentless, rapport HTML/PDF, OpenSCAP CIS | Terminé |
| Traefik Edge Proxy | Reverse proxy avec SSL/TLS automatique (Let's Encrypt) | Terminé |
| Staging Cloner Sync | Clonage automatisé d'environnement staging depuis la prod | En préparation |
| Automate HTTPS | Automatisation HTTPS via Traefik et Let's Encrypt | Terminé |
| GitLab Runner Provisioner | Provisioning one-liner de runners GitLab | Terminé |
| Ops Vision | Monitoring léger (Uptime Kuma, Prometheus, Grafana) | Terminé |
| Trivy Audit | Audit sécurité avancé (scan OS/images/IaC, SBOM CycloneDX, remédiation assistée par IA) | Terminé |
| CI Hardening | Hardening continu via CI schedulée : détection de drift + auto-remédiation | Terminé |

## Bilan

11 outils sur 13 sont terminés et utilisables en production, les 2 restants sont en cours de finalisation. Le volet commercial a été abandonné par manque de temps, mais cette suite est directement utilisée pour exploiter le [homelab](/projets/homelab/) et déployer ce portfolio - la leçon retenue : savoir arbitrer sa charge de travail plutôt que de tout vouloir mener de front.
