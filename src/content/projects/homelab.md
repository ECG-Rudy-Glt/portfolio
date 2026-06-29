---
title: "Homelab - Infrastructure self-hosted"
category: perso
summary: "Infrastructure personnelle de production : 2 nœuds Proxmox + firewall OPNsense, 4 VLANs, PKI interne, SSO, observabilité complète et stack streaming Jellyfin - tout piloté en Infrastructure as Code."
period: "2026 - en cours"
role: "Conception, achat du matériel, déploiement et exploitation en solo"
stack: ["Proxmox", "OPNsense", "Terraform", "Ansible", "Tailscale", "OpenBao", "Authentik", "Vaultwarden", "Traefik", "Prometheus", "Grafana", "Loki", "Grafana Alloy", "Forgejo", "Jellyfin", "Home Assistant", "K3s", "Nextcloud"]
tags: ["Infra as Code", "Réseau", "Sécurité", "Observabilité", "CI/CD", "Self-hosting"]
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
| NAS phase 1 | HDD 2 To (ex-iMac, USB) | ~0 € | Stockage temporaire en attendant le NAS définitif |

Consommation visée : 46-73W en idle, jusqu'à 90-120W en charge - environ 50 à 80 €/an d'électricité.

## Architecture réseau

```
Internet ─► OPNsense (firewall, VLANs 802.1Q, Tailscale VPN)
                │
       ┌────────┴────────┐
  node-1 (Proxmox)   node-2 (Proxmox)
  services permanents   dev / CI/CD / K8s
```

4 VLANs cloisonnés par niveau de confiance, avec règles de pare-feu explicites entre chaque zone :

| VLAN | Rôle |
|---|---|
| MGMT | Proxmox, OPNsense, infrastructure - inaccessible depuis les autres VLANs |
| LAB | Services applicatifs, reverse proxy, dev, futur Kubernetes |
| TRUST | Services sensibles : SSO, secrets, gestionnaire de mots de passe, domotique |
| IoT | Appareils domotique, isolés du reste du réseau (DNS uniquement) |

Accès distant exclusivement via Tailscale (mesh WireGuard) - aucun port exposé directement sur Internet.

## Identité, secrets & PKI

OpenBao (fork open-source de HashiCorp Vault) joue deux rôles : autorité de certification interne (Root CA 10 ans, Intermediate CA 5 ans, certificats de service renouvelés automatiquement toutes les 30 jours par un Vault Agent) et coffre à secrets KV, consommé par Terraform et Ansible via AppRole - plus aucun secret en clair dans le dépôt Git. Authentik fournit le SSO (OIDC/SAML) devant les interfaces d'administration, et Vaultwarden sert de gestionnaire de mots de passe personnel.

## Services en production

- **Traefik v3** : reverse proxy HTTPS unique pour tous les services internes, certificats récupérés automatiquement auprès d'OpenBao.
- **AdGuard Home** : DNS interne avec blocage de trackers/publicités.
- **Forgejo + Actions** : git self-hébergé et CI/CD - c'est ce qui build et déploie ce portfolio.
- **Prometheus, Grafana, Loki, Grafana Alloy** : observabilité complète (métriques, logs, conteneurs) avec dashboards dédiés - vue d'ensemble des hôtes, santé des services avec alerte sur expiration des certificats TLS, et consommation par conteneur.
- **Home Assistant** : domotique, seul service autorisé à parler au VLAN IoT isolé.
- **vm-dev** : poste de travail à distance (Debian, Docker, kubectl, Terraform, Ansible) pour ne jamais développer directement sur l'infrastructure de prod.

## Streaming média : Jellyfin sans stockage local

Plutôt que d'investir dans plusieurs To de disques, la chaîne média repose sur du debrid : un abonnement Real-Debrid stocke les fichiers dans le cloud, `rclone` les monte localement, Riven génère les liens symboliques correspondants, et Jellyfin les lit comme s'ils étaient en local - avec transcodage matériel via le GPU Intel intégré du mini-PC. Accessible en interne via une interface web façon Netflix (Jellyfin-Vue) et via les apps natives (Android TV, iOS).

## Ce qui reste à faire

Cluster Kubernetes (K3s) pour la suite de la stack applicative, Nextcloud pour le stockage de fichiers personnel, NAS définitif pour les sauvegardes, IDS pour la détection d'intrusion, et une vitrine publique détaillant l'architecture en temps réel. Réseau, sécurité, PKI, observabilité, CI/CD et streaming sont déjà opérationnels au quotidien.
