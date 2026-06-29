---
title: "SUPCHAT - Plateforme de communication"
category: ecole
summary: "Plateforme de chat temps réel multi-plateforme (web, iOS, Android) avec IA Mistral intégrée, workspaces, partage de fichiers et notifications push."
period: "SUPINFO - 3e année"
role: "Membre de l'équipe projet"
stack: ["Node.js", "React", "React Native", "PostgreSQL", "Docker", "Socket.IO", "Mistral AI", "S3"]
tags: ["Temps réel", "IA", "Full-stack", "Mobile", "Docker", "Projet de groupe"]
links:
  demo: "https://supchat.fr"
  repo: "https://github.com/paulmzzn/SUPCHAT"
images: []
groupProject: true
contributors: ["Paul Mzzn"]
relevance: "majeur"
order: 5
---

## Le problème

Les outils de communication d'équipe du marché (Slack, Discord, Teams) sont fermés, payants à l'échelle, et n'intègrent pas nativement d'assistant IA contextuel à la conversation. L'objectif du cahier des charges SUPINFO : construire une alternative complète, multi-plateforme, avec une vraie intégration IA - pas juste un chat de plus.

## La solution

Une plateforme de communication d'équipe avec chat temps réel, organisation par workspaces, partage de fichiers, authentification OAuth, notifications push, et un assistant IA intégré (Mistral) capable de répondre dans le contexte de la conversation. Déployée et accessible en ligne sur supchat.fr, avec des clients natifs web (PWA), iOS et Android.

## Choix techniques & architecture

- **Temps réel** : Socket.IO pour la diffusion instantanée des messages et de la présence, plutôt que du polling.
- **Backend** : Node.js 18, PostgreSQL 16 pour la persistance (messages, workspaces, utilisateurs).
- **Web** : React 18.3 en PWA, installable et utilisable hors-ligne partiellement.
- **Mobile** : React Native 0.79, code partagé avec le web côté logique métier.
- **Stockage de fichiers** : S3 (Scaleway) pour les pièces jointes, découplé du serveur applicatif.
- **IA** : intégration de l'API Mistral pour des réponses contextuelles à l'intérieur des conversations, plutôt qu'un chatbot séparé.
- **Infra** : conteneurisation Docker complète pour un déploiement reproductible en production.

## Mon rôle

Projet réalisé en équipe avec [Paul Mzzn](https://github.com/paulmzzn) - contribution sur la partie applicative (web/backend), avec une coordination nécessaire pour intégrer mobile, backend et IA sans que les trois équipes ne se bloquent mutuellement.

## Résultat

Plateforme en ligne sur [supchat.fr](https://supchat.fr), utilisable dès aujourd'hui sur web, iOS et Android.
