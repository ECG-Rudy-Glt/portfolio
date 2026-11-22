---
project: parcours-platform-harness
title: "Bibliography"
summary: "Every source in the path, verified and dated: books, papers, articles, docs, podcasts and repositories."
order: 99
---

Every source in the path, grouped by topic. **Checked on 2026-11-22**: every URL was tested (HTTP 200, page title matches), and dates and authors were taken from the page itself. Books were checked against their public metadata (publisher, library catalogues). The two ACM Queue articles block automated requests (Cloudflare): their existence, authors and date were confirmed by search.

Legend: 🟢 essential · 🔵 go deeper · 📕 book · 📄 paper · 🎧 podcast · 🛠️ repository / tool · 🇫🇷 in French

---

## 1. Books

| | Title | Authors | Publisher, date | Modules |
|---|---|---|---|---|
| 📕 | *Team Topologies* (2nd ed.) | Matthew Skelton, Manuel Pais, Ruth Malan | IT Revolution, 2025 (1st ed. 2019) | P1 |
| 📕 | *Platform Engineering: A Guide for Technical, Product, and People Leaders* | Camille Fournier, Ian Nowland | O'Reilly, Oct. 2024 | P1 |
| 📕 | *Accelerate* | Nicole Forsgren, Jez Humble, Gene Kim | IT Revolution, 2018 | P1, P6 |
| 📕 | *Programming Kubernetes* (ISBN 9781492047094) | Michael Hausenblas, Stefan Schimanski | O'Reilly, Jul. 2019 | P2 |
| 📕 | *Terraform: Up & Running* (3rd ed.) | Yevgeniy Brikman | O'Reilly, 2022 | P3 |
| 📕 | *Observability Engineering* (ISBN 9781492076438); **2nd ed.** ISBN 9781098179915, with chapters on LLMs | Charity Majors, Liz Fong-Jones, George Miranda | O'Reilly, May 2022 | P6, C1 |
| 📕 | *Site Reliability Engineering* & *The SRE Workbook* ([online, free](https://sre.google/books/)) | Google | O'Reilly, 2016 / 2018 | P6, C2 |
| 📕 | *AI Engineering: Building Applications with Foundation Models* | Chip Huyen | O'Reilly, Jan. 2025 | H1 |
| 📕 | *Platform Strategy* | Gregor Hohpe | [Leanpub](https://leanpub.com/platformstrategy), continuously updated | P1 |
| 📕 | *Kubernetes Patterns* | Bilgin Ibryam, Roland Huß | [k8spatterns.com](https://k8spatterns.com/) | P2 |
| 📕 | *Software Engineering at Google* ([free online](https://abseil.io/resources/swe-book)) | Titus Winters, Tom Manshreck, Hyrum Wright | O'Reilly, 2020 | P4 |

## 2. Platform engineering

| | Source | Author / date | Module |
|---|---|---|---|
| 🟢 | [CNCF — Platforms White Paper](https://tag-app-delivery.cncf.io/whitepapers/platforms/) | CNCF TAG App Delivery, Apr. 2023 | 00, P1 |
| 🟢 | [CNCF — Platform Engineering Maturity Model](https://tag-app-delivery.cncf.io/whitepapers/platform-eng-maturity-model/) | CNCF TAG App Delivery, vOct. 1, 2023 | P1 |
| 🟢 | [internaldeveloperplatform.org](https://internaldeveloperplatform.org/) | Community | P1 |
| 🔵 | [platformengineering.org — blog](https://platformengineering.org/blog) | Community | P1 |
| 🟢 | [DORA — research](https://dora.dev/) · [metrics](https://dora.dev/guides/dora-metrics-four-keys/) | DORA / Google Cloud | P1, P6 |
| 🔵 | [Spotify — How we use golden paths…](https://engineering.atspotify.com/2020/08/how-we-use-golden-paths-to-solve-fragmentation-in-our-software-ecosystem) | Spotify Engineering, Aug. 2020 | P4 |
| 🟢 | [What I Talk About When I Talk About Platforms](https://martinfowler.com/articles/talk-about-platforms.html) | Evan Bottcher, Mar. 5, 2018 | P1 |
| 🟢 | [DORA — State of AI-assisted Software Development 2025](https://dora.dev/research/2025/dora-report/) | DORA / Google Cloud, 2025 | P1 |
| 🔵 | [The SPACE of Developer Productivity](https://queue.acm.org/detail.cfm?id=3454124) | N. Forsgren, M.-A. Storey et al., ACM Queue, 2021 | P1 |
| 🔵 | [DevEx: What Actually Drives Productivity](https://queue.acm.org/detail.cfm?id=3595878) | A. Noda, M.-A. Storey, N. Forsgren, M. Greiler, ACM Queue, 2023 | P1 |

## 3. Kubernetes, GitOps, IaC

| | Source | Notes | Module |
|---|---|---|---|
| 🟢 | [Kubernetes — Controllers](https://kubernetes.io/docs/concepts/architecture/controller/) | | P2 |
| 🟢 | [Kubebuilder Book](https://book.kubebuilder.io/) | | P2 |
| 🔵 | 🛠️ [Kubernetes The Hard Way](https://github.com/kelseyhightower/kubernetes-the-hard-way) | Kelsey Hightower | P2 |
| 🟢 | [Flux — Ways of structuring your repositories](https://fluxcd.io/flux/guides/repository-structure/) | | P2 |
| 🟢 | 🛠️ [fluxcd/flux2-multi-tenancy](https://github.com/fluxcd/flux2-multi-tenancy) | Reference example | P2 |
| 🔵 | [Flux — Multi-tenancy lockdown](https://fluxcd.io/flux/installation/configuration/multitenancy/) | | P2 |
| 🔵 | [OpenGitOps](https://opengitops.dev/) | GitOps principles | P2 |
| 🟢 | [Crossplane — What's Crossplane](https://docs.crossplane.io/latest/whats-crossplane/) · [Composition](https://docs.crossplane.io/latest/composition/) | v2.4, CNCF graduated | P3 |
| 🔵 | [Crossplane — Upgrade to v2](https://docs.crossplane.io/latest/guides/upgrade-to-crossplane-v2/) | | P3 |
| 🟢 | [OpenTofu docs](https://opentofu.org/docs/) | | P3 |
| 🔵 | [Terraform — Creating modules](https://developer.hashicorp.com/terraform/language/modules/develop) | | P3 |
| 🔵 | [Kratix docs](https://docs.kratix.io/) | Promises | P3 |

## 4. Developer portal

| | Source | Notes | Module |
|---|---|---|---|
| 🟢 | 🛠️ [backstage/backstage](https://github.com/backstage/backstage) | CNCF *incubating* project | P4 |
| 🟢 | [Backstage — What is Backstage?](https://backstage.io/docs/overview/what-is-backstage) | | P4 |
| 🟢 | [Backstage — Software Templates](https://backstage.io/docs/features/software-templates/) | | P4 |
| 🔵 | [Score](https://score.dev/) | Workload specification | P4 |

## 5. Security & supply chain

| | Source | Module |
|---|---|---|
| 🟢 | [SLSA](https://slsa.dev/) | P5 |
| 🟢 | [Sigstore docs](https://docs.sigstore.dev/) | P5 |
| 🟢 | [Kyverno docs](https://kyverno.io/docs/) | P5 |
| 🔵 | [Kubernetes — Pod Security Standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/) | P5 |
| 🔵 | [OpenBao docs](https://openbao.org/docs/) | P5 |
| 🔵 | [CNCF TAG Security — Supply chain security paper](https://github.com/cncf/tag-security/tree/main/community/working-groups/supply-chain-security/supply-chain-security-paper) | P5 |

## 6. Observability & SRE

| | Source | Module |
|---|---|---|
| 🟢 | [Google SRE books](https://sre.google/books/) | P6, C2 |
| 🟢 | [OpenTelemetry docs](https://opentelemetry.io/docs/) | P6 |
| 🟢 | 🛠️ [OpenTelemetry — GenAI semantic conventions](https://github.com/open-telemetry/semantic-conventions-genai) (moved off opentelemetry.io) | C1 |
| 🔵 | [Sloth](https://sloth.dev/) | P6 |

## 7. Harness engineering: definitions & overview

| | Source | Author / date | Module |
|---|---|---|---|
| 🟢 | [OpenAI — Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/) | Ryan Lopopolo, Feb. 11, 2026 | H3, H6 |
| 🟢 | [Thoughtworks — AI agent harness](https://www.thoughtworks.com/en-au/insights/blog/machine-learning-and-ai/ai-agent-harness) | Thoughtworks | 00 |
| 🟢 | [DigitalOcean — What is harness engineering?](https://www.digitalocean.com/resources/articles/what-is-harness-engineering) | DigitalOcean | 00 |
| 🔵 | [TechTarget — Agent harnesses as critical infrastructure](https://www.techtarget.com/it-infrastructure/tip/Harness-engineering-Agent-harnesses-as-critical-infrastructure) | TechTarget | 00 |
| 🔵 | [Claude Code Ultimate Guide: Context & Harness Engineering](https://cc.bruniaux.com) | Florian Bruniaux | H3 |

## 8. Agents: fundamentals, tools, context

| | Source | Author / date | Module |
|---|---|---|---|
| 🟢 | [Anthropic — Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) | Anthropic, Dec. 19, 2024 | H1, C2 |
| 🟢 | [Claude — Documentation](https://docs.claude.com/) · [Tool use](https://docs.claude.com/en/docs/agents-and-tools/tool-use/overview) · [Agent Skills](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview) | Anthropic | H1, H2 |
| 🔵 | [LLM Powered Autonomous Agents](https://lilianweng.github.io/posts/2023-06-23-agent/) | Lilian Weng, Jun. 2023 | H1 |
| 🔵 | [ReAct (arXiv 2210.03629)](https://arxiv.org/abs/2210.03629) | Yao et al., 2022 | H1 |
| 🟢 | [Anthropic — Writing effective tools for AI agents](https://www.anthropic.com/engineering/writing-tools-for-agents) | Anthropic, Sep. 11, 2025 | H2, L-H2 |
| 🟢 | [Model Context Protocol](https://modelcontextprotocol.io/) | | H2 |
| 🟢 | [SWE-agent: Agent-Computer Interfaces (arXiv 2405.15793)](https://arxiv.org/abs/2405.15793) | Yang et al., 2024 | H2 |
| 🟢 | 🛠️ [mattpocock/skills — Skills for Real Engineers](https://github.com/mattpocock/skills) | Matt Pocock | H2, H5, H6 |
| 🔵 | 🛠️ [12-Factor Agents](https://github.com/humanlayer/12-factor-agents) | HumanLayer | H2 |
| 🟢 | [Anthropic — Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) | Anthropic, Sep. 29, 2025 | H3 |
| 🔵 | [Claude Code — Best practices](https://code.claude.com/docs/en/best-practices) (old anthropic.com/engineering URL redirects here) | Anthropic | H3 |
| 🔵 | [Context Rot](https://research.trychroma.com/context-rot) | Chroma | H3 |
| 🔵 | 🛠️ [RTK](https://github.com/rtk-ai/rtk) | rtk-ai | H3 |
| 🟢 | [Designing agentic loops](https://simonwillison.net/2025/Sep/30/designing-agentic-loops/) | Simon Willison, Sep. 30, 2025 | H2 |
| 🟢 | [Anthropic — Code execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp) | Adam Jones, Conor Kelly, Nov. 4, 2025 | H2 |
| 🔵 | [Anthropic — Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) | B. Zhang, K. Lazuka, M. Murag, Oct. 16, 2025 | H2 |
| 🟢 | [Context Engineering for AI Agents: Lessons from Building Manus](https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus) | Yichao "Peak" Ji, Jul. 18, 2025 | H3 |

## 9. Evals

| | Source | Author / date | Module |
|---|---|---|---|
| 🟢 | [Anthropic — Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) | M. Grace, J. Hadfield, R. Olivares, J. De Jonghe, Jan. 9, 2026 | H4 |
| 🟢 | [Your AI Product Needs Evals](https://hamel.dev/blog/posts/evals/) | Hamel Husain | H4 |
| 🟢 | 🛠️ [Inspect AI](https://inspect.aisi.org.uk/) | UK AI Security Institute | H4 |
| 🟢 | [SWE-bench](https://www.swebench.com/) | | H4 |
| 🔵 | [τ-bench (arXiv 2406.12045)](https://arxiv.org/abs/2406.12045) | Sierra, 2024 | H4 |

## 10. Agent sandboxing & security

| | Source | Author / date | Module |
|---|---|---|---|
| 🟢 | [The lethal trifecta for AI agents](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/) | Simon Willison, Jun. 16, 2025 | H5 |
| 🟢 | [Anthropic — Making Claude Code safer with sandboxing](https://www.anthropic.com/engineering/claude-code-sandboxing) | D. Dworken, O. Weller-Davies, Oct. 20, 2025 | H5 |
| 🟢 | [OWASP — Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/) | OWASP GenAI | H5 |
| 🔵 | 🛠️ [gVisor](https://gvisor.dev/) · [Firecracker](https://firecracker-microvm.github.io/) · [Kata Containers](https://katacontainers.io/) | | H5 |
| 🟢 | 🛠️ [kubernetes-sigs/agent-sandbox](https://github.com/kubernetes-sigs/agent-sandbox) | Kubernetes SIG Apps | H5, C1 |

## 11. Long-running & multi-agent

| | Source | Author / date | Module |
|---|---|---|---|
| 🟢 | [Anthropic — Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) | Justin Young, Nov. 26, 2025 | H6 |
| 🟢 | [Anthropic — Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps) | Prithvi Rajasekaran, Mar. 24, 2026 | H6 |
| 🔵 | [Anthropic — How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system) | Anthropic, Jun. 13, 2025 | H6 |
| 🔵 | [InfoQ — Anthropic designs three-agent harness](https://www.infoq.com/news/2026/04/anthropic-three-agent-harness-ai/) | InfoQ, Apr. 2026 | H6 |
| 🟢 | [Don't Build Multi-Agents](https://cognition.com/blog/dont-build-multi-agents) | Walden Yan (Cognition), Jun. 12, 2025 | H6 |

## 12. Research papers

Dates: first arXiv submission, or conference when published.

| | Paper | Authors, venue | Module |
|---|---|---|---|
| 📄 | [Large-scale cluster management at Google with Borg](https://research.google/pubs/large-scale-cluster-management-at-google-with-borg/) | Verma et al., EuroSys 2015 | P2 |
| 📄 | [Not what you've signed up for: … Indirect Prompt Injection](https://arxiv.org/abs/2302.12173) | Greshake et al., 2023 | H5 |
| 📄 | [Reflexion: Language Agents with Verbal Reinforcement Learning](https://arxiv.org/abs/2303.11366) | Shinn et al., 2023 | H6 |
| 📄 | [Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena](https://arxiv.org/abs/2306.05685) | Zheng et al., 2023 | H4 |
| 📄 | [Lost in the Middle: How Language Models Use Long Contexts](https://arxiv.org/abs/2307.03172) | Liu et al., 2023 | H3 |
| 📄 | [SWE-bench: Can Language Models Resolve Real-World GitHub Issues?](https://arxiv.org/abs/2310.06770) | Jimenez et al., ICLR 2024 | H4 |
| 📄 | [Executable Code Actions Elicit Better LLM Agents (CodeAct)](https://arxiv.org/abs/2402.01030) | Wang et al., ICML 2024 | H2 |
| 📄 | [Agentless: Demystifying LLM-based Software Engineering Agents](https://arxiv.org/abs/2407.01489) | Xia et al., 2024 | H2 |
| 📄 | [Measuring AI Ability to Complete Long Software Tasks](https://arxiv.org/abs/2503.14499) | Kwa et al., NeurIPS 2025 | H6 |
| 📄 | [Defeating Prompt Injections by Design (CaMeL)](https://arxiv.org/abs/2503.18813) | Debenedetti et al., 2025 | H5 |
| 📄 | [Design Patterns for Securing LLM Agents against Prompt Injections](https://arxiv.org/abs/2506.08837) | Beurer-Kellner et al., 2025 | H5 |

## 13. IFTTD (podcast, in French)

Episodes selected from #345 to #385 (catalogue checked on 2026-11-22). Date given when the episode page shows it.

| | Episode | Guest | Date | Module |
|---|---|---|---|---|
| 🎧 | [#384 — Usine logicielle 100% AI : qui réveille-t-on quand l'usine prend feu ?](https://www.ifttd.io/episodes/usine-logicielle-100-ai) | Nikolay Rodionov | Nov. 11, 2026 | C1 |
| 🎧 | [#383 — Contexte Engineering : dresser ses agents IA](https://www.ifttd.io/episodes/contexte-engineering) | Florian Bruniaux | Nov. 4, 2026 | H3, C1 |
| 🎧 | [#382 — Rapprocher la CI : l'IA a 20x la cadence, nos CI doivent suivre](https://www.ifttd.io/episodes/rapprocher-la-ci) | Yves Brissaud | Oct. 28, 2026 | C1 |
| 🎧 | [#381 — AI Coding : réécrire des applications legacy](https://www.ifttd.io/episodes/ai-coding) | Quentin Pleplé | Oct. 21, 2026 | H6 |
| 🎧 | [#379 — Productivité sans IA : le mythe de la productivité](https://www.ifttd.io/episodes/productivite-sans-ia) | Bastien Albertus | — | P1 |
| 🎧 | [#375 — RTK : le coût du token, la nouvelle donne du Dev](https://www.ifttd.io/episodes/rtk) | Patrick Szymkowiak | — | H3 |
| 🎧 | [#360 — Docker Sandbox : sécuriser les agents IA sans ralentir les devs](https://www.ifttd.io/episodes/docker-sandbox) | Guillaume Lours | Jun. 10, 2026 | H5 |
| 🎧 | [#358 — DevSecOps : pourquoi l'automatisation ne sauvera pas (toute seule) la sécu](https://www.ifttd.io/episodes/devsecops) | Tugdual Grall | May 27, 2026 | P5 |
| 🎧 | [#355 — SRE et DevOps : la prod relax](https://www.ifttd.io/episodes/sre-et-devops) | Kevin Davin | May 6, 2026 | P6 |
| 🎧 | [#354 — Self Hosting : tout refaire pour être indépendant](https://www.ifttd.io/episodes/self-hosting) | Loic Tosser | — | homelab |
| 🎧 | [#346 — IA & DevX : code assisté, valeur humaine préservée](https://www.ifttd.io/episodes/ia-devx) | Jocelyn N'takpe | — | P1 |

Episode #383 is also available as a [video](https://www.youtube.com/watch?v=Le5K1WheyBE).

