---
title: "Ops Delivery Suite - Boîte à outils DevOps, open source"
category: perso
summary: "Onze outils DevOps autonomes et publiés en open source (MIT) : durcissement Ansible, durcissement continu, audits de sécurité Trivy et OpenSCAP, sauvegarde chiffrée vers S3, migration de serveur, proxy HTTPS Traefik, supervision, templates CI/CD."
period: "2025 - en cours"
role: "Conception, développement et publication open source en solo"
stack: ["Ansible", "Docker", "Traefik", "Trivy", "OpenSCAP", "Python", "GitLab CI", "GitHub Actions", "Prometheus", "Grafana"]
tags: ["DevOps", "Sécurité", "CI/CD", "Automatisation", "Monitoring", "Infra as Code"]
links:
  repo: "https://github.com/ECG-Rudy-Glt/ops-delivery-suite"
featured: true
relevance: "majeur"
order: 8
---

## Le problème

Sur chaque mission ou projet, les mêmes tâches d'exploitation reviennent : durcir un serveur neuf, mettre en place une CI/CD, sauvegarder proprement, auditer la sécurité, exposer un service en HTTPS, superviser. Les refaire à la main à chaque fois prend du temps et produit des serveurs tous configurés un peu différemment.

Le projet est né d'un essai de monter une offre de services DevOps packagés pour de petites structures, en parallèle de l'alternance. La charge combinée était trop lourde pour mener les deux de front ; le volet commercial est en pause, mais les outils restent utiles. Je les ai donc publiés en open source.

## La solution

Une collection d'outils indépendants, réunis dans [un seul dépôt GitHub](https://github.com/ECG-Rudy-Glt/ops-delivery-suite). Chacun vit dans son dossier, avec son README, et s'utilise seul : on copie le dossier, on renseigne un inventaire ou un `.env`, on lance. Aucun identifiant n'est fourni par défaut, et la CI du dépôt vérifie à chaque commit l'absence de secrets, la syntaxe Ansible et les linters.

Parcours type pour un nouveau serveur : **VPS Shield** le durcit, **Traefik Edge Proxy** expose les services en HTTPS, **Data Sentinel** sauvegarde, **Ops Vision** surveille, **CI Hardening** vérifie chaque nuit que rien n'a dérivé, et **Infra Flash Audit** ou **Trivy Audit** produisent le rapport d'audit.

## Les modules

Cliquez sur un module pour voir comment il s'utilise, puis sur « Explorer le module » pour le détail.

<details class="module">
<summary>VPS Shield <span class="module-role">Durcissement d'un serveur neuf</span></summary>
<div class="module-body">

Un playbook Ansible qui applique quinze rôles activables séparément : compte admin à clé SSH, SSH durci, pare-feu UFW ou FirewallD, fail2ban, sysctl, PAM, auditd, AIDE, bannière légale. Inspiré d'ANSSI-BP-028 et des CIS Benchmarks.

```bash
cd vps-shield && ./setup.sh
cp inventory.ini.example inventory.ini   # IP du serveur
ansible-playbook playbook.yml --check --diff
ansible-playbook playbook.yml
```

<p class="module-links"><a href="/projets/ops-delivery-suite/vps-shield/">Explorer le module →</a><a href="https://github.com/ECG-Rudy-Glt/ops-delivery-suite/tree/main/vps-shield">Code</a></p>
</div>
</details>

<details class="module">
<summary>CI Hardening <span class="module-role">Durcissement continu et auto-remédiation</span></summary>
<div class="module-body">

Un pipeline planifié compare chaque nuit l'état réel des serveurs à l'état voulu (SSH, pare-feu, sysctl, services, ports, comptes, intégrité de fichiers), corrige les écarts et envoie un rapport par e-mail.

```bash
cd ci-hardening
ansible-playbook playbooks/audit.yml        # détecte seulement
ansible-playbook playbooks/full-cycle.yml   # détecte, corrige, notifie
```

<p class="module-links"><a href="/projets/ops-delivery-suite/ci-hardening/">Explorer le module →</a><a href="https://github.com/ECG-Rudy-Glt/ops-delivery-suite/tree/main/ci-hardening">Code</a></p>
</div>
</details>

<details class="module">
<summary>Infra Flash Audit <span class="module-role">Audit de sécurité sans agent, rapport HTML/PDF</span></summary>
<div class="module-body">

