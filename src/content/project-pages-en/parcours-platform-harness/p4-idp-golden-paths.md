---
project: parcours-platform-harness
title: "P4 — Internal Developer Portal & golden paths"
summary: "Backstage and a golden path: a new app in prod in under 15 minutes."
order: 4
---

## Goals
- Set up a software catalog: owners, dependencies, documentation.
- Offer a "new app → in prod" golden path in under 15 minutes, with no ticket.
- Tell the portal (UI) apart from the orchestrator (platform backend).

## Key concepts
Backstage (catalog, software templates, TechDocs, plugins), scorecards, entity model (Component, System, API, Resource), templates vs abstractions, Score.dev.

## Sources
- 🟢 [Backstage — the project (GitHub, CNCF *incubating* project)](https://github.com/backstage/backstage): read `ADOPTERS.md`, `plugins/` and `docs/`
- 🟢 [Backstage docs](https://backstage.io/docs/overview/what-is-backstage)
- 🟢 [Backstage — Software Templates](https://backstage.io/docs/features/software-templates/)
- 🔵 [Score specification](https://score.dev/)
- 🔵 [Spotify — How we use golden paths](https://engineering.atspotify.com/2020/08/how-we-use-golden-paths-to-solve-fragmentation-in-our-software-ecosystem)
- 📕 *Software Engineering at Google*, Winters, Manshreck & Wright ([free online](https://abseil.io/resources/swe-book)): shared tooling, build, CI at scale

## Homelab lab

**L-P4 — Golden path & Backstage**

**Goal**: "new app → HTTPS URL in prod" in under 15 minutes, without editing the `HOMELAB` repo by hand.

### Steps
1. Deploy [Backstage](https://github.com/backstage/backstage) into `lab-backstage`, with Authentik OIDC auth and a Postgres database.
2. Write a `catalog-info.yaml` for each app (patrimoine, sport-coach, freelance, media, speedtest) and for the infra (OpenBao, Flux, Prometheus).
3. Create a Software Template that creates the Forgejo repo from a skeleton (Dockerfile, CI, `App` from lab L-P2), then opens the Flux PR in `HOMELAB`.
4. Publish TechDocs from `HOMELAB/Documentation`.
5. Time the journey, and compare it with the measurement taken in L-P1.

### Deliverable
Backstage online, complete catalog, working template, before/after measurement.

## Validation
- [ ] Every homelab app is in the catalog, with an owner and a link to its repo.
- [ ] The template creates the repo, the CI, the manifests and the Flux Kustomization, and the app answers over HTTPS.
- [ ] I have timed the journey and noted the friction points.
