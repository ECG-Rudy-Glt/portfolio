---
project: ops-delivery-suite
title: "CI Hardening"
summary: "Durcissement continu : un pipeline planifié détecte chaque dérive de configuration, la corrige et envoie un rapport."
order: 2
---

## À quoi ça sert

Un durcissement est une photo prise à un instant donné. Ensuite, un admin réactive `PasswordAuthentication yes` pour dépanner, une mise à jour écrase un réglage `sysctl`, un service interdit revient après un redémarrage. CI Hardening transforme la photo en surveillance : à intervalle régulier, il compare l'état réel des serveurs à l'état voulu et corrige les écarts.

## Comment ça marche

| Étape | Contrôles |
|---|---|
| Détection | SSH (config effective), pare-feu, sysctl, services interdits, ports ouverts, comptes (UID 0, comptes sans mot de passe), intégrité de fichiers sensibles |
| Remédiation | SSH, pare-feu, sysctl, services, avec sauvegarde des fichiers modifiés |
| Rapport | Score de conformité, liste des écarts et des corrections, e-mail HTML au-dessus d'un seuil de sévérité |

L'état voulu se décrit dans `group_vars/all.yml` (`desired_permit_root_login: "no"`, `desired_max_auth_tries: 3`…).

## Utilisation

```bash
cd ci-hardening
ansible-galaxy collection install -r requirements-collections.yml
ansible-playbook playbooks/audit.yml        # détecte, ne modifie rien
ansible-playbook playbooks/remediate.yml    # corrige
ansible-playbook playbooks/full-cycle.yml   # détecte, corrige, vérifie, notifie
```

Sans GitLab, `scripts/install-cron.sh` installe une exécution planifiée locale. Avec GitLab, le `.gitlab-ci.yml` fourni s'exécute sur un *schedule* (`RUN_MODE=audit` ou `full-cycle`) et n'a besoin que d'une variable : le mot de passe du vault.

## Ce que j'ai corrigé avant publication

- **Dérive invisible.** La détection lisait le fichier `/etc/ssh/sshd_config`. Or, sur Debian 12, Ubuntu 22.04+ et RHEL 9, un fichier de `sshd_config.d/` (par exemple `50-cloud-init.conf` avec `PasswordAuthentication yes`) l'emporte sur lui. L'outil annonçait « conforme » alors que la connexion par mot de passe était active : précisément la dérive qu'il est censé détecter. Il lit désormais la configuration effective avec `sshd -T`.
- **Remédiation sans filet.** Les corrections SSH étaient écrites sans validation avant de redémarrer sshd : une erreur, et le serveur devenait injoignable. Elles passent maintenant par `sshd_config.d/00-ci-hardening.conf` (prioritaire sur cloud-init), et la configuration complète est validée par `sshd -t` avant tout redémarrage.
- Un test comme `MaxAuthTries 3` acceptait aussi `MaxAuthTries 30`.

Vérifié sur un conteneur Debian 12 simulant le piège cloud-init : détection de l'écart, correction, puis configuration effective revenue à `passwordauthentication no`.

[Voir le code sur GitHub](https://github.com/ECG-Rudy-Glt/ops-delivery-suite/tree/main/ci-hardening)
