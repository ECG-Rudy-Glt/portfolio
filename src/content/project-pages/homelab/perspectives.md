---
project: homelab
title: "La suite"
summary: "Cluster Kubernetes, NAS définitif, cloud personnel, streaming musique auto-hébergé, automatisation par IA locale, migration Linux du poste client - et le fil conducteur derrière tout ça : l'indépendance."
order: 10
---

La [page projet](/projets/homelab/#ce-qui-reste-à-faire) liste rapidement ce qui reste à faire.
Cette page détaille pourquoi ces chantiers, dans cet ordre de priorité.

## Le fil conducteur : ne plus dépendre des GAFAM par défaut

Ce n'est pas un absolu - certains services restent plus simples à consommer en SaaS - mais
reprendre le contrôle sur ce qui peut raisonnablement l'être est la logique derrière chaque
nouveau chantier du lab. Chaque service auto-hébergé de plus est un abonnement de moins et une
dépendance de moins à une plateforme tierce.

## Cloud personnel - Nextcloud et Immich

Reprendre la main sur le stockage de fichiers et les photos de famille plutôt que de dépendre
d'un cloud tiers. Techniquement déjà provisionnés, pas encore mis à disposition avec de vraies
données - la priorité a été donnée aux fondations (réseau, sécurité, observabilité) avant
d'exposer un service que la famille utiliserait au quotidien avec des données sensibles.

## NAS définitif et Proxmox Backup Server

Le disque récupéré d'un iMac (voir [le stockage](/projets/homelab/stockage-hdd/)) est une
solution phase 1, pas la cible finale. Un NAS dédié suivra, avec Proxmox Backup Server pour des
sauvegardes réellement testées et déduppliquées plutôt qu'une simple copie de fichiers.

## Streaming musique auto-hébergé

Remplacer Spotify (version familiale) par une stack lossless, avec découverte algorithmique et
recherche libre - sans dépendre d'un moteur d'IA générative pour la recommandation. Piste
sérieusement creusée : un serveur de streaming léger compatible avec un large écosystème de
clients mobiles, couplé à un mécanisme d'acquisition automatisée façon Jellyfin
(voir [la page Jellyfin](/projets/homelab/jellyfin/)), et un moteur de recommandation basé sur du
filtrage collaboratif plutôt que sur un LLM. Le vrai défi identifié n'est pas l'outillage mais la
disponibilité du contenu : un service de débridage a un taux de disponibilité immédiate bien
inférieur pour la musique lossless que pour la vidéo grand public - la solution passe par un
pré-remplissage intelligent de la bibliothèque plutôt que du tout-à-la-demande.

## Automatisation par IA locale

Une piste explorée mais volontairement mise de côté pour l'instant : brancher un LLM local
(auto-hébergé, pas d'API tierce) à des automatisations concrètes du lab - résumé d'incidents,
triage d'alertes, aide au diagnostic. Le principe retenu : si l'IA doit toucher à l'infrastructure,
elle tourne en local, sur le lab lui-même, cohérent avec la philosophie générale
d'indépendance du projet.

## Migration Linux du poste client

Le Dell XPS 15 personnel reste aujourd'hui un simple terminal vers le lab (voir
[les services](/projets/homelab/services/)) - tout le calcul et l'état vivent sur
l'infrastructure. La dernière étape prévue est de migrer ce poste lui-même sous Linux, pour
sortir également la machine de saisie quotidienne de l'écosystème Windows.

## Et après - le freelance

Ce homelab a démarré comme un projet de fin de 4e année (voir
[pourquoi ce projet](/projets/homelab/pourquoi/)), mais son objectif dépasse le cadre académique :
préparer une activité indépendante, notamment en sécurité. Le pentest mené sur ma propre
infrastructure (voir [la sécurité](/projets/homelab/securite/)) est le premier exercice concret
dans cette direction - la suite logique est de reproduire cette rigueur sur des infrastructures
qui ne sont pas la mienne.
