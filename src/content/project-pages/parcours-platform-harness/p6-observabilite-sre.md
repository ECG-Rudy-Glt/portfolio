---
project: parcours-platform-harness
title: "P6 : Observabilité & SRE"
summary: "SLO, error budgets, DORA et post-mortems qui ferment leurs actions."
group: "Track Platform"
order: 6
---

## Objectifs
- Définir des SLI/SLO, des error budgets et des alertes multi-burn-rate.
- Instrumenter avec OpenTelemetry (traces, métriques, logs).
- Mesurer DORA sur sa propre delivery.
- Écrire des post-mortems sans blâme et en tirer des actions.

## Concepts clés
SLI/SLO/SLA, burn rate, alerting sur symptômes plutôt que sur causes, OTel Collector, RED/USE, cardinalité, DORA (deployment frequency, lead time, change failure rate, time to restore).

## Sources
- 🟢 [Google SRE books (en ligne, gratuits)](https://sre.google/books/), en priorité les chapitres SLO, Alerting on SLOs et Postmortem Culture
- 🟢 [OpenTelemetry docs](https://opentelemetry.io/docs/)
- 🔵 [Sloth, génération de SLO Prometheus](https://sloth.dev/)
- 🔵 [DORA metrics guide](https://dora.dev/guides/dora-metrics-four-keys/)
- 📕 *Observability Engineering*, Majors, Fong-Jones & Miranda (O'Reilly, 2022 ; 2e éd. avec des chapitres sur les LLM)
- 🎧 🇫🇷 [IFTTD #355 : SRE et DevOps : la prod relax, avec Kevin Davin (6 mai 2026)](https://www.ifttd.io/episodes/sre-et-devops) : error budget, modèle déclaratif, responsabilité partagée du run

## Lab homelab

**L-P6 : SLO & DORA du homelab**

### Étapes
1. Définir les SLI de patrimoine et sport-coach : disponibilité (Blackbox) et latence (Traefik metrics).
2. Générer les règles avec Sloth : alertes multi-window multi-burn-rate dans Alertmanager.
3. Ajouter un canal d'alerte hors bande (ntfy, déjà auto-hébergé) pour lever la limite « alerting dépendant du SMTP ».
4. DORA : collecter les déploiements (commits `deploy: images` + événements Flux), le lead time (commit → rollout) et les échecs (rollbacks, post-mortems). Construire un dashboard Grafana.
5. Revoir les actions des 3 post-mortems existants : lesquelles sont fermées ?

### Livrable
SLO en prod, dashboard DORA, revue des actions post-mortem.

## Validation
- [ ] 2 apps ont des SLO avec alertes burn-rate.
- [ ] Un tableau de bord DORA est alimenté par Forgejo et Flux.
- [ ] Le dernier post-mortem a des actions suivies jusqu'à leur fermeture.
