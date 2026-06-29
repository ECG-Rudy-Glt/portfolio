---
title: "SUPFile - Stockage cloud souverain"
category: ecole
summary: "Alternative française à Dropbox/Drive : chiffrement de bout en bout, coffre-fort, partage avancé, MFA, et IA documentaire embarquée (Bobby) - web, mobile et desktop."
period: "SUPINFO - 4e année"
role: "Membre de l'équipe projet"
stack: ["Node.js", "React", "React Native", "Electron", "PostgreSQL", "Prisma", "Docker", "Ollama", "ChromaDB", "GitHub Actions"]
tags: ["Sécurité", "IA / RAG", "Full-stack", "Mobile", "Desktop", "CI/CD", "Projet de groupe"]
links:
  demo: "https://supfile.tech"
  repo: "https://github.com/ECG-Rudy-Glt/4PROJ-"
images: []
groupProject: true
contributors: []
relevance: "majeur"
order: 6
---

## Le problème

Dropbox et Google Drive hébergent les données hors d'Europe et n'offrent ni coffre-fort chiffré natif ni recherche intelligente dans les documents. Le cahier des charges visait une alternative souveraine, déployable en une commande, avec un vrai niveau de sécurité (chiffrement, MFA) et une IA capable d'interroger le contenu des fichiers plutôt que de simples métadonnées.

## La solution

Une plateforme de stockage cloud complète : chiffrement de bout en bout des fichiers, coffre-fort, partage avancé avec permissions, authentification multi-facteurs, et un assistant documentaire IA embarqué ("Bobby") capable de répondre à des questions sur le contenu des documents stockés. Disponible sur web, mobile (iOS/Android) et desktop (client Windows avec synchronisation automatique).

## Choix techniques & architecture

- **Backend** : Node.js avec Prisma comme ORM, PostgreSQL pour la persistance.
- **Frontend** : React, état géré avec Zustand.
- **Mobile** : React Native / Expo.
- **Desktop** : client Electron avec synchronisation automatique en arrière-plan (Windows).
- **IA documentaire (Bobby)** : microservice dédié implémentant un pipeline RAG (Retrieval-Augmented Generation) - les documents sont indexés dans ChromaDB (base vectorielle), et Ollama exécute le modèle de langage en local pour répondre aux questions sans envoyer les données à un service tiers.
- **CI/CD** : pipeline GitHub Actions avec analyse SAST (détection de vulnérabilités dans le code) et génération automatique de SBOM (inventaire des dépendances) à chaque build.
- **Infra** : déploiement VPS conteneurisé via Docker Compose.

## Mon rôle

Couvrir l'ensemble de la chaîne dans le cadre du cursus SUPINFO 4e année : backend, frontend, mobile, desktop et sécurisation de la CI/CD - un projet qui demande de comprendre comment chaque couche s'articule avec les autres, pas seulement de livrer une fonctionnalité isolée.

## Résultat

Plateforme en ligne sur [supfile.tech](https://supfile.tech).
