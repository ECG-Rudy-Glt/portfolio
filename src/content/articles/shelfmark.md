---
title: "Des livres et les dernières sorties directement sur la liseuse"
summary: "Ma compagne voulait pouvoir lire ses livres et les sorties récentes sans jongler entre plusieurs sites et un transfert manuel - j'ai cherché une solution que je pouvais brancher sur mon homelab, et l'ai trouvée avec Shelfmark."
date: 2026-08-26
tags: ["Homelab", "Self-hosting"]
type: article
---

## Le besoin de départ

Ma compagne lit beaucoup, et voulait pouvoir récupérer facilement ses livres et les sorties
récentes directement sur sa liseuse - sans avoir à chercher sur plusieurs sites différents puis
transférer le fichier à la main à chaque fois. J'avais déjà un petit script maison qui faisait
à peu près ça, mais fragile et limité à une seule source. Plutôt que de continuer à le rafistoler,
j'ai cherché une brique toute faite à brancher sur mon [homelab](/projets/homelab/).

## Shelfmark

[Shelfmark](https://github.com/calibrain/shelfmark) coche toutes les cases : une recherche qui
couvre plusieurs sources à la fois, et surtout un mode d'envoi qui fait directement suivre chaque
téléchargement terminé par email vers l'adresse de la liseuse - le geste Kindle classique, mais
automatisé. Une recherche, un clic, et le livre est là quelques minutes plus tard, sans que
personne n'ait à manipuler un fichier.

Déployé en conteneur, à côté du reste des services du lab, avec sa propre CI/CD pour les mises à
jour - même logique que le reste de mon infrastructure : chaque service a son cycle de vie
indépendant, sans dépendre d'une intervention manuelle pour rester à jour.

## Pour aller plus loin

J'ai généralisé la configuration qui en résulte - variables d'environnement commentées, quelques
réglages non documentés par le projet mais nécessaires pour que la recherche fonctionne bien du
premier coup - dans un dépôt "prêt à déployer" séparé, testé de bout en bout avant publication :
[github.com/ECG-Rudy-Glt/shelfmark_ready_to_deploy](https://github.com/ECG-Rudy-Glt/shelfmark_ready_to_deploy).
