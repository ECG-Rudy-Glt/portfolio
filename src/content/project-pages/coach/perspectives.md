---
project: coach
title: "Limites et perspectives"
summary: "Ce qui n'est pas fait ou pas validé, et ce qui vient ensuite : relecture humaine, anglais, autres montres, sécurité des comptes."
order: 9
---

## Ce qui n'est pas validé

**Les règles et les publications.** La base compte 60 publications dont les résumés ont été vérifiés, mais aucun texte complet n'a été relu par un spécialiste. Les règles sont une version 0. L'application le dit, et le ticket de relecture humaine est la priorité avant toute promotion plus large.

**Les plans eux-mêmes.** Ils sont cohérents avec les règles (c'est ce que les tests vérifient), pas prouvés bénéfiques pour un individu donné. D'où le message de prudence répété dans l'application et la documentation.

## Ce qui manque

- **L'interface est en français uniquement** (code, documentation et API sont en anglais). L'internationalisation, avec l'extraction des textes et un fichier de langue, est le plus gros frein à l'adoption.
- **Une seule marque de montre est branchée** (Garmin, via une bibliothèque non officielle). L'import de fichiers FIT ouvrirait Coros et les autres.
- **Pas de double authentification**, pas d'écran « mes appareils », pas encore d'export et de suppression des données depuis l'application.
- **Dette technique assumée** : le fichier JavaScript de l'interface dépasse 1 400 lignes et le dépôt de données 900 ; pas de tests de bout en bout de l'interface.

## Ce qui vient ensuite

1. Import de fichiers d'activité (Coros, Suunto, Polar, Apple Watch).
2. Interface en anglais.
3. Relecture humaine des règles et des publications, et comblement des manques (sortie longue, côte et descente, vélo, Hyrox).
4. Double authentification, export et suppression des données, sauvegardes chiffrées.
5. Tests de bout en bout de l'interface et audit d'accessibilité (VoiceOver, TalkBack, contrastes des trois thèmes).

## Ce que j'en retiens

Une règle de conception qui m'a servi partout : **tout ce qui touche à un chiffre appartient au code testable, pas au modèle**. Elle rend le projet moins spectaculaire qu'un « coach IA » qui improvise, et bien plus facile à auditer, à tester et à corriger.
