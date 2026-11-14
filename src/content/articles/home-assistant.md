---
title: "Home Assistant dans mon homelab : la maison et le lab sur le même tableau de bord"
summary: "Comment Home Assistant tourne dans une machine virtuelle de mon homelab, parle à mes lampes en Zigbee et à mes accessoires en Matter sur Thread, et surveille aussi l'infrastructure. La config, les automatisations qui servent vraiment et les pièges rencontrés."
date: 2026-11-14
tags: ["Homelab", "Domotique", "Home Assistant", "Self-hosting"]
type: article
cover: "/sites/homelab.webp"
---

Home Assistant est le seul service de mon [homelab](/projets/homelab/) que toute la famille touche
sans le savoir : la lumière du salon, le purificateur d'air, la TV. C'est aussi celui où
l'infrastructure et la maison se croisent, puisque le même outil qui allume une lampe me prévient
quand un conteneur s'arrête ou qu'un disque se remplit. Cet article décrit comment il est
installé, ce qu'il pilote, et ce qui m'a coûté du temps.

Ce que je ne montre pas : les noms des personnes, les trajets, les lieux, la caméra et tout ce qui
décrit les habitudes de la maison. Les captures viennent de tableaux de bord réels, recadrés pour
ne montrer que des équipements.

## L'installation

Home Assistant OS tourne dans une machine virtuelle du premier serveur Proxmox. Il vit dans la zone
réseau « confiance », avec l'identité et le coffre de secrets, parce qu'il a la main sur des objets
et des clés d'API. La machine est sauvegardée comme les autres invités, et Home Assistant fait aussi ses propres
sauvegardes, dont l'âge est affiché sur un tableau.

Il parle aux objets par trois chemins, résumés ci-dessous.

![Home Assistant dans une machine virtuelle du serveur 1, deux clés radio USB, le Bluetooth de la carte et le Wi-Fi de la box](/articles/home-assistant/radio.svg)

- **Zigbee** pour les lampes, avec une clé USB dédiée et l'intégration ZHA. Cinq lampes, qui
  forment un réseau maillé : chacune relaie les messages des autres.
- **Matter sur Thread** pour les accessoires récents : un bouton double avec molette, un capteur de
  température et deux prises connectées. Une seconde clé USB, flashée avec le firmware OpenThread,
  fait office de routeur de bordure Thread. Le Bluetooth de la carte du serveur ne sert qu'à
  l'appairage.
- **Le Wi-Fi de la box** pour tout ce qui l'utilise déjà : la TV (Google Cast), le purificateur
  d'air, la caméra et les téléphones.

Deux détails de câblage comptent plus qu'on ne le croit. Les clés USB sont transmises à la machine
virtuelle **par port** et non par identifiant : mes deux clés ont le même identifiant USB, donc
l'identifiant seul ne permet pas de savoir laquelle est laquelle. Et le réseau Zigbee (canal 11) est éloigné du
réseau Thread (canal 15), pour limiter les interférences sur la bande 2,4 GHz que tout le monde
partage.

## Ce qu'il pilote, au quotidien

Home Assistant compte environ 1 150 entités, 62 automatisations, 14 scripts et une douzaine de
tableaux de bord. Presque tout cela vient de trois familles d'intégrations : l'infrastructure
(Proxmox, AdGuard, la supervision), la maison (Zigbee, Matter, le purificateur, la TV) et quelques
services du quotidien (météo, calendrier, bibliothèque Jellyfin).

![Tableau Lumières : lampes, modes, éclairage automatique et boutons](/articles/home-assistant/tableau-lumieres.png)

Le tableau Lumières est celui qu'on regarde le plus. À gauche, des modes en un geste (film, nuit,
travail). Au centre, chaque lampe avec sa luminosité et sa teinte. Deux lampes sont indisponibles sur
cette capture : le tableau le signale plutôt que de les afficher éteintes. En bas, l'éclairage
automatique et l'explication des boutons.

## Les automatisations qui servent vraiment

J'en ai beaucoup écrit, mais une poignée fait l'essentiel du travail.

