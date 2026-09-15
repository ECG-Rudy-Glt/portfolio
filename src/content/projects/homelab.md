---
title: "Homelab - Infrastructure self-hosted"
category: perso
summary: "Infrastructure personnelle de production : 2 nœuds Proxmox + firewall OPNsense, 4 VLANs, PKI interne, SSO, observabilité complète et stack streaming Jellyfin - tout piloté en Infrastructure as Code."
period: "2026 - en cours"
role: "Conception, achat du matériel, déploiement et exploitation en solo"
stack: ["Proxmox", "OPNsense", "Terraform", "Ansible", "Tailscale", "OpenBao", "Authentik", "Vaultwarden", "Traefik", "Prometheus", "Grafana", "Loki", "Grafana Alloy", "Alertmanager", "Forgejo", "Suricata", "CrowdSec", "Jellyfin", "Home Assistant", "K3s", "Nextcloud"]
tags: ["Infra as Code", "Réseau", "Sécurité", "Observabilité", "CI/CD", "Self-hosting"]
links:
  repo: "https://github.com/ECG-Rudy-Glt/HOMELAB"
images: ["/projets/homelab/pile-mini-pcs.png"]
featured: true
relevance: "majeur"
order: 2
---

Infrastructure self-hosted pensée comme un environnement de production plutôt qu'un empilement de conteneurs : réseau segmenté, gestion centralisée des secrets et des certificats, authentification unifiée et supervision complète - le tout en Infrastructure as Code, avec un budget et une consommation électrique maîtrisés.

## Le matériel

Choix volontaire de mini-PCs plutôt que de serveurs rack traditionnels, pour rester sous 80W en idle. Budget total : environ 735 € pour la phase 1.

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

Consommation visée : 46-73W en idle, jusqu'à 90-120W en charge - environ 50 à 80 €/an d'électricité.

## Architecture réseau

<pre class="mermaid">
flowchart TB
    INTERNET["Internet"]
    OPN["OPNsense<br/>firewall - VLANs 802.1Q - Tailscale VPN"]
    N1["node-1 (Proxmox)<br/>services permanents"]
    N2["node-2 (Proxmox)<br/>dev / CI-CD / K8s"]

    INTERNET --> OPN
    OPN --> N1
    OPN --> N2
</pre>

4 VLANs cloisonnés par niveau de confiance, avec règles de pare-feu explicites entre chaque zone :

| VLAN | Rôle |
|---|---|
| MGMT | Proxmox, OPNsense, infrastructure - inaccessible depuis les autres VLANs |
| LAB | Services applicatifs, reverse proxy, dev, futur Kubernetes |
| TRUST | Services sensibles : SSO, secrets, gestionnaire de mots de passe, domotique |
| IoT | Appareils domotique, isolés du reste du réseau (DNS uniquement) |

Accès distant exclusivement via Tailscale (mesh WireGuard) - aucun port exposé directement sur Internet.

## Identité, secrets & PKI

OpenBao (fork open-source de HashiCorp Vault) joue deux rôles : autorité de certification interne (Root CA 10 ans, Intermediate CA 5 ans, certificats de service renouvelés automatiquement toutes les 30 jours par un Vault Agent) et coffre à secrets KV, consommé par Terraform et Ansible via AppRole - plus aucun secret en clair dans le dépôt Git. Authentik fournit le SSO : OIDC branché sur Grafana et sur l'interface d'administration Proxmox VE (realm dédié, groupe Authentik séparé du SSO PAM par défaut pour ne jamais risquer un lockout), et Vaultwarden sert de gestionnaire de mots de passe personnel, accessible aussi en mobile via la CA interne installée sur le trust store iOS.

## Sécurité réseau : détection, blocage, visibilité

Le firewall OPNsense (mini-PC N150) héberge une couche de sécurité réseau à part entière, en plus du filtrage par VLAN :

- **Suricata** en mode détection (IDS, pas IPS) sur le WAN et les 4 VLANs, rulesets ET Open + abuse.ch - le pattern matcher Hyperscan a été nécessaire pour ramener la charge CPU de ~50 % à moins de 20 % sur ce matériel à 4 cœurs avant de pouvoir surveiller toutes les interfaces simultanément.
- **CrowdSec** : blocage collaboratif d'IP malveillantes, enrôlé sur la blocklist communautaire, règles appliquées directement au niveau du pare-feu.
- **Blocage géographique (GeoIP)** : alias MaxMind GeoLite2 sur le WAN pour les pays à fort volume de scan/attaque.
- **ntopng** : visibilité "qui parle à qui" par VLAN, utile pour repérer un trafic inter-VLAN inattendu.
- Logs Suricata centralisés dans Loki via syslog, pour les corréler avec le reste de l'observabilité plutôt que de les laisser isolés sur le firewall.

