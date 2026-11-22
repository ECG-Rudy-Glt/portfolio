---
title: "Homelab - Infrastructure self-hosted"
category: perso
summary: "Infrastructure personnelle de production : 2 nœuds Proxmox et un firewall OPNsense, 4 VLANs, PKI interne, SSO, observabilité complète, 25 invités dont 22 en Terraform, des applications en GitOps sur k3s et un assistant IA encadré - tout piloté en Infrastructure as Code."
period: "2026 - en cours"
role: "Conception, achat du matériel, déploiement et exploitation en solo"
stack: ["Proxmox", "OPNsense", "Terraform", "Ansible", "Tailscale", "OpenBao", "Authentik", "Vaultwarden", "Traefik", "AdGuard Home", "Prometheus", "Grafana", "Loki", "Grafana Alloy", "Alertmanager", "Forgejo", "Harbor", "Suricata", "CrowdSec", "Jellyfin", "Home Assistant", "Immich", "Nextcloud", "K3s", "FluxCD", "Cloudflare Tunnel", "Proxmox Backup Server"]
tags: ["Infra as Code", "Réseau", "Sécurité", "Observabilité", "CI/CD", "Self-hosting", "Claude Code"]
links:
  demo: "https://homelab.gault-rudy.com/"
  repo: "https://github.com/ECG-Rudy-Glt/HOMELAB"
images: ["/projets/homelab/visite-3d-machine.webp", "/projets/homelab/visite-3d-flux.webp", "/projets/homelab/visite-3d-cluster.webp", "/projets/homelab/pile-mini-pcs.png"]
featured: true
relevance: "majeur"
order: 2
---

Infrastructure self-hosted pensée comme un environnement de production plutôt qu'un empilement de conteneurs : réseau segmenté, gestion centralisée des secrets et des certificats, authentification unifiée et supervision complète - le tout en Infrastructure as Code, avec un budget et une consommation électrique maîtrisés.

## Visite interactive en 3D

La baie en 3D : cliquez une machine pour voir les conteneurs et les machines virtuelles qu'elle héberge, lancez une visite guidée, suivez le chemin d'une requête et ouvrez les projets hébergés. Sur mobile, le même contenu s'ouvre en liste. Les données sont assainies : aucune adresse, aucun port, aucun identifiant.

<iframe src="https://homelab.gault-rudy.com/?embed=1" title="Visite interactive du homelab en 3D" loading="lazy" allow="fullscreen" style="width:100%;height:min(78vh,720px);min-height:520px;border:1px solid var(--border);border-radius:0.75rem;background:var(--bg-elevated);"></iframe>

<p><a href="https://homelab.gault-rudy.com/">Ouvrir la visite en plein écran →</a></p>

## Le matériel

Choix volontaire de mini-PCs plutôt que de serveurs rack traditionnels, pour une consommation maîtrisée. Budget total : environ 735 € pour la phase 1.

| Composant | Modèle | Prix | Specs |
|---|---|---|---|
| Firewall | Mini-PC N150 (bare metal OPNsense) | ~170 € | Intel N150 4c/3,6 GHz, 12 Go DDR4, 512 Go SSD, 2 NIC, 6-10W idle |
| Compute ×2 | HP EliteDesk 800 G6 Mini ×2 | ~370 € | Intel Core i5-10500 6c/12t, 32 Go DDR4 chacun, SSD NVMe 512 Go, 10-20W idle |
| RAM upgrade | 32 Go DDR4 ×2 nœuds | ~100 € | 64 Go au total sur le cluster |
| Switch | TP-Link TL-SG108E | ~40 € | 8 ports Gigabit manageable, 802.1Q |
| Câblage | Patch panel 1U Cat6 + câbles | ~35 € | |
| Adaptateur réseau | USB 3.0 → 2.5G (RTL8156B) | ~20 € | Pour le NAS phase 1 |
| NAS phase 1 | HDD 1 To (ex-iMac, USB) | ~0 € | Stockage temporaire en attendant le NAS définitif |
| **Total** | | **~735 €** | |

