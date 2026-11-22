---
project: parcours-platform-harness
title: "P3: IaC & control planes"
summary: "From hand-run Terraform to a declarative API reconciled continuously."
group: "Platform track"
order: 3
---

## Goals
- Move from "Terraform run by hand" to a **declarative API reconciled continuously**.
- Design abstractions: modules, compositions, XRDs.
- Handle state, drift and secrets properly.

## Key concepts
State and locking, drift detection, versioned modules, Crossplane v2 (CNCF *graduated* project; composition: XRD, Composition, composition Functions in YAML/KCL/Python/Go), the Kratix model (Promises), Terraform vs control plane, OpenTofu.

## Sources
- 🟢 [Crossplane, What's Crossplane](https://docs.crossplane.io/latest/whats-crossplane/) then [Composition](https://docs.crossplane.io/latest/composition/)
- 🔵 [Crossplane, Upgrade to v2](https://docs.crossplane.io/latest/guides/upgrade-to-crossplane-v2/): what changed compared with v1 tutorials (claims)
- 🟢 [OpenTofu docs](https://opentofu.org/docs/)
- 🔵 [Kratix, Promises](https://docs.kratix.io/)
- 🔵 [Terraform, Module best practices](https://developer.hashicorp.com/terraform/language/modules/develop)
- 📕 *Terraform: Up & Running*, Yevgeniy Brikman (O'Reilly, 3rd ed. 2022)

## Homelab lab

**L-P3: From manual Terraform to a control plane**

**Goal**: remove the "local Terraform state without locking" limitation, then try continuous reconciliation.

### Steps
1. Apply ADR 0006 (`HOMELAB/Documentation/adr/0006-backend-terraform.md`): S3 backend with locking, state migration, tested backup.
2. Set up a scheduled Terraform plan in Forgejo CI: a non-empty plan raises a **drift** alert.
3. Experiment in `lab-crossplane`: Crossplane + Terraform provider (`provider-terraform`) or a community Proxmox provider, with a `LabVM` XRD (size, VLAN, image).
4. Write an ADR choosing Terraform+CI or Crossplane, with costs and risks; the PBS `terraform destroy` post-mortem is an argument to include.

### Deliverable
Migrated backend, drift-detection job, decision ADR.

## Validation
- [ ] I can argue Terraform vs Crossplane for a given case (written as an ADR).
- [ ] A homelab resource is requested through a manifest and reconciled without a manual `terraform apply`.
- [ ] Drift is detected and reported.
