---
project: coach
title: "Bibliography and technologies"
summary: "A few of the publications the rules rely on, and the list of technologies used."
order: 10
---

The full base of 60 publications, with the reported result, the limitations and the confidence level of each, is in the repository: [`data/evidence/`](https://github.com/ECG-Rudy-Glt/COACH/tree/main/data/evidence). The abstracts were checked, not the full texts. Here are a few selected references.

## Endurance training

- Seiler S (2010). *What is best practice for training intensity and duration distribution in endurance athletes?* Int J Sports Physiol Perform.
- Stöggl T, Sperlich B (2014). *Polarized training has greater impact on key endurance variables than threshold, high intensity, or high volume training.* Front Physiol.
- Impellizzeri FM, Tenan MS, Kempton T, Novak A, Coutts AJ (2020). *Acute:chronic workload ratio: conceptual issues and fundamental pitfalls.* (cited for its limitations)
- Bosquet L, Montpetit J, Arvisais D, Mujika I (2007). *Effects of tapering on performance: a meta-analysis.* Med Sci Sports Exerc.

## Strength and concurrent training

- Schoenfeld BJ, Ogborn D, Krieger JW (2017). *Dose-response relationship between weekly resistance training volume and increases in muscle mass.* J Sports Sci.
- Schoenfeld BJ, Grgic J, Ogborn D, Krieger JW (2017). *Strength and hypertrophy adaptations between low- vs. high-load resistance training.*
- Schumann M, Feuerbacher JF, et al. (2022). *Compatibility of concurrent aerobic and strength training for skeletal muscle size and function.*

## Nutrition

- Mifflin MD, St Jeor ST, et al. (1990). *A new predictive equation for resting energy expenditure in healthy individuals.* Am J Clin Nutr.
- Morton RW, Murphy KT, et al. (2018). *A systematic review, meta-analysis and meta-regression of the effect of protein supplementation on resistance training-induced gains in muscle mass and strength.* Br J Sports Med.
- Garthe I, Raastad T, et al. (2011). *Effect of two different weight-loss rates on body composition and strength and power-related performance in elite athletes.*
- O'Hara C, Kent G, et al. (2025). *An evaluation of ChatGPT for nutrient content estimation from meal photographs.* (cited for the imprecision of AI estimates)

## Recovery

- Saw AE, Main LC, Gastin PB (2016). *Monitoring the athlete training response: subjective self-reported measures trump commonly used objective measures.* Br J Sports Med.

## Technologies

**Application**: Python 3.12, FastAPI, Pydantic, PostgreSQL 16 (psycopg), native JavaScript and PWA (service worker, Web Push), PyYAML, cryptography (Fernet).
**AI**: Anthropic API, OpenAI, Gemini, Mistral, OpenRouter, Ollama, any OpenAI-compatible server.
**Data**: wger, free-exercise-db, Garmin Connect (garminconnect library), PubMed and Europe PMC for reference verification.
**Deployment**: Docker and Docker Compose, Caddy, Kubernetes (k3s) with Flux in personal production.
**Quality**: pytest, ruff, pip-audit, Gitleaks, GitHub Actions, Dependabot, Playwright (demo screenshots).
