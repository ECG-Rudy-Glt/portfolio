---
title: "Patrimoine - Self-hosted wealth tracking with a sourced AI advisor"
category: perso
summary: "A self-hosted wealth tracking app for a household: accounts aggregated through the official PSD2 APIs, budget, investments, taxes, alerts and reports, with figures computed by deterministic services and an AI advisor whose every citation is verified by the server. Open source (Apache 2.0), under construction."
period: "2026 - ongoing"
role: "Design, development, security, deployment and open source release, solo"
stack: ["Python", "FastAPI", "PostgreSQL", "React", "Grafana", "Docker Compose", "Enable Banking (PSD2)", "LLM / Claude (Anthropic)", "ntfy", "Home Assistant"]
tags: ["Full-stack", "AI / Conversational assistant", "Application security", "Docker", "Self-hosting"]
links:
  repo: "https://github.com/ECG-Rudy-Glt/PATRIMOINE"
  demo: "https://patrimoine-open.gault-rudy.com"
  sandbox: "https://patrimoine-demo.gault-rudy.com"
featured: false
relevance: "pertinent"
order: 4
images: ["/projets/patrimoine/tableau-de-bord.webp", "/projets/patrimoine/budget.webp"]
---

## The need

Track a household's entire wealth (current accounts, savings, life insurance, stocks, crypto, real estate) without entrusting the data to a third-party service, and receive savings and allocation advice without a language model inventing figures.

## The solution

- **Accounts** aggregated through the official PSD2 APIs via Enable Banking (read-only, free restricted access to your own accounts); banking credentials are never stored.
- **Budget**: rule-based categorisation, pay cycle, amount available to save; **savings goals**.
- **Investments**: positions, cost basis, allocation against target, tax filter, cost of fees.
- **Taxes**: LEP eligibility, PER ceiling, seniority of life insurance and PEA.
- **Alerts** (low balance, ntfy, web notification, Home Assistant) and **reports** (monthly e-mail digest at each payday, Excel workbook).
- **Household**: several people, per-account share.

## Technical choices & architecture

- **The LLM invents no figures.** The advisor receives figures identified by a key and produces recommendations in JSON; the server checks each citation and rejects those that are made up. Estimates are marked "≈".
- **Python services (FastAPI)**: ledger, budget-engine, allocation-engine, advisor, reporting, ingestion-bank, ingestion-market, around PostgreSQL, with a React interface and Grafana, all in Docker Compose.
- **AI model**: Claude (Anthropic) today; support for other models, online or local, is under way and not yet available.

## Result and limitations

Public repository since 6 November 2026, Apache 2.0 licence, used by its author. The project is **open and under construction**: the interface and schemas may still change. The application has **no built-in authentication** (to be placed behind a reverse proxy that authenticates) and **does not encrypt data at rest**: these protections are the responsibility of the installation.

For the full reasoning, see the article [Tracking your wealth self-hosted: reliable figures and an AI that cites its sources](/blog/patrimoine/) (in French). Along the same lines: [COACH](/en/projets/coach/) (sports coach, same principle of sourced rules) and [Relai](/en/projets/relai/).

## Website and demo

Project website: [patrimoine-open.gault-rudy.com](https://patrimoine-open.gault-rudy.com). Interactive demo with fictional data: [patrimoine-demo.gault-rudy.com](https://patrimoine-demo.gault-rudy.com). Code: [GitHub](https://github.com/ECG-Rudy-Glt/PATRIMOINE).
