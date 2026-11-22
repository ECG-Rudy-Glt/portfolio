---
project: parcours-platform-harness
title: "H1: LLM API & fundamentals"
summary: "What happens in a call: tokens, tool use, caching, stop reasons."
group: "Harness track"
order: 7
---

## Goals
- Call a model through the API: messages, system prompt, streaming, tool use, prompt caching.
- Understand tokens, context window, cost and latency.
- Know why a model "hallucinates" a tool call, and how the harness catches it.

## Key concepts
Messages API, roles, `tool_use` / `tool_result`, `stop_reason`, structured outputs, prompt caching, extended thinking, batch, rate limits, model choice (cost / capability).

## Sources
- 🟢 [Anthropic, API documentation](https://docs.claude.com/)
- 🟢 [Anthropic, Tool use](https://docs.claude.com/en/docs/agents-and-tools/tool-use/overview)
- 🟢 [Anthropic, Building effective agents](https://www.anthropic.com/engineering/building-effective-agents): workflows vs agents, worth rereading often
- 🔵 [Lilian Weng, LLM Powered Autonomous Agents](https://lilianweng.github.io/posts/2023-06-23-agent/)
- 🔵 [ReAct (Yao et al., 2022)](https://arxiv.org/abs/2210.03629)
- 📕 *AI Engineering: Building Applications with Foundation Models*, Chip Huyen (O'Reilly, Jan. 2025)

## Homelab lab

**L-H1: A mini-agent in ~200 lines**

**Goal**: write your own loop without a framework, to know what Claude Code or Codex do under the hood.

### Steps
1. Python or Go, Anthropic SDK, 3 tools: `read_file`, `run_command` (with an allowlist), `edit_file` (exact replacement).
2. Loop: call → `tool_use` → execution → `tool_result` (with `is_error` when needed) → repeat until `end_turn` or a limit of N turns.
3. On every turn, log input/output tokens, tokens read from and written to the cache, and the cost.
4. Test task: "add a missing unit test in a small toy repo and make it pass".
5. Vary the tool descriptions and observe the effect on the result.

### Deliverable
`mini-agent` repo, experiment log in `notes/`.

## Validation
- [ ] I can read a raw response and say why the model stopped.
- [ ] My script measures the tokens and the cost of each turn.
- [ ] Prompt caching is enabled, and I have measured the gain.
