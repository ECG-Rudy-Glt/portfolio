---
project: homelab
title: "Jellyfin - streaming familial sans stockage local"
summary: "Le service le plus complexe du lab : zéro média stocké en local, exposition publique réelle et durcie, casting facile pour toute la famille via Streamyfin, et la chaîne technique complète derrière une simple recherche de film."
order: 9
---

## Pourquoi zéro stockage local

Investir dans plusieurs téraoctets de disques pour une médiathèque n'était pas une option
cohérente avec le reste du projet (voir [l'équipement](/projets/homelab/materiel/)). La chaîne
retenue repose entièrement sur un service de débridage : le contenu n'est jamais téléchargé sur
l'infrastructure elle-même.

## La chaîne technique complète

Du clic de la famille jusqu'à la lecture, plusieurs briques distinctes s'enchaînent :

```
Famille (♥ favori OU recherche + demande)
   │
   ▼
Jellyseerr (interface de demande, style Netflix)
   │
   ▼
Riven (orchestrateur : cherche, résout la meilleure source)
   │
   ▼
Service cloud de debrid (le fichier reste stocké à distance)
   │
   ▼
Système de fichiers virtuel (FUSE) - présente le fichier comme s'il était local
   │
   ▼
Jellyfin core (transcodage matériel via l'iGPU si besoin, catalogue, comptes)
   │
   ▼
Client (Streamyfin / Wholphin / web) - lecture directe ou cast
```

Deux mécanismes de demande coexistent, indépendants du client utilisé : le ♥ (favori) sur un
élément suggéré déclenche automatiquement la chaîne ci-dessus via un plugin serveur qui surveille
cette action standard de l'API Jellyfin - universelle, disponible sur tous les clients. La
recherche manuelle avec sélection de qualité passe par une intégration différente selon le
client (voir plus bas pour Streamyfin).

## Pourquoi Streamyfin pour la famille

Le vrai problème à résoudre n'était pas "lire une vidéo" - l'app officielle Jellyfin le fait déjà
très bien - mais **caster facilement vers la TV du salon depuis un foyer avec un mélange
d'iPhone et d'Android**. Sur ce point précis, Streamyfin est à ce jour à peu près le seul client
tiers avec un Chromecast qui fonctionne **sur iOS et Android en même temps** - la plupart des
alternatives ne couvrent qu'une seule des deux plateformes (Findroid : Android uniquement,
Infuse : AirPlay seulement sur iOS, pas de Google Cast).

Un détail technique qui a son importance : le Chromecast ne relaie pas l'écran du téléphone, il
récupère le flux **lui-même**, directement sur le réseau de la maison. Ça a exigé de résoudre un
problème de réseau local avant que le cast fonctionne de façon fiable - indépendant du choix de
l'app, mais découvert en mettant Streamyfin en place.

Bonus qui a pesé dans le choix : Streamyfin a sa **propre intégration Jellyseerr native** (pas
besoin du plugin web injecté dans le client, qui ne fonctionne que sur les apps officielles) -
authentification déléguée au compte Jellyfin de l'utilisateur, pas de clé API séparée à gérer côté
famille. Pour les téléviseurs (Android TV, Google TV, Fire TV), un client différent -
**Wholphin**, pensé TV-first plutôt qu'un portage de l'app mobile - complète le dispositif sans
rien changer côté serveur : les deux clients parlent à la même instance Jellyfin, le mécanisme de
requête reste identique.

## L'exposition publique - pas juste un port ouvert

Contrairement au reste du lab, accessible uniquement via VPN (voir
[l'infrastructure](/projets/homelab/infrastructure/)), Jellyfin est volontairement exposé sur
Internet pour que la famille y accède sans configurer de VPN sur chaque appareil. Cette exception
est protégée par plusieurs couches indépendantes plutôt qu'une seule : allowlist géographique au
niveau du firewall, détection comportementale avec remédiation réseau automatique, rate-limiting
côté reverse proxy. Le détail de ce qui a été vérifié en conditions réelles est dans
[la page sécurité](/projets/homelab/securite/).

## Multi-comptes familiaux

Chaque membre de la famille a son propre compte, avec ses propres accès et son propre historique,
pas un compte partagé. Ça a un coût en complexité : gérer des demandes de contenu par
utilisateur, s'assurer que les permissions d'administration restent au bon niveau pour chacun, et
déboguer des bugs qui n'affectent qu'un compte précis pendant que les autres fonctionnent - le
genre de problème qui n'apparaît jamais sur une instance mono-utilisateur.

## Le service le plus fragile du lab

C'est aussi le service qui a généré le plus d'incidents réels - un job de sauvegarde qui se fige
sur le point de montage FUSE, un conteneur verrouillé, une chaîne de correctifs qui déplace le
problème avant de le résoudre. Le récit complet est dans
[les vraies pannes](/projets/homelab/incidents/). C'est directement lié à sa complexité : c'est
le service avec le plus de pièces mobiles (système de fichiers virtuel, transcodage matériel,
exposition publique, comptes multiples, deux clients distincts), donc statistiquement celui qui a
le plus de surface pour qu'un incident survienne.
