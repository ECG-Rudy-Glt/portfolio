---
project: ops-delivery-suite
title: "Trivy Audit"
summary: "Vulnérabilités du système, des images Docker et des Dockerfile, SBOM CycloneDX et plan de remédiation par IA optionnel."
order: 4
---

## À quoi ça sert

Savoir quelles CVE critiques touchent un serveur et les conteneurs qu'il fait tourner, sans installer d'agent. Trivy Audit pilote [Trivy](https://trivy.dev) avec Ansible et rassemble tout dans un rapport.

## Ce qui est scanné

| Scan | Résultat |
|---|---|
| Système (`trivy rootfs`) | CVE HIGH et CRITICAL des paquets installés |
| Images Docker | CVE par image, triées par criticité (20 images au plus) |
| IaC (`trivy config`) | Mauvaises configurations des Dockerfile et Compose trouvés dans `/opt`, `/srv`, `/home`, `/root`, `/var/www` |
| SBOM | Un inventaire CycloneDX par image |

Trivy est installé sur la cible s'il manque, et peut être retiré en fin d'audit. Les fichiers de travail et le cache sont toujours supprimés.

## Utilisation

```bash
cd trivy-audit
pip install ansible-core jinja2 weasyprint
cp inventories/example.yml inventories/mes-serveurs.yml
ansible-playbook -i inventories/mes-serveurs.yml site.yml
# rapport : reports/<hôte>/trivy_report_latest.html (et .pdf)
```

Options courantes : `-e audit_scan_images=false`, `-e audit_severity=MEDIUM,HIGH,CRITICAL`, `-e audit_trivy_version=0.58.1` pour figer la version.

### Plan de remédiation par IA

Avec `-e audit_ai_enabled=true` et une clé dans `AUDIT_AI_API_KEY`, le générateur envoie à une API compatible OpenAI (Groq, OpenAI, Mistral ou un Ollama local) **un résumé** : identifiants CVE, paquets, versions, règles IaC, jamais le nom ni l'IP du serveur. Le plan revient dans une section du rapport marquée « à valider ».

## Ce que j'ai corrigé avant publication

En lançant l'outil sur un conteneur Debian, plusieurs fonctions annoncées s'avéraient inopérantes :

- **Le scan IaC ne s'exécutait jamais.** `trivy config` attend un dossier et refuse `--no-progress` ; chaque appel échouait en silence (`failed_when: false`). En plus, la recherche partait de `/` et `excludes` ne filtrait que des noms de fichiers : `/proc` et `/sys` étaient parcourus. Le scan cible désormais les dossiers listés, et ses résultats ont enfin une section dans le rapport.
- **L'« analyse IA » était un `echo`.** Elle est maintenant réelle et optionnelle.
- **Connexion aux registres privés.** La syntaxe `TRIVY_USERNAME=… trivy registry login` n'existe pas : elle passe par `--username` et `--password-stdin`, donc sans mot de passe dans la ligne de commande.
- **Version de Trivy.** Une condition `when` mal écrite empêchait de lire la version quand Trivy était déjà installé ; le rapport affichait aussi une version écrite en dur.
- **Rapport.** Le HTML était généré sans échappement (injection possible depuis les données de CVE), les noms d'images contenant `_` étaient déformés, et les résultats d'un audit précédent se mélangeaient au suivant.

[Voir le code sur GitHub](https://github.com/ECG-Rudy-Glt/ops-delivery-suite/tree/main/trivy-audit)
