---
project: parcours-platform-harness
title: "P1 — Platform as a product"
summary: "Treat the platform as a product: users, contract, metrics, maturity."
order: 1
---

## Goals
- Identify the platform's users, their journeys and their pain points.
- Write a charter: scope, contract, what is out of scope.
- Position a platform on the CNCF maturity model.
- Choose adoption and DevEx metrics.

## Key concepts
Team Topologies (stream-aligned / platform / enabling), cognitive load, Thinnest Viable Platform, X-as-a-Service, golden path vs golden cage, voluntary adoption, DORA, SPACE.

## Sources
- 🟢 [CNCF — Platforms white paper](https://tag-app-delivery.cncf.io/whitepapers/platforms/)
- 🟢 [CNCF — Platform Engineering Maturity Model](https://tag-app-delivery.cncf.io/whitepapers/platform-eng-maturity-model/)
- 🟢 [internaldeveloperplatform.org](https://internaldeveloperplatform.org/)
- 🔵 [platformengineering.org — blog & talks](https://platformengineering.org/blog)
- 🔵 [DORA — research & quick check](https://dora.dev/)
- 📕 *Team Topologies*, Skelton & Pais (IT Revolution, 1st ed. 2019; **2nd ed. 2025**, with Ruth Malan)
- 📕 *Platform Engineering: A Guide for Technical, Product, and People Leaders*, Camille Fournier & Ian Nowland (O'Reilly, Oct. 2024)
- 📕 *Accelerate*, Forsgren, Humble & Kim (IT Revolution, 2018)
- 🟢 [Evan Bottcher — What I Talk About When I Talk About Platforms](https://martinfowler.com/articles/talk-about-platforms.html) (martinfowler.com, Mar. 2018): the reference definition, a platform is a self-service internal product that *"cannot stand on a mandate alone"*
- 🟢 [DORA — State of AI-assisted Software Development 2025](https://dora.dev/research/2025/dora-report/): AI acts as an **amplifier** of the organisation's existing strengths and weaknesses
- 🔵 [The SPACE of Developer Productivity](https://queue.acm.org/detail.cfm?id=3454124) (Forsgren, Storey et al., ACM Queue, 2021): five dimensions, no single metric
- 🔵 [DevEx: What Actually Drives Productivity](https://queue.acm.org/detail.cfm?id=3595878) (Noda, Storey, Forsgren, Greiler, ACM Queue, 2023): feedback loops, cognitive load, flow state
- 🎧 🇫🇷 [IFTTD #379 — Productivité sans IA, with Bastien Albertus](https://www.ifttd.io/episodes/productivite-sans-ia) (in French): the productivity myth
- 🎧 🇫🇷 [IFTTD #346 — IA & DevX, with Jocelyn N'takpe](https://www.ifttd.io/episodes/ia-devx) (in French): assisted code, preserved human value
- 📕 *Platform Strategy*, Gregor Hohpe ([Leanpub](https://leanpub.com/platformstrategy), continuously updated)

## Homelab lab

**L-P1 — Homelab platform charter**

**Goal**: treat the homelab as a product whose users are: me as a developer, the family members who use the apps every day, freelance clients, and soon agents.

### Steps
1. List the personas and, for each one, the current journey: how does an app reach prod today? Time how long it took to add the last app (sport-coach or freelance).
2. Assess each aspect of the [CNCF maturity model](https://tag-app-delivery.cncf.io/whitepapers/platform-eng-maturity-model/) (Investment, Adoption, Interfaces, Operations, Measurement) with evidence.
3. Write `HOMELAB/Documentation/plateforme/charte.md`: mission, scope, contract (what the platform guarantees), out of scope, metrics.
4. Choose 3 metrics and their source (e.g. time to onboard an app, Flux deploy frequency, number of manual steps in `DID.md`).

### Deliverable
Charter + maturity table, as a PR in `HOMELAB`.

## Validation
- [ ] I can explain the difference between a platform and a collection of tools.
- [ ] My homelab is positioned on the 5 aspects of the maturity model, with a justification.
- [ ] The charter exists and names at least 2 real personas.
- [ ] I have chosen 3 metrics and I know how to collect them.
