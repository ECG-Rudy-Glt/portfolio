---
project: parcours-platform-harness
title: "P1 — Platform as a product"
summary: "Traiter la plateforme comme un produit : utilisateurs, contrat, métriques, maturité."
order: 1
---

## Objectifs
- Définir les utilisateurs de la plateforme, leurs parcours et leurs irritants.
- Rédiger une charte : périmètre, contrat, ce qui est hors périmètre.
- Situer une plateforme sur le modèle de maturité CNCF.
- Choisir des métriques d'adoption et de DevEx.

## Concepts clés
Team Topologies (stream-aligned / platform / enabling), charge cognitive, Thinnest Viable Platform, X-as-a-Service, golden path et golden cage, adoption volontaire, DORA, SPACE.

## Sources
- 🟢 [CNCF — Platforms white paper](https://tag-app-delivery.cncf.io/whitepapers/platforms/)
- 🟢 [CNCF — Platform Engineering Maturity Model](https://tag-app-delivery.cncf.io/whitepapers/platform-eng-maturity-model/)
- 🟢 [internaldeveloperplatform.org](https://internaldeveloperplatform.org/)
- 🔵 [platformengineering.org — blog & talks](https://platformengineering.org/blog)
- 🔵 [DORA — research & quick check](https://dora.dev/)
- 📕 *Team Topologies*, Skelton & Pais (IT Revolution, 1re éd. 2019 ; **2e éd. 2025**, avec Ruth Malan)
- 📕 *Platform Engineering: A Guide for Technical, Product, and People Leaders*, Camille Fournier & Ian Nowland (O'Reilly, oct. 2024)
- 📕 *Accelerate*, Forsgren, Humble & Kim (IT Revolution, 2018)
- 🟢 [Evan Bottcher — What I Talk About When I Talk About Platforms](https://martinfowler.com/articles/talk-about-platforms.html) (martinfowler.com, mars 2018) : la définition de référence, une plateforme est un produit interne en self-service, qui *« ne peut pas reposer sur un mandat seul »*
- 🟢 [DORA — State of AI-assisted Software Development 2025](https://dora.dev/research/2025/dora-report/) : l'IA agit comme un **amplificateur** des forces et faiblesses existantes de l'organisation
- 🔵 [The SPACE of Developer Productivity](https://queue.acm.org/detail.cfm?id=3454124) (Forsgren, Storey et al., ACM Queue, 2021) : cinq dimensions, aucune métrique unique
- 🔵 [DevEx: What Actually Drives Productivity](https://queue.acm.org/detail.cfm?id=3595878) (Noda, Storey, Forsgren, Greiler, ACM Queue, 2023) : boucles de feedback, charge cognitive, état de flow
- 🎧 🇫🇷 [IFTTD #379 — Productivité sans IA : le mythe de la productivité, avec Bastien Albertus](https://www.ifttd.io/episodes/productivite-sans-ia)
- 🎧 🇫🇷 [IFTTD #346 — IA & DevX : code assisté, valeur humaine préservée, avec Jocelyn N'takpe](https://www.ifttd.io/episodes/ia-devx)
- 📕 *Platform Strategy*, Gregor Hohpe ([Leanpub](https://leanpub.com/platformstrategy), mis à jour en continu)

## Lab homelab

**L-P1 — Charte de la plateforme homelab**

**But** : traiter le homelab comme un produit dont les utilisateurs sont : moi en dev, mes proches qui utilisent les apps au quotidien, les clients freelance, et bientôt des agents.

### Étapes
1. Lister les personas et, pour chacun, le parcours actuel : comment une app arrive-t-elle en prod aujourd'hui ? Chronométrer l'ajout de la dernière app (sport-coach ou freelance).
2. Évaluer chaque aspect du [modèle de maturité CNCF](https://tag-app-delivery.cncf.io/whitepapers/platform-eng-maturity-model/) (Investment, Adoption, Interfaces, Operations, Measurement) avec une preuve.
3. Rédiger `HOMELAB/Documentation/plateforme/charte.md` : mission, périmètre, contrat (ce que la plateforme garantit), hors périmètre, métriques.
4. Choisir 3 métriques et leur source (ex. temps d'onboarding d'une app, deploy frequency Flux, nombre de gestes manuels dans `DID.md`).

### Livrable
Charte + tableau de maturité, en PR dans `HOMELAB`.

## Validation
- [ ] Je peux expliquer la différence entre une plateforme et un ensemble d'outils.
- [ ] Mon homelab est positionné sur les 5 aspects du modèle de maturité, avec une justification.
- [ ] La charte existe et nomme au moins 2 personas réels.
- [ ] J'ai choisi 3 métriques, et je sais comment les collecter.