Audite des serveurs Linux et Windows par SSH ou WinRM sans rien installer : système, comptes, SSH, conteneurs, journaux, SSL, en-têtes HTTP, ports, et en option Lynis, OpenSCAP CIS et une synthèse par IA. Le rapport attribue un score et une note de A à F.

```bash
cd infra-flash-audit
cp -r inventories/example inventories/client-a
ansible-playbook site.yml -i inventories/client-a/hosts.yml --ask-vault-pass
```

<p class="module-links"><a href="/projets/ops-delivery-suite/infra-flash-audit/">Explorer le module →</a><a href="https://github.com/ECG-Rudy-Glt/ops-delivery-suite/tree/main/infra-flash-audit">Code</a></p>
</div>
</details>

<details class="module">
<summary>Trivy Audit <span class="module-role">Vulnérabilités OS, images et IaC, SBOM</span></summary>
<div class="module-body">

Installe Trivy sur la cible si besoin, scanne les paquets, chaque image Docker et les Dockerfile ou Compose présents, génère des SBOM CycloneDX et un rapport HTML/PDF, avec en option un plan de remédiation rédigé par un LLM.

```bash
cd trivy-audit
ansible-playbook -i inventories/example.yml site.yml
# rapport : reports/<hôte>/trivy_report_latest.html
```

<p class="module-links"><a href="/projets/ops-delivery-suite/trivy-audit/">Explorer le module →</a><a href="https://github.com/ECG-Rudy-Glt/ops-delivery-suite/tree/main/trivy-audit">Code</a></p>
</div>
</details>

<details class="module">
<summary>Data Sentinel <span class="module-role">Sauvegarde chiffrée vers S3</span></summary>
<div class="module-body">

Un conteneur qui dumpe les bases MySQL, PostgreSQL et MongoDB d'autres conteneurs, archive des dossiers, chiffre avec GPG, envoie vers un stockage S3 (AWS, Scaleway, MinIO…), applique une rétention quotidienne, hebdomadaire et mensuelle, puis notifie Discord ou Slack.

```bash
cd data-sentinel
cp config.example.yaml config.yaml   # bucket, bases, dossiers
make dry-run          # simulation, sans envoi
make backup           # sauvegarde immédiate
make install-cron     # sauvegarde quotidienne à 3 h
make list             # sauvegardes disponibles sur S3
```

<p class="module-links"><a href="/projets/ops-delivery-suite/data-sentinel/">Explorer le module →</a><a href="https://github.com/ECG-Rudy-Glt/ops-delivery-suite/tree/main/data-sentinel">Code</a></p>
</div>
</details>

<details class="module">
<summary>Server Migration Kit <span class="module-role">Migration d'un serveur vers un autre</span></summary>
<div class="module-body">

Six playbooks : vérifications préalables, audit de la source, copie des fichiers, transfert des bases, migration des stacks Docker avec sauvegarde Restic, contrôle d'intégrité par checksums. Chaque étape écrit un rapport.

```bash
cd server-migration-kit
cp inventory/examples/migration.ini.example inventory/migration.ini
ansible-playbook -i inventory/migration.ini playbooks/00_preflight_checks.yml
ansible-playbook -i inventory/migration.ini playbooks/04_full_migration.yml --ask-vault-pass
```

<p class="module-links"><a href="/projets/ops-delivery-suite/server-migration-kit/">Explorer le module →</a><a href="https://github.com/ECG-Rudy-Glt/ops-delivery-suite/tree/main/server-migration-kit">Code</a></p>
</div>
</details>

<details class="module">
<summary>Traefik Edge Proxy <span class="module-role">Reverse proxy HTTPS automatique</span></summary>
<div class="module-body">

Traefik avec certificats Let's Encrypt, redirection HTTP vers HTTPS, en-têtes de sécurité, dashboard protégé, et un playbook Ansible qui prépare le serveur et déploie la stack. Une application s'expose avec quatre labels Docker.

```bash
cd traefik-edge-proxy
make setup && cp .env.example .env
make password      # identifiants du dashboard, à coller dans .env
make start
```

<p class="module-links"><a href="/projets/ops-delivery-suite/traefik-edge-proxy/">Explorer le module →</a><a href="https://github.com/ECG-Rudy-Glt/ops-delivery-suite/tree/main/traefik-edge-proxy">Code</a></p>
</div>
</details>

<details class="module">
<summary>Ops Vision <span class="module-role">Supervision légère</span></summary>
<div class="module-body">

Uptime Kuma pour la disponibilité et les certificats, et en option Prometheus, Grafana et node-exporter pour les métriques, avec des alertes Discord, Slack, Telegram ou e-mail.

