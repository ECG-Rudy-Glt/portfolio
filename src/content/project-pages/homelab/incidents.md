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

## Le firewall saturé par ses propres interruptions (août-septembre)

Trois pannes totales du même type, la dernière le 25 septembre : plus de LAN, plus de VPN, plus de
services publics pendant plus d'une heure, et **aucune alerte reçue**. Le firewall n'était pas
planté : un de ses quatre cœurs était saturé à 100 % par les interruptions de ses cartes réseau
Realtek, sous un flux entrant soutenu. Le déclencheur était interne : un script de contrôle de
santé qui relisait une partie de chaque fichier de la bibliothèque distante, et dont le cache
téléchargeait des dizaines de Mo au lieu de quelques Ko - une estimation faite à la main, jamais
mesurée. Le limiteur de débit n'a rien retenu : il était réglé par IP, et le trafic venait de six
ou sept IP à la fois.

Le post-mortem a trouvé une seconde panne cachée dans la première : le reverse proxy, redémarré
pendant la coupure, n'avait pas pu télécharger son plugin CrowdSec, et avait désactivé sans rien
dire toutes les routes publiques, restées en erreur plusieurs heures de plus. Et aucune alerte
n'était partie, parce que les e-mails d'alerte passaient par le firewall en panne.

Corrigé depuis : le script lit directement les octets utiles (0,6 Mbit/s en moyenne au lieu de
120), le plugin est embarqué dans la configuration du reverse proxy, le DNS et le coffre à secrets
démarrent en premier après un redémarrage, et des sondes surveillent les routes publiques et le DNS.
Reste ouvert : la carte réseau Intel, un limiteur à plafond global, et un canal d'alerte qui ne
dépende pas du firewall.

## La bibliothèque vidée par un montage disparu (octobre)

Une nuit d'octobre, le montage distant de la bibliothèque a décroché pendant un scan de Jellyfin.
Jellyfin a vu des dossiers vides et a retiré 788 éléments de sa base. Rien n'était perdu
(les fichiers sont distants), mais tout était à rescanner. Depuis, un garde-fou surveille le
montage **pendant** le scan et coupe Jellyfin s'il disparaît : mieux vaut un service arrêté
qu'une bibliothèque vidée.

## La maintenance automatique qui a figé le streaming (novembre)

Le script de maintenance nocturne prenait un instantané du conteneur Jellyfin avant de le mettre
à jour. Le gel du conteneur ne s'est jamais terminé, à cause du montage FUSE, exactement comme
lors d'un incident de juillet que je n'avais pas recoupé en écrivant le script. Jellyfin est resté
hors service toute la nuit, la sauvegarde a échoué, et aucun nœud n'a été mis à jour. La
correction ne s'est pas arrêtée au script : la règle « jamais d'instantané de ce conteneur » est
maintenant écrite dans les consignes du dépôt **et** bloquée par un hook qui refuse la commande,
qu'elle vienne de moi ou d'un agent (voir [l'outillage IA](/projets/homelab/outillage-ia/)).

## Le poste de dev qui faisait chauffer un disque (novembre)

La VM de développement s'est figée deux fois en trois jours, avec un NVMe à 82 °C. La mesure a
montré plus de 400 Go lus en quelques minutes pour 55 Go de données : la VM saturait sa mémoire et
relisait sans fin son disque. La première réponse (un plafond de lecture) traitait le symptôme ; la
récidive a forcé à trouver la cause, et la VM a eu plus de mémoire, de la mémoire compressée et un
garde-fou. Le disque, lui, n'était pas usé (5 %) : c'était un problème de dissipation dans un
boîtier de mini-PC, qui a ensuite conduit à déplacer le serveur Kubernetes sur l'autre nœud.

## Les sauvegardes d'une nuit, toutes en échec (novembre)

Toutes les sauvegardes d'une nuit ont échoué d'un coup. Le disque USB qui sert de datastore avait
été rallumé **après** le démarrage du serveur de sauvegarde, qui ne le remonte pas tout seul. Rien
n'a été perdu, mais c'est exactement le genre de panne silencieuse qu'un contrôle quotidien doit
attraper : le montage est maintenant automatique, et c'est un argument de plus pour le NAS
définitif.

## La rotation complète des credentials

Avant tout pentest sérieux, tous les mots de passe et secrets créés pendant la construction du
lab ont été considérés comme "brûlés" et roulés méthodiquement - voir
[la sécurité](/projets/homelab/securite/) pour pourquoi cette étape précède le pentest plutôt que
l'inverse.
