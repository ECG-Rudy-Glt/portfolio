---
project: ops-delivery-suite
title: "VPS Shield"
summary: "Durcir un serveur Linux neuf en une commande Ansible : compte admin à clé SSH, SSH, pare-feu, fail2ban, noyau, PAM, auditd, AIDE."
order: 1
---

## À quoi ça sert

Un VPS fraîchement livré accepte souvent la connexion root par mot de passe, n'a pas de pare-feu et reçoit des milliers de tentatives SSH par jour. VPS Shield applique en quelques minutes un socle de durcissement inspiré du guide ANSSI-BP-028 et des CIS Benchmarks, toujours le même d'un serveur à l'autre.

Testé sur Debian 12, Ubuntu 22.04 et 24.04, Rocky Linux 9 (un `Vagrantfile` est fourni pour tester sans risque).

## Ce que fait le playbook

| Rôle | Effet |
|---|---|
| ssh_keygen | Génère une paire de clés ED25519 pour le compte admin |
| common | Mises à jour, paquets de base, mises à jour de sécurité automatiques |
| user | Compte admin avec sudo et clé SSH, mot de passe verrouillé |
| ssh | Pas de root, pas de mot de passe, algorithmes modernes, config validée par `sshd -t` |
| firewall | UFW ou FirewallD : tout refusé en entrée sauf les ports listés |
| fail2ban | Bannit les IP après des échecs SSH répétés |
| sysctl_hardening | Anti-spoofing, redirections ICMP, ASLR, `kptr_restrict`… |
| pam_hardening | Politique de mots de passe, verrouillage après échecs |
| security_modules | AppArmor ou SELinux en mode enforcing |
| auditd, aide | Journalisation des événements sensibles, contrôle d'intégrité |
| filesystem_hardening | Options de montage de `/tmp`, systèmes de fichiers inutiles désactivés |
| legal_banner | Bannière de connexion |

Chaque rôle s'active ou se désactive avec `enable_<rôle>` dans `group_vars/all.yml`.

## Utilisation

```bash
cd vps-shield
./setup.sh                                   # Ansible et collections
cp inventory.ini.example inventory.ini       # IP du serveur
ansible-playbook playbook.yml --check --diff # simulation
ansible-playbook playbook.yml
```

Puis, dans un **second terminal**, avant de fermer la session en cours :

```bash
ssh -i keys/id_ed25519_admin admin@203.0.113.10
```

Pour un seul volet : `ansible-playbook playbook.yml --tags ssh,firewall`. Pour un serveur Docker, ajoutez-le au groupe `[docker_hosts]`, qui ouvre 80/443 et garde l'IP forwarding nécessaire.

## Ce que j'ai corrigé avant publication

- **Mot de passe par défaut.** Le compte admin, qui a sudo, recevait le mot de passe `TestVagrant123!`, écrit dans `group_vars`. Il est désormais verrouillé : connexion par clé uniquement.
- **Perte d'accès.** Rien n'empêchait de couper l'authentification par mot de passe alors que le compte admin n'avait aucune clé. Le rôle `ssh` vérifie maintenant `authorized_keys` et s'arrête avec un message clair s'il est vide.
- **Variable manquante.** Le rôle `ssh_keygen`, actif par défaut, utilisait une variable `admin_user` définie nulle part : le premier lancement hors de la CI échouait.

[Voir le code sur GitHub](https://github.com/ECG-Rudy-Glt/ops-delivery-suite/tree/main/vps-shield)
