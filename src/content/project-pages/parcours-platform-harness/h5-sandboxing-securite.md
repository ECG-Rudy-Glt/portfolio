---
project: parcours-platform-harness
title: "H5 — Sandboxing & sécurité des agents"
summary: "Injection, exfiltration, isolation du système de fichiers et du réseau."
order: 11
---

## Objectifs
- Modéliser les menaces propres aux agents : prompt injection, exfiltration, actions destructrices.
- Isoler l'exécution : système de fichiers, réseau (egress allowlist), noyau (gVisor / microVM).
- Donner à l'agent des identifiants à durée courte et à périmètre minimal.

## Concepts clés
« Lethal trifecta » (données privées + contenu non fiable + capacité d'exfiltration), permissions par outil, human-in-the-loop sur actions irréversibles, gVisor, Kata, Firecracker, NetworkPolicy, secrets dynamiques. Le sandbox de Claude Code combine isolation FS (écriture limitée au répertoire de travail) et réseau (proxy hors sandbox avec liste de domaines), via bubblewrap sous Linux et seatbelt sous macOS : *il faut les deux*.

## Sources
- 🟢 [Simon Willison — The lethal trifecta for AI agents](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/)
- 🟢 [Anthropic — Making Claude Code safer with sandboxing (oct. 2025)](https://www.anthropic.com/engineering/claude-code-sandboxing)
- 🟢 [OWASP — Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/)
- 🔵 [gVisor](https://gvisor.dev/) · [Firecracker](https://firecracker-microvm.github.io/) · [Kata Containers](https://katacontainers.io/)
- 🔵 [kubernetes-sigs/agent-sandbox](https://github.com/kubernetes-sigs/agent-sandbox) : CRD `Sandbox`, plus `SandboxTemplate`, `SandboxClaim` et `SandboxWarmPool` en extensions ; délègue l'isolation à gVisor ou Kata via `RuntimeClass`
- 🔵 [mattpocock/skills — `git-guardrails-claude-code`](https://github.com/mattpocock/skills/tree/main/skills/misc/git-guardrails-claude-code), exemple de garde-fou par hook
- 🟢 [Not what you've signed up for — Indirect Prompt Injection](https://arxiv.org/abs/2302.12173) (Greshake et al., 2023) : le papier fondateur, l'injection passe par les données que l'application récupère
- 🟢 [Design Patterns for Securing LLM Agents against Prompt Injections](https://arxiv.org/abs/2506.08837) (Beurer-Kellner et al., 2025) : des patrons d'architecture à résistance prouvable, et leurs compromis utilité/sécurité
- 🔵 [Defeating Prompt Injections by Design (CaMeL)](https://arxiv.org/abs/2503.18813) (Debenedetti et al., 2025) : les données non fiables ne peuvent jamais modifier le flot du programme ; 77 % des tâches AgentDojo résolues avec sécurité prouvable, contre 84 % sans défense
- 🎧 🇫🇷 [IFTTD #360 — Docker Sandbox : sécuriser les agents IA sans ralentir les devs, avec Guillaume Lours (10 juin 2026)](https://www.ifttd.io/episodes/docker-sandbox) : micro-VM légère, man-in-the-middle pour les credentials, profils de sécurité

## Lab homelab

**L-H5 — Sandbox d'agent sur k3s**

### Étapes
1. Installer gVisor (`runsc`) sur le worker k3s, puis créer une `RuntimeClass` gvisor.
2. Créer le namespace `lab-agents` : Pod Security `restricted`, NetworkPolicy par défaut deny, egress autorisé uniquement vers l'API du modèle et Forgejo (via proxy ou FQDN policy).
3. Pour les identifiants, s'authentifier à OpenBao avec la ServiceAccount (auth kubernetes), et obtenir un token Forgejo à périmètre repo avec TTL de 1 h.
4. Red-team : faire lire à l'agent un README piégé (prompt injection) qui tente d'exfiltrer un secret. Documenter ce qui bloque, et ce qui passe.
5. Évaluer [agent-sandbox](https://github.com/kubernetes-sigs/agent-sandbox) comme alternative.

### Livrable
Manifestes Flux `lab-agents`, rapport red-team, ADR « isolation des agents ».

## Validation
- [ ] Un test d'injection (contenu web piégé) ne parvient pas à exfiltrer de secret.
- [ ] L'agent tourne sous gVisor, avec egress restreint à l'API du modèle et au Forgejo.
- [ ] Les identifiants de l'agent expirent en moins d'une heure.
