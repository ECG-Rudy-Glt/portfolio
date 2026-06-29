---
title: "4ARCL - Architecture FlyAway Airlines"
category: ecole
summary: "Conception d'une architecture complète (frontend, backend, données, stockage) pour une compagnie aérienne gérant des millions d'utilisateurs, avec exigences SLO et conformité."
period: "SUPINFO - 4e année"
role: "Projet en équipe de 2"
stack: ["Architecture cloud", "Microservices", "Event Bus", "Excalidraw"]
tags: ["Architecture", "Conception", "Sécurité", "Conformité (RGPD/PCI-DSS)", "Travail en équipe"]
images:
  - "/projets/4arcl/Architecture-Globale.png"
  - "/projets/4arcl/Microservices-et-Event-Bus.png"
  - "/projets/4arcl/Couche-de-Donnees.png"
  - "/projets/4arcl/Securite-et-Reseau.png"
relevance: "pertinent"
order: 11
---

## Le problème

FlyAway, compagnie aérienne fictive du cahier des charges, doit gérer la recherche et la réservation de vols pour des millions d'utilisateurs simultanés, avec un objectif de SLO à 500ms et des contraintes de conformité RGPD et PCI-DSS (paiement). Aucune ligne de code à écrire ici : l'exercice porte sur la capacité à concevoir une architecture qui tient ces contraintes avant même de coder quoi que ce soit.

## La solution

Une architecture en microservices découplés par un bus d'événements, avec une analyse critique justifiée de chaque choix structurant plutôt qu'une solution "par défaut".

## Démarche & choix d'architecture

- **Compute & hébergement** : comparaison argumentée entre datacenter propre et cloud public, en pesant coût, élasticité face aux pics de charge (haute saison) et maîtrise des données.
- **Découplage** : architecture microservices avec bus d'événements, pour que la panne d'un service (paiement par exemple) ne bloque pas la recherche de vols.
- **Sécurité & conformité** : couche dédiée pour répondre aux exigences RGPD (données personnelles) et PCI-DSS (données de paiement) - chiffrement, cloisonnement réseau, droits d'accès.
- **Production** : document d'architecture détaillé de 12 à 15 pages et 4 diagrammes (architecture globale, microservices & event bus, couche données, sécurité/réseau).

## Compétence mise en avant

Raisonner architecture à grande échelle (scalabilité, résilience, conformité) avant l'implémentation, en binôme - une démarche structurante complémentaire des projets plus orientés exécution comme 4KUBE ou SUPCHAT.
