---
project: parcours-platform-harness
title: "C2 — Homelab operations agent"
summary: "An incident triage agent, evaluated on real post-mortems."
order: 14
---

An incident triage agent, **read-only at first**. It is the capstone project: platform, harness, evals and security all come together.

## Goals
- The agent receives an alert, reads metrics, logs and Flux state, then proposes a diagnosis and a runbook.
- The existing post-mortems (`HOMELAB/Documentation/postmortems/`) become the **eval set**: does the agent find the root cause?
- Escalation happens in stages: read-only, then proposing a PR, then acting with human approval.

## Sources
- 🟢 Google SRE book: *Effective Troubleshooting* and *Postmortem Culture* chapters
- 🟢 H4 (evals) and H5 (permissions)
- 🔵 [Anthropic — Building effective agents](https://www.anthropic.com/engineering/building-effective-agents), to know when a workflow is enough

## Homelab lab

**L-C2 — Incident triage agent**

### Steps
1. Alertmanager webhook → `AgentTask` (L-C1) in read-only mode: Prometheus, Loki, `flux get`, `kubectl describe`.
2. Output: diagnosis, evidence (queries run) and proposed runbook, published to ntfy.
3. **Evals on real history**: replay the 3 post-mortems (certificate not renewed, PBS `terraform destroy`, OPNsense storm) as scenarios, and measure whether the agent finds the root cause.
4. Staged escalation: proposed fix PR, then action after human approval (ntfy button). Destructive actions are never automatic.

### Deliverable
Read-only ops agent live, score on the post-mortem scenarios, "autonomy levels" ADR.

