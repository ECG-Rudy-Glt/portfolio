---
title: "TicketApp - SaaS de billetterie haute disponibilité"
category: ecole
summary: "SaaS de vente de billets pour événements, conçu pour absorber aussi bien un petit événement scolaire qu'une tournée internationale, sans survente et sans temps d'arrêt sur les paiements."
period: "SUPINFO - 4e année"
role: "Projet individuel"
stack: ["Node.js", "Express", "PostgreSQL", "Patroni", "RabbitMQ", "Redis", "PgBouncer", "Nginx", "Zipkin", "Docker", "Docker Compose"]
tags: ["Microservices", "Haute disponibilité", "Docker", "Full-stack"]
links:
  repo: "https://github.com/ECG-Rudy-Glt/4WEBD-TICKET"
relevance: "secondaire"
order: 12
---

## Le problème

Le cahier des charges imposait un système de billetterie capable de servir aussi bien un petit événement scolaire qu'une tournée internationale, sans survente de billets, avec confirmation d'achat asynchrone, paiement par carte, et une criticité différenciée selon l'opération : une perte de transaction de paiement n'a pas le même impact qu'un like perdu.

## La solution

Une architecture en microservices où chaque domaine métier (auth, utilisateurs, événements, réservation, paiement, notification) est un service indépendant, répliqué et équilibré par son propre load balancer, avec un traitement événementiel asynchrone via RabbitMQ pour ne jamais bloquer l'utilisateur sur une opération lente.

## Choix techniques & architecture

- **Gateway** : API Gateway en façade, qui route vers les load balancers internes de chaque microservice (auth, user, event, booking, payment), chacun avec plusieurs instances.
- **Flux de réservation asynchrone** : `POST /bookings` publie sur une queue RabbitMQ - le booking-service décrémente la capacité de manière atomique (évite la survente), crée le ticket en attente, puis publie sur la queue paiement. Le payment-service traite le paiement et republie le résultat sur une queue de notification, qui se charge de loguer et persister l'issue finale - chaque étape peut être retentée indépendamment sans bloquer les autres.
- **Haute disponibilité ciblée** : les données critiques (réservations, paiements) sont en cluster Patroni (PostgreSQL HA avec basculement automatique, coordonné par etcd), tandis que les données moins critiques (auth, utilisateurs, événements) utilisent un simple primary/replica - la complexité HA va là où elle a le plus de valeur, pas partout par défaut.
- **Performance** : Redis en cache pour les lectures fréquentes, PgBouncer en pooling de connexions devant PostgreSQL, séparation explicite des pools de requêtes en lecture (replica) et en écriture (primary) dans le code.
- **Observabilité** : tracing distribué via Zipkin sur l'ensemble des microservices, pour suivre une requête de bout en bout à travers la chaîne de services.
- **Infra** : l'ensemble est conteneurisé et orchestré via Docker Compose, avec deux livrables - une version applicative standalone et une version incluant l'infrastructure de déploiement complète.

## Résultat

Un système où la criticité de chaque donnée dicte le niveau de robustesse appliqué (HA Patroni pour le paiement, replica simple pour le reste), plutôt qu'une architecture uniforme - le compromis le plus difficile à justifier dans le rapport technique du projet.
