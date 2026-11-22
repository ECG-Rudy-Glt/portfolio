---
project: ops-delivery-suite
title: "Server Migration Kit"
summary: "Migrer un serveur vers un autre avec Ansible : audit, fichiers, bases, conteneurs Docker, vérification par checksums."
order: 6
---

## À quoi ça sert

Changer d'hébergeur ou de machine sans rien oublier : un dossier de configuration, une base, une tâche cron, un volume Docker. Le kit décompose la migration en étapes rejouables, chacune avec son rapport.

## Les étapes

| Playbook | Rôle |
|---|---|
| 00_preflight_checks | Connectivité, espace disque, outils nécessaires sur les deux serveurs |
| 01_audit_source | Inventaire de la source (OS, services, utilisateurs, cron, bases) |
| 02_sync_files | Copie des dossiers choisis par rsync |
| 03_sync_db | Dump des bases, transfert, import sur la destination |
| 04_full_migration | Tout enchaîné, avec checksums et audit de sécurité avant et après |
| 05_docker_migration | Sauvegarde Restic, export des volumes et des fichiers Compose, redémarrage sur la destination |

## Utilisation

```bash
cd server-migration-kit
ansible-galaxy collection install -r requirements.yml
cp inventory/examples/migration.ini.example inventory/migration.ini
# [source], [destination], dossiers à migrer, types de bases ; mots de passe dans un vault

ansible-playbook -i inventory/migration.ini playbooks/00_preflight_checks.yml
ansible-playbook -i inventory/migration.ini playbooks/01_audit_source.yml
ansible-playbook -i inventory/migration.ini playbooks/04_full_migration.yml --ask-vault-pass
```

En mode `selective` (par défaut), seuls `folders_to_migrate` sont copiés ; en mode `full`, une liste plus large, dont les configurations nginx, Let's Encrypt, cron et systemd. Les audits avant et après utilisent [Infra Flash Audit](/projets/ops-delivery-suite/infra-flash-audit/).

## Ce que j'ai corrigé avant publication

- Les tâches locales utilisaient `local_action` sous une forme qui sera retirée d'Ansible : elles passent par `delegate_to: localhost`.
- Le chemin vers l'outil d'audit pointait sur l'ancien dépôt séparé ; il suit maintenant la structure du dépôt unique.
- README écrit : le dépôt d'origine n'en avait pas.

Cet outil est celui que j'ai le moins éprouvé en conditions réelles : testez-le d'abord entre deux machines jetables.

[Voir le code sur GitHub](https://github.com/ECG-Rudy-Glt/ops-delivery-suite/tree/main/server-migration-kit)
