---
project: homelab
title: "Les services - l'ordre de déploiement, et pourquoi"
summary: "La page projet liste les services actifs. Ici, l'ordre dans lequel ils ont été déployés - parce que cet ordre est lui-même une décision d'architecture, pas un hasard."
order: 4
---

La liste des services actifs est sur la [page projet](/projets/homelab/#services-en-production).
Cette page explique l'ordre de déploiement, parce qu'aucun de ces services n'aurait pu être
posé avant celui qui le précède.

## Couche 0 - Réseau, avant tout le reste

OPNsense, AdGuard Home (DNS interne), Tailscale. Rien ne peut être déployé avant cette couche -
c'est elle qui donne au reste du réseau sa structure et son isolement (détail en
[infrastructure](/projets/homelab/infrastructure/)).

## Couche 1 - L'hyperviseur

Le cluster Proxmox, socle de tout provisionnement ultérieur - voir
[l'Infrastructure as Code](/projets/homelab/iac/) pour la partie Terraform.

## Couche 2 - Services core, dans cet ordre précis

1. **Traefik** (reverse proxy) - point d'entrée unique pour tous les services web internes
2. **OpenBao** (coffre-fort + PKI interne) - pour arrêter de stocker des secrets en clair et
   émettre les certificats TLS internes ; détail complet dans l'article dédié
   [Construire une PKI interne](/blog/homelab-pki-secrets/)
3. **Authentik** (SSO) - authentification centralisée
4. **Vaultwarden** - gestionnaire de mots de passe familial
5. **Forgejo** - hébergement Git auto-hébergé, source de vérité de tout le code IaC, avec CI/CD
6. **Home Assistant** - hub domotique, seul service autorisé à parler au VLAN IoT (détail de
   l'extension réseau/caméra en cours dans [domotique, réseau et vidéosurveillance](/projets/homelab/domotique-reseau/))
7. **Vikunja** - gestion de tâches personnelle

Chaque service de cette liste dépend d'au moins un des précédents : Authentik a besoin
d'OpenBao pour ses secrets, Vaultwarden est exposé via Traefik, etc.

## Couche 3 - Environnement de développement

**vm-dev** : une VM qui sert de poste de travail distant. Mon ordinateur personnel n'exécute rien
lui-même - il se connecte en SSH/Remote Dev à cette VM qui a Docker, Terraform, Ansible et le
client du coffre-fort installés. Le laptop reste un simple terminal ; toute la charge de calcul
et tout l'état vivent sur le lab.

## Couche 4 - Kubernetes & CI/CD

k3s, FluxCD (GitOps), MetalLB, cert-manager, et le runner Forgejo Actions qui exécute les
pipelines CI/CD - chaque job dans un conteneur jetable.

## Couche 5 - Observabilité

Sans cette couche, une panne se découvre parce qu'un utilisateur se plaint - pas acceptable pour
une infra qui doit rester fiable au quotidien pour ma famille. Prometheus, Grafana, Loki,
Alertmanager avec de vraies alertes configurées (certificat qui expire, service down, SMART
disque).

## Couche 6 - Cloud personnel *(à venir)*

Nextcloud et Immich - voir [la suite](/projets/homelab/perspectives/).

## Couche 7 - Media

Jellyfin, avec une architecture suffisamment particulière pour mériter sa propre page - voir
[Jellyfin sans stockage local](/projets/homelab/jellyfin/).

## Ce que cet ordre montre

Chaque couche dépend de la précédente. Ce n'est pas arbitraire : c'est la conséquence directe
d'avoir voulu une infrastructure cohérente plutôt qu'un empilement de services indépendants.