Consommation **mesurée** depuis novembre 2026 par une prise connectée suivie dans Home Assistant : environ 70 W en moyenne (50 W au repos, 150 W au démarrage), soit à peu près 610 kWh et 120 € d'électricité par an.

## En chiffres (novembre 2026)

| | |
|---|---|
| Nœuds Proxmox | 2, plus un firewall bare metal |
| Invités (VM et conteneurs LXC) | 25, dont 22 décrits en Terraform |
| Routes HTTPS derrière le reverse proxy | 41 |
| Applications sur Kubernetes (k3s) | 4 namespaces applicatifs, gérés en GitOps |
| Rôles Ansible | 26 |

Ces chiffres ne sont pas recopiés à la main : un script lit en lecture seule Proxmox, Terraform, Traefik, k3s et Ansible, et **génère l'inventaire** du lab. C'est devenu la source de vérité, avec une fiche par invité qui liste ses pièges connus (voir [l'outillage IA](/projets/homelab/outillage-ia/)).

## Architecture

<pre class="mermaid">
flowchart TB
    INTERNET["Internet"]
    CF["Cloudflare Tunnel<br/>sites publics, aucun port entrant"]
    OPN["OPNsense (bare metal)<br/>VLANs 802.1Q · Suricata · CrowdSec · GeoIP · Tailscale"]
    TRAEFIK["Traefik + CrowdSec<br/>reverse proxy HTTPS unique"]
    N1["node-1 · services permanents<br/>SSO · secrets et PKI · DNS · monitoring<br/>Jellyfin · Home Assistant · photos et fichiers · sauvegardes"]
    N2["node-2 · dev et plateforme<br/>poste de dev · Forgejo + runner · registry<br/>DNS secondaire · assistant IA · sites publics"]
    K3S["k3s sur les deux nœuds · FluxCD<br/>Patrimoine · COACH · CRM · média"]

    INTERNET --> OPN
    INTERNET -.-> CF
    CF -.-> N2
    OPN -->|"port filtré, services familiaux"| TRAEFIK
    TRAEFIK --> N1
    TRAEFIK --> N2
    TRAEFIK --> K3S
    N1 --- K3S
    N2 --- K3S
</pre>

Le schéma interactif complet, avec six parcours de requête (accès admin, site public, streaming, demande de film, alerte, déploiement), est sur [la carte des flux](https://homelab.gault-rudy.com/flux/) du site du homelab.

4 VLANs cloisonnés par niveau de confiance, avec règles de pare-feu explicites entre chaque zone :

| VLAN | Rôle |
|---|---|
| MGMT | Proxmox, OPNsense, infrastructure - inaccessible depuis les autres VLANs |
| LAB | Services applicatifs, reverse proxy, dev, Kubernetes, point d'accès Wi-Fi du lab |
| TRUST | Services sensibles : SSO, secrets, gestionnaire de mots de passe, domotique |
| IoT | Appareils domotique, isolés du reste du réseau (DNS uniquement) |

**Trois chemins d'entrée, choisis selon l'usage** (décision documentée dans un ADR) :

- **Administration** : jamais exposée, uniquement par Tailscale (mesh WireGuard qui tourne sur le firewall).
- **Sites publics** (ce portfolio, mon site freelance, les vitrines de mes projets) : Cloudflare Tunnel. Le conteneur ouvre lui-même une connexion sortante, aucun port entrant n'est ouvert pour eux.
- **Services familiaux** (streaming, demandes de films, SSO, notifications, l'app Patrimoine) : un port non standard vers Traefik, filtré par CrowdSec, GeoIP et limitation de débit. Le streaming ne peut pas passer par le tunnel : les conditions de Cloudflare l'interdisent.

Le DNS interne est **redondant** depuis novembre : un AdGuard Home sur chaque nœud, annoncés tous les deux par le DHCP, et tout le trafic DNS du réseau redirigé vers eux, y compris les appareils qui codent leur DNS en dur.

## Identité, secrets & PKI

OpenBao (fork open-source de HashiCorp Vault) joue deux rôles : autorité de certification interne (Root CA 10 ans, Intermediate CA 5 ans, certificats de service de 30 jours renouvelés automatiquement) et coffre à secrets KV, consommé par Terraform et Ansible via AppRole - aucun secret en clair dans le dépôt Git. Depuis novembre, même l'interface d'administration de Proxmox présente un certificat signé par OpenBao, renouvelé chaque jour par un AppRole qui ne peut qu'émettre. Authentik fournit le SSO : OIDC branché sur Grafana et sur Proxmox VE (realm dédié, sans risque de lockout), et sert d'authentification devant l'app Patrimoine exposée. Vaultwarden sert de gestionnaire de mots de passe familial. Détail complet dans l'article [Construire une PKI interne](/blog/homelab-pki-secrets/).

## Sécurité réseau : détection, blocage, visibilité

Le firewall OPNsense (mini-PC N150) héberge une couche de sécurité réseau à part entière, en plus du filtrage par VLAN :

- **Suricata** en mode détection (IDS) sur le WAN et les 4 VLANs, rulesets ET Open + abuse.ch - le pattern matcher Hyperscan a été nécessaire pour ramener la charge CPU de ~50 % à moins de 20 % sur ce matériel à 4 cœurs.
- **CrowdSec** : blocage collaboratif d'IP malveillantes, au niveau du pare-feu et en bouncer devant Traefik pour les services exposés.
- **Blocage géographique (GeoIP)** : alias MaxMind GeoLite2 sur le WAN.
- **ntopng** : visibilité « qui parle à qui » par VLAN.
- Logs Suricata centralisés dans Loki, pour les corréler avec le reste de l'observabilité.

## Services en production

**Cœur d'infrastructure**
- **Traefik v3** : reverse proxy HTTPS unique (41 routes), certificats émis par OpenBao, CrowdSec en bouncer.
- **AdGuard Home ×2** : DNS interne redondant, avec blocage des trackers et publicités (environ 40 % des requêtes bloquées sur 24 h).
- **OpenBao**, **Authentik**, **Vaultwarden** : secrets et PKI, SSO, mots de passe.

**Dev, CI/CD & plateforme**
- **Forgejo + Actions** : git self-hébergé et CI/CD, avec un runner dédié (LXC isolé, executor Docker). C'est ce qui build et déploie ce portfolio, les sites des projets et les applications, et qui valide Terraform et Ansible à chaque push.
- **vm-dev** : poste de travail à distance, pour ne jamais développer directement sur l'infrastructure de prod.
- **Harbor** : registry OCI privé avec scan de vulnérabilités Trivy.
- **k3s + FluxCD** (MetalLB, cert-manager) : chaque application a son dépôt, et Flux le suit. Aujourd'hui : [Patrimoine](/projets/patrimoine/) (gestion du budget et du patrimoine du foyer, en microservices, avec ses notifications ntfy), [COACH](/projets/coach/) (coaching sportif), un CRM pour mon activité freelance, et la partie demandes et indexation de la chaîne média.
- **Sites publics** : ce portfolio, mon site freelance et les vitrines de [Relai](/projets/relai/), COACH, Patrimoine et du homelab, déployés automatiquement par la CI.

**Observabilité**
- **Prometheus, Grafana, Loki + Alloy, Blackbox, Alertmanager** : métriques, logs et sondes, avec de vraies alertes (certificat qui expire, service down, santé SMART, température des NVMe, remplissage des pools de stockage).
- Les alertes partent par **e-mail**, vers **Home Assistant** (notification sur le téléphone) et sont **expliquées sur Telegram** par l'assistant du lab (ci-dessous).

**Assistant IA du lab : Hermes**
- Un bot Telegram qui répond à la famille et à moi : état de la maison, demandes de films avec quotas, commandes domotiques en liste blanche, explication de chaque nouvelle alerte, veille technique hebdomadaire (versions et failles connues des outils du lab).
- Modèle : Claude Haiku, derrière un garde-budget local plafonné à 1 $ par mois. Le bot n'a **aucun accès direct** à Home Assistant ni au reste du lab : il passe par un service de politique séparé, qui détient les jetons, applique les rôles et demande une confirmation hors bande pour les actions sensibles. Détail en [outillage IA](/projets/homelab/outillage-ia/).

**Maison & usage personnel**
- **Home Assistant** : Zigbee, Matter sur Thread, énergie (la consommation du lab est suivie en continu), seul service autorisé à parler au VLAN IoT. Détail dans l'article [Home Assistant dans mon homelab](/blog/home-assistant/).
- **Immich** (photos) et **Nextcloud** (fichiers) : en service, avec des alertes sur le remplissage du stockage.
- **Vikunja** (tâches), **Cal.com** (prise de rendez-vous de mon activité freelance), **Shelfmark** (livres envoyés directement sur liseuse), un portail d'accueil et quelques outils (PDF, utilitaires).

**Sauvegardes**
- **Proxmox Backup Server** : datastore dédié sur un disque séparé, déduplication et incrémental (voir [le stockage](/projets/homelab/stockage-hdd/)).
- **Copie hors site chiffrée** (rclone crypt) des services sensibles vers un stockage objet S3.
- **Restauration testée** de bout en bout, et un contrôle automatique après chaque redémarrage de nœud.

## Streaming média : Jellyfin sans stockage local

La chaîne média repose sur un service cloud de débridage : aucun fichier vidéo n'est stocké en local. Radarr et Sonarr gèrent la bibliothèque sous forme de liens vers un montage WebDAV (rclone), Jellyfin les lit avec transcodage matériel sur le GPU Intel intégré, et les demandes passent par Jellyseerr (côté Kubernetes, avec l'indexation derrière un VPN). Une série de garde-fous systemd surveille le montage et coupe Jellyfin s'il disparaît, pour ne jamais vider la bibliothèque. Détail complet sur [la page dédiée](/projets/homelab/jellyfin/).

## Limites connues

Une infrastructure sérieuse se juge aussi à ce qu'on sait d'elle. Ce qui n'est pas encore au niveau, et pourquoi :

| Limite | Risque | Suite prévue |
|---|---|---|
| Firewall unique, cartes réseau Realtek | Point de défaillance unique ; trois pannes sous charge entre août et septembre (voir [les vraies pannes](/projets/homelab/incidents/)) | Carte réseau Intel |
| Cluster Proxmox à 2 nœuds sans quorum tiers | Pas de bascule automatique | QDevice externe |
| k3s à un seul serveur | Plan de contrôle non redondant | Acceptable pour un lab |
| Descellement manuel du coffre à secrets | Services dépendants bloqués après un redémarrage | Ordre de démarrage déjà posé, auto-unseal à étudier |
| Toutes les alertes dépendent du WAN | E-mail, Home Assistant et Telegram tombent avec Internet | Canal réellement hors bande |
| Dissipation thermique des mini-PC | Les NVMe montent à 80 °C sous charge (photos, gros scans) | Plafonds de lecture posés, ventilation à revoir |
| Appareils Wi-Fi sur le VLAN du lab | Le point d'accès ne permet pas le multi-SSID prévu (firmware non remplaçable) | Règles par appareil en attendant un point d'accès compatible |
| Sauvegardes sur un disque USB | Le disque doit être monté avant le serveur de sauvegarde | NAS définitif |

**Résolu récemment** : le state Terraform est passé sur un backend S3 verrouillé, partagé entre les postes (novembre 2026, voir [l'IaC](/projets/homelab/iac/)).

## Ce qui reste à faire

Un NAS définitif pour remplacer le disque de récupération actuel, la carte réseau Intel du firewall, un QDevice pour le quorum, la montée vers Proxmox Backup Server 4 puis Debian 13 invité par invité, et le volet interne du pentest. Le streaming musique auto-hébergé a été commencé puis abandonné début novembre : sa VM chargeait un NVMe qui montait déjà à 80 °C, pour un gain qui ne justifiait pas cette charge. Détail en [la suite](/projets/homelab/perspectives/).
