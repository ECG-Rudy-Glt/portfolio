---
title: "Construire une PKI interne pour mon homelab"
summary: "Pourquoi et comment j'ai mis en place une autorité de certification interne et un coffre à secrets centralisé sur mon homelab, avec OpenBao."
date: 2025-09-12
tags: ["Homelab", "Sécurité", "PKI", "OpenBao"]
type: article
---

## Pourquoi une PKI interne

Sur mon [homelab](/projets/homelab/), tous les services internes communiquent en HTTPS - y compris entre eux, sans jamais sortir sur Internet. Utiliser Let's Encrypt pour ça pose un problème : ça nécessite soit d'exposer un challenge DNS/HTTP public, soit de gérer des certificats wildcard avec leurs propres contraintes de rotation. J'ai préféré monter ma propre autorité de certification interne.

## Le choix d'OpenBao

OpenBao (le fork open-source de HashiCorp Vault) sert deux rôles chez moi :

- **PKI interne** : émission et rotation automatique des certificats pour chaque service, via des rôles dédiés par domaine.
- **Coffre à secrets** : centralisation des credentials (API tokens, mots de passe de service, clés SSH) au lieu de les disperser dans des fichiers `.env` sur chaque VM.

## Ce que ça change au quotidien

- Plus aucun certificat à renouveler manuellement.
- Un seul endroit pour révoquer un accès en cas de compromission suspectée.
- Authentik (mon SSO) et Traefik consomment directement les secrets depuis OpenBao au démarrage.

## Prochaine étape

Documenter la procédure de bootstrap (le problème classique de la PKI : comment démarrer en confiance sans dépendre d'elle) et l'intégrer au pipeline Ansible du homelab.
