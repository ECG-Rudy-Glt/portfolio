---
project: ops-delivery-suite
title: "GitLab Runner Provisioner"
summary: "Installer et enregistrer un runner GitLab sur un VPS à partir d'une IP et d'un token, en Bash ou PowerShell."
order: 11
---

## À quoi ça sert

Les runners partagés de GitLab sont limités et lents pour certains jobs. Avoir son propre runner sur un VPS demande d'installer Docker, GitLab Runner, de l'enregistrer et de le configurer : ce script le fait en une commande.

## Ce que fait le playbook

- Installe Docker et GitLab Runner (Debian, Ubuntu, RHEL)
- Enregistre le runner (exécuteur Docker ou shell), une seule fois même si on relance
- Limite la taille des logs Docker et planifie un nettoyage hebdomadaire des images, pour ne pas saturer le disque
- Règle le nombre de jobs simultanés et un `umask` restrictif

## Utilisation

```bash
cd gitlab-runner-provisioner
# Token : GitLab > Settings > CI/CD > Runners > New project runner (commence par glrt-)
./provision.sh 203.0.113.10 glrt-xxxx -u ubuntu -k ~/.ssh/id_ed25519 -c 4
./provision.sh 203.0.113.10 glrt-xxxx --executor shell --tags shell,build
```

Sous Windows : `.\provision.ps1 -IP "203.0.113.10" -Token "glrt-xxxx" -User "ubuntu"`.

## Ce que j'ai corrigé avant publication

- **Token en clair.** Un script de déploiement contenait un vrai token de runner et l'IP d'un serveur ; supprimé.
- **Doublons.** Le test « runner déjà enregistré ? » lisait la sortie standard de `gitlab-runner list`, qui écrit en réalité sur la sortie d'erreur. Chaque relance enregistrait un runner de plus.
- **Mode privileged par défaut.** Un job en mode Docker `privileged` peut prendre le contrôle de l'hôte. Il est désactivé par défaut, à n'activer que pour du Docker-in-Docker.
- Le token d'enregistrement n'apparaît plus dans les logs Ansible.

[Voir le code sur GitHub](https://github.com/ECG-Rudy-Glt/ops-delivery-suite/tree/main/gitlab-runner-provisioner)
