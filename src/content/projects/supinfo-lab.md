---
title: "SUPINFO Lab - Lab pédagogique collaboratif"
category: perso
summary: "Initiative personnelle : conception d'un lab informatique physique sur le campus SUPINFO de Tours pour permettre aux étudiants de pratiquer l'infrastructure de A à Z. Projet non abouti."
period: "2026 - fin (non abouti)"
role: "Initiateur du projet - cahier des charges, budget, équipement"
stack: ["Proxmox", "K3s", "Terraform", "Ansible", "OPNsense", "Ludus", "Gitea", "Woodpecker CI", "Wazuh", "ELK", "Authentik", "BookStack"]
tags: ["Initiative", "Gestion de projet", "Infra as Code", "Kubernetes", "Sécurité", "Pédagogie"]
featured: true
ended: true
relevance: "majeur"
order: 3
---

## Le problème

Les étudiants SUPINFO (3e à 5e année) apprennent l'infrastructure, le cloud et la cybersécurité essentiellement sur slides et VMs personnelles limitées en ressources. Sans matériel physique partagé, impossible de pratiquer du vrai clustering, de la segmentation réseau ou des labs cyber réalistes - on reste cantonné à la théorie ou à des bouts de simulation.

## La solution

Plutôt que d'attendre qu'on me propose quelque chose, j'ai pris l'initiative de monter un lab physique partagé sur le campus de Tours : rédaction du cahier des charges, chiffrage et gestion du budget, choix de l'équipement, jusqu'à la proposition pédagogique complète présentée à l'établissement. Personne ne me l'a demandé - c'est ce qui en fait un projet révélateur sur l'initiative et la gestion de projet, pas seulement sur la technique.

## Choix techniques & contenu pédagogique

- **Virtualisation & IaC** : Proxmox comme hyperviseur partagé, Terraform et Ansible pour que les étudiants pratiquent le provisioning reproductible plutôt que le clic-bouton.
- **Kubernetes** : K3s, plus léger qu'un cluster Kubernetes classique, adapté à un usage pédagogique multi-utilisateurs.
- **Réseau** : OPNsense pour pratiquer la segmentation VLAN en conditions réelles.
- **Sécurité offensive/défensive** : labs cyber éphémères via Ludus (environnements jetables, remis à zéro à chaque session), supervision SIEM avec Wazuh et la stack ELK.
- **GitOps** : Gitea + Woodpecker CI pour que chaque étudiant ait son propre pipeline CI/CD sans dépendre d'un compte cloud externe.
- **Plateforme** : SSO Authentik pour un accès unifié, documentation centralisée sur BookStack.

## Méthode de déploiement

Quatre phases pensées pour livrer de la valeur dès le début plutôt que d'attendre un "grand soir" : fondation (virtualisation/réseau), observabilité, labs cyber, puis enrichissement à long terme selon les retours des premiers utilisateurs.

## Pourquoi le projet n'a pas abouti

Le budget a bien été débloqué, mais le lab n'a jamais été monté. Je ne pouvais pas assurer seul le montage physique en plus de l'alternance, du travail personnel, du sport et de mon propre [homelab](/projets/homelab/), et l'idée était donc de constituer une équipe d'étudiants pour prendre part à l'exécution. Cette équipe ne s'est jamais formée : l'implication étudiante n'a pas suivi, et de mon côté je n'ai pas eu le temps de porter le projet malgré tout.

## Ce que j'en retiens

Le cadrage, le chiffrage et la proposition pédagogique ont bien été menés à leur terme, jusqu'à obtenir un budget. Le point faible était ailleurs : un projet qui repose sur l'engagement d'autres personnes doit sécuriser cet engagement avant de démarrer, pas après. Et il vaut mieux reconnaître qu'on n'a pas le temps de porter un sujet que de le laisser traîner en le présentant comme « en cours ».
