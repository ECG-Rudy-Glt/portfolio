---
project: homelab
title: "Domotique, extension réseau et vidéosurveillance locale"
summary: "Home Assistant comme seul point de passage vers le VLAN IoT isolé, et le chantier en cours pour l'étendre : un AP WiFi dédié multi-SSID (remplace un projet CPL abandonné) et une caméra intérieure 100% locale, sans dépendance cloud tierce."
order: 9.8
---

## Home Assistant - un hub, pas une porte ouverte

[Home Assistant](https://www.home-assistant.io/) tourne comme service dédié sur le lab, et c'est le
**seul** autorisé à parler au VLAN IoT isolé (voir [l'infrastructure réseau](/projets/homelab/infrastructure/)
pour le détail des 4 VLANs). Le principe est simple : les appareils domotiques n'ont eux-mêmes
aucun accès direct au reste du réseau ni à Internet - seul Home Assistant, sur son propre segment,
a le droit de leur parler. Un appareil IoT compromis reste cantonné à son VLAN, sans rebond
possible vers le reste de l'infrastructure.

## Pourquoi étendre le réseau maintenant

Deux besoins sont apparus en parallèle, tous les deux bloqués par la même limite physique : la
prise Ethernet murale de certaines pièces ne remonte pas sur les VLANs du lab, mais sur le réseau
propre de la box opérateur (deux réseaux IP distincts, aucune passerelle entre les deux sans
tout recâbler). Premier besoin : une TV dans une pièce sans accès direct au réseau du lab, donc
sans découverte Jellyfin possible. Second besoin, apparu au même moment : une caméra de
surveillance d'appartement, à connecter au lab plutôt qu'au cloud du fabricant.

Un premier essai en courant porteur (CPL) pour la TV a été abandonné après plusieurs soirées de
tests peu concluants (résultats pollués par le WiFi resté actif sur les appareils de test, un
test ayant même fait perdre l'accès Internet le temps de le corriger) - pas la peine de s'acharner
sur une techno dont la fiabilité reste, par nature, dépendante de la qualité du réseau électrique
de l'appartement. Solution retenue à la place : un seul point d'accès WiFi dédié, mutualisé entre
les deux besoins.

## Le choix du point d'accès - et une limite trouvée après achat

Modèle retenu : **Cudy WR3000E** (WiFi 6 AX3000, 5 ports Gigabit, mode "point d'accès" natif dans
le firmware stock) plutôt qu'un modèle plus cher initialement envisagé - le bon rapport
fonctionnalités/prix pour un simple AP, sans les frais d'un contrôleur centralisé inutile ici.

Point important découvert en creusant la fiche technique avant achat : le firmware stock Cudy,
bien que probablement bâti sur une base OpenWrt en interne, n'expose pas son interface LuCI ni le
VLAN par SSID - impossible d'y rattacher un SSID à un VLAN précis directement depuis l'UI
propriétaire. Bonne nouvelle : Cudy documente et signe eux-mêmes le chemin de flash vers de
l'OpenWrt officiel pour ce modèle - pas un hack tiers non supporté. Le plan retenu passe donc par
un flash complet vers OpenWrt, pour retrouver le contrôle fin nécessaire : deux SSID (`lab-media`
pour la TV, `lab-iot` pour la caméra), chacun rattaché à son propre VLAN tagué, port d'uplink
configuré en trunk vers le switch principal.

Autre point tranché avant même l'achat : le Cudy propose sa propre appli de gestion cloud (Cudy
Mesh, administration à distance TR-069) - **écartée d'office**, même logique que pour la caméra
ci-dessous. Un équipement réseau interne se gère en local, pas via un compte cloud tiers.

## La caméra - RTSP local, zéro cloud

Modèle retenu : **Reolink E1 Pro**, choisi spécifiquement parce qu'il expose du RTSP/ONVIF en
local sans dépendre du cloud du fabricant - contrairement à des alternatives grand public type
Ring ou Nest, structurellement pensées autour d'un abonnement cloud. Le P2P/cloud de l'appli
Reolink sera désactivé au profit du mode local uniquement : une caméra de sécurité qui "téléphone"
en continu vers un tiers va à l'encontre du but recherché.

Côté réseau, la caméra se connecte au SSID `lab-iot` (VLAN IoT) comme n'importe quel autre
appareil domotique - même modèle d'isolation que pour Home Assistant : aucun accès Internet
sortant pour ce VLAN, seul le service d'enregistrement a le droit de tirer le flux RTSP.
L'enregistrement lui-même sera géré par [Frigate](https://frigate.video/) (détection d'objets/
personnes en plus du simple enregistrement continu), avec le stockage sur le NAS déjà en place
pour le reste du lab (voir [le stockage](/projets/homelab/stockage-hdd/)).

## Accès à distance - réutiliser ce qui existe déjà

Pas de nouveau VPN à déployer pour consulter le flux depuis l'extérieur : Tailscale tourne déjà au
niveau du firewall OPNsense, avec du subnet routing sur l'ensemble du réseau du lab - le VLAN IoT
en fera partie une fois créé. Une fois connecté à Tailscale depuis un appareil externe, l'accès au
NVR se fait exactement comme depuis l'appartement. Dupliquer ce mécanisme avec un VPN propre à
l'AP aurait été redondant - la bonne réponse ici a été de ne rien construire de plus, pas d'ajouter
une couche.

## Où ça en est

Le matériel (AP + caméra) reste à commander au moment où j'écris ces lignes, mais la conception
est bouclée : quel modèle, pourquoi, ce que le firmware stock ne permet pas, comment le contourner
proprement, et une checklist de configuration détaillée prête à exécuter à réception (flash
OpenWrt, VLANs, SSID, règles de pare-feu). Le choix conscient a été d'investir le temps dans la
conception avant l'achat, plutôt que d'acheter puis découvrir après coup une limite bloquante -
ce qui est exactement ce qui s'est passé avec le firmware stock, mais avant de commander, pas
après.
