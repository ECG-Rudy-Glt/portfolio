---
title: "3DOKR - Orchestration Docker Swarm"
category: ecole
summary: "Cluster Docker Swarm déployable selon 3 approches : automatisée via Vagrant, manuelle sur 3 VMs, ou en local via Docker Compose."
period: "SUPINFO - 3e année"
role: "Projet individuel"
stack: ["Docker Swarm", "Docker Compose", "Vagrant"]
tags: ["Orchestration", "Infra as Code", "Docker"]
links:
  repo: "https://github.com/ECG-Rudy-Glt/3DOKR-"
relevance: "secondaire"
order: 14
---

## Le problème

Comprendre l'orchestration Docker Swarm en restant uniquement sur une automatisation toute faite ne suffit pas à en saisir les mécanismes : il faut aussi savoir construire un cluster à la main pour comprendre ce que l'automatisation cache.

## La solution

Trois branches du même dépôt, chacune une façon différente d'aborder le même problème :

- **`swarm_config`** : cluster Swarm multi-VM entièrement automatisé via Vagrant - démarrage et configuration en une commande, pour un usage reproductible.
- **`mano`** : construction manuelle du cluster sur 3 machines virtuelles, étape par étape - chaque commande `docker swarm init` / `docker swarm join` exécutée et comprise individuellement, plutôt que masquée par un script.
- **`docker_dev`** : environnement de développement local en simple Docker Compose, sans la complexité d'un cluster, pour itérer rapidement sans VM.

## Ce que ça démontre

Trois niveaux d'abstraction sur le même problème : production automatisée, apprentissage manuel, développement local - une manière de prouver qu'automatiser une tâche n'a de valeur que si on est capable de l'expliquer sans elle.
