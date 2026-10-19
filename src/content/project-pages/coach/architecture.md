---
project: coach
title: "Architecture"
summary: "Un seul processus FastAPI, une base PostgreSQL, une PWA servie par le même processus : pourquoi aussi simple, et comment les composants se parlent."
order: 2
---

## Choix de départ : le plus simple qui tienne

Une application FastAPI (API, moteur de règles, fichiers statiques de la PWA) et une base PostgreSQL. Pas de bus de messages, pas de file de tâches, pas d'étape de build côté interface : du JavaScript natif, validé par une politique CSP stricte. Les tâches de fond (synchronisation Garmin, notifications) sont de simples threads, inactifs tant qu'on ne les active pas. Une seule instance suffit pour un usage personnel ou familial, et c'est ce que le projet vise.

<pre class="mermaid">
flowchart LR
    PHONE["Téléphone<br/>PWA installée"]
    PROXY["Proxy HTTPS<br/>(optionnel)"]
    APP["Application FastAPI<br/>moteurs de règles - API - PWA"]
    DB[("PostgreSQL")]
    LLM["Fournisseur d'IA<br/>(optionnel)"]
    WATCH["Garmin Connect<br/>(optionnel)"]
    PHONE --> PROXY --> APP
    APP --- DB
    APP -.-> LLM
    APP -.-> WATCH
</pre>

## Les moteurs sont des fonctions pures

Le plan (`app/plan`) et la nutrition (`app/nutrition`) prennent des *faits* et des *objectifs* en entrée et renvoient des séances ou des cibles. Pas d'accès base, pas de date cachée, pas d'aléatoire : le même profil donne toujours le même plan, ce qui les rend testables sans rien d'autre que des dictionnaires.

## Un dépôt en mémoire pour les tests

Toutes les écritures passent par une interface `Repo` implémentée deux fois : en mémoire (tests, démonstration) et en PostgreSQL (production). La suite de tests, plus de 160 tests, tourne sans base ; la couche SQL est testée à part, contre un vrai PostgreSQL, dans la CI.

## Les faits plutôt que des colonnes

Les réponses au questionnaire deviennent des *faits* horodatés (valeur JSONB). Un parcours long, une liste de blessures ou des performances passées s'y rangent sans schéma supplémentaire, PostgreSQL gardant transactions et sauvegarde unique. Je n'ai pas ajouté de base NoSQL ou vectorielle : elle aurait doublé la surface à sauvegarder et à protéger pour des données de santé, sans rien que JSONB ne couvre ici.

## Du questionnaire au plan

<pre class="mermaid">
flowchart LR
    Q["Questionnaire"] --> F["Faits"]
    G["Objectifs et épreuve cible"] --> P
    F --> P["Profil"]
    P --> C["Cycle<br/>3 semaines de montée + 1 allégée<br/>base - développement - pic - affûtage"]
    C --> W["Semaine de séances<br/>règles citées"]
    W --> U["Retours de séance<br/>(ou Garmin)"]
    U --> P
</pre>

Une **seule semaine** est générée à la fois, après lecture des retours de la précédente : le plan s'adapte au lieu de dériver.

## Une interface pensée pour le téléphone

Application installable (PWA) avec coquille hors ligne, trois thèmes (clair, sombre et « éco » en noir et blanc), notifications par Web Push, ntfy ou e-mail. Les captures de la [page du projet](/projets/coach/) viennent d'une instance de démonstration alimentée par un persona fictif.
