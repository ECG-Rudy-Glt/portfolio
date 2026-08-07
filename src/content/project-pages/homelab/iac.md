---
project: homelab
title: "Infrastructure as Code - le détail technique"
summary: "Rien n'est créé sans être codifié. Le détail concret : comment Terraform, Ansible, OpenBao et FluxCD s'articulent, avec du vrai code plutôt qu'une description générale."
order: 5
---

## Le principe

Une règle tenue depuis le début : **rien n'est créé manuellement sans être immédiatement
codifié.** Si une VM est provisionnée à la main un soir pour tester vite, elle est reprise en
Terraform dès que possible - sinon elle n'existe pas vraiment aux yeux du reste de
l'infrastructure.

## Terraform - provisionner

Le provider [`bpg/proxmox`](https://registry.terraform.io/providers/bpg/proxmox) pilote Proxmox
via son API. Chaque VM et conteneur LXC du lab est une ressource versionnée :

```hcl
resource "proxmox_virtual_environment_vm" "vm_pbs" {
  node_name = local.node1
  vm_id     = 116
  name      = "vm-pbs"

  cpu    { cores = 2; sockets = 1 }
  memory { dedicated = 2048 }

  disk {
    datastore_id = "local-lvm"
    size         = 20
    interface    = "scsi0"
  }

  network_device {
    bridge  = "vmbr0"
    vlan_id = local.vlan_lab
  }
}
```

Authentification par token API - pas de mot de passe en clair - et les secrets (identifiants
Proxmox, clés SSH) sont lus depuis le coffre-fort au moment du `terraform apply`, jamais
commités dans un `.tfvars`.

## Ansible - configurer

Une fois une machine provisionnée, Ansible prend le relais : paquets, utilisateurs,
durcissement, déploiement applicatif. Chaque service a son rôle
(`Ansible/roles/<service>/`) et son playbook de déploiement.

Les secrets applicatifs ne sont **jamais en dur dans un playbook** - récupérés à l'exécution
depuis OpenBao :

```yaml
vaultwarden_admin_token: "{{ lookup('community.hashi_vault.vault_kv2_get', 'homelab/vaultwarden').secret.admin_token }}"
```

## OpenBao - le coffre-fort central

Détaillé dans l'article dédié [Construire une PKI interne](/blog/homelab-pki-secrets/). En
résumé pour cette page : secrets applicatifs en KV versionné, PKI interne à deux niveaux (Root CA
+ Intermediate CA) avec renouvellement automatique des certificats TLS via un agent dédié sur le
reverse proxy.

## FluxCD - GitOps sur Kubernetes

Pour tout ce qui tourne sur k3s, pas de `kubectl apply` manuel :

1. Un manifeste est modifié dans le dépôt
2. `git push` vers la forge Git self-hébergée
3. FluxCD détecte le changement et l'applique automatiquement au cluster
4. L'état est vérifiable directement : `flux get kustomizations`

Le dépôt Git devient la seule source de vérité de l'état désiré du cluster - pas de dérive
silencieuse entre "ce qui est documenté" et "ce qui tourne réellement".

## Forgejo - le dépôt central

Toute cette chaîne (Terraform, Ansible, manifestes Kubernetes) vit dans un dépôt Git self-hébergé
sur Forgejo, avec sa propre CI/CD qui valide chaque changement (lint Terraform, lint Ansible)
avant qu'il ne soit appliqué.

## Ce portfolio lui-même : Cloudflare Tunnel + CI/CD Forgejo Actions

Ce site tourne sur le même lab, avec un modèle d'exposition différent de celui de
[Jellyfin](/projets/homelab/jellyfin/). Jellyfin sort en direct (port-forward + GeoIP + CrowdSec)
parce que le cast Chromecast a besoin d'accès direct au flux. Le portfolio n'a aucune contrainte
de ce genre - pages statiques, pas de flux lourd - donc le modèle le plus restrictif possible a
été retenu : **Cloudflare Tunnel**. Le conteneur qui héberge le site n'ouvre **aucun port entrant**
sur le réseau domestique - il initie lui-même une connexion sortante vers Cloudflare, qui relaie
le trafic public jusqu'à lui. Zéro port à défendre côté maison, contrairement au chemin Jellyfin.

Le déploiement suit le même principe GitOps que le reste du lab : chaque `git push` sur ce dépôt
déclenche une pipeline **Forgejo Actions**, exécutée sur le runner auto-hébergé déjà mentionné
plus haut (LXC isolé, executor Docker) - build du site, puis déploiement, sans intervention
manuelle. Le portfolio que tu es en train de lire s'est littéralement construit et publié tout
seul au dernier commit.

## Pourquoi cette discipline compte

Sur un projet solo, la tentation du "je le fais vite à la main, je codifierai plus tard" est
permanente - et "plus tard" n'arrive jamais si on ne s'y engage pas dès le départ. Cette
discipline a payé concrètement : lors d'incidents sérieux (voir
[les incidents](/projets/homelab/incidents/)), la question n'a jamais été "est-ce que j'ai les
commandes pour tout reconstruire" - c'était déjà écrit.
