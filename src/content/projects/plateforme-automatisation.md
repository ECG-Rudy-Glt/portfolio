---
title: "Plateforme interne d'automatisation - Portail & microservices"
category: entreprise
summary: "Unification d'une vingtaine d'outils d'automatisation isolés (audit, supervision, reporting, IA) derrière un portail web unique : edge sécurisé, SSO, microservices conteneurisés et chaîne CI/CD durcie."
period: "2025 - 2026 (en cours)"
role: "Conception et développement en solo, dans le cadre de mon alternance"
stack: ["Caddy", "Authelia (SSO/OIDC)", "React", "FastAPI", "Docker", "PostgreSQL", "GitLab CI", "gitleaks", "Grype", "Checkov", "Syft (SBOM)", "Python", "LLM / tool-calling"]
tags: ["Architecture", "Microservices", "Sécurité", "SSO", "CI/CD", "DevOps", "IA / AIOps"]
featured: true
relevance: "majeur"
order: 5
---

## Le problème

Au fil de mon alternance, j'ai créé ou repris une vingtaine d'outils d'automatisation indépendants (audit d'infrastructure, supervision réseau, reporting, génération de documents, premiers cas d'usage IA). Chacun avait été construit isolément pour répondre vite à un besoin précis - un choix pertinent au départ, à coût et couplage minimal. Mais à cette échelle, le modèle a montré ses limites : autant de points d'entrée que d'outils, aucune authentification commune, des clients API réimplémentés dans chaque projet, des secrets dupliqués sur plusieurs dépôts, et une seule personne (moi) détenant la connaissance de l'architecture des déclenchements entre pipelines - un vrai risque pour la continuité de l'équipe.

J'ai formalisé ce constat dans deux documents de cadrage soumis à ma hiérarchie : l'un proposait un portail web pour unifier l'accès aux outils, l'autre une plateforme de microservices pour industrialiser leur exécution. Plutôt que de les traiter comme deux chantiers séparés, j'ai fini par les fusionner en un seul projet réel.

## La solution : un point d'entrée unique, sécurisé par construction

L'architecture repose sur un edge unique (reverse proxy Caddy, TLS interne) qui remplace les multiples points d'entrée indépendants, une authentification mutualisée par SSO (Authelia - comptes nominatifs, groupes, 2FA optionnelle) pour qu'aucun outil satellite ne réimplémente sa propre gestion des accès, un portail d'accueil en React qui affiche à chaque utilisateur les outils accessibles selon son groupe, et un réseau Docker partagé qui connecte les modules entre eux sans les exposer individuellement.

```
Utilisateur ─► Edge Caddy (TLS) ─► SSO Authelia
                     │
        ┌────────────┼────────────────────┬───────────────┐
   Supervision   Reporting /         Documentation      Orchestrateur
   réseau        suivi d'alertes     d'exploitation      Azure DevOps
   (dashboard,   (remplace des       (portage d'un       (webhook + polling,
   inventaire)   fichiers Excel      outil desktop       client API mutualisé)
                 manuels)            en web)
        │
   Agent IA (tool-calling en lecture seule sur les APIs internes)
```

Huit modules sont aujourd'hui fédérés derrière ce point d'entrée : un outil déclaratif de gestion du cycle de vie des équipements réseau supervisés (façon Terraform, `plan`/`apply` sur un inventaire versionné), son frontend de consultation, un outil de suivi d'alertes critiques qui remplace un fichier Excel de 42 onglets devenu ingérable, un module de détection des sondes de supervision désactivées avec réactivation en lot, un lecteur web de documentation d'exploitation (portage d'une ancienne application desktop autonome), un orchestrateur qui centralise les automatisations côté outil de gestion de projet (client API mutualisé, remplacement de 6 projets webhook historiques par un point d'entrée unique), et un agent conversationnel IA détaillé plus bas.

## Processus DevOps et sécurité

Chaque module passe par une chaîne CI/CD commune que j'ai construite pour l'ensemble de la plateforme plutôt que projet par projet :

- **Détection de secrets** (gitleaks) sur l'historique complet des dépôts, pas seulement le dernier commit.
- **Lint de Dockerfile** et **scan de vulnérabilités des images** (Grype, après avoir écarté un outil concurrent suite à des incidents de sécurité documentés).
- **Contrôle des mauvaises configurations** (Checkov) et **génération systématique d'un SBOM** (Syft, format CycloneDX) pour tracer les dépendances de chaque service.
- **Déploiement en mode "push"** (build → export de l'image → transfert → chargement) car la VM de production n'a pas d'accès direct au registre - une contrainte réseau réelle, contournée plutôt qu'ignorée.

Avant la mise en production, j'ai mené un audit de sécurité de la plateforme elle-même qui a révélé des mots de passe par défaut sur une base de données, une API exposée sans authentification et du CORS ouvert sur un des modules - autant de points corrigés avant l'ouverture, dans une logique de sécurité dès la conception plutôt qu'ajoutée après coup.

## Un cas d'usage IA cadré plutôt qu'ambitieux sans limite

J'avais développé, plus tôt dans mon parcours, un chatbot d'analyse automatique de tickets qui avait dû être abandonné : hallucinations trop fréquentes, périmètre de données trop hétérogène pour qu'un LLM les traite de façon fiable. Cette expérience a directement façonné ma manière d'intégrer l'IA dans cette plateforme : l'agent conversationnel qui y tourne aujourd'hui répond aux questions en langage naturel sur les données de supervision en interrogeant en **tool-calling** les API réelles des modules - aucune valeur inventée, uniquement des données récupérées en direct -, avec un service entièrement stateless côté serveur, des appels strictement en lecture seule, et un journal d'audit de tous les échanges. C'est le même principe de garde-fou que celui appliqué sur mon outil de vérification croisée de conformité, qui combine systématiquement le LLM à des règles déterministes plutôt que de le laisser trancher seul.

## Statut et résultats

La plateforme est construite à un rythme quasi quotidien depuis son démarrage, avec plusieurs modules déjà en production et d'autres encore en cours d'intégration - je préfère le documenter tel quel plutôt que présenter un chantier encore actif comme terminé. Concrètement, elle a déjà permis de retirer six projets webhook redondants au profit d'un orchestrateur unique, de remplacer plusieurs suivis manuels par des outils partagés et sécurisés, et de donner à toute la squad un point d'entrée commun plutôt qu'un outil par besoin.

Elle a surtout été pensée dès le départ pour ne pas rester figée à ces huit modules : de nouveaux services (reporting, IA, supervision) sont déjà prévus pour la rejoindre au fur et à mesure des besoins, sans avoir à recréer un point d'entrée, une authentification ou une chaîne CI/CD par outil comme c'était le cas auparavant - c'est précisément ce que cette architecture était censée résoudre.

## Ce qui reste à faire

Finaliser le durcissement CI/CD des derniers modules, mettre l'agent conversationnel en production, mutualiser complètement les derniers clients API encore dupliqués, et engager le volet gouvernance que je n'ai pas encore traité (gestion centralisée des secrets, observabilité distribuée). À plus long terme, faire évoluer le déploiement actuel par Docker Compose vers un véritable orchestrateur de cluster pour ouvrir la plateforme à d'autres équipes - la vision de départ, mais son aboutissement, pas encore son état actuel.
