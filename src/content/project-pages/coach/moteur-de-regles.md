---
project: coach
title: "Le moteur de règles"
summary: "Comment un plan se construit sans modèle de langage : cycles, règles à identifiant, niveau de preuve, tests, et publications rattachées."
order: 3
---

## Principe

Le moteur est **déterministe** : mêmes faits, même plan. Chaque règle a un **identifiant**, une valeur, un **niveau de preuve** (A solide, B modéré, C pratique de terrain) et un effet vérifiable par un test. Chaque séance du plan liste les règles qu'elle applique, et l'interface les affiche. En cas de doute (donnée manquante, blessure, signal d'alerte), le moteur **réduit** plutôt que d'extrapoler.

## Ce que le moteur décide

- **Le cycle** : blocs de 3 semaines de montée suivies d'une semaine allégée (2+1 après 45 ans, après une reprise ou si les retours se dégradent), puis des phases vers l'épreuve cible : base, développement, pic de forme, affûtage.
- **La répartition de la semaine** : une séance de qualité au plus, sortie longue plafonnée en part du volume, un jour de repos au minimum, jours bloqués par l'utilisateur respectés, jambes jamais la veille d'une séance clé.
- **Les séances de musculation** : créneaux par schéma de mouvement (poussée, tirage, jambes…) remplis par des exercices de la bibliothèque, charges et séries qui progressent d'un bloc à l'autre.
- **La nutrition** : dépense estimée (équation de Mifflin-St Jeor), cible calorique selon l'objectif et la charge du jour, protéines et glucides, et lecture de la tendance de poids pour ajuster.

## Des règles qui renvoient à des publications

Les règles sont liées à une base de 60 publications (`data/evidence/`). Chaque entrée garde la référence (DOI, PMID), le résultat tel que rapporté dans le résumé, ses **limites** (taille d'échantillon, population, durée) et un niveau de confiance. Quelques exemples de rattachements :

- la **répartition de l'intensité** (environ 80 % facile, 20 % dur) s'appuie sur des revues et essais sur l'entraînement polarisé ;
- la **progression du volume** et l'usage du **ratio charge aiguë/chronique** sont rattachés à des études qui en montrent surtout les limites : la base les cite pour cela, pas pour les présenter comme des certitudes ;
- l'**affûtage** s'appuie sur une méta-analyse et une revue systématique ;
- l'**estimation d'un repas par IA** est rattachée à des études qui en montrent l'imprécision, d'où des calories présentées comme des estimations (≈).

Quand la preuve est faible, c'est écrit dans la fiche : le choix devient alors une pratique de terrain prudente, pas un résultat établi.

## Comment une règle entre dans le moteur

1. Elle est écrite dans `docs/rules.md` avec son identifiant, sa valeur et son niveau de preuve, puis copiée dans un résumé que le coach LLM a le droit de citer.
2. Elle est implémentée dans une fonction pure, avec une valeur par défaut prudente quand les données manquent.
3. Elle a un test pour le cas nominal, les bornes et le cas où elle ne doit pas se déclencher. Un test vérifie aussi que le document de règles et le résumé ne divergent pas.

## Ce qui reste à faire

Les résumés des publications ont été vérifiés (titre, revue, DOI/PMID, résultat), mais **pas les textes complets**, et aucune relecture humaine spécialisée n'a été faite. Les règles sont une version 0. C'est écrit dans le dépôt, et c'est un ticket ouvert.
