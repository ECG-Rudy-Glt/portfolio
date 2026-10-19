---
project: coach
title: "Données et intégrations"
summary: "Questionnaire adaptatif, bibliothèque d'exercices, Garmin, import de fichiers FIT pour Coros et les autres montres : comment les données entrent."
order: 6
---

## Le questionnaire adaptatif

Environ 100 questions réparties en 13 domaines (objectifs, course, trail, vélo, musculation, santé, contraintes, historique…). Un moteur de conditions ne pose que ce dont la décision suivante a besoin : quelqu'un qui ne fait pas de vélo ne voit jamais les questions de vélo. Chaque réponse devient un fait horodaté, et une validation au démarrage rejette toute banque de questions incohérente.

## La bibliothèque d'exercices

Plus de 1 750 exercices fusionnés depuis wger et free-exercise-db, plus quelques exercices maison, avec pour chaque illustration l'auteur et la licence. Un import automatique les charge au premier démarrage de la pile Docker et se relance sans doublon. Les images ne sont pas redistribuées : elles sont récupérées à la demande, depuis une liste d'hôtes autorisés, et mises en cache.

## Garmin

La connexion passe par une bibliothèque non officielle : l'utilisateur saisit ses identifiants (et un code MFA si besoin), seuls les jetons résultants sont conservés, chiffrés. Une synchronisation (toutes les 6 heures par défaut) récupère deux ans d'activités à la première connexion puis un mois glissant, avec la fréquence cardiaque au repos, la VO2max, les temps estimés et la charge d'entraînement. Les activités récentes sont rapprochées des séances prévues (même jour, sport compatible, durée la plus proche) et les valident sans jamais écraser ce que l'utilisateur a saisi.

## Coros et les autres marques

Coros ne propose pas d'API aux particuliers, donc rien à brancher comme pour Garmin. La voie retenue est l'**import de fichiers d'activité** (FIT, TCX, GPX), que Coros, Suunto, Polar, Wahoo ou Apple Watch savent tous exporter. Un seul adaptateur ouvrirait donc le projet à toutes les marques : c'est la priorité de la prochaine version, décrite dans un ticket et dans le guide d'intégration (`docs/integrations.md`), qui explique aussi comment ajouter une source ou un service de A à Z.

## Un contrat simple pour ajouter une source

Une source doit produire des lignes d'activité normalisées (sport, durée, distance, dénivelé, fréquence cardiaque, calories, charge ; inconnu = absent, jamais zéro) et des mesures quotidiennes. Tout le reste (rapprochement avec le plan, historique, contexte du coach) lit ces lignes via l'interface de dépôt. Le dépôt fournit une procédure pas à pas pour un contributeur ou un assistant de code (`skills/add-activity-source`).
