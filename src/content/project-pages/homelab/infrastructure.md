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
| **LAB** | Services applicatifs, reverse proxy, environnement de dev, futur Kubernetes | Internet (sortant), TRUST pour les appels applicatifs nécessaires (ex. reverse proxy → SSO) |
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
Firewall dédié (OPNsense, bare metal)
   │  routage inter-VLAN, DHCP, DNS, VPN Tailscale, IDS/IPS
   │
Switch manageable (802.1Q)
   │
   ├── VLAN MGMT   - accès aux hyperviseurs uniquement
   ├── VLAN LAB    - reverse proxy, DNS interne, dev, la majorité des services
   ├── VLAN TRUST  - SSO, coffre-fort de secrets, gestionnaire de mots de passe
   └── VLAN IoT    - isolé, DNS uniquement
        │
        └── 2 nœuds Proxmox (cluster) - VMs et conteneurs LXC
             ├── node-1 : services permanents
             └── node-2 : dev, CI/CD, Kubernetes
```

## L'accès distant sans ouvrir de port

Tailscale (mesh VPN, exécuté directement sur le firewall) permet d'atteindre le lab depuis
n'importe où sans exposer le moindre port entrant sur le WAN. La seule exception volontaire est le
service de streaming, exposé publiquement avec ses propres couches de protection dédiées - détail
complet en [sécurité](/projets/homelab/securite/) et [Jellyfin](/projets/homelab/jellyfin/).
