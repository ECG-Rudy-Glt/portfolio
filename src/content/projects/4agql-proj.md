---
title: "SchoolInc - Gestion scolaire en microservices GraphQL"
category: ecole
summary: "Application de gestion scolaire (étudiants, classes, notes) construite sur 3 microservices GraphQL indépendants, agrégés via GraphQL Mesh."
period: "SUPINFO - 4e année"
role: "Projet individuel"
stack: ["Node.js", "GraphQL Mesh", "Next.js", "MongoDB", "Docker Compose", "JWT"]
tags: ["GraphQL", "Microservices", "Full-stack", "Docker"]
links:
  repo: "https://github.com/paulmzzn/4AGQL-PROJ"
relevance: "pertinent"
order: 13
---

## Le problème

Une application de gestion scolaire mélange plusieurs domaines métier (authentification, classes, notes) qui évoluent à des rythmes différents. Tout coder dans un seul service REST monolithique rend chaque évolution risquée pour l'ensemble, et un client web aurait dû interroger plusieurs endpoints séparément pour assembler une seule vue.

## La solution

Découper le système en 3 microservices GraphQL indépendants (auth, class, grade), chacun avec sa propre base de données, et les agréger derrière une gateway GraphQL Mesh qui expose un schéma unique au frontend - le client interroge un seul point d'entrée sans savoir combien de services répondent derrière.

## Choix techniques & architecture

- **Services** : 3 microservices Node.js/GraphQL autonomes, chacun avec sa propre base MongoDB - scalables et déployables indépendamment les uns des autres.
- **Gateway** : GraphQL Mesh pour fusionner les schémas des trois services en une seule API cohérente côté client.
- **Frontend** : Next.js, qui consomme cette API unifiée.
- **Sécurité** : authentification JWT propagée entre services pour que chaque microservice puisse vérifier l'identité de l'appelant sans repasser par le service d'authentification à chaque requête.
- **Orchestration** : Docker Compose pour lancer l'ensemble des services et la gateway en une seule commande en développement local.

## Résultat

Une architecture où ajouter un quatrième domaine métier (par exemple la gestion des emplois du temps) ne nécessiterait qu'un nouveau microservice et une mise à jour de la gateway, sans toucher aux services existants.
