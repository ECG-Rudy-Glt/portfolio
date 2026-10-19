---
project: coach
title: "Le coach IA et ses garde-fous"
summary: "Un LLM qui commente sans calculer : frontière de sécurité, validation côté serveur, fournisseurs interchangeables, plafond de dépense, mode dégradé."
order: 4
---

## Un rôle limité à expliquer

Le modèle ne fixe **aucun chiffre**. Il relit la semaine (séances prévues, faites, sautées, retours, activités de la montre), la commente honnêtement et peut *proposer* au plus quelques ajustements sur des séances futures. Le plan, lui, reste celui du moteur de règles.

<pre class="mermaid">
sequenceDiagram
    participant S as Serveur
    participant L as Modèle
    S->>S: construit le contexte (profil, séances, cycle, règles, sources) sans nom ni e-mail
    S->>L: consigne + contexte JSON (+ outils en lecture seule)
    L-->>S: commentaire + 4 propositions au plus
    S->>S: valide chaque proposition
    Note over S: règle citée existante - publication existante<br/>réduction entre 0,5 et 0,95 : jamais d'ajout de charge<br/>séance future et non traitée - jour non bloqué
    S->>S: journalise le coût et applique le plafond mensuel
</pre>

## La validation, pièce centrale

Chaque proposition passe par `check_proposal` : la règle et la publication citées doivent exister dans les listes fournies, le facteur de réduction doit rester dans une plage qui ne peut que *diminuer* la charge, la séance doit être future et encore planifiée, un déplacement ne peut ni sortir de la semaine ni tomber sur un jour bloqué ni rapprocher une séance clé de jambes lourdes. Ce qui échoue est écarté, compté et journalisé avec sa raison. Même un modèle détourné par un texte malveillant (un nom d'activité venu d'une montre, par exemple) ne peut au pire produire qu'une proposition rejetée.

## Ce que le modèle voit, et ce qu'il ne voit pas

Un instantané construit par le serveur : âge (pas la date de naissance), objectifs, séances récentes, position dans le cycle, tendance des charges, résumé de l'historique de la montre, règles et publications citables. Ni nom, ni e-mail, ni identifiant de compte : un test échoue si l'identité fuite dans une consigne. Les outils offerts au modèle (recherche dans l'historique de la montre) sont en lecture seule, bornés en taille, et liés à l'utilisateur courant par construction.

## Fournisseurs interchangeables

Un catalogue de fournisseurs (`data/llm_providers.yaml`) décrit Anthropic, OpenAI, Gemini, Mistral, OpenRouter, Ollama et tout serveur compatible OpenAI, avec leurs modèles suggérés et leur modèle « rapide » pour les tâches courtes comme l'estimation d'un repas. On change de fournisseur en modifiant deux variables et une clé. Ollama permet de tout garder sur la machine. L'API expose le fournisseur et le modèle actifs, jamais la clé.

## Coût maîtrisé

Chaque appel est journalisé (modèle, jetons, coût estimé) et un **plafond mensuel** appliqué côté serveur refuse les appels au-delà. C'est ce qui rend la partie « coach » abordable : quelques euros par mois au maximum, ou rien avec un modèle local.

## Sans IA, ça marche

Sans clé (ou avec `LLM_PROVIDER=none`), le questionnaire, le plan, la nutrition, la musculation et le suivi fonctionnent. Seuls le bilan hebdomadaire, la discussion et l'estimation de repas par photo sont inactifs, et l'interface l'indique plutôt que de planter.
