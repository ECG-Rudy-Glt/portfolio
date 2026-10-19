---
project: coach
title: "Sécurité et données de santé"
summary: "Authentification, isolation des utilisateurs, en-têtes et CSP, secrets, conteneurs durcis : ce qui protège les données, et les limites connues."
order: 5
---

## Pourquoi c'est central

L'application manipule des données de santé : poids, entraînement, repas, éventuellement l'historique d'une montre. Chaque choix ci-dessous répond à un risque précis, et les limites sont écrites dans la documentation du dépôt plutôt que passées sous silence.

## Ce qui est en place

- **Mots de passe et sessions** : scrypt avec sel aléatoire, comparaison à temps constant, jeton de session aléatoire dont seul le hash est stocké, cookie HttpOnly et SameSite, expiration à 30 jours, révocation des autres sessions au changement de mot de passe.
- **Force brute** : limitation des essais par couple adresse/e-mail et, séparément, par compte toutes adresses confondues. L'adresse client n'est lue dans `X-Forwarded-For` que si on déclare un proxy de confiance : sans cela, un en-tête falsifié contournerait la limite.
- **Inscription** : ouverte seulement jusqu'à la création du premier compte, puis fermée par défaut.
- **Isolation** : toute route `/users/{id}/…` vérifie que l'identifiant du chemin est celui de la session ; des tests le contrôlent.
- **Navigateur** : politique CSP sans script en ligne, interdiction d'être inclus dans un cadre, `nosniff`, HSTS en HTTPS, refus des écritures dont l'origine diffère de l'hôte, documentation d'API désactivée par défaut.
- **Entrées** : photos de repas validées par leurs octets magiques et leur taille, quotas par jour, proxy d'images limité à une liste blanche d'hôtes en HTTPS (pas de SSRF), SQL toujours paramétré.
- **Secrets** : fournis en fichiers (`NOM_FILE`) et non en variables d'environnement, donc absents de `docker inspect`. Les jetons Garmin sont chiffrés (Fernet) et le mot de passe Garmin n'est jamais conservé.
- **Conteneurs** : utilisateur non privilégié, système de fichiers en lecture seule, toutes les capacités Linux retirées, `no-new-privileges`, base sur un réseau Docker *interne* sans route vers Internet.

## Les vérifications automatiques

Chaque PR passe par un lint, les tests (dont ceux de sécurité), un audit des dépendances et un scan de secrets. L'audit a d'ailleurs relevé des failles connues dans Starlette dès la publication : la mise à jour des dépendances qui les corrige a été la première PR fusionnée.

## Limites connues

Pas encore de double authentification ; la limitation d'essais est en mémoire (réinitialisée au redémarrage) ; la bibliothèque Garmin n'est pas officielle et peut casser ou poser un souci de conditions d'utilisation ; les sauvegardes ne sont pas chiffrées par défaut ; un fournisseur d'IA tiers reçoit le contexte configuré. Chacune a un ticket ou une mention dans `docs/security.md`.

## Signaler une faille

Le dépôt publie une politique de signalement privé (`SECURITY.md`) et un guide de durcissement pour ceux qui l'auto-hébergent.
