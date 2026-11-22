---
project: homelab
title: "L'infrastructure réseau, en détail"
summary: "L'inspiration derrière l'architecture, le détail des 4 VLANs et de leurs règles inter-zones, et pourquoi la segmentation est allée plus loin qu'un simple découpage de principe."
order: 3
---

## Le point de départ

Je n'ai pas conçu cette architecture dans le vide. Le déclencheur a été la découverte du
[homelab de Stéphane Robert](https://blog.stephane-robert.info/docs/homelab/) et de son
[roadmap](https://blog.stephane-robert.info/docs/homelab/roadmap/) - une structure claire, avec
des choix justifiés plutôt qu'un empilement de services. Ça a servi de socle méthodologique, pas
de copie conforme : firewall bare metal séparé, Proxmox en cluster, segmentation VLAN comme
fondation plutôt qu'un ajout après coup, tout en Infrastructure as Code dès le départ. Chaque
choix a ensuite été adapté à mes contraintes propres - notamment celle de ne jamais dégrader le
réseau familial (voir [pourquoi ce projet](/projets/homelab/pourquoi/)).

## Pourquoi 4 VLANs et pas 2 ou 3

Le résumé du projet mentionne 4 zones (MGMT, LAB, TRUST, IoT). Le détail de la logique derrière
ce découpage précis :

| VLAN | Contient | Peut atteindre |
|---|---|---|
| **MGMT** | Proxmox, OPNsense lui-même | Rien d'autre ne doit l'atteindre depuis un autre VLAN sans règle explicite |
| **LAB** | Services applicatifs, reverse proxy, environnement de dev, Kubernetes, un point d'accès Wi-Fi dédié au lab | Internet (sortant), TRUST pour les appels applicatifs nécessaires (ex. reverse proxy → SSO) |
| **TRUST** | SSO, coffre-fort de secrets, gestionnaire de mots de passe, domotique | Internet limité, jamais initiateur vers MGMT |
| **IoT** | Appareils domotiques | DNS uniquement - aucun accès à Internet, aucun accès au reste du réseau |

La règle qui structure tout : **un VLAN plus sensible ne fait jamais confiance à un VLAN moins
sensible sans raison explicite.** LAB peut appeler TRUST (le reverse proxy doit parler au SSO),
mais TRUST n'a aucune raison d'initier une connexion vers LAB. C'est ce genre de règle qui a été
vérifié concrètement lors du pentest - voir [la sécurité](/projets/homelab/securite/) pour ce qui
a été trouvé en testant cette théorie en conditions réelles.

## Le réseau familial, hors de portée du lab

Le foyer (TV, téléphones, ordinateur de ma conjointe en télétravail) ne vit pas sur ces 4 VLANs -
c'est un réseau séparé, qui ne traverse jamais les règles de pare-feu du lab. C'était une
contrainte de conception dès le premier schéma, pas un ajustement après coup : le risque
d'expérimentation devait rester confiné au lab, jamais impacter un usage professionnel réel sur
le même toit.

## Vue d'ensemble

```
Internet
   │
Box opérateur (double NAT)
   │
Firewall dédié (OPNsense, bare metal)
   │  routage inter-VLAN, DHCP, IDS, CrowdSec, GeoIP, VPN Tailscale
   │
Switch manageable (802.1Q)
   │
   ├── VLAN MGMT   - accès aux hyperviseurs uniquement
   ├── VLAN LAB    - reverse proxy, DNS, dev, Kubernetes, Wi-Fi du lab
   ├── VLAN TRUST  - SSO, coffre-fort de secrets, mots de passe, domotique
   └── VLAN IoT    - isolé, DNS uniquement
        │
        └── 2 nœuds Proxmox (cluster) - 25 VMs et conteneurs LXC
             ├── node-1 : services permanents (SSO, secrets, DNS, monitoring,
             │            streaming, domotique, photos et fichiers, sauvegardes)
             └── node-2 : dev et plateforme (poste de dev, Forgejo et son runner,
                          registry, DNS secondaire, assistant IA, sites publics)
        k3s s'étend sur les deux nœuds : le serveur sur node-1, le worker sur node-2
```

La répartition n'est pas figée. En novembre, le disque NVMe de node-2 montait à 79 °C au repos,
contre 39 °C pour le même modèle sur node-1 : un problème de dissipation, pas d'usure. Le
serveur k3s a été déplacé sur node-1, et la répartition suit maintenant aussi la température.

## Trois chemins d'entrée, pas un seul

Chaque usage a son chemin, du plus fermé au plus ouvert :

| Usage | Chemin | Ports entrants |
|---|---|---|
| Administration | Tailscale (mesh WireGuard, sur le firewall) | Aucun |
| Sites publics (portfolio, site freelance, vitrines des projets) | Cloudflare Tunnel, connexion sortante initiée depuis le lab | Aucun |
| Services familiaux (streaming, demandes de films, SSO, notifications, app Patrimoine) | Port non standard vers Traefik, filtré par CrowdSec, GeoIP et limitation de débit | Un seul |

Le streaming ne peut pas passer par le tunnel (les conditions de Cloudflare interdisent la vidéo
en volume), d'où ce port unique, défendu en profondeur et vérifié par un pentest externe - détail
en [sécurité](/projets/homelab/securite/) et [Jellyfin](/projets/homelab/jellyfin/).

## Un DNS qui ne tombe plus avec un seul conteneur

Le DNS est le service dont tout dépend sans qu'on le voie. Depuis novembre 2026, il y a un
AdGuard Home sur chaque nœud, le DHCP annonce les deux, et le firewall redirige tout le trafic
DNS du réseau vers eux, y compris les appareils qui codent leur DNS en dur (la TV, notamment).
Un nœud peut redémarrer sans que la maison perde Internet. Au passage, environ 40 % des
requêtes sont des trackers ou des publicités bloqués.
