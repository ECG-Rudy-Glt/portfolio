---
title: "4KUBE - Cluster Kubernetes haute disponibilité"
category: ecole
summary: "Déploiement d'une application microservices (FleetMan, suivi GPS temps réel) sur un cluster Kubernetes 3 nœuds avec haute disponibilité."
period: "SUPINFO - 4e année"
role: "Projet individuel"
stack: ["Kubernetes", "kubeadm", "containerd", "Calico", "MongoDB", "ActiveMQ", "Nginx", "Vagrant"]
tags: ["Kubernetes", "Infra as Code", "Microservices", "Réseau", "Haute disponibilité"]
images: ["/projets/4kube/infrastucture-reseau.png", "/projets/4kube/application-microservice.png"]
links:
  repo: "https://github.com/paulmzzn/4KUBE"
relevance: "pertinent"
order: 10
---

## Le problème

FleetMan est une application de suivi GPS en microservices (API gateway, service de position, simulateur, base de données, file de messages). Déployée sur une seule machine, la moindre panne d'un composant rend tout le système indisponible - inacceptable pour un système de suivi en temps réel.

## La solution

Orchestrer l'ensemble sur un cluster Kubernetes en haute disponibilité (1 master + 2 workers), avec un déploiement entièrement automatisé et reproductible plutôt qu'une installation manuelle, pour pouvoir reconstruire le cluster à l'identique en cas de besoin.

## Choix techniques & architecture

- **Cluster monté from scratch** : 3 VMs Ubuntu 22.04 nues (1 master 4 vCPU/2 Go, 2 workers 2 vCPU/1 Go chacun) - aucune brique managée, tout est configuré à la main puis automatisé : hostname, `/etc/hosts`, désactivation du swap (obligatoire pour kubeadm), avant même d'initialiser le cluster.
- **Cluster** : Kubernetes v1.30 provisionné via kubeadm, containerd comme runtime de conteneurs, Calico comme CNI pour la mise en réseau entre pods.
- **Données** : MongoDB en ReplicaSet pour la tolérance de panne de la base, ActiveMQ comme broker de messages pour découpler les microservices entre eux.
- **Exposition** : Nginx comme point d'entrée vers l'application web.
- **Provisioning** : déploiement automatisé via Vagrant pour reproduire l'environnement en une commande, avec une procédure manuelle documentée pas-à-pas via kubeadm pour comprendre chaque étape de bootstrap plutôt que de la traiter comme une boîte noire.

## Résultat

Cluster 3 nœuds fonctionnel avec tolérance de panne réelle (testée), manifests versionnés pour chaque composant (namespace, MongoDB, queue, API gateway, webapp) et scripts d'automatisation pour le join des nœuds.