## Services en production

**Cœur d'infrastructure**
- **Traefik v3** : reverse proxy HTTPS unique pour tous les services internes, certificats récupérés automatiquement auprès d'OpenBao.
- **AdGuard Home** : DNS interne avec blocage de trackers/publicités.
- **OpenBao** : coffre à secrets + PKI interne (voir [Identité, secrets & PKI](#identité-secrets--pki)).
- **Authentik** : SSO OIDC/SAML.
- **Vaultwarden** : gestionnaire de mots de passe familial.

**Dev, CI/CD & Kubernetes**
- **Forgejo + Actions** : git self-hébergé et CI/CD, avec un runner auto-hébergé dédié (LXC isolé, executor Docker) - c'est ce qui build et déploie ce portfolio, et qui valide Terraform/Ansible à chaque push.
- **vm-dev** : poste de travail à distance (Debian, Docker, kubectl, Terraform, Ansible) pour ne jamais développer directement sur l'infrastructure de prod.
- **k3s + FluxCD** : cluster Kubernetes léger avec GitOps (MetalLB, cert-manager), namespace dédié au streaming média.
- **Harbor** : registry Docker/OCI privé avec scan de vulnérabilités Trivy.

**Observabilité**
- **Prometheus, Grafana, Loki, Grafana Alloy, Alertmanager** : observabilité complète (métriques, logs, conteneurs) avec dashboards dédiés et alertes réelles (SMTP) - certificat qui expire, service down, SMART disque.
- **Zabbix** : provisionné en LXC, non actif en continu (redondant avec Prometheus/Grafana pour l'instant).

**Domotique & usage personnel**
- **Home Assistant** : domotique, seul service autorisé à parler au VLAN IoT isolé.
- **Vikunja** : gestion de tâches personnelle.
- **Nextcloud** : cloud fichiers / calendrier / contacts personnel.
- **Immich** : galerie photo avec reconnaissance faciale locale.
- **Cal.com** : prise de rendez-vous auto-hébergée, pour l'activité freelance à venir.
- **Sandbox client** : LXC isolé dédié aux petites missions freelance (sites clients légers, exécution Ansible ponctuelle) - séparé du reste du lab.

**Backup**
- **Proxmox Backup Server** : datastore dédié sur le NAS phase 1, déduplication et incrémental permanent (voir [le stockage](/projets/homelab/stockage-hdd/) pour le détail).

## Streaming média : Jellyfin sans stockage local

Plutôt que d'investir dans plusieurs To de disques, la chaîne média repose sur un service cloud de debrid : les fichiers restent stockés à distance, Riven orchestre la récupération, et un système de fichiers virtuel (FUSE) les présente à Jellyfin comme s'ils étaient en local - avec transcodage matériel via le GPU Intel intégré du mini-PC. Accessible en interne via une interface web façon Netflix (Jellyfin-Vue) et via les apps natives (Android TV, iOS). Détail complet sur [la page dédiée](/projets/homelab/jellyfin/).

## Cartographie du dépôt

Le dépôt Git de ce lab (Terraform, Ansible, manifestes Kubernetes, documentation) a été passé dans [graphify](https://github.com/safishamsi/graphify) pour en extraire un graphe de connaissances : 701 nœuds, 1204 relations, 64 communautés détectées automatiquement - de quoi visualiser d'un coup d'œil les dépendances entre rôles Ansible, la chaîne Terraform → Ansible → K3s, et des liens moins évidents entre code et documentation (ex. le contournement d'un bug `community.hashi_vault` répété dans plusieurs playbooks).

<iframe src="/graph/homelab-graph.html" title="Graphe de connaissances du homelab" loading="lazy" style="width:100%;height:80vh;border:1px solid var(--border);border-radius:0.75rem;"></iframe>

## Ce qui reste à faire

Un NAS définitif pour remplacer le disque de récupération actuel, un streaming musique lossless auto-hébergé pour remplacer Spotify, une exploration d'automatisation pilotée par un LLM local (n8n + Ollama), et une extension réseau WiFi + caméra de vidéosurveillance 100% locale (conception bouclée, matériel à commander — détail dans [domotique, réseau et vidéosurveillance](/projets/homelab/domotique-reseau/)). Réseau, sécurité (PKI, SSO, IDS), observabilité, CI/CD, Kubernetes, cloud personnel et streaming vidéo sont déjà opérationnels au quotidien. Détail complet en [la suite](/projets/homelab/perspectives/).
