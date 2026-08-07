---
project: homelab
title: "Les vraies pannes"
summary: "Une infrastructure qui n'a jamais eu d'incident sérieux n'a jamais vraiment tourné. Le récit de quelques pannes formatrices, avec la méthode de diagnostic utilisée."
order: 6
---

Un homelab qui n'a jamais eu d'incident sérieux n'a jamais vraiment tourné. Ce qui suit n'est pas
une liste de services qui fonctionnent - c'est la méthode de diagnostic utilisée quand quelque
chose casse, souvent plus révélateur qu'un uptime à 100%.

## La panne réseau totale

Le scénario le plus stressant à date : plus aucun accès à l'infrastructure, tous les services
familiaux (streaming, mots de passe) injoignables. Méthode, du plus simple au plus poussé :

1. **Isoler ce qui répond encore** - le firewall (machine séparée du cluster, voir
   [l'équipement](/projets/homelab/materiel/)) restait joignable, ce qui a immédiatement écarté
   une coupure de courant générale
2. **Utiliser cette machine survivante comme poste d'observation** - sa table ARP ne montrait
   aucune entrée pour les deux nœuds Proxmox, alors que les autres VLANs répondaient normalement
   pour leurs propres passerelles
3. **Lire les graphes de trafic réseau** (RRD) pour dater précisément l'incident - une chute
   nette du débit à un horodatage précis, permettant de croiser avec les journaux système au lieu
   de chercher à l'aveugle sur 24h
4. **Conclusion** : les deux machines physiques de virtualisation étaient down simultanément,
   sans explication réseau - direction l'accès physique

La leçon n'est pas la cause elle-même, mais la méthode : isoler ce qui répond encore avant de
supposer que tout est cassé, et utiliser les éléments qui survivent comme points d'observation
plutôt que de deviner.

## La migration VLAN - le vrai post-mortem

Passer d'un réseau plat à 4 VLANs segmentés (voir [l'infrastructure](/projets/homelab/infrastructure/))
a cassé plusieurs choses avant de fonctionner :
- Des ports de switch inversés (mauvais VLAN sur le mauvais port physique)
- Un paramètre `bridge-vids` manquant côté Proxmox, qui limitait silencieusement les VLANs
  autorisés à traverser le bridge réseau
- Une règle de pare-feu bloquante découverte tardivement, qui filtrait du trafic légitime sans
  message d'erreur explicite

Chacun de ces trois problèmes, pris isolément, était un simple oubli de configuration. Ensemble,
ils ont transformé une migration prévue pour une soirée en plusieurs jours de diagnostic - la
vraie leçon étant qu'un changement réseau doit être découpé en étapes vérifiables une par une,
pas appliqué d'un bloc.

## La chaîne de pannes Jellyfin

Un incident en cascade révélateur de comment un premier problème mineur peut en déclencher
d'autres si les mécanismes de récupération automatique ne sont pas eux-mêmes fiabilisés - détaillé
dans [la page Jellyfin](/projets/homelab/jellyfin/). En résumé : un job de sauvegarde se fige sur
le point de montage FUSE utilisé pour le streaming, le conteneur se retrouve verrouillé, un
redémarrage forcé résout le verrou mais fait planter un plugin au passage, et le premier
correctif déplace le problème plutôt que de le résoudre - les archives générées remplissent le
disque de l'hôte. La leçon : un correctif qui ne s'attaque qu'au symptôme visible laisse la vraie
cause structurelle intacte, et elle revient sous une autre forme.

## L'instabilité réseau nocturne

Une instabilité sur le switch réseau a provoqué des coupures en cascade sur plusieurs services
indépendants (gestionnaire de mots de passe figé, service de streaming en boucle de redémarrage)
la même nuit - un bon rappel que dans une infrastructure segmentée, une seule couche partagée
(ici le réseau physique) reste un point de défaillance commun à tout ce qui en dépend, malgré la
segmentation logique en VLANs.

## La rotation complète des credentials

Avant tout pentest sérieux, tous les mots de passe et secrets créés pendant la construction du
lab ont été considérés comme "brûlés" et roulés méthodiquement - voir
[la sécurité](/projets/homelab/securite/) pour pourquoi cette étape précède le pentest plutôt que
l'inverse.

## Ce que ces incidents ont en commun

Aucun n'a de cause unique et évidente. Tous ont demandé de résister à la tentation de la première
explication plausible, et de vérifier méthodiquement avant d'agir - la même discipline qui
sous-tend la partie sécurité du projet.
