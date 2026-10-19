---
project: coach
title: "Bibliographie et technologies"
summary: "Quelques-unes des publications sur lesquelles reposent les règles, et la liste des technologies utilisées."
order: 10
---

La base complète de 60 publications, avec le résultat rapporté, les limites et le niveau de confiance de chacune, est dans le dépôt : [`data/evidence/`](https://github.com/ECG-Rudy-Glt/COACH/tree/main/data/evidence). Les résumés ont été vérifiés, pas les textes complets. Voici quelques références choisies.

## Entraînement d'endurance

- Seiler S (2010). *What is best practice for training intensity and duration distribution in endurance athletes?* Int J Sports Physiol Perform.
- Stöggl T, Sperlich B (2014). *Polarized training has greater impact on key endurance variables than threshold, high intensity, or high volume training.* Front Physiol.
- Impellizzeri FM, Tenan MS, Kempton T, Novak A, Coutts AJ (2020). *Acute:chronic workload ratio: conceptual issues and fundamental pitfalls.* (cité pour ses limites)
- Bosquet L, Montpetit J, Arvisais D, Mujika I (2007). *Effects of tapering on performance: a meta-analysis.* Med Sci Sports Exerc.

## Musculation et entraînement combiné

- Schoenfeld BJ, Ogborn D, Krieger JW (2017). *Dose-response relationship between weekly resistance training volume and increases in muscle mass.* J Sports Sci.
- Schoenfeld BJ, Grgic J, Ogborn D, Krieger JW (2017). *Strength and hypertrophy adaptations between low- vs. high-load resistance training.*
- Schumann M, Feuerbacher JF, et al. (2022). *Compatibility of concurrent aerobic and strength training for skeletal muscle size and function.*

## Nutrition

- Mifflin MD, St Jeor ST, et al. (1990). *A new predictive equation for resting energy expenditure in healthy individuals.* Am J Clin Nutr.
- Morton RW, Murphy KT, et al. (2018). *A systematic review, meta-analysis and meta-regression of the effect of protein supplementation on resistance training-induced gains in muscle mass and strength.* Br J Sports Med.
- Garthe I, Raastad T, et al. (2011). *Effect of two different weight-loss rates on body composition and strength and power-related performance in elite athletes.*
- O'Hara C, Kent G, et al. (2025). *An evaluation of ChatGPT for nutrient content estimation from meal photographs.* (cité pour l'imprécision des estimations par IA)

## Récupération

- Saw AE, Main LC, Gastin PB (2016). *Monitoring the athlete training response: subjective self-reported measures trump commonly used objective measures.* Br J Sports Med.

## Technologies

**Application** : Python 3.12, FastAPI, Pydantic, PostgreSQL 16 (psycopg), JavaScript natif et PWA (service worker, Web Push), PyYAML, cryptography (Fernet).
**IA** : API Anthropic, OpenAI, Gemini, Mistral, OpenRouter, Ollama, tout serveur compatible OpenAI.
**Données** : wger, free-exercise-db, Garmin Connect (bibliothèque garminconnect), PubMed et Europe PMC pour la vérification des références.
**Déploiement** : Docker et Docker Compose, Caddy, Kubernetes (k3s) avec Flux en production personnelle.
**Qualité** : pytest, ruff, pip-audit, Gitleaks, GitHub Actions, Dependabot, Playwright (captures d'écran de démonstration).
