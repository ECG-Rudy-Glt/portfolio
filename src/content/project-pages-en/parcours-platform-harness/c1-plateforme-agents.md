---
project: parcours-platform-harness
title: "C1: A platform for running agents"
summary: "The harness becomes a platform product: isolated, observed, budgeted."
group: "Convergence"
order: 13
---

The harness becomes a **platform product**: any homelab project can launch an agent in an isolated, observed and budgeted environment.

## Goals
- Offer an "AgentTask" CRD or API: repo, instruction, budget, permissions.
- Run each task in an ephemeral sandbox, with dynamic credentials.
- Trace LLM and tool calls with the OTel GenAI conventions, and track cost per task and per project.
- Run the harness evals in CI before every prompt or tool change.

## Sources
- 🟢 [OpenTelemetry, GenAI semantic conventions](https://github.com/open-telemetry/semantic-conventions-genai) (moved off the main site into this repository)
- 🟢 [kubernetes-sigs/agent-sandbox](https://github.com/kubernetes-sigs/agent-sandbox): `SandboxWarmPool` to start agents without waiting
- 🔵 [IFTTD #383](https://www.ifttd.io/episodes/contexte-engineering) (in French): moving the harness from the local machine into CI
- 🔵 All of modules P2, P5, P6, H4 and H5
- 🟢 🎧 🇫🇷 [IFTTD #384: Usine logicielle 100% AI, with Nikolay Rodionov (Nov. 11, 2026)](https://www.ifttd.io/episodes/usine-logicielle-100-ai) (in French): agents in ephemeral sandboxes, PRs at volume, review as the bottleneck, building a reliable harness
- 🟢 🎧 🇫🇷 [IFTTD #382: Rapprocher la CI, with Yves Brissaud (Oct. 28, 2026)](https://www.ifttd.io/episodes/rapprocher-la-ci) (in French): AI multiplies the pace 20x and CI must keep up; fine-grained cache, parallelism, hybrid local/remote runs

## Homelab lab

**L-C1: Agent platform on k3s**

**Goal**: merge L-P2, L-H5 and L-H4 into one platform service.

```yaml
apiVersion: platform.homelab/v1alpha1
kind: AgentTask
spec:
  repo: rudy/sport-coach
  prompt: "Fix issue #42"
  budget: { usd: 2, maxTurns: 80 }
  permissions: { write: pr-only }
```

### Steps
1. The controller (an extension of the L-P2 operator) creates a sandbox Pod (L-H5) and injects ephemeral credentials. The result is a PR and a `status`.
2. OTel GenAI traces → Collector → Tempo or Loki. A Grafana dashboard of cost per task and per project, and an alert when the budget is exceeded.
3. Harness CI: any prompt or tool change re-runs the L-H4 bench. A regression blocks the merge.
4. Expose the "launch an agent" template in Backstage (L-P4).

### Deliverable
`AgentTask` CRD in lab prod, cost dashboard, evals gate in CI.

