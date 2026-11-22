---
project: parcours-platform-harness
title: "P5 : Sécurité, policy as code & supply chain"
summary: "Signer, vérifier à l'admission, et remplacer les secrets statiques."
group: "Track Platform"
order: 5
---

## Objectifs
- Signer les images et vérifier les signatures à l'admission.
- Générer des SBOM et scanner les vulnérabilités dans la CI.
- Appliquer des policies par défaut : pas de root, limites de ressources, registries autorisées.
- Remplacer les secrets statiques par des secrets dynamiques à courte durée de vie.

## Concepts clés
SLSA levels, provenance, Sigstore (cosign, keyless, Rekor), SBOM (SPDX/CycloneDX), Kyverno / Gatekeeper, Pod Security Standards, External Secrets / Vault Agent, secrets dynamiques OpenBao.

## Sources
- 🟢 [SLSA](https://slsa.dev/)
- 🟢 [Sigstore, cosign](https://docs.sigstore.dev/)
- 🟢 [Kyverno docs](https://kyverno.io/docs/)
- 🔵 [Kubernetes, Pod Security Standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/)
- 🔵 [OpenBao docs](https://openbao.org/docs/)
- 🔵 [CNCF, Software Supply Chain Best Practices](https://github.com/cncf/tag-security/tree/main/community/working-groups/supply-chain-security/supply-chain-security-paper)
- 🎧 🇫🇷 [IFTTD #358 : DevSecOps : pourquoi l'automatisation ne sauvera pas (toute seule) la sécu, avec Tugdual Grall (27 mai 2026)](https://www.ifttd.io/episodes/devsecops)

## Lab homelab

**L-P5 : Supply chain signée**

### Étapes
1. CI Forgejo : build, SBOM (`syft`), scan (`grype` ou `trivy`) qui échoue sur une CVE critique, puis signature `cosign` (clé stockée dans OpenBao, ou Transit).
2. Installer Kyverno : vérifier les signatures des images du registre interne, interdire `:latest`, imposer `runAsNonRoot` et les limits. Démarrer en `Audit`, puis passer en `Enforce`.
3. Prouver le refus d'une image non signée avec un test.
4. Remplacer un secret statique d'app par un secret dynamique OpenBao, par exemple un identifiant Postgres à durée courte pour patrimoine, via External Secrets ou Vault Agent.

### Livrable
Pipeline signé, policies en Enforce, test de refus, ADR « secrets dynamiques ».

## Validation
- [ ] Une image non signée est refusée par le cluster (preuve avec un test).
- [ ] La CI publie un SBOM et échoue sur une CVE critique.
- [ ] Au moins une app lit un secret dynamique depuis OpenBao.
