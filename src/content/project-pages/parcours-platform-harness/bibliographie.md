---
project: parcours-platform-harness
title: "Bibliographie"
summary: "Toutes les sources du parcours, vérifiées et datées : livres, papiers, articles, documentations, podcasts et dépôts."
group: "Références"
order: 99
---

Toutes les sources du parcours, classées par thème. **Vérification du 22/11/2026** : chaque URL a été testée (HTTP 200, titre de page conforme), et les dates et auteurs ont été relevés sur la page elle-même. Les livres ont été vérifiés par leurs métadonnées publiques (éditeur, catalogues de bibliothèques). Les deux articles d'ACM Queue bloquent les requêtes automatisées (Cloudflare) : leur existence, leurs auteurs et leur date ont été confirmés par recherche.

Légende : 🟢 essentiel · 🔵 approfondir · 📕 livre · 📄 papier · 🎧 podcast · 🛠️ dépôt / outil · 🇫🇷 en français

---

## 1. Livres

| | Titre | Auteurs | Éditeur, date | Modules |
|---|---|---|---|---|
| 📕 | *Team Topologies* (2e éd.) | Matthew Skelton, Manuel Pais, Ruth Malan | IT Revolution, 2025 (1re éd. 2019) | P1 |
| 📕 | *Platform Engineering: A Guide for Technical, Product, and People Leaders* | Camille Fournier, Ian Nowland | O'Reilly, oct. 2024 | P1 |
| 📕 | *Accelerate* | Nicole Forsgren, Jez Humble, Gene Kim | IT Revolution, 2018 | P1, P6 |
| 📕 | *Programming Kubernetes* (ISBN 9781492047094) | Michael Hausenblas, Stefan Schimanski | O'Reilly, juil. 2019 | P2 |
| 📕 | *Terraform: Up & Running* (3e éd.) | Yevgeniy Brikman | O'Reilly, 2022 | P3 |
| 📕 | *Observability Engineering* (ISBN 9781492076438) ; **2e éd.** ISBN 9781098179915, avec des chapitres sur les LLM | Charity Majors, Liz Fong-Jones, George Miranda | O'Reilly, mai 2022 | P6, C1 |
| 📕 | *Site Reliability Engineering* & *The SRE Workbook* ([en ligne, gratuits](https://sre.google/books/)) | Google | O'Reilly, 2016 / 2018 | P6, C2 |
| 📕 | *AI Engineering: Building Applications with Foundation Models* | Chip Huyen | O'Reilly, janv. 2025 | H1 |
| 📕 | *Platform Strategy* | Gregor Hohpe | [Leanpub](https://leanpub.com/platformstrategy), mis à jour en continu | P1 |
| 📕 | *Kubernetes Patterns* | Bilgin Ibryam, Roland Huß | [k8spatterns.com](https://k8spatterns.com/) | P2 |
| 📕 | *Software Engineering at Google* ([gratuit en ligne](https://abseil.io/resources/swe-book)) | Titus Winters, Tom Manshreck, Hyrum Wright | O'Reilly, 2020 | P4 |

## 2. Platform engineering

| | Source | Auteur / date | Module |
|---|---|---|---|
| 🟢 | [CNCF, Platforms White Paper](https://tag-app-delivery.cncf.io/whitepapers/platforms/) | CNCF TAG App Delivery, avr. 2023 | 00, P1 |
| 🟢 | [CNCF, Platform Engineering Maturity Model](https://tag-app-delivery.cncf.io/whitepapers/platform-eng-maturity-model/) | CNCF TAG App Delivery, v1 oct. 2023 | P1 |
| 🟢 | [internaldeveloperplatform.org](https://internaldeveloperplatform.org/) | Communauté | P1 |
| 🔵 | [platformengineering.org, blog](https://platformengineering.org/blog) | Communauté | P1 |
| 🟢 | [DORA, recherche](https://dora.dev/) · [métriques](https://dora.dev/guides/dora-metrics-four-keys/) | DORA / Google Cloud | P1, P6 |
| 🔵 | [Spotify, How we use golden paths…](https://engineering.atspotify.com/2020/08/how-we-use-golden-paths-to-solve-fragmentation-in-our-software-ecosystem) | Spotify Engineering, août 2020 | P4 |
| 🟢 | [What I Talk About When I Talk About Platforms](https://martinfowler.com/articles/talk-about-platforms.html) | Evan Bottcher, 5 mars 2018 | P1 |
| 🟢 | [DORA, State of AI-assisted Software Development 2025](https://dora.dev/research/2025/dora-report/) | DORA / Google Cloud, 2025 | P1 |
| 🔵 | [The SPACE of Developer Productivity](https://queue.acm.org/detail.cfm?id=3454124) | N. Forsgren, M.-A. Storey et al., ACM Queue, 2021 | P1 |
| 🔵 | [DevEx: What Actually Drives Productivity](https://queue.acm.org/detail.cfm?id=3595878) | A. Noda, M.-A. Storey, N. Forsgren, M. Greiler, ACM Queue, 2023 | P1 |

## 3. Kubernetes, GitOps, IaC

| | Source | Notes | Module |
|---|---|---|---|
| 🟢 | [Kubernetes, Controllers](https://kubernetes.io/docs/concepts/architecture/controller/) | | P2 |
| 🟢 | [Kubebuilder Book](https://book.kubebuilder.io/) | | P2 |
| 🔵 | 🛠️ [Kubernetes The Hard Way](https://github.com/kelseyhightower/kubernetes-the-hard-way) | Kelsey Hightower | P2 |
| 🟢 | [Flux, Ways of structuring your repositories](https://fluxcd.io/flux/guides/repository-structure/) | | P2 |
| 🟢 | 🛠️ [fluxcd/flux2-multi-tenancy](https://github.com/fluxcd/flux2-multi-tenancy) | Exemple de référence | P2 |
| 🔵 | [Flux, Multi-tenancy lockdown](https://fluxcd.io/flux/installation/configuration/multitenancy/) | | P2 |
| 🔵 | [OpenGitOps](https://opengitops.dev/) | Principes GitOps | P2 |
| 🟢 | [Crossplane, What's Crossplane](https://docs.crossplane.io/latest/whats-crossplane/) · [Composition](https://docs.crossplane.io/latest/composition/) | v2.4, CNCF graduated | P3 |
| 🔵 | [Crossplane, Upgrade to v2](https://docs.crossplane.io/latest/guides/upgrade-to-crossplane-v2/) | | P3 |
| 🟢 | [OpenTofu docs](https://opentofu.org/docs/) | | P3 |
| 🔵 | [Terraform, Creating modules](https://developer.hashicorp.com/terraform/language/modules/develop) | | P3 |
| 🔵 | [Kratix docs](https://docs.kratix.io/) | Promises | P3 |

## 4. Portail développeur

| | Source | Notes | Module |
|---|---|---|---|
| 🟢 | 🛠️ [backstage/backstage](https://github.com/backstage/backstage) | Projet CNCF *incubating* | P4 |
| 🟢 | [Backstage, What is Backstage?](https://backstage.io/docs/overview/what-is-backstage) | | P4 |
| 🟢 | [Backstage, Software Templates](https://backstage.io/docs/features/software-templates/) | | P4 |
| 🔵 | [Score](https://score.dev/) | Spécification de workload | P4 |

## 5. Sécurité & supply chain

| | Source | Module |
|---|---|---|
| 🟢 | [SLSA](https://slsa.dev/) | P5 |
| 🟢 | [Sigstore docs](https://docs.sigstore.dev/) | P5 |
| 🟢 | [Kyverno docs](https://kyverno.io/docs/) | P5 |
| 🔵 | [Kubernetes, Pod Security Standards](https://kubernetes.io/docs/concepts/security/pod-security-standards/) | P5 |
| 🔵 | [OpenBao docs](https://openbao.org/docs/) | P5 |
| 🔵 | [CNCF TAG Security, Supply chain security paper](https://github.com/cncf/tag-security/tree/main/community/working-groups/supply-chain-security/supply-chain-security-paper) | P5 |

## 6. Observabilité & SRE

| | Source | Module |
|---|---|---|
| 🟢 | [Google SRE books](https://sre.google/books/) | P6, C2 |
| 🟢 | [OpenTelemetry docs](https://opentelemetry.io/docs/) | P6 |
| 🟢 | 🛠️ [OpenTelemetry, GenAI semantic conventions](https://github.com/open-telemetry/semantic-conventions-genai) (déplacées hors de opentelemetry.io) | C1 |
| 🔵 | [Sloth](https://sloth.dev/) | P6 |

## 7. Harness engineering : définitions & panorama

| | Source | Auteur / date | Module |
|---|---|---|---|
| 🟢 | [OpenAI, Harness engineering: leveraging Codex in an agent-first world](https://openai.com/index/harness-engineering/) | Ryan Lopopolo, 11 fév. 2026 | H3, H6 |
| 🟢 | [Thoughtworks, AI agent harness](https://www.thoughtworks.com/en-au/insights/blog/machine-learning-and-ai/ai-agent-harness) | Thoughtworks | 00 |
| 🟢 | [DigitalOcean, What is harness engineering?](https://www.digitalocean.com/resources/articles/what-is-harness-engineering) | DigitalOcean | 00 |
| 🔵 | [TechTarget, Agent harnesses as critical infrastructure](https://www.techtarget.com/it-infrastructure/tip/Harness-engineering-Agent-harnesses-as-critical-infrastructure) | TechTarget | 00 |
| 🔵 | [Claude Code Ultimate Guide: Context & Harness Engineering](https://cc.bruniaux.com) | Florian Bruniaux | H3 |

## 8. Agents : fondamentaux, outils, contexte

| | Source | Auteur / date | Module |
|---|---|---|---|
| 🟢 | [Anthropic, Building effective agents](https://www.anthropic.com/engineering/building-effective-agents) | Anthropic, 19 déc. 2024 | H1, C2 |
| 🟢 | [Claude, Documentation](https://docs.claude.com/) · [Tool use](https://docs.claude.com/en/docs/agents-and-tools/tool-use/overview) · [Agent Skills](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/overview) | Anthropic | H1, H2 |
| 🔵 | [LLM Powered Autonomous Agents](https://lilianweng.github.io/posts/2023-06-23-agent/) | Lilian Weng, juin 2023 | H1 |
| 🔵 | [ReAct (arXiv 2210.03629)](https://arxiv.org/abs/2210.03629) | Yao et al., 2022 | H1 |
| 🟢 | [Anthropic, Writing effective tools for AI agents](https://www.anthropic.com/engineering/writing-tools-for-agents) | Anthropic, 11 sept. 2025 | H2, L-H2 |
| 🟢 | [Model Context Protocol](https://modelcontextprotocol.io/) | | H2 |
| 🟢 | [SWE-agent: Agent-Computer Interfaces (arXiv 2405.15793)](https://arxiv.org/abs/2405.15793) | Yang et al., 2024 | H2 |
| 🟢 | 🛠️ [mattpocock/skills, Skills for Real Engineers](https://github.com/mattpocock/skills) | Matt Pocock | H2, H5, H6 |
| 🔵 | 🛠️ [12-Factor Agents](https://github.com/humanlayer/12-factor-agents) | HumanLayer | H2 |
| 🟢 | [Anthropic, Effective context engineering for AI agents](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents) | Anthropic, 29 sept. 2025 | H3 |
| 🔵 | [Claude Code, Best practices](https://code.claude.com/docs/en/best-practices) (ancienne URL anthropic.com/engineering redirigée) | Anthropic | H3 |
| 🔵 | [Context Rot](https://research.trychroma.com/context-rot) | Chroma | H3 |
| 🔵 | 🛠️ [RTK](https://github.com/rtk-ai/rtk) | rtk-ai | H3 |
| 🟢 | [Designing agentic loops](https://simonwillison.net/2025/Sep/30/designing-agentic-loops/) | Simon Willison, 30 sept. 2025 | H2 |
| 🟢 | [Anthropic, Code execution with MCP](https://www.anthropic.com/engineering/code-execution-with-mcp) | Adam Jones, Conor Kelly, 4 nov. 2025 | H2 |
| 🔵 | [Anthropic, Equipping agents for the real world with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) | B. Zhang, K. Lazuka, M. Murag, 16 oct. 2025 | H2 |
| 🟢 | [Context Engineering for AI Agents: Lessons from Building Manus](https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus) | Yichao « Peak » Ji, 18 juil. 2025 | H3 |

## 9. Évals

| | Source | Auteur / date | Module |
|---|---|---|---|
| 🟢 | [Anthropic, Demystifying evals for AI agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) | M. Grace, J. Hadfield, R. Olivares, J. De Jonghe, 9 janv. 2026 | H4 |
| 🟢 | [Your AI Product Needs Evals](https://hamel.dev/blog/posts/evals/) | Hamel Husain | H4 |
| 🟢 | 🛠️ [Inspect AI](https://inspect.aisi.org.uk/) | UK AI Security Institute | H4 |
| 🟢 | [SWE-bench](https://www.swebench.com/) | | H4 |
| 🔵 | [τ-bench (arXiv 2406.12045)](https://arxiv.org/abs/2406.12045) | Sierra, 2024 | H4 |

## 10. Sandboxing & sécurité des agents

| | Source | Auteur / date | Module |
|---|---|---|---|
| 🟢 | [The lethal trifecta for AI agents](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/) | Simon Willison, 16 juin 2025 | H5 |
| 🟢 | [Anthropic, Making Claude Code safer with sandboxing](https://www.anthropic.com/engineering/claude-code-sandboxing) | D. Dworken, O. Weller-Davies, 20 oct. 2025 | H5 |
| 🟢 | [OWASP, Top 10 for LLM Applications](https://genai.owasp.org/llm-top-10/) | OWASP GenAI | H5 |
| 🔵 | 🛠️ [gVisor](https://gvisor.dev/) · [Firecracker](https://firecracker-microvm.github.io/) · [Kata Containers](https://katacontainers.io/) | | H5 |
| 🟢 | 🛠️ [kubernetes-sigs/agent-sandbox](https://github.com/kubernetes-sigs/agent-sandbox) | Kubernetes SIG Apps | H5, C1 |

## 11. Agents longue durée & multi-agent

| | Source | Auteur / date | Module |
|---|---|---|---|
| 🟢 | [Anthropic, Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) | Justin Young, 26 nov. 2025 | H6 |
| 🟢 | [Anthropic, Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps) | Prithvi Rajasekaran, 24 mars 2026 | H6 |
| 🔵 | [Anthropic, How we built our multi-agent research system](https://www.anthropic.com/engineering/multi-agent-research-system) | Anthropic, 13 juin 2025 | H6 |
| 🔵 | [InfoQ, Anthropic designs three-agent harness](https://www.infoq.com/news/2026/04/anthropic-three-agent-harness-ai/) | InfoQ, avr. 2026 | H6 |
| 🟢 | [Don't Build Multi-Agents](https://cognition.com/blog/dont-build-multi-agents) | Walden Yan (Cognition), 12 juin 2025 | H6 |

## 12. Papiers de recherche

Dates : première soumission sur arXiv, ou conférence si publiée.

| | Papier | Auteurs, venue | Module |
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

## 13. IFTTD (podcast, en français)

Épisodes retenus parmi #345 à #385 (catalogue consulté le 22/11/2026). Date indiquée quand la page de l'épisode l'affiche.

| | Épisode | Invité | Date | Module |
|---|---|---|---|---|
| 🎧 | [#384 : Usine logicielle 100% AI : qui réveille-t-on quand l'usine prend feu ?](https://www.ifttd.io/episodes/usine-logicielle-100-ai) | Nikolay Rodionov | 11 nov. 2026 | C1 |
| 🎧 | [#383 : Contexte Engineering : dresser ses agents IA](https://www.ifttd.io/episodes/contexte-engineering) | Florian Bruniaux | 4 nov. 2026 | H3, C1 |
| 🎧 | [#382 : Rapprocher la CI : l'IA a 20x la cadence, nos CI doivent suivre](https://www.ifttd.io/episodes/rapprocher-la-ci) | Yves Brissaud | 28 oct. 2026 | C1 |
| 🎧 | [#381 : AI Coding : réécrire des applications legacy](https://www.ifttd.io/episodes/ai-coding) | Quentin Pleplé | 21 oct. 2026 | H6 |
| 🎧 | [#379 : Productivité sans IA : le mythe de la productivité](https://www.ifttd.io/episodes/productivite-sans-ia) | Bastien Albertus |, | P1 |
| 🎧 | [#375 : RTK : le coût du token, la nouvelle donne du Dev](https://www.ifttd.io/episodes/rtk) | Patrick Szymkowiak |, | H3 |
| 🎧 | [#360 : Docker Sandbox : sécuriser les agents IA sans ralentir les devs](https://www.ifttd.io/episodes/docker-sandbox) | Guillaume Lours | 10 juin 2026 | H5 |
| 🎧 | [#358 : DevSecOps : pourquoi l'automatisation ne sauvera pas (toute seule) la sécu](https://www.ifttd.io/episodes/devsecops) | Tugdual Grall | 27 mai 2026 | P5 |
| 🎧 | [#355 : SRE et DevOps : la prod relax](https://www.ifttd.io/episodes/sre-et-devops) | Kevin Davin | 6 mai 2026 | P6 |
| 🎧 | [#354 : Self Hosting : tout refaire pour être indépendant](https://www.ifttd.io/episodes/self-hosting) | Loic Tosser |, | homelab |
| 🎧 | [#346 : IA & DevX : code assisté, valeur humaine préservée](https://www.ifttd.io/episodes/ia-devx) | Jocelyn N'takpe |, | P1 |

Épisode #383 aussi en [vidéo](https://www.youtube.com/watch?v=Le5K1WheyBE).

