---
title: "SUPINFO Lab - Lab pédagogique collaboratif"
category: perso
summary: "Initiative personnelle : conception et montage d'un lab informatique physique sur le campus SUPINFO de Tours pour permettre aux étudiants de pratiquer l'infrastructure de A à Z."
period: "2026 - en cours"
role: "Initiateur du projet - cahier des charges, budget, équipement"
stack: ["Proxmox", "K3s", "Terraform", "Ansible", "OPNsense", "Ludus", "Gitea", "Woodpecker CI", "Wazuh", "ELK", "Authentik", "BookStack"]
tags: ["Initiative", "Gestion de projet", "Infra as Code", "Kubernetes", "Sécurité", "Pédagogie"]
featured: true
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

## Ce que ça démontre

Ce projet n'a pas de "code" à montrer comme les autres - il démontre autre chose : la capacité à identifier un problème non technique (un manque pédagogique), à le cadrer comme un vrai projet (budget, cahier des charges, jalons), et à le porter seul jusqu'à la mise en œuvre. Une compétence rarement visible sur un portfolio de développeur, mais directement transférable à un rôle de gestion de projet technique.
