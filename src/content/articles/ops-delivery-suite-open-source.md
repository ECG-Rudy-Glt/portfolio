---
title: "Publier onze outils DevOps en open source : ce que l'exécution a révélé"
summary: "Migrer dix-neuf dépôts GitLab privés vers un dépôt GitHub public : trier, purger les secrets, repartir d'un historique neuf, puis tester chaque outil sur des conteneurs jetables. Une douzaine de bugs invisibles au lint et à la relecture, dont plusieurs qui rendaient des fonctions entières inopérantes."
date: 2026-11-22
tags: ["DevOps", "Sécurité", "Open source", "Ansible"]
type: article
---

## Le point de départ

Pendant un an, j'ai construit une série d'outils d'exploitation pour une offre de services DevOps que je n'ai finalement pas lancée : durcissement de serveur, audit de sécurité, sauvegarde, migration, reverse proxy, supervision. Ils vivaient dans dix-neuf dépôts GitLab privés. Je les utilisais pour mon homelab, et je voulais les publier.

Le résultat est [Ops Delivery Suite](/projets/ops-delivery-suite/), un [dépôt GitHub](https://github.com/ECG-Rudy-Glt/ops-delivery-suite) sous licence MIT qui regroupe onze outils. Cet article décrit la démarche, et surtout ce qu'elle a fait remonter : rendre un code public oblige à le relire, mais c'est en l'exécutant qu'on découvre s'il marche.

## Trier avant de publier

Sur dix-neuf dépôts, sept ne devaient pas partir : quatre coquilles vides avec le README par défaut de GitLab, une application sans rapport avec la suite, le site commercial, et une branche qui faisait doublon. Deux outils (Automate HTTPS et Traefik Edge Proxy) étaient deux moitiés du même projet, l'un avec la documentation, l'autre avec le déploiement Ansible : je les ai fusionnés.

J'ai regroupé le reste dans un seul dépôt, un dossier par outil. Plusieurs outils font quelques fichiers ; douze dépôts à maintenir et à faire découvrir séparément auraient coûté plus qu'ils n'apportaient.

## Les secrets : ne pas réécrire, repartir de zéro

Un scan gitleaks de l'historique complet a trouvé ce qu'on trouve toujours dans des dépôts « privés, donc pas grave » : des clés privées SSH, un vault Ansible déchiffré à côté de son mot de passe, un token d'enregistrement de runner GitLab, une clé d'API, un mot de passe root en clair dans un inventaire. Une recherche complémentaire (gitleaks ne connaît pas les IP ni les noms de clients) a fait remonter les adresses de vrais serveurs, des rapports d'audit réels et le domaine d'un tiers.

Deux options : réécrire l'historique avec `git filter-repo` pour en retirer ces fichiers, ou publier un commit initial propre. La réécriture garde la chronologie, mais il suffit d'oublier une IP dans un message de commit ou un diff pour que la fuite soit publique et indexée. J'ai choisi l'historique neuf. Ce n'est pas suffisant pour autant : tout ce qui a été exposé doit être révoqué, même dans un dépôt resté privé.

Le dépôt public a ensuite sa propre CI : gitleaks à chaque push, syntaxe et lint Ansible, ruff, shellcheck et validation des fichiers Compose.

## Lint propre, outil cassé

Une fois le code nettoyé, les linters ne signalaient plus grand-chose. J'ai quand même lancé chaque outil sur des conteneurs jetables : MariaDB, PostgreSQL et MongoDB pour les sauvegardes, une Debian 12 comme cible d'audit, une vraie instance Traefik avec une application derrière. Voici ce qui en est sorti.

**La sauvegarde PostgreSQL n'avait jamais fonctionné.** Le code passait `--no-owner --no-acl` à `pg_dump` comme un seul argument, que `pg_dump` refuse. Le fichier produit portait en plus l'extension `.sql`, alors que le script de restauration cherchait des `.dump`. Côté MySQL, la commande était une chaîne passée à un shell, mot de passe compris : il suffisait d'un mot de passe contenant un espace ou un `;` pour casser le dump, ou exécuter autre chose, et le mot de passe apparaissait dans `ps`. J'ai testé la correction avec un mot de passe piégé (`p@ss w0rd;$(id)"`…), jusqu'à la restauration.

**Le scan IaC de Trivy Audit ne s'était jamais exécuté.** `trivy config` attend un dossier, pas un fichier, et refuse l'option `--no-progress`. Chaque appel échouait, mais la tâche Ansible portait `failed_when: false` : aucune erreur visible, simplement une section vide. La recherche des Dockerfile partait par ailleurs de `/` avec un `excludes` censé écarter `/proc` et `/sys`, alors que ce paramètre ne filtre que des noms de fichiers. Quant à l'« analyse IA » annoncée dans le README, c'était un `echo`.

**Traefik ne voyait aucun conteneur.** Les versions 3.0 et 3.2 utilisent une version de l'API Docker que Docker 29 refuse désormais. Le proxy démarrait, répondait en 404 sur toutes les routes, et le message d'erreur n'apparaissait que dans le fichier de log. Le même test a révélé un champ inexistant, `frameDelay` au lieu de `frameDeny`, dans le fichier des middlewares : Traefik rejetait tout le fichier, si bien qu'aucun en-tête de sécurité n'était appliqué, HSTS compris.

**La détection de dérive SSH regardait le mauvais fichier.** CI Hardening vérifie chaque nuit que le durcissement tient toujours. Il lisait `/etc/ssh/sshd_config`. Or, sur Debian 12, Ubuntu 22.04+ et RHEL 9, `sshd` lit d'abord `/etc/ssh/sshd_config.d/*.conf`, et c'est la première valeur rencontrée qui l'emporte. Un `50-cloud-init.conf` contenant `PasswordAuthentication yes` suffisait donc à rouvrir la connexion par mot de passe pendant que l'outil affichait « conforme ». C'est exactement la dérive qu'il était censé détecter. La détection lit maintenant la configuration effective (`sshd -T`), et les corrections vont dans un fichier `00-…` prioritaire, validé par `sshd -t` avant tout redémarrage.

**Le runner GitLab s'enregistrait à chaque relance.** Le test « déjà enregistré ? » cherchait le nom du runner dans la sortie standard de `gitlab-runner list`, qui écrit en réalité sur la sortie d'erreur.

## Les valeurs par défaut sont du code de production

L'autre famille de problèmes ne fait planter rien : ce sont des valeurs « temporaires » devenues définitives. Le compte admin créé par l'outil de durcissement, avec sudo, recevait le mot de passe du banc de test Vagrant. Le dashboard Traefik était protégé par `admin:admin`, Grafana démarrait en `admin` / `admin`, Prometheus était publié sur toutes les interfaces sans authentification. Et la documentation de l'agent de supervision conseillait de protéger le port des métriques avec UFW, alors qu'un port publié par Docker contourne UFW.

La règle que j'ai appliquée partout : aucun identifiant par défaut. Sans mot de passe défini, la stack refuse de démarrer avec un message qui dit quoi faire. C'est moins confortable pour un premier test, mais personne ne déploiera `admin:admin` par oubli.

J'ai ajouté aussi un garde-fou à l'outil de durcissement : il refuse de désactiver l'authentification par mot de passe tant que le compte admin n'a aucune clé dans `authorized_keys`. Sans lui, le playbook pouvait vous enfermer hors de votre propre serveur.

## Ce que j'en retiens

- **Un `failed_when: false` est une dette.** Il transforme une fonction cassée en fonction silencieuse. Les deux bugs les plus graves de cette migration se cachaient derrière.
- **Lire n'est pas exécuter.** Le lint était propre, la relecture n'avait rien vu. Le dump PostgreSQL, le scan IaC et le routage Traefik n'ont cassé qu'à l'exécution, sur une vraie base et un vrai Docker.
- **Tester contre la version courante.** Le bug Traefik n'existait pas quand l'outil a été écrit. Un outil d'infrastructure vieillit avec ce qui l'entoure.
- **Un outil de sécurité doit regarder l'état effectif.** Un fichier de configuration ne dit pas comment le service se comporte. `sshd -T` le dit.

Chaque module a sa page sur le portfolio, avec son mode d'emploi et la liste de ce qui a été corrigé : [Ops Delivery Suite](/projets/ops-delivery-suite/).
