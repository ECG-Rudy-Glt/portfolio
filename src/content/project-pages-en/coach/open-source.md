---
project: coach
title: "Open source release"
summary: "History hygiene, decoupling from the homelab, licences, pull request workflow, issues and milestones: how a private project becomes a public one."
order: 8
---

## Why publish

I wanted the project to be useful to other people looking for the same thing as me: free tracking, affordable advice, data that stays at home. And I wanted it to show a way of working: security, documentation, tests, process.

## What had to be done beforehand

- **Sweep the history** for secrets, internal addresses, domain names and e-mails. No real secret, but traces of my infrastructure: the public repository therefore starts from a **fresh history**, and an export script fails if a private pattern reappears in the published tree.
- **Decouple from the homelab**: Kubernetes manifests moved into a generic example, configurable domains and registries, a self-hosting Docker Compose, documented environment variables.
- **Make the AI interchangeable** and the no-key degraded mode real.
- **Write the necessary notices**: a "neither a medical device nor dietary advice" disclaimer, a privacy notice, licences and attributions for each dataset (wger under CC-BY-SA, free-exercise-db, Inter font), a warning about the fragility of the Garmin connection.
- **Choose the licence**: AGPL-3.0, so that modified versions exposed as a service remain open.

## The workflow

`main` is protected: nobody, not even me, pushes to it directly. Everything goes through a branch (or a fork), a pull request with its template, a green CI (tests, Docker build, secret scan) and a squash merge. Issue forms distinguish a bug, a feature request, an integration request (watch, service, AI provider) and a correction to a rule or a publication. Dependency updates arrive as grouped monthly PRs.

## A public roadmap

Twenty-four labelled issues, spread across milestones: *v0.2.0* (watch brands, English interface), *v0.3.0* (two-factor authentication, data export and deletion, encrypted backups) and *Later*. Several are marked "good first issue".

## Contributing with a coding assistant

The repository contains an `AGENTS.md` file (non-negotiable rules, commands, conventions, definition of "done") and ten recipes (`skills/`): adding an AI provider, a data source, a rule, a publication, a question, a prompt, a migration, a route, a language, or reviewing a change from a security angle. They serve a busy human as much as an assistant, and they repeat the project's guardrails: the numbers come from the engine, never from a model.

## First release

**0.1.0** is published, with its release notes and images: [github.com/ECG-Rudy-Glt/COACH](https://github.com/ECG-Rudy-Glt/COACH).
