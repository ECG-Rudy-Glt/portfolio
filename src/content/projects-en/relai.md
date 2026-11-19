---
title: "Relai - Handing over between humans and AI agents"
category: perso
summary: "A Go binary and git-versioned files to work with AI agents without rereading everything each session: deterministic resume summary, multi-repository view, shared conventions checked in CI, a guide for agents. Optional team board as a separate project. Open source, version 0.x."
period: "2026 - ongoing"
role: "Design, development, testing with real agents and open source release, solo"
stack: ["Go", "Git", "MCP", "Docker", "OpenSpec", "Beads", "GitHub Actions"]
tags: ["AI / Conversational assistant", "CI/CD", "Docker", "Git"]
links:
  repo: "https://github.com/ECG-Rudy-Glt/RELAI"
  demo: "https://relai.gault-rudy.com"
featured: false
relevance: "pertinent"
order: 3
images: ["/projets/relai/fonctionnement.webp"]
---

## The need

About fifteen projects run in parallel with AI agents: each session starts cold and
rereads dozens of files, working rules drift from one repository to another, and sometimes
we rewrite what another project already provides.

## The solution

- **`relai handoff`**: a deterministic resume summary (git, Beads or GitHub Issues, OpenSpec,
  `.relai/notes.md`) within a token budget, with a degraded mode when none of these sources exist.
- **Several repositories**: `relai find` (check before building), `relai workspace` (one page for
  all projects), `relai discover --links` (mentions between repositories, as clues to confirm).
- **Shared conventions**: a hub repository pinned to a tag, `relai sync` to copy them,
  `relai check` in CI to detect drift.
- **`relai init` and `relai guide`**: `AGENTS.md`, a session-start hook and an Agent Skill, so that
  an agent learns the tool without explanation.
- **Relai-Team** (separate, optional project): a shared board, task reservations with a lease
  that expires, per-person tokens and MCP tools.

## Technical choices

- A **deterministic** summary, never written by a model; contradictions between sources are
  shown, not settled.
- Go, standard library only, one static binary; a hand-written parser for the constrained
  format of `relai.yaml`.
- Builds on existing standards (AGENTS.md, Agent Skills, OpenSpec, Beads) instead of creating
  yet another one; not a portal, everything goes through git.
- Hub content treated as untrusted, dry-run synchronisation by default.

## Result and limitations

Version 0.x published on GitHub, with documentation in French and English on
[relai.gault-rudy.com](https://relai.gault-rudy.com). Evaluated with Claude agents only, on
the repositories of a single developer: a 1.2 to 3.4 times gain in dollars, and nothing on repositories without
task tracking. No third-party audit, Windows not verified. See the article
[Relai: resuming a project with an AI agent without rereading everything](/blog/relai/) (in French).

Code: [Relai](https://github.com/ECG-Rudy-Glt/RELAI) and [Relai-Team](https://github.com/ECG-Rudy-Glt/RELAI-TEAM).
