---
project: homelab
title: "Le stockage - d'un iMac démonté à Proxmox Backup Server"
summary: "Le disque dur qui sert de NAS phase 1 vient d'un iMac récupéré et démonté. Le détail de sa remise en service : vérification de santé, stabilité USB, et la bascule vers une vraie sauvegarde déduppliquée."
order: 8
---

## D'où vient ce disque

Le budget du projet (voir [l'équipement](/projets/homelab/materiel/)) priorise le cœur de
l'infrastructure avant le stockage dédié. Plutôt que d'attendre un NAS neuf pour avoir de vraies
sauvegardes, la solution retenue a été un disque dur récupéré d'un iMac démonté - l'occasion de
lui donner une seconde vie plutôt que de le laisser à la benne. Le démontage complet (extraction
du disque d'un iMac tout-en-un, pas conçu pour être ouvert facilement) fait l'objet d'un article
dédié : [Transformer un iMac 27" en écran externe](/blog/imac-ecran/).

## Ne pas faire confiance à un disque récupéré sans le vérifier

Un disque qui vient d'un usage inconnu de plusieurs années ne se met pas directement en
production. Méthode suivie avant toute utilisation :

1. **Vérification S.M.A.R.T. complète** - pas juste le statut global "PASSED", mais les
   compteurs qui comptent vraiment : secteurs réalloués, secteurs suspects en attente, erreurs
   non corrigées. Tous à zéro était la condition pour continuer.
2. **Test actif, pas seulement passif** - un test court puis un test étendu de plusieurs heures
   qui lit réellement toute la surface du disque, plutôt que de se fier au seul historique
   déclaratif.
3. **Stabilité de la connexion USB** - un disque externe sur un serveur qui tourne en continu
   peut se faire mettre en veille par le système ou se déconnecter selon le chipset du boîtier ;
   vérifié avant de considérer le disque fiable.

Résultat : un disque avec un historique d'usage réel (plusieurs milliers d'heures de
fonctionnement, beaucoup de cycles marche/arrêt) mais sans aucun secteur défectueux -
utilisable, avec une vigilance de suivi plutôt qu'une confiance aveugle.

## De la sauvegarde simple à Proxmox Backup Server

La première option - un stockage "dossier" basique côté hyperviseur - fonctionne mais fait une
sauvegarde **complète à chaque exécution**, sans déduplication. La cible retenue est
**Proxmox Backup Server** : déduplication par blocs, incrémental permanent, vérification
d'intégrité native. Le disque y est géré comme un datastore amovible, avec passthrough USB direct
vers une VM dédiée plutôt qu'un simple montage de dossier - ce qui donne à PBS un accès bloc
natif plutôt qu'une couche d'abstraction supplémentaire.

## La règle 3-2-1, partiellement

L'objectif : 3 copies des données, sur 2 supports différents, dont 1 hors site.
- **Copie 1** : les données en production (VMs, conteneurs)
- **Copie 2** : ce NAS phase 1, sur un disque physiquement distinct des SSD qui font tourner les
  VMs
- **Copie 3 (hors site)** : synchronisation chiffrée côté client vers un stockage objet cloud,
  restreinte aux services ayant un vrai état à perdre - configuration, secrets, bases de données.
  Le contenu média n'a explicitement pas besoin d'être sauvegardé : voir
  [Jellyfin sans stockage local](/projets/homelab/jellyfin/) pour comprendre pourquoi.

Le chiffrement de la copie hors site se fait **avant** que les données ne quittent le réseau
local - rien en clair n'est envoyé vers le stockage cloud tiers.

## Une sauvegarde jamais restaurée n'est qu'une espérance

Un job de sauvegarde qui tourne sans erreur ne prouve rien en soi - seule une restauration réelle
le prouve. Test effectué en conditions réelles : restauration complète d'un conteneur de
production (Vikunja) depuis PBS, puis à nouveau depuis la copie hors site chiffrée - les deux
restaurations ont abouti sans perte de données. C'est cette vérification, plus que l'existence du
job lui-même, qui rend la stratégie 3-2-1 ci-dessus crédible plutôt que théorique.
