---
title: "Mon homelab : construire une infrastructure de production pour de vrai"
summary: "Firewall dédié, cluster Proxmox à deux nœuds, segmentation réseau réelle, PKI interne, et un pentest mené sur ma propre infrastructure - le récit complet de mon homelab."
date: 2026-08-08
tags: ["Homelab", "DevOps", "Infrastructure"]
type: article
---

Ce n'est pas un tutoriel "installe Docker sur un Raspberry Pi". C'est le récit de la construction
d'une infrastructure à la maison qui ressemble à ce qu'on trouve en PME : un firewall dédié, un
cluster de virtualisation à deux nœuds, une segmentation réseau réelle, des secrets gérés par un
vrai coffre-fort, une CI/CD self-hébergée, un cluster Kubernetes, et - parce qu'une infra qui n'a
jamais été attaquée n'a jamais été testée - un pentest mené sur ma propre infrastructure une fois
qu'elle a tourné en conditions réelles pour ma famille.

![Le cluster homelab empilé : mini-PC firewall, deux HP EliteDesk et boîtier de stockage USB](/articles/homelab/pile-mini-pcs.png)

## Pourquoi

Ce projet a démarré dans le cadre de la fin de ma 4e année à Supinfo (parcours DevOps, en
alternance), mais il ne s'arrête pas à un rendu académique : c'est une démarche pour monter en
compétences sur une pile complète plutôt qu'un seul maillon, me former par la pratique sur des
sujets que l'alternance ne couvre pas, et préparer une activité indépendante a cause d'un avenir incertain avec le marché de l'emploie actuel. 

## Le projet complet

Le détail technique intégral - matériel, budget, architecture réseau, services, Infrastructure as
Code, incidents réels, et les résultats bruts du pentest - est sur la
[page dédiée du projet](/projets/homelab/), qui se déploie elle-même sur plusieurs pages
détaillées : pourquoi ce projet, l'équipement et ses choix, l'infrastructure réseau, les services
et leur ordre de déploiement, l'IaC en détail, les vraies pannes rencontrées, la sécurité et le
pentest, le stockage, Jellyfin, et la suite.

Deux morceaux ont déjà leur propre article : la mise en place de la
[PKI interne et du coffre à secrets](/blog/homelab-pki-secrets/), et le
[démontage d'un iMac](/blog/imac-ecran/) dont le disque dur sert aujourd'hui de premier NAS au lab.
