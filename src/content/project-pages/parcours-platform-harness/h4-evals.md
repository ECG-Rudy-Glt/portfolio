---
project: parcours-platform-harness
title: "H4 : Évals d'agents"
summary: "Mesurer un harness sur des tâches réelles, plusieurs fois : pass@k et pass^k."
group: "Track Harness"
order: 10
---

## Objectifs
- Construire un jeu de tâches représentatif, avec des graders automatiques (tests, état final, LLM-as-judge calibré).
- Comparer deux versions d'un harness à modèle constant, et inversement.
- Lire les traces pour classer les échecs (error analysis), au lieu de regarder un seul score.

## Concepts clés
Tâches à état vérifiable, pass@k vs pass^k, variance et répétitions, LLM-as-judge et sa calibration, contamination, évals de régression en CI, analyse d'erreurs par catégories.

## Sources
- 🟢 [Anthropic, Demystifying evals for AI agents (janv. 2026)](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) : pass@k (au moins 1 succès sur k) vs pass^k (k succès sur k) ; « 20-50 tâches simples tirées de vrais échecs » pour démarrer ; noter le résultat plutôt que le chemin ; lire les transcripts
- 🟢 [Hamel Husain, Your AI product needs evals](https://hamel.dev/blog/posts/evals/)
- 🟢 [Inspect AI (UK AISI)](https://inspect.aisi.org.uk/), framework d'évals open source
- 🟢 [SWE-bench](https://www.swebench.com/), pour comprendre la construction d'un benchmark d'agent de code
- 🔵 [τ-bench (Sierra, 2024)](https://arxiv.org/abs/2406.12045), qui a popularisé pass^k pour mesurer la fiabilité
- 🔵 [SWE-bench, le papier](https://arxiv.org/abs/2310.06770) (Jimenez et al., ICLR 2024) : 2 294 issues GitHub réelles ; le meilleur modèle de l'époque en résolvait 1,96 %
- 🔵 [Judging LLM-as-a-Judge with MT-Bench and Chatbot Arena](https://arxiv.org/abs/2306.05685) (Zheng et al., 2023) : plus de 80 % d'accord avec les humains, mais biais de position, de verbosité et d'auto-complaisance

## Lab homelab

**L-H4 : Banc d'évals sur tâches homelab**

### Étapes
1. Écrire 20 tâches réalistes avec un état final vérifiable, par exemple :
   - « le pod X crashloop, trouve pourquoi » (incident injecté dans `lab-evals`) ;
   - « ajoute une règle Alertmanager pour Y » (validé par `promtool test rules`) ;
   - « corrige ce rôle Ansible pour que `ansible-lint` passe ».
2. Graders automatiques (tests, `kubectl`, lint), plus un LLM-judge calibré seulement là où c'est indispensable.
3. Lancer avec [Inspect AI](https://inspect.aisi.org.uk/) ou un runner maison, 3 répétitions par tâche, et calculer pass@1 et pass^3.
4. Comparer : mini-agent L-H1 contre Claude Code, puis MCP avant contre après L-H2.
5. Faire l'analyse d'erreurs : catégoriser les échecs en lisant les traces.

### Livrable
Repo `homelab-evals`, rapport comparatif, taxonomie d'échecs.

## Validation
- [ ] 20+ tâches, chacune avec un grader automatique.
- [ ] Un rapport compare 2 variantes de harness, avec au moins 3 répétitions par tâche.
- [ ] Une taxonomie de mes échecs les plus fréquents existe.