```bash
cd ops-vision
docker compose up -d                                 # Uptime Kuma seul
docker compose -f docker-compose.full.yml up -d      # + Prometheus et Grafana
```

<p class="module-links"><a href="/projets/ops-delivery-suite/ops-vision/">Explorer le module →</a><a href="https://github.com/ECG-Rudy-Glt/ops-delivery-suite/tree/main/ops-vision">Code</a></p>
</div>
</details>

<details class="module">
<summary>Docker Stack Builder <span class="module-role">Stacks Docker prêtes pour le dev et la prod</span></summary>
<div class="module-body">

Quatre environnements complets : Node.js Express, PHP Laravel, Python Django et WordPress, chacun avec sa base, son cache, ses healthchecks et un Makefile.

```bash
cp -r docker-stack-builder/templates/php-laravel mon-projet/
cd mon-projet && cp .env.example .env
make dev
```

<p class="module-links"><a href="/projets/ops-delivery-suite/docker-stack-builder/">Explorer le module →</a><a href="https://github.com/ECG-Rudy-Glt/ops-delivery-suite/tree/main/docker-stack-builder">Code</a></p>
</div>
</details>

<details class="module">
<summary>CI/CD Templates <span class="module-role">Pipelines GitHub Actions et GitLab CI</span></summary>
<div class="module-body">

Sept modèles de pipeline (Node avec PM2, PHP Laravel, Python, Docker Compose, Go, Rust, site statique), chacun en version GitHub Actions et GitLab CI : tests, build et déploiement par SSH, avec un guide de retour arrière.

```bash
cp cicd-templates/templates/node-pm2/github-action.yml .github/workflows/deploy.yml
# secrets du dépôt : SSH_PRIVATE_KEY, DEPLOY_HOST, DEPLOY_USER, DEPLOY_PATH
```

<p class="module-links"><a href="/projets/ops-delivery-suite/cicd-templates/">Explorer le module →</a><a href="https://github.com/ECG-Rudy-Glt/ops-delivery-suite/tree/main/cicd-templates">Code</a></p>
</div>
</details>

<details class="module">
<summary>GitLab Runner Provisioner <span class="module-role">Un runner GitLab en une commande</span></summary>
<div class="module-body">

Installe Docker et GitLab Runner sur un VPS, enregistre le runner et limite son emprise sur le disque, à partir d'une IP et d'un token. Versions Bash et PowerShell.

```bash
cd gitlab-runner-provisioner
./provision.sh 203.0.113.10 glrt-xxxx -u ubuntu -k ~/.ssh/id_ed25519
```

<p class="module-links"><a href="/projets/ops-delivery-suite/gitlab-runner-provisioner/">Explorer le module →</a><a href="https://github.com/ECG-Rudy-Glt/ops-delivery-suite/tree/main/gitlab-runner-provisioner">Code</a></p>
</div>
</details>

## Le passage en open source

Les outils vivaient dans dix-neuf dépôts GitLab privés. Pour les publier :

- **Historique repris à zéro.** Les anciens commits contenaient des clés privées, un token de runner, une clé d'API et des inventaires de vrais serveurs. Plutôt que de risquer un oubli en réécrivant l'historique, le dépôt public part d'un commit propre, et les inventaires sont remplacés par des exemples.
- **Tri.** Douze dépôts réels sur dix-neuf (les autres étaient vides ou hors sujet), dont deux doublons fusionnés : Automate HTTPS et Traefik Edge Proxy.
- **Corrections.** En testant chaque outil sur des conteneurs jetables, j'ai trouvé et corrigé des bugs qui empêchaient certaines fonctions de marcher : le dump PostgreSQL échouait, le scan IaC de Trivy Audit ne s'exécutait jamais, Traefik ne voyait aucun conteneur avec Docker 29, le fichier de middlewares était rejeté, et CI Hardening se fiait à `sshd_config` alors qu'un fichier de `sshd_config.d` pouvait réactiver le mot de passe. J'ai aussi retiré tous les identifiants par défaut et ajouté un garde-fou contre la perte d'accès SSH. Le détail est dans la page de chaque module.

## Bilan

Ces outils servent à exploiter mon [homelab](/projets/homelab/) et à déployer ce portfolio. La leçon, côté projet : savoir arbitrer sa charge plutôt que tout mener de front. Côté technique : un outil de sécurité n'est fiable qu'une fois testé sur une vraie machine. Plusieurs bugs n'apparaissaient ni au lint ni à la relecture, seulement à l'exécution.
