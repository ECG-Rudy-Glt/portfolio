---
project: parcours-platform-harness
title: "P5 — Security, policy as code & supply chain"
summary: "Sign, verify at admission, and replace static secrets."
order: 5
---

## Goals
- Sign images and verify signatures at admission.
- Generate SBOMs and scan for vulnerabilities in CI.
- Enforce default policies: no root, resource limits, allowed registries.
- Replace static secrets with short-lived dynamic secrets.

## Key concepts
SLSA levels, provenance, Sigstore (cosign, keyless, Rekor), SBOM (SPDX/CycloneDX), Kyverno / Gatekeeper, Pod Security Standards, External Secrets / Vault Agent, OpenBao dynamic secrets.

## Sources
- 🟢 [SLSA](https://slsa.dev/)
- 🟢 [Sigstore — cosign](https://docs.sigstore.dev/)
- 🟢 [Kyverno docs](https://kyverno.io/docs/)
- 🔵 [Kubernetes — Pod Security Standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/)
- 🔵 [OpenBao docs](https://openbao.org/docs/)
- 🔵 [CNCF — Software Supply Chain Best Practices](https://github.com/cncf/tag-security/tree/main/community/working-groups/supply-chain-security/supply-chain-security-paper)
- 🎧 🇫🇷 [IFTTD #358 — DevSecOps, with Tugdual Grall (May 27, 2026)](https://www.ifttd.io/episodes/devsecops) (in French): why automation alone will not save security

## Homelab lab

**L-P5 — Signed supply chain**

### Steps
1. Forgejo CI: build, SBOM (`syft`), scan (`grype` or `trivy`) that fails on a critical CVE, then `cosign` signature (key stored in OpenBao, or Transit).
2. Install Kyverno: verify signatures of internal-registry images, forbid `:latest`, require `runAsNonRoot` and limits. Start in `Audit`, then switch to `Enforce`.
3. Prove with a test that an unsigned image is rejected.
4. Replace an app's static secret with an OpenBao dynamic secret, for example a short-lived Postgres credential for patrimoine, through External Secrets or Vault Agent.

### Deliverable
Signed pipeline, policies in Enforce, rejection test, "dynamic secrets" ADR.

## Validation
- [ ] An unsigned image is rejected by the cluster (proven with a test).
- [ ] CI publishes an SBOM and fails on a critical CVE.
- [ ] At least one app reads a dynamic secret from OpenBao.
