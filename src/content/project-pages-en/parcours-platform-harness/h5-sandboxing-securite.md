---
project: parcours-platform-harness
title: "H5 — Agent sandboxing & security"
summary: "Injection, exfiltration, filesystem and network isolation."
order: 11
---

## Goals
- Model the threats specific to agents: prompt injection, exfiltration, destructive actions.
- Isolate execution: filesystem, network (egress allowlist), kernel (gVisor / microVM).
- Give the agent short-lived, minimally scoped credentials.

## Key concepts
"Lethal trifecta" (private data + untrusted content + ability to exfiltrate), per-tool permissions, human-in-the-loop on irreversible actions, gVisor, Kata, Firecracker, NetworkPolicy, dynamic secrets. The Claude Code sandbox combines filesystem isolation (writes limited to the working directory) and network isolation (a proxy outside the sandbox with a domain list), using bubblewrap on Linux and seatbelt on macOS: *you need both*.

## Sources
- 🟢 [Simon Willison — The lethal trifecta for AI agents](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/)
- 🟢 [Anthropic — Making Claude Code safer with sandboxing (Oct. 2025)](https://www.anthropic.com/engineering/claude-code-sandboxing)
- 🟢 [OWASP — Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/)
- 🔵 [gVisor](https://gvisor.dev/) · [Firecracker](https://firecracker-microvm.github.io/) · [Kata Containers](https://katacontainers.io/)
- 🔵 [kubernetes-sigs/agent-sandbox](https://github.com/kubernetes-sigs/agent-sandbox): `Sandbox` CRD, plus `SandboxTemplate`, `SandboxClaim` and `SandboxWarmPool` as extensions; delegates isolation to gVisor or Kata through `RuntimeClass`
- 🔵 [mattpocock/skills — `git-guardrails-claude-code`](https://github.com/mattpocock/skills/tree/main/skills/misc/git-guardrails-claude-code), an example of a hook-based guardrail
- 🟢 [Not what you've signed up for — Indirect Prompt Injection](https://arxiv.org/abs/2302.12173) (Greshake et al., 2023): the founding paper, injection comes through the data the application retrieves
- 🟢 [Design Patterns for Securing LLM Agents against Prompt Injections](https://arxiv.org/abs/2506.08837) (Beurer-Kellner et al., 2025): architecture patterns with provable resistance, and their utility/security trade-offs
- 🔵 [Defeating Prompt Injections by Design (CaMeL)](https://arxiv.org/abs/2503.18813) (Debenedetti et al., 2025): untrusted data can never change program flow; 77% of AgentDojo tasks solved with provable security, vs 84% undefended
- 🎧 🇫🇷 [IFTTD #360 — Docker Sandbox, with Guillaume Lours (Jun. 10, 2026)](https://www.ifttd.io/episodes/docker-sandbox) (in French): lightweight micro-VM, man-in-the-middle for credentials, security profiles

## Homelab lab

**L-H5 — Agent sandbox on k3s**

### Steps
1. Install gVisor (`runsc`) on the k3s worker, then create a gvisor `RuntimeClass`.
2. Create the `lab-agents` namespace: Pod Security `restricted`, default-deny NetworkPolicy, egress allowed only to the model API and Forgejo (through a proxy or an FQDN policy).
3. For credentials, authenticate to OpenBao with the ServiceAccount (kubernetes auth), and get a repo-scoped Forgejo token with a 1 h TTL.
4. Red-team: make the agent read a booby-trapped README (prompt injection) that tries to exfiltrate a secret. Document what blocks it and what gets through.
5. Evaluate [agent-sandbox](https://github.com/kubernetes-sigs/agent-sandbox) as an alternative.

### Deliverable
`lab-agents` Flux manifests, red-team report, "agent isolation" ADR.

## Validation
- [ ] An injection test (booby-trapped web content) fails to exfiltrate any secret.
- [ ] The agent runs under gVisor, with egress restricted to the model API and Forgejo.
- [ ] The agent's credentials expire in under an hour.
