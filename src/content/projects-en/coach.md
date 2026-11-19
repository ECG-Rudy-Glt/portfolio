---
title: "COACH - Self-hosted open source sports coach"
category: perso
summary: "A self-hosted app for multisport training plans and nutrition suggestions: a deterministic rules engine that cites its sources, an optional LLM coach constrained by server-side validation, Garmin sync and an installable PWA. Free and open source (AGPL-3.0)."
period: "2026 - ongoing"
role: "Design, development, security, deployment and open source release, solo"
stack: ["Python", "FastAPI", "PostgreSQL", "JavaScript", "PWA", "Docker Compose", "Caddy", "GitHub Actions", "Kubernetes", "Ollama", "LLM / tool-calling", "Garmin Connect"]
tags: ["Full-stack", "AI / Conversational assistant", "Application security", "CI/CD", "Docker", "Self-hosting"]
links:
  repo: "https://github.com/ECG-Rudy-Glt/COACH"
  demo: "https://coach.gault-rudy.com"
  sandbox: "https://coach-demo.gault-rudy.com"
images: ["/projets/coach/home-light.png", "/projets/coach/plan-dark.png", "/projets/coach/nutrition-eco.png"]
featured: true
relevance: "majeur"
order: 1
---

## The need

I wanted an application able to handle my **sports tracking** without a subscription, and to get **personalised coaching advice cheaply**: that is the starting point of the project. Paid offers bill every month for tracking and advice that you can produce yourself, and "AI" apps often let a model invent training loads without saying where they come from.

So I set out to do the opposite: a tool I host at home, that keeps my health data, in which **every session is explained by a rule**, that stays useful without AI, and whose "coach" part costs a few euros a month at most (adjustable spending cap) or nothing at all with a local model.

## The solution

A web application installable on a phone (PWA, iPhone and Android):

- an **adaptive questionnaire** (about a hundred questions, asking only what the next decision needs);
- a **deterministic plan engine**: same data, same plan. 3-week build + 1 lighter week cycles, phases towards a goal (base, development, peak, taper), handling of injuries and blocked days;
- a **nutrition engine** (needs, targets, weight trend) and meal logging;
- a **library of 1,700+ exercises** (wger and free-exercise-db, author and licence displayed for each media item);
- **Garmin synchronisation** with automatic matching of completed and planned sessions;
- an **optional LLM coach** (weekly review, chat, notifications) that comments on the week without ever setting a number.

## Technical choices & architecture

- **The LLM is not the source of the numbers.** It explains and may *propose* a few bounded adjustments; the server validates them one by one (the cited rule must exist, the load can never increase, the session must be in the future and not yet processed). An out-of-bounds proposal is rejected with its reason. The context sent contains neither name nor email.
- **Sourced rules**: each rule has an identifier, an evidence level and a test; 60 publications (verified summaries, limits stated) are attached to them. The complete human review of this base remains to be done and is tracked in the repository's issues.
- **Interchangeable AI provider**: Anthropic, OpenAI, Gemini, Mistral, OpenRouter, Ollama (100% local model) or any OpenAI-compatible server, with a model catalogue and a **monthly spending cap** enforced server-side. Without a key, the application works without the AI part.
- **Clean Docker Compose**: PostgreSQL database on an *internal* Docker network (no route to the Internet), secrets mounted as files (`NAME_FILE`, nothing in the environment or in `docker inspect`), non-root read-only application container with all Linux capabilities dropped, automatic exercise import on first start, optional profiles (Caddy HTTPS, backups, Ollama).
- **Application security**: scrypt passwords, sessions in an HttpOnly cookie of which only the hash is stored, attempt limiting per address and per account, CSP with no inline script, rejection of cross-origin writes, strict per-user data isolation, image validation (magic bytes, size) and a host allowlist against SSRF, Garmin tokens encrypted at rest (the Garmin password is never kept).
- **Quality**: more than 160 tests (the engine and the API run without a database thanks to an in-memory repository, the PostgreSQL layer is tested in CI), lint, dependency audit and secret scanning on every PR.
- **Release**: a public repository starting from a fresh history after a secrets sweep, protected `main` (PR and CI required), GitHub Actions CI, multi-architecture images published to the GitHub registry on each tag, documentation in English (architecture with diagrams, configuration, exposure through VPN / Cloudflare Tunnel / ngrok, PWA installation, adding a data source or an AI provider) and an `AGENTS.md` guide with "skills" for contributing with a coding assistant.

## Result

Version **0.1.0** published on [GitHub](https://github.com/ECG-Rudy-Glt/COACH), with a roadmap of 24 issues (FIT file import for Coros and other watches, English interface, two-factor authentication, data export and deletion, human review of the rules). In daily use on my homelab (k3s, GitOps deployment) alongside the public version.

The application gives general suggestions and is neither a medical device nor dietary advice.

## Website and demo

The project has its own website, with documentation in French and English: [coach.gault-rudy.com](https://coach.gault-rudy.com). A **read-only demo**, with no sign-up and with fictional data, is available at [coach-demo.gault-rudy.com](https://coach-demo.gault-rudy.com): it runs on the latest published version of the application. The code is on [GitHub](https://github.com/ECG-Rudy-Glt/COACH). For the full reasoning, see the article [COACH: a self-hosted sports coach where every session is explained by a rule](/blog/coach/) (in French). The same principle of computed figures and AI that cites its sources is found in [Patrimoine](/en/projets/patrimoine/).
