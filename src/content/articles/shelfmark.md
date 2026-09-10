---
title: "Recherche de livres et envoi direct sur Kindle, sans code custom"
summary: "Comment j'ai remplacé un vieux scraper maison par Shelfmark : recherche multi-sources, envoi automatique sur liseuse par email, et les deux incidents de prod qui semblaient liés mais ne l'étaient pas - un mot de passe SMTP, et un DNS mal configuré qui faisait échouer les envois en silence."
date: 2026-08-26
tags: ["Homelab", "Self-hosting", "Docker", "DNS", "SMTP"]
type: article
---

## Le problème à remplacer

Avant [Shelfmark](https://github.com/calibrain/shelfmark), mon [homelab](/projets/homelab/) faisait
tourner un scraper Anna's Archive fait maison en Python, plus un script d'envoi Kindle par SMTP à
côté. Ça marchait, mais c'était fragile et mono-source - le genre de code qu'on continue de
maintenir seulement parce qu'on ne s'est jamais posé la question de le remplacer par quelque chose
de mieux entretenu. Shelfmark fait tout ça nativement, sans code custom : recherche multi-sources
(Anna's Archive/LibGen/Z-Library en direct download, torrents + débrideur en complément) et un mode
de sortie `email` qui envoie chaque téléchargement terminé directement par SMTP - exactement le
comportement que je codais à la main avant.

## Deux dépôts, deux responsabilités

Même pattern que le reste du lab (Portfolio, ce site) : mon [dépôt d'infrastructure](/projets/homelab/)
(Terraform + Ansible) se contente de provisionner la LXC et de la bootstrapper - rien de plus, pas
de rôle Ansible applicatif. Un second dépôt, dédié à Shelfmark, déploie l'app par-dessus via sa
propre CI/CD (Forgejo Actions, SSH + `docker compose pull && up -d` à chaque push sur `main`).
Séparer les deux évite qu'un changement de config applicative ne déclenche un `terraform plan` sur
le reste du lab, et inversement.

Le exposition publique passe par un tunnel Cloudflare embarqué dans le compose de l'app - pas par
mon reverse proxy interne Traefik, qui ne route que du trafic LAN/Tailscale.

## Incident 1 - un SMTP qui répond `535` sans raison évidente

Premier vrai test en prod : `535 Authentication failed` côté SMTP OVH. Ma première hypothèse a été
un bug de parsing du fichier `.env` - un mot de passe avec un caractère spécial mal échappé par
Docker Compose. Pour trancher, j'ai isolé le test au maximum : un script Python `smtplib` direct
sur la LXC, en dehors de toute la stack Shelfmark. Même échec, avec le même mot de passe. Ça
éliminait le parsing `.env` d'un coup - le mot de passe lui-même était invalide côté OVH.
Régénéré, retesté avec un email réel reçu, appliqué dans le vrai `.env` (permissions resserrées au
passage, `chmod 600`).

Leçon retenue : isoler la variable la plus simple à tester en premier (ici, le mot de passe
lui-même, avec le protocole le plus nu possible) plutôt que de suspecter d'abord la couche la plus
complexe (le parsing Compose).

## Incident 2 - envoi "réussi", livre jamais reçu

Une fois le SMTP réparé, un livre envoyé sans la moindre erreur dans les logs n'est jamais arrivé
dans la bibliothèque cloud Kindle. Aucune exception, aucun rejet visible - le genre de silence qui
fait perdre du temps parce qu'il n'y a rien à débugger côté application.

La cause était plus haut dans la chaîne : DNS. Mon domaine avait un enregistrement SPF
(`v=spf1 include:mx.ovh.com -all`) mais ni DKIM ni DMARC. Un domaine expéditeur avec SPF seul, sans
DKIM ni DMARC, est un pattern classique de rejet silencieux chez les destinataires stricts - et
Amazon Kindle en fait partie. Le mail est accepté par le relais SMTP OVH (d'où l'absence d'erreur
côté Shelfmark), mais jamais transmis derrière.

Fix : publier les deux CNAME de signature DKIM fournis par OVH, plus un enregistrement `_dmarc` en
mode observation (`p=none`), dans la zone DNS Cloudflare. Un piège précis à connaître ici : les
CNAME DKIM doivent être en **DNS only** (nuage gris), pas proxifiés (nuage orange) - un enregistrement
proxifié casse la vérification de signature, puisque le destinataire doit pouvoir résoudre le vrai
enregistrement TXT de la clé publique, pas une réponse Cloudflare. Propagation vérifiée par
résolution DNS-over-HTTPS publique avant d'activer la fonctionnalité côté OVH.

## Le vrai bug navigateur - deux fausses pistes avant la bonne

Une recherche a ensuite commencé à échouer avec `Pure CDP browser startup failed`. Un incident CPU
à 100 % sur la même LXC, découvert au même moment, a d'abord semblé être la cause - il s'agissait en
réalité de processus `cat` fantômes issus d'une session de debug `docker exec` jamais fermée
proprement, sans aucun rapport avec le navigateur. Deux causes indépendantes, coïncidence de
calendrier.

Le vrai coupable : `/dev/shm` à 64 Mo, la valeur par défaut de Docker, insuffisante pour faire
tourner un Chromium headless. Le bypasser anti-bot intégré de Shelfmark (nécessaire pour passer la
protection DDoS-Guard des miroirs Anna's Archive) en a besoin pour démarrer. Fix en une ligne dans
le `docker-compose.yml` :

```yaml
services:
  shelfmark:
    shm_size: "2gb"
```

Avant de trouver ce fix, j'ai testé une bascule vers un bypasser externe (FlareSolverr) en pensant
tenir la vraie cause - erreur. FlareSolverr est câblé pour résoudre des challenges Cloudflare
spécifiquement (recherche d'éléments HTML propres à Cloudflare dans la page), pas DDoS-Guard, la
protection utilisée par les miroirs Anna's Archive. Confirmé par
[une issue fermée sur leur tracker](https://github.com/FlareSolverr/FlareSolverr/issues/886)
("closed as not planned") : ce n'est pas un bug de configuration de mon côté, FlareSolverr n'a
structurellement aucune chance de fonctionner sur ce type de protection. Retour au bypasser interne,
correctement dimensionné cette fois - test de bout en bout confirmé, livre reçu dans la bibliothèque
Kindle.

## Ce que ça donne au quotidien

Une recherche, un clic, et le livre arrive directement sur la liseuse - sans jongler entre plusieurs
sites de téléchargement et un transfert manuel par câble. La source directe (Anna's Archive/LibGen)
couvre l'essentiel des besoins réels ; les indexeurs torrent + débrideur (réutilise la même clé que
mon pipeline de streaming - voir [l'article Netflix familial](/blog/netflix-familial/)) restent en
complément pour ce que la première source ne trouve pas.

## Aller plus loin

J'ai généralisé la config qui en résulte - `docker-compose.yml`, variables d'environnement
commentées, et le fix `shm_size` (non documenté par le projet upstream) - dans un dépôt "prêt à
déployer" séparé, testé en local de bout en bout avant publication :
[github.com/ECG-Rudy-Glt/shelfmark_ready_to_deploy](https://github.com/ECG-Rudy-Glt/shelfmark_ready_to_deploy).

## Sources

- [Shelfmark (calibrain)](https://github.com/calibrain/shelfmark)
- [FlareSolverr issue #886 - DDoS-Guard non supporté](https://github.com/FlareSolverr/FlareSolverr/issues/886)
