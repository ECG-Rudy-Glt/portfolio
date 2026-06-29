# Décisions validées pour le portfolio Astro

Document figé : toutes les questions ont été tranchées. Sert de référence pour le scaffolding.

## Contenu identifié

**Projets école (7) :**
- 4KUBE — cluster Kubernetes pour app microservices FleetMan (SUPINFO)
- 4ARCL — conception architecture compagnie aérienne FlyAway (équipe de 2)
- SUPCHAT — plateforme de chat temps réel + IA Mistral, live sur supchat.fr — **projet de groupe, à créditer**
- 4WEBD-TICKET — appli de gestion de tickets (+ infra complète)
- 4AGQL-PROJ — gestion scolaire via 3 microservices GraphQL + Mesh
- 3DOKR- — orchestration Docker Swarm (3 approches de déploiement)
- 4PROJ- (SUPFile) — alternative française à Dropbox/Drive : stockage chiffré, IA documentaire embarquée "Bobby" (RAG/Ollama), MFA, coffre-fort, web+mobile+desktop, live sur supfile.tech — **projet de groupe, à créditer**

**Projets BTS (3, à inclure pour montrer la progression) :**
- Ancien portfolio statique (Rudy-GAULT-Portfolio.github.io)
- Projet GSB — Gestion des visites médicales
- Location-GSB (Python/Flask)
- À mettre en valeur : BTS SIO terminé avec ~16 de moyenne, 1er au projet de 3e année SUPINFO, 2e à celui de 4e année, + initiative perso de montage d'un lab SUPINFO (gestion budget, cahier des charges, équipement)

**Projet entreprise / alternance :**
- Rapport d'alternance Cloud Temple 2024-2025 (VMware/ESXi, Ansible, CI/CD, monitoring, API RTMS/Confluence) — **client jamais nommé, à anonymiser systématiquement**

**Projets perso (3 univers) :**
- Homelab — infra self-hosted (Proxmox, Terraform/Ansible, OPNsense, Authentik, Traefik, observabilité) — ~70% terminé
- SUPINFO Lab — proposition de lab pédagogique collaboratif sur le campus de Tours (en planification)
- Ops Delivery Suite — 13 outils DevOps autonomes (hardening Ansible, CI/CD templates, backup, audit sécurité Trivy, Traefik, monitoring...) — 11/13 terminés — **présenté comme un seul projet "suite d'outils DevOps" avec vue détaillée par outil**

## Choix techniques

- **Styling** : sobre et soigné, pas d'exemple de référence imposé. Palette/typo à proposer (aucune charte existante).
- **Contenu** : Content Collections Astro (Markdown/MDX, un fichier par projet).
- **Dark/Light mode** : toggle manuel + persistance localStorage.
- **Interactivité** : îles React pour les parties interactives (filtres, etc.).
- **Animations** : Framer Motion.
- **Hébergement** : homelab perso, déploiement via CI/CD Forgejo.
- **Nom de domaine** : pas encore défini — prévoir un sous-domaine temporaire.
- **i18n** : français uniquement (pas de FR/EN).
- **Contact** : lien mailto, pas de formulaire backend.

## Structure et arborescence

- Catégories : **Parcours**, **Compétences** (transversale, tags par techno), **Projets perso**, **Projets école**, **Projet entreprise (Cloud Temple)**.
- Ops Delivery Suite = une seule entrée projet avec sous-vues par outil.
- BTS inclus comme fil de progression (BTS → SUPINFO 3e/4e année → alternance).
- Rapport Cloud Temple : anonymisation totale du client, toujours.
- SUPCHAT et SUPFile : mention "projet de groupe" + crédit des contributeurs.
- Positionnement : **tech + soft skills/gestion** — mettre en avant l'appétence gestion de projet/leadership (ex. initiative du lab SUPINFO avec gestion budget) en plus du contenu technique.

## Visuels et identité

- Pas de charte graphique existante — palette + police à proposer (cohérent profil DevOps/cloud).
- Pour les projets sans visuels propres : utiliser les PNG/diagrammes existants directement (pas de génération de schémas custom).
- Avatar page "Parcours" : photo de profil GitHub.

## Compétences

- Compétences agrégées par projet (pas de page séparée listant tout, mais des tags réutilisés dans la page "Compétences" transversale).

---

Prochaine étape : scaffolding du projet Astro (structure de dossiers, content collections, design system) sur la base de ces décisions.
