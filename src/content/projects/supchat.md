---
title: "SUPCHAT - Plateforme de communication"
category: ecole
summary: "Mon projet de fin de 3e année : plateforme de chat temps réel multi-plateforme (web, iOS, Android) avec IA Mistral intégrée, workspaces, partage de fichiers et notifications push. Démo en ligne sans compte, en lecture seule et sans IA."
period: "SUPINFO - 3e année (projet de fin d'année)"
role: "Membre de l'équipe projet"
stack: ["Node.js", "React", "React Native", "PostgreSQL", "Docker", "Socket.IO", "Mistral AI", "S3"]
tags: ["Temps réel", "IA", "Full-stack", "Mobile", "Docker", "Projet de groupe", "Sites web"]
links:
  demo: "https://supchat.gault-rudy.com"
  sandbox: "https://supchat-demo.gault-rudy.com"
  repo: "https://github.com/paulmzzn/SUPCHAT"
images: ["/projets/supchat/images.jpg", "/projets/supchat/canal.jpg", "/projets/supchat/messages-prives.jpg"]
groupProject: true
contributors: ["Paul Mzzn"]
relevance: "majeur"
order: 10
---

## Le problème

Les outils de communication d'équipe du marché (Slack, Discord, Teams) sont fermés, payants à l'échelle, et n'intègrent pas nativement d'assistant IA contextuel à la conversation. L'objectif du cahier des charges SUPINFO : construire une alternative complète, multi-plateforme, avec une vraie intégration IA - pas juste un chat de plus.

## La solution

Une plateforme de communication d'équipe avec chat temps réel, organisation par workspaces, partage de fichiers, authentification OAuth, notifications push, et un assistant IA intégré (Mistral) capable de répondre dans le contexte de la conversation. SUPCHAT est mon projet de fin de 3e année à SUPINFO. La plateforme comprend un client web (PWA) et des clients mobiles iOS et Android.

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

Une [page de présentation](https://supchat.gault-rudy.com) et une [démo en ligne](https://supchat-demo.gault-rudy.com), sans compte, en lecture seule et sur des données fictives. La démo est une variante allégée et durcie du projet : pas d'authentification (un utilisateur fictif), toute écriture refusée par le serveur, par nginx et par le rôle SQL, et aucun modèle de langage (l'assistant Mistral y est retiré). L'espace « Portfolio de Rudy » de la démo présente mes autres projets (Relai, mon site de freelance, COACH, Patrimoine, mon homelab) avec des captures.

Le dépôt d'origine, publié par Paul, reste la référence pour le code complet, mobile compris. L'ancien site `supchat.fr` n'est plus en ligne.
