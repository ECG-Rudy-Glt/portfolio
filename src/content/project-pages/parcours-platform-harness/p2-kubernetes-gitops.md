---
project: parcours-platform-harness
title: "P2 : Kubernetes en profondeur & GitOps avancé"
summary: "La boucle de réconciliation, un opérateur écrit à la main, et Flux multi-tenant."
group: "Track Platform"
order: 2
---

## Objectifs
- Comprendre le modèle de contrôleur : reconcile loop, informers, finalizers, status.
- Écrire un opérateur avec kubebuilder.
- Structurer Flux pour plusieurs tenants : multi-sources, dépendances, promotion.

## Concepts clés
API machinery, CRD et versions, admission webhooks, Server-Side Apply, réconciliation idempotente, Flux Kustomization / HelmRelease / dependsOn, image automation, multi-tenancy (impersonation, ServiceAccount par tenant).

## Sources
- 🟢 [Kubebuilder Book](https://book.kubebuilder.io/)
- 🟢 [Flux, Ways of structuring your repositories](https://fluxcd.io/flux/guides/repository-structure/)
- 🟢 [fluxcd/flux2-multi-tenancy](https://github.com/fluxcd/flux2-multi-tenancy), l'exemple de référence cité par la doc Flux
- 🔵 [Flux, Multi-tenancy lockdown](https://fluxcd.io/flux/installation/configuration/multitenancy/)
- 🟢 [Kubernetes docs, Controllers](https://kubernetes.io/docs/concepts/architecture/controller/)
- 🔵 [Kubernetes The Hard Way](https://github.com/kelseyhightower/kubernetes-the-hard-way)
- 🔵 [OpenGitOps principles](https://opengitops.dev/)
- 📕 *Programming Kubernetes*, Hausenblas & Schimanski (O'Reilly, 2019)
- 🎓 CKA puis CKS (certifications, en option)
- 🔵 [Large-scale cluster management at Google with Borg](https://research.google/pubs/large-scale-cluster-management-at-google-with-borg/) (Verma et al., EuroSys 2015) : l'ancêtre direct de Kubernetes
- 📕 *Kubernetes Patterns*, Bilgin Ibryam & Roland Huß ([k8spatterns.com](https://k8spatterns.com/))

## Lab homelab

**L-P2 : Opérateur `App` pour le homelab**

**But** : remplacer le copier-coller Deployment + Service + IngressRoute + Certificate de chaque app par **une ressource de haut niveau**.

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

### Étapes
1. `kubebuilder init` en Go, CRD `App` v1alpha1.
2. Reconcile : générer les ressources enfants avec `ownerReferences`, et utiliser Server-Side Apply.
3. Remplir `status.conditions` (Ready, Degraded) et ajouter un finalizer si une ressource externe est créée.
4. Tests envtest, puis déploiement via Flux dans `lab-operator`.
5. Migrer **une** app peu critique (speedtest), sans toucher patrimoine.

### Livrable
Repo `platform-operator` sur Forgejo, migration de speedtest, ADR « abstraction App ».

## Validation
- [ ] Je sais expliquer ce qui se passe entre `kubectl apply` et le démarrage du pod.
- [ ] Mon opérateur gère création, mise à jour et suppression (finalizer), et remplit `status.conditions`.
- [ ] Flux du homelab : un tenant ne peut pas écrire hors de son namespace.