- **L'éclairage suit le soleil.** La luminosité et la teinte des lampes s'ajustent selon l'heure, la
  météo et la position du soleil. Si je règle une lampe à la main (appli ou bouton), elle passe en
  « manuel » pendant une heure, ou jusqu'à son extinction, puis l'automatisme reprend la main.
- **Un double bouton et une molette sur les piles.** Le bouton allume, éteint, monte et baisse ; la
  molette règle la luminosité d'une lampe choisie par appui long. Comme elle ne parle qu'à un seul
  canal, c'est Home Assistant qui décide quelle lampe elle commande.
- **Des modes.** Le mode film se déclenche seul quand la TV est allumée la nuit. Le mode nuit baisse
  la lampe à pied très bas pendant trente minutes avant de l'éteindre. Le mode travail éteint
  salon et cuisine en semaine.
- **Le purificateur et l'aération.** Quand l'humidité ou les particules fines montent, une
  automatisation me prévient d'aérer, et un script force le purificateur au niveau 3 pendant une heure.
- **Les alertes du homelab.** Un conteneur ou une machine virtuelle arrêtés, un disque presque plein,
  une consommation anormale, une alerte Grafana, une erreur de la médiathèque : tout arrive sur mon
  téléphone par la même voie que les rappels de la maison.

## Le lab vu depuis Home Assistant

L'intégration Proxmox à elle seule crée plus de 470 entités. Plutôt que de tout afficher, j'ai
composé un tableau « Infra » : l'état des deux serveurs, la charge, la mémoire, le stockage et les
sauvegardes, l'état de chaque conteneur et machine virtuelle, la consommation électrique et le débit
de la connexion.

![Tableau Infra : serveurs, consommation, stockage et sauvegardes, conteneurs et machines virtuelles](/articles/home-assistant/tableau-infra.png)

La consommation vient d'une prise connectée avec mesure d'énergie, placée devant le lab. Sur une
journée, le lab tire en moyenne 67 W, soit environ 590 kWh par an et une centaine d'euros avec mon
tarif moyen. Avoir ce chiffre en continu change la façon de décider : chaque machine ajoutée a un coût
visible. Un bilan mensuel de consommation arrive aussi par notification.

Les tableaux de bord eux-mêmes sont **dans le dépôt**. Je les écris et les modifie avec de petits
scripts Python qui parlent à l'API de Home Assistant, après une sauvegarde du JSON existant. Les
automatisations sont exportées en YAML dans le même dépôt. Un tableau cassé se restaure, et chaque
changement laisse une trace dans Git.

## Ce qui a mal tourné

- **La découverte réseau ne traverse pas les VLAN.** La TV est dans un autre réseau que Home Assistant
  et n'apparaissait pas dans l'intégration Google Cast. La découverte automatique repose sur du
  multicast, qui reste dans son réseau. La solution : renseigner l'adresse de la TV à la main
  dans les options de l'intégration.
- **Deux clés qui se ressemblent.** Avec la seconde clé, l'identifiant USB devenait ambigu pour
  la machine virtuelle. D'où la transmission par port.
- **Le pourcentage de pile est faux.** Mon bouton affichait environ 42 % avec des piles neuves. Mes
  alertes se basent désormais sur la tension (alerte sous 2,2 V), qui est fiable.
- **Après une coupure, un appareil sur piles rejoue ses appuis.** Si le lab perd le courant, le bouton
  perd son lien avec les prises qui servent de relais. Au premier réveil, il envoie d'un coup tous
  les appuis mémorisés : les lampes clignotent. Retirer et remettre une pile règle le problème.
- **Une prise connectée devant tout le lab.** C'est pratique pour mesurer, dangereux pour le reste :
  son interrupteur est désactivé dans Home Assistant, parce qu'un clic malencontreux éteindrait
  l'infrastructure entière. Ne mettez jamais un interrupteur commandable devant des machines qui
  doivent rester allumées.

## Ce qu'il reste à faire

L'isolation des objets connectés dans un réseau dédié est prévue, mais n'est pas encore en place :
c'est la prochaine étape côté sécurité.

La visite 3D du [homelab](https://homelab.gault-rudy.com/?vue=3d#maison) montre ces liaisons radio et
les objets de la maison, dépliables depuis la maison connectée.
