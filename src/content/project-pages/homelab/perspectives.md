---
project: homelab
title: "La suite"
summary: "NAS définitif, fiabilisation du réseau et du quorum, montée de versions, pentest interne, migration Linux du poste client - ce qui reste, ce qui est fait depuis, et le fil conducteur derrière tout ça : l'indépendance."
order: 10
---

La [page projet](/projets/homelab/#ce-qui-reste-à-faire) liste rapidement ce qui reste à faire.
Cette page détaille pourquoi ces chantiers, dans cet ordre de priorité.

## Le fil conducteur : ne plus dépendre des GAFAM par défaut

Ce n'est pas un absolu - certains services restent plus simples à consommer en SaaS - mais
reprendre le contrôle sur ce qui peut raisonnablement l'être est la logique derrière chaque
nouveau chantier du lab. Chaque service auto-hébergé de plus est un abonnement de moins et une
dépendance de moins à une plateforme tierce.

## Ce qui était « la suite » et qui est fait

- **Cloud personnel** : Immich (photos) et Nextcloud (fichiers) sont en service, avec des alertes
  sur le remplissage du stockage. Ils ont attendu que sauvegardes et supervision soient prêtes.
- **State Terraform partagé et verrouillé** : fait en novembre (voir [l'IaC](/projets/homelab/iac/)).
- **Un agent IA branché sur le lab** : c'est Hermes, qui explique les alertes, prend les demandes de
  films et pilote la maison (voir [l'outillage IA](/projets/homelab/outillage-ia/)). Il ne tourne pas
  sur un LLM local, contrairement à l'idée de départ : mesuré sur ces mini-PC sans GPU, c'était
  trop lent. Le compromis retenu est un modèle distant à budget plafonné, derrière des garde-fous
  qui ne dépendent pas de lui.
- **Des applications en GitOps** : Patrimoine, COACH et un CRM tournent sur Kubernetes, avec un
  dépôt par application.

## Ce qui a été abandonné

**Le streaming musique auto-hébergé.** L'objectif était de remplacer Spotify par une bibliothèque
lossless, avec Navidrome et une acquisition automatisée. Le projet a été commencé, puis abandonné
début novembre : sa VM chargeait un disque NVMe qui montait déjà à 80 °C, et le gain ne justifiait
pas d'ajouter de la charge à un lab qui chauffait. Abandonner proprement fait aussi partie du
travail : VM supprimée par Terraform, stockage libéré, rôles et scripts retirés du dépôt.

## NAS définitif

Proxmox Backup Server tourne, avec une copie hors site chiffrée et une restauration testée. Mais son
datastore vit sur un disque récupéré d'un iMac (voir [le stockage](/projets/homelab/stockage-hdd/)),
branché en USB : une nuit, toutes les sauvegardes ont échoué parce qu'il avait été rallumé après le
serveur de sauvegarde. Un NAS dédié le remplacera, sans changer la chaîne de sauvegarde elle-même.

## Fiabiliser ce qui est déjà là

- **La carte réseau du firewall** : remplacer les cartes Realtek par des Intel, la vraie réponse aux
  pannes sous charge de l'été (voir [les vraies pannes](/projets/homelab/incidents/)).
- **Le quorum du cluster** : un QDevice externe, pour qu'un nœud puisse tomber sans bloquer l'autre.
- **Un canal d'alerte vraiment hors bande** : aujourd'hui, e-mail, Home Assistant et Telegram
  dépendent tous de la connexion Internet du lab.
- **La dissipation des mini-PC** : les NVMe montent à 80 °C sous charge. Des plafonds de lecture et
  une répartition par température sont en place, la ventilation reste à revoir.
- **La montée de versions** : Proxmox Backup Server 4, puis Debian 13 invité par invité, avec un
  nouveau modèle de VM à côté de l'actuel.

## Le pentest interne

Le pentest externe a vérifié la surface publique (voir [la sécurité](/projets/homelab/securite/)).
Le volet interne - un attaquant déjà présent sur un VLAN - reste à mener, et c'est le prochain
exercice de sécurité.

## Migration Linux du poste client

Le Dell XPS 15 personnel reste aujourd'hui un simple terminal vers le lab (voir
[les services](/projets/homelab/services/)) - tout le calcul et l'état vivent sur
l'infrastructure. La dernière étape prévue est de migrer ce poste lui-même sous Linux, pour
sortir également la machine de saisie quotidienne de l'écosystème Windows.

## Et après - Platform Engineering

Ce homelab a démarré comme un projet de fin de 4e année (voir [pourquoi ce projet](/projets/homelab/pourquoi/)),
et il sert aujourd'hui de terrain pour la suite : mon activité freelance tourne dessus (site, prise
de rendez-vous, CRM), et il sert de banc d'essai à mon
[parcours Platform × Harness engineer](/projets/parcours-platform-harness/), où chaque module se
termine par un lab mené sur cette infrastructure : opérateur Kubernetes, golden paths, supply chain
signée, SLO, et une plateforme pour faire tourner des agents isolés.
