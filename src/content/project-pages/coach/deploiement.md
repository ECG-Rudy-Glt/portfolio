---
project: coach
title: "Déploiement et exposition"
summary: "Docker Compose propre (réseaux, secrets, profils), exposition par VPN ou tunnel, installation sur iPhone et Samsung, et la production sur mon homelab."
order: 7
---

## Docker Compose

Un `docker compose up` suffit, après un script qui génère les secrets. La pile sépare trois réseaux : `data` (interne, sans accès à Internet) pour la base et les sauvegardes, `edge` (sortie autorisée) pour l'application, qui doit joindre les API d'IA, Garmin et wger, et `llm` pour un éventuel modèle local. Les secrets sont des fichiers montés dans `/run/secrets`. Des profils optionnels ajoutent un proxy HTTPS (Caddy), des sauvegardes quotidiennes ou Ollama. Un service ponctuel importe la bibliothèque d'exercices au premier démarrage et se met de côté ensuite.

## Exposition : un guide plutôt qu'une recommandation unique

Parce que les utilisateurs n'ont pas tous le même réseau, la documentation compare les options : **VPN** (Tailscale, WireGuard : recommandé, personne d'autre ne peut même joindre la page de connexion), **Cloudflare Tunnel** avec une couche d'accès devant, **ngrok** pour une démonstration, ou **reverse proxy avec redirection de ports**. Pour chacune : ce qui est exposé, les réglages à activer (hôtes autorisés, cookies sécurisés, proxy de confiance) et une liste de vérification avant ouverture. Elle rappelle aussi que le HTTPS est obligatoire pour installer la PWA et recevoir des notifications.

## Installer l'application sur un téléphone

Le guide décrit pas à pas l'ajout à l'écran d'accueil sur **iPhone** (Safari, notifications à partir d'iOS 16.4 pour une application installée), sur **Samsung** (Samsung Internet, avec le réglage de la batterie pour que les rappels arrivent) et sur Chrome Android, ainsi que la confiance à accorder à une autorité de certification privée quand on n'a pas de certificat public.

## En production chez moi

Sur mon homelab, la même application tourne sur k3s, déployée en GitOps : Flux suit le dépôt et applique le tag d'image qu'il contient. La CI sait construire l'image et mettre le tag à jour ; la poussée de l'image vers mon registre se fait encore à la main, l'automatiser est un point ouvert. Des sauvegardes logiques quotidiennes de la base s'ajoutent à celles de la machine virtuelle. La version publique et ma version de production sont deux dépôts : l'un contient en plus mes manifestes privés, l'autre est généré par un script qui les exclut et échoue si quoi que ce soit de privé s'y glisse.

## CI et images

Sur GitHub, chaque PR lance lint, tests (avec PostgreSQL), audit des dépendances, build de l'image avec démarrage de la pile et vérification des en-têtes, et scan de secrets. Chaque tag `vX.Y.Z` publie une image multi-architecture (amd64 et arm64) sur le registre GitHub.
