---
project: coach
title: "Data and integrations"
summary: "Adaptive questionnaire, exercise library, Garmin, FIT file import for Coros and other watches: how data comes in."
order: 6
---

## The adaptive questionnaire

About 100 questions spread over 13 domains (goals, running, trail, cycling, strength training, health, constraints, history…). A condition engine only asks what the next decision needs: someone who does not cycle never sees the cycling questions. Each answer becomes a timestamped fact, and a check at startup rejects any inconsistent question bank.

## The exercise library

More than 1,750 exercises merged from wger and free-exercise-db, plus a few in-house exercises, with the author and licence for each illustration. An automatic import loads them on the first start of the Docker stack and can be rerun without duplicates. Images are not redistributed: they are fetched on demand, from an allowlist of hosts, and cached.

## Garmin

The connection goes through an unofficial library: the user enters their credentials (and an MFA code if needed), only the resulting tokens are kept, encrypted. A synchronisation (every 6 hours by default) fetches two years of activities on first connection and then a rolling month, with resting heart rate, VO2max, estimated times and training load. Recent activities are matched with planned sessions (same day, compatible sport, closest duration) and validate them without ever overwriting what the user entered.

## Coros and other brands

Coros does not offer an API to individuals, so there is nothing to plug in as there is for Garmin. The route chosen is the **import of activity files** (FIT, TCX, GPX), which Coros, Suunto, Polar, Wahoo or Apple Watch can all export. A single adapter would therefore open the project to all brands: it is the priority of the next version, described in an issue and in the integration guide (`docs/integrations.md`), which also explains how to add a source or a service from A to Z.

## A simple contract for adding a source

A source must produce normalised activity rows (sport, duration, distance, elevation gain, heart rate, calories, load; unknown = absent, never zero) and daily measurements. Everything else (matching with the plan, history, coach context) reads these rows through the repository interface. The repository provides a step-by-step procedure for a contributor or a coding assistant (`skills/add-activity-source`).
