---
project: coach
title: "Architecture"
summary: "A single FastAPI process, one PostgreSQL database, a PWA served by the same process: why so simple, and how the components talk to each other."
order: 2
---

## Starting point: the simplest thing that holds up

A FastAPI application (API, rules engine, the PWA's static files) and a PostgreSQL database. No message bus, no task queue, no build step on the interface side: native JavaScript, validated by a strict CSP policy. Background tasks (Garmin sync, notifications) are plain threads, idle until you enable them. A single instance is enough for personal or family use, and that is what the project aims for.

<pre class="mermaid">
flowchart LR
    PHONE["Phone<br/>installed PWA"]
    PROXY["HTTPS proxy<br/>(optional)"]
    APP["FastAPI application<br/>rules engines - API - PWA"]
    DB[("PostgreSQL")]
    LLM["AI provider<br/>(optional)"]
    WATCH["Garmin Connect<br/>(optional)"]
    PHONE --> PROXY --> APP
    APP --- DB
    APP -.-> LLM
    APP -.-> WATCH
</pre>

## The engines are pure functions

The plan (`app/plan`) and nutrition (`app/nutrition`) take *facts* and *goals* as input and return sessions or targets. No database access, no hidden date, no randomness: the same profile always gives the same plan, which makes them testable with nothing more than dictionaries.

## An in-memory repository for tests

All writes go through a `Repo` interface implemented twice: in memory (tests, demo) and in PostgreSQL (production). The test suite, more than 160 tests, runs without a database; the SQL layer is tested separately, against a real PostgreSQL, in CI.

## Facts rather than columns

Questionnaire answers become timestamped *facts* (JSONB value). A long career history, a list of injuries or past performances fit in without any extra schema, with PostgreSQL keeping transactions and a single backup. I did not add a NoSQL or vector database: it would have doubled the surface to back up and protect for health data, without anything that JSONB does not cover here.

## From questionnaire to plan

<pre class="mermaid">
flowchart LR
    Q["Questionnaire"] --> F["Facts"]
    G["Goals and target event"] --> P
    F --> P["Profile"]
    P --> C["Cycle<br/>3 weeks build + 1 lighter<br/>base - development - peak - taper"]
    C --> W["Week of sessions<br/>cited rules"]
    W --> U["Session feedback<br/>(or Garmin)"]
    U --> P
</pre>

Only **one week** is generated at a time, after reading the feedback from the previous one: the plan adapts instead of drifting.

## An interface designed for the phone

An installable application (PWA) with an offline shell, three themes (light, dark and a black-and-white "eco" theme), notifications through Web Push, ntfy or e-mail. The screenshots on the [project page](/en/projets/coach/) come from a demo instance fed by a fictional persona.
