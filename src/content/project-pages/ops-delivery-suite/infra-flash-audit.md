---
project: ops-delivery-suite
title: "Infra Flash Audit"
summary: "Audit de sécurité sans agent de serveurs Linux et Windows, avec un rapport HTML/PDF noté de A à F."
order: 3
---

## À quoi ça sert

« On doit prouver à notre client grand compte que nos serveurs sont sécurisés. » Infra Flash Audit répond à ce besoin : il se connecte en SSH (ou WinRM pour Windows), collecte l'état du serveur sans rien y installer, et produit un rapport lisible par un non-spécialiste, avec un score sur 100, une note de A à F et des recommandations.

## Ce qui est audité

| Volet | Contenu |
|---|---|
| Système | OS, noyau, mises à jour en attente, redémarrage requis, sysctl |
| Comptes | Comptes UID 0, comptes sans mot de passe, sudoers, PAM |
| SSH | Options sensibles, algorithmes faibles, clés d'hôte |
| Réseau | Ports en écoute, règles de pare-feu, fail2ban |
| Services et CMS | Services actifs ou en échec, WordPress et Drupal, fichiers `.env` exposés |
| Conteneurs | Images, conteneurs en échec, montages sensibles, socket Docker |
| Journaux | Échecs de connexion, IP suspectes, OOM, centralisation des logs |
| Externe | Certificat SSL, en-têtes HTTP de sécurité, scan nmap |
| Options | Lynis, OpenSCAP (profil CIS niveau 1), synthèse par IA |

## Utilisation

```bash
cd infra-flash-audit
pip install ansible-core weasyprint
ansible-galaxy collection install ansible.windows community.general

cp -r inventories/example inventories/client-a      # IP, utilisateur, clé SSH
ansible-vault encrypt inventories/client-a/group_vars/all/vault.yml

ansible-playbook site.yml -i inventories/client-a/hosts.yml --ask-vault-pass \
  -e "audit_company_name='Client A' audit_domain='exemple.com'"
```

Les rapports HTML et PDF arrivent dans `reports/`. L'analyse IA (`-e audit_ai_enabled=true`) envoie à une API compatible OpenAI un résumé par section et ajoute une synthèse avec plan de remédiation.

## Ce que j'ai corrigé avant publication

- **Données réelles.** Le dépôt d'origine contenait l'inventaire d'un vrai serveur, sa clé privée, le mot de passe du compte d'audit, une clé d'API et deux rapports d'audit réels. Tout a été remplacé par un inventaire d'exemple et un `vault.yml.example`.
- **Clé SSH reconstruite à la main.** Le playbook recopiait une clé privée depuis le vault en reformatant son contenu avec un script Python, puis l'écrivait dans `~/.ssh`. La connexion passe désormais par l'agent SSH ou `ansible_ssh_private_key_file`.
- **Vérification des clés d'hôte.** Elle était désactivée partout (`StrictHostKeyChecking=no`), ce qui ouvre la porte à une interception de la session d'audit. Elle est réactivée par défaut.

Vérifié de bout en bout sur un conteneur Debian 12 : 267 tâches et un rapport généré.

[Voir le code sur GitHub](https://github.com/ECG-Rudy-Glt/ops-delivery-suite/tree/main/infra-flash-audit)
