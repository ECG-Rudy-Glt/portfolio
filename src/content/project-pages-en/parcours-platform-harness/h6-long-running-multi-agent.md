---
project: parcours-platform-harness
title: "H6 — Long-running & multi-agent"
summary: "Moving an agent forward on a project larger than one context window."
order: 12
---

## Goals
- Make an agent progress on a project larger than one context window.
- Design the handoff artifacts: a JSON feature list (`"passes": false`), `claude-progress.txt`, `init.sh`, git history.
- Separate generator from evaluator, and orchestrate sub-agents in parallel.

## Key concepts
Two generations of harness, not to be confused:
- **Nov. 2025** (*Effective harnesses*): an *initializer agent* sets up the environment (200+ features in JSON, because the model is less likely to rewrite JSON than Markdown), then a *coding agent* moves forward feature by feature and commits. Both share the same harness and differ only by their initial prompt. **There is no separate evaluator.**
- **Mar. 2026** (*Harness design*): three agents (**planner**, **generator**, **evaluator**). The evaluator tests through the Playwright MCP, with scored criteria calibrated by few-shot examples. The article also describes *context anxiety* (the model rushes when it believes it is nearing its context limit) and *context resets* vs compaction. With Opus 4.5, resets could be dropped in favour of automatic compaction.

Other notions: orchestrator-workers, multi-agent cost.

## Sources
- 🟢 [Anthropic — Effective harnesses for long-running agents (Justin Young, Nov. 26, 2025)](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- 🟢 [Anthropic — Harness design for long-running application development (Prithvi Rajasekaran, Mar. 24, 2026)](https://www.anthropic.com/engineering/harness-design-long-running-apps)
- 🟢 [OpenAI — Harness engineering: leveraging Codex in an agent-first world (Ryan Lopopolo, Feb. 11, 2026)](https://openai.com/index/harness-engineering/): humans steer and agents execute, the repo as system of record, *"enforcing invariants, not micromanaging implementations"* (linters and structural tests), continuous clean-up agents
- 🔵 [Anthropic — How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system)
- 🔵 [InfoQ — Anthropic three-agent harness](https://www.infoq.com/news/2026/04/anthropic-three-agent-harness-ai/)
- 🔵 [mattpocock/skills — `handoff`, `to-spec`, `to-tickets`, `implement-spec`](https://github.com/mattpocock/skills/tree/main/skills), a spec → tickets → implementation pipeline as skills
- 🟢 [Cognition — Don't Build Multi-Agents](https://cognition.com/blog/dont-build-multi-agents) (Walden Yan, Jun. 12, 2025): the essential counterpoint. Share full context, because *"actions carry implicit decisions"*; a single-threaded linear agent stays the default
- 🔵 [Measuring AI Ability to Complete Long Software Tasks](https://arxiv.org/abs/2503.14499) (Kwa et al., NeurIPS 2025): the 50%-success task horizon has doubled roughly every seven months since 2019
- 🔵 [Reflexion](https://arxiv.org/abs/2303.11366) (Shinn et al., 2023): the agent improves through written self-critique kept in memory, without retraining
- 🎧 🇫🇷 [IFTTD #381 — AI Coding, with Quentin Pleplé (Oct. 21, 2026)](https://www.ifttd.io/episodes/ai-coding) (in French): rewriting legacy apps, a three-phase method (spec, migration, Kaizen) and harness engineering

## Homelab lab

**L-H6 — A long-running agent on a real project**

**Goal**: first reproduce the initializer + coding agent pattern (Anthropic, Nov. 2025), then add the separate evaluator (Anthropic, Mar. 2026), on a real project from the backlog. A possible candidate: a feature from `patrimoine/TODO.md`, on a branch.

### Steps
1. Init session: spec, `features.json` (all `"passes": false`), `claude-progress.txt`, `init.sh` (start-up + tests), initial commit.
2. Work sessions: one feature at a time, commit, update `claude-progress.txt`, and **reset** the context between two sessions.
3. Then add a separate evaluator agent (scored criteria with a threshold, calibrated with few-shot examples, tests through Playwright), which accepts or rejects each feature (E2E tests, screenshots).
4. Compare with and without the evaluator, then test compaction against reset. Measure the number of sessions, cost, evaluator rejections and human rework.

### Deliverable
Feature delivered, versioned handoff artifacts, write-up in `notes/`.

## Validation
- [ ] An agent has delivered a project over more than 5 sessions, without me having to re-explain the context.
- [ ] The separate evaluator has rejected at least one deliverable that the generator considered finished.
- [ ] Total cost, time and rate of human rework are measured.
