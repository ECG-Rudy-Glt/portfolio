---
project: parcours-platform-harness
title: "P3 — IaC & control planes"
summary: "De Terraform lancé à la main à une API déclarative réconciliée en continu."
order: 3
---

## Objectifs
- Passer de « Terraform lancé à la main » à une **API déclarative réconciliée en continu**.
- Concevoir des abstractions : modules, compositions, XRD.
- Gérer l'état, la dérive et les secrets proprement.

## Concepts clés
State et locking, drift detection, modules versionnés, Crossplane v2 (projet CNCF *graduated*, composition : XRD, Composition, composition Functions en YAML/KCL/Python/Go), modèle de Kratix (Promises), Terraform contre control plane, OpenTofu.

## Sources
- 🟢 [Crossplane — What's Crossplane](https://docs.crossplane.io/latest/whats-crossplane/) puis [Composition](https://docs.crossplane.io/latest/composition/)
- 🔵 [Crossplane — Upgrade to v2](https://docs.crossplane.io/latest/guides/upgrade-to-crossplane-v2/) : ce qui change par rapport aux tutoriels v1 (claims)
- 🟢 [OpenTofu docs](https://opentofu.org/docs/)
- 🔵 [Kratix — Promises](https://docs.kratix.io/)
- 🔵 [Terraform — Module best practices](https://developer.hashicorp.com/terraform/language/modules/develop)
- 📕 *Terraform: Up & Running*, Yevgeniy Brikman (O'Reilly, 3e éd. 2022)

## Lab homelab

**L-P3 — De Terraform manuel à un control plane**

**But** : lever la limite « state Terraform local sans verrou », puis tester la réconciliation continue.

### Étapes
1. Appliquer l'ADR 0006 (`HOMELAB/Documentation/adr/0006-backend-terraform.md`) : backend S3 avec verrou, migration du state, sauvegarde testée.
2. Mettre en place un plan Terraform planifié en CI Forgejo : un plan non vide déclenche une alerte de **dérive**.
3. Expérimenter dans `lab-crossplane` : Crossplane + provider Terraform (`provider-terraform`) ou provider Proxmox communautaire, avec une XRD `LabVM` (taille, VLAN, image).
4. Rédiger un ADR Terraform+CI ou Crossplane, avec coûts et risques ; le post-mortem `terraform destroy` PBS est un argument à intégrer.

### Livrable
Backend migré, job de détection de dérive, ADR de décision.

## Validation
- [ ] Je peux argumenter Terraform vs Crossplane pour un cas donné (rédigé sous forme d'ADR).
- [ ] Une ressource du homelab est demandée par un manifeste et réconciliée sans `terraform apply` manuel.
- [ ] La dérive est détectée et signalée.
