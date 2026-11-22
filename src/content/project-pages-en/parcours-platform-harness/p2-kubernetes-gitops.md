---
project: parcours-platform-harness
title: "P2 — Kubernetes in depth & advanced GitOps"
summary: "The reconcile loop, a hand-written operator, and multi-tenant Flux."
order: 2
---

## Goals
- Understand the controller model: reconcile loop, informers, finalizers, status.
- Write an operator with kubebuilder.
- Structure Flux for several tenants: multiple sources, dependencies, promotion.

## Key concepts
API machinery, CRDs and versions, admission webhooks, Server-Side Apply, idempotent reconciliation, Flux Kustomization / HelmRelease / dependsOn, image automation, multi-tenancy (impersonation, one ServiceAccount per tenant).

## Sources
- 🟢 [Kubebuilder Book](https://book.kubebuilder.io/)
- 🟢 [Flux — Ways of structuring your repositories](https://fluxcd.io/flux/guides/repository-structure/)
- 🟢 [fluxcd/flux2-multi-tenancy](https://github.com/fluxcd/flux2-multi-tenancy), the reference example cited by the Flux docs
- 🔵 [Flux — Multi-tenancy lockdown](https://fluxcd.io/flux/installation/configuration/multitenancy/)
- 🟢 [Kubernetes docs — Controllers](https://kubernetes.io/docs/concepts/architecture/controller/)
- 🔵 [Kubernetes The Hard Way](https://github.com/kelseyhightower/kubernetes-the-hard-way)
- 🔵 [OpenGitOps principles](https://opengitops.dev/)
- 📕 *Programming Kubernetes*, Hausenblas & Schimanski (O'Reilly, 2019)
- 🎓 CKA then CKS (certifications, optional)
- 🔵 [Large-scale cluster management at Google with Borg](https://research.google/pubs/large-scale-cluster-management-at-google-with-borg/) (Verma et al., EuroSys 2015): Kubernetes' direct ancestor
- 📕 *Kubernetes Patterns*, Bilgin Ibryam & Roland Huß ([k8spatterns.com](https://k8spatterns.com/))

## Homelab lab

**L-P2 — `App` operator for the homelab**

**Goal**: replace the copy-pasted Deployment + Service + IngressRoute + Certificate of every app with **one high-level resource**.

```yaml
apiVersion: platform.homelab/v1alpha1
kind: App
metadata: { name: speedtest, namespace: speedtest }
spec:
  image: registry.example/speedtest:1.2.0
  port: 8080
  host: speedtest.lan
  auth: authentik        # none | authentik
  resources: small       # small | medium
```

### Steps
1. `kubebuilder init` in Go, `App` v1alpha1 CRD.
2. Reconcile: generate child resources with `ownerReferences`, and use Server-Side Apply.
3. Fill in `status.conditions` (Ready, Degraded) and add a finalizer if an external resource is created.
4. envtest tests, then deploy through Flux into `lab-operator`.
5. Migrate **one** low-criticality app (speedtest), without touching patrimoine.

### Deliverable
`platform-operator` repo on Forgejo, speedtest migrated, "App abstraction" ADR.

## Validation
- [ ] I can explain what happens between `kubectl apply` and the pod starting.
- [ ] My operator handles create, update and delete (finalizer), and fills in `status.conditions`.
- [ ] Homelab Flux: a tenant cannot write outside its namespace.
