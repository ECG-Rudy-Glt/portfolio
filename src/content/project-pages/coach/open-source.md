---
project: coach
title: "Publication open source"
summary: "Hygiène de l'historique, découplage du homelab, licences, workflow par pull requests, tickets et jalons : comment un projet privé devient un projet public."
order: 8
---

## Pourquoi publier

Je voulais que le projet serve à d'autres personnes qui cherchent la même chose que moi : un suivi gratuit, des conseils abordables, des données qui restent chez soi. Et qu'il montre une façon de travailler : sécurité, documentation, tests, processus.

## Ce qu'il a fallu faire avant

- **Balayer l'historique** à la recherche de secrets, d'adresses internes, de noms de domaine et d'e-mails. Aucun secret réel, mais des traces de mon infrastructure : le dépôt public repart donc d'un **historique neuf**, et un script d'export échoue si un motif privé réapparaît dans l'arbre publié.
- **Découpler du homelab** : manifestes Kubernetes déplacés dans un exemple générique, domaines et registres paramétrables, Docker Compose d'auto-hébergement, variables d'environnement documentées.
- **Rendre l'IA interchangeable** et le mode dégradé sans clé réel.
- **Écrire les mentions nécessaires** : avertissement « ni dispositif médical ni avis diététique », notice de confidentialité, licences et attributions de chaque donnée (wger en CC-BY-SA, free-exercise-db, police Inter), avertissement sur la fragilité de la connexion Garmin.
- **Choisir la licence** : AGPL-3.0, pour que les versions modifiées exposées en service restent ouvertes.

## Le workflow

`main` est protégée : personne, pas même moi, n'y pousse directement. Tout passe par une branche (ou un fork), une pull request avec son modèle, une CI verte (tests, build Docker, scan de secrets) et une fusion en squash. Des formulaires de tickets distinguent un bogue, une demande de fonction, une demande d'intégration (montre, service, fournisseur d'IA) et une correction de règle ou de publication. Les mises à jour de dépendances arrivent par PR groupées et mensuelles.

## Une feuille de route publique

Vingt-quatre tickets étiquetés, répartis en jalons : *v0.2.0* (marques de montres, interface en anglais), *v0.3.0* (double authentification, export et suppression des données, sauvegardes chiffrées) et *Later*. Plusieurs sont marqués « good first issue ».

## Contribuer avec un assistant de code

Le dépôt contient un fichier `AGENTS.md` (règles non négociables, commandes, conventions, définition de « terminé ») et dix recettes (`skills/`) : ajouter un fournisseur d'IA, une source de données, une règle, une publication, une question, un prompt, une migration, une route, une langue, ou relire un changement côté sécurité. Elles servent autant à un humain pressé qu'à un assistant, et elles répètent les garde-fous du projet : les chiffres viennent du moteur, jamais d'un modèle.

## Première version

La **0.1.0** est publiée, avec ses notes de version et ses images : [github.com/ECG-Rudy-Glt/COACH](https://github.com/ECG-Rudy-Glt/COACH).
