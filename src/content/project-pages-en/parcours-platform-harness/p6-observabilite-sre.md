---
project: parcours-platform-harness
title: "P6 — Observability & SRE"
summary: "SLOs, error budgets, DORA and post-mortems that close their actions."
order: 6
---

## Goals
- Define SLIs/SLOs, error budgets and multi-burn-rate alerts.
- Instrument with OpenTelemetry (traces, metrics, logs).
- Measure DORA on your own delivery.
- Write blameless post-mortems and turn them into actions.

## Key concepts
SLI/SLO/SLA, burn rate, alerting on symptoms rather than causes, OTel Collector, RED/USE, cardinality, DORA (deployment frequency, lead time, change failure rate, time to restore).

## Sources
- 🟢 [Google SRE books (online, free)](https://sre.google/books/), starting with the SLO, Alerting on SLOs and Postmortem Culture chapters
- 🟢 [OpenTelemetry docs](https://opentelemetry.io/docs/)
- 🔵 [Sloth — Prometheus SLO generation](https://sloth.dev/)
- 🔵 [DORA metrics guide](https://dora.dev/guides/dora-metrics-four-keys/)
- 📕 *Observability Engineering*, Majors, Fong-Jones & Miranda (O'Reilly, 2022; 2nd ed. with chapters on LLMs)
- 🎧 🇫🇷 [IFTTD #355 — SRE et DevOps, with Kevin Davin (May 6, 2026)](https://www.ifttd.io/episodes/sre-et-devops) (in French): error budgets, declarative model, shared run responsibility

## Homelab lab

**L-P6 — Homelab SLOs & DORA**

### Steps
1. Define the SLIs for patrimoine and sport-coach: availability (Blackbox) and latency (Traefik metrics).
2. Generate the rules with Sloth: multi-window, multi-burn-rate alerts in Alertmanager.
3. Add an out-of-band alerting channel (ntfy, already self-hosted) to remove the "alerting depends on SMTP" limitation.
4. DORA: collect deployments (`deploy: images` commits + Flux events), lead time (commit → rollout) and failures (rollbacks, post-mortems). Build a Grafana dashboard.
5. Review the actions of the 3 existing post-mortems: which ones are closed?

### Deliverable
SLOs in prod, DORA dashboard, post-mortem action review.

## Validation
- [ ] 2 apps have SLOs with burn-rate alerts.
- [ ] A DORA dashboard is fed by Forgejo and Flux.
- [ ] The latest post-mortem has actions tracked through to closure.
