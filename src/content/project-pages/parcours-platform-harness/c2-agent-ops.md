---
project: parcours-platform-harness
title: "C2 : Agent d'exploitation du homelab"
summary: "Un agent de triage d'incident, évalué sur de vrais post-mortems."
group: "Convergence"
order: 14
---

Un agent de triage d'incident, en **lecture seule d'abord**. Il sert de projet final : on y retrouve plateforme, harness, évals et sécurité.

## Objectifs
- L'agent reçoit une alerte, lit métriques, logs et état Flux, puis propose un diagnostic et un runbook.
- Les post-mortems existants (`HOMELAB/Documentation/postmortems/`) deviennent le **jeu d'évals** : l'agent retrouve-t-il la cause racine ?
- L'escalade se fait par paliers : lecture seule, puis proposition de PR, puis action avec approbation humaine.

## Sources
- 🟢 Google SRE book : chapitres *Effective Troubleshooting* et *Postmortem Culture*
- 🟢 H4 (évals) et H5 (permissions)
- 🔵 [Anthropic, Building effective agents](https://www.anthropic.com/engineering/building-effective-agents), pour savoir quand un workflow suffit

## Lab homelab

**L-C2 : Agent de triage d'incident**

### Étapes
1. Webhook Alertmanager → `AgentTask` (L-C1) en lecture seule : Prometheus, Loki, `flux get`, `kubectl describe`.
2. Sortie : diagnostic, preuves (requêtes exécutées) et runbook proposé, publié sur ntfy.
3. **Évals sur l'histoire réelle** : rejouer les 3 post-mortems (certificat non renouvelé, `terraform destroy` PBS, tempête OPNsense) sous forme de scénarios, et mesurer si l'agent trouve la cause racine.
4. Escalade par paliers : PR de correctif proposée, puis action après approbation humaine (bouton ntfy). Les actions destructrices ne sont jamais automatiques.

### Livrable
Agent ops en lecture seule actif, score sur les scénarios post-mortem, ADR « niveaux d'autonomie ».

