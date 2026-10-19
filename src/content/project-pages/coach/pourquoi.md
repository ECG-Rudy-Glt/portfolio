---
project: coach
title: "Pourquoi ce projet"
summary: "Un suivi sportif sans abonnement et des conseils de coach personnalisés pour pas cher : le point d'entrée, et pourquoi aucune application existante ne me convenait."
order: 1
---

## Le point de départ

Je voulais une application capable d'assurer mon **suivi sportif** sans payer d'abonnement, et d'obtenir des **conseils personnalisés de coach pour pas cher**. C'est le point d'entrée du projet. Les offres payantes facturent chaque mois un suivi et des conseils qu'on peut produire soi-même, et la plupart des applications qui ajoutent de l'« IA » laissent un modèle de langage inventer des charges d'entraînement, sans dire d'où elles viennent.

## Ce que je voulais en tirer

**Un outil à moi, sans abonnement.** Il tourne sur mon homelab, mes données de santé restent chez moi, et la partie « coach » coûte quelques euros par mois au plus : le plafond de dépense est réglable côté serveur, et un modèle local (Ollama) la rend gratuite.

**Des conseils qui s'expliquent.** Chaque séance du plan doit pouvoir répondre à « pourquoi celle-ci, avec cette durée ? » en citant une règle, elle-même rattachée à une publication quand il en existe une. Quand la preuve est faible, l'application le dit.

**Un projet complet, pas un script.** Questionnaire, moteur de plan, nutrition, synchronisation de montre, application installable sur téléphone, sécurité, déploiement, CI, documentation et publication open source : toute la chaîne, seul, sur un sujet que j'utilise réellement.

## Pourquoi pas un fork de wger

[wger](https://wger.de) est l'application libre de référence pour la musculation, mais elle ne couvre que le journal de séances : pas de questionnaire adaptatif, pas de plan multisport, pas de moteur de règles. Un fork serveur n'aurait pas apporté ces fonctions dans l'application mobile. J'ai donc écrit l'application, et je n'ai repris de wger que sa **base d'exercices** (licence Creative Commons, auteur et licence affichés pour chaque média), complétée par free-exercise-db.

## Ce que l'application ne prétend pas être

Un dispositif médical, un avis diététique ou un remplaçant de coach humain. Elle propose des suggestions générales, fondées sur des règles et des publications dont les limites sont indiquées, et renvoie vers un professionnel dès qu'il est question de douleur ou de signal d'alerte.
