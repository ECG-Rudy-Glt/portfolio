---
project: coach
title: "The AI coach and its guardrails"
summary: "An LLM that comments without calculating: security boundary, server-side validation, interchangeable providers, spending cap, degraded mode."
order: 4
---

## A role limited to explaining

The model sets **no number**. It rereads the week (planned, completed and skipped sessions, feedback, watch activities), comments on it honestly and may *propose* at most a few adjustments to future sessions. The plan itself remains that of the rules engine.

<pre class="mermaid">
sequenceDiagram
    participant S as Server
    participant L as Model
    S->>S: builds the context (profile, sessions, cycle, rules, sources) with no name or e-mail
    S->>L: instruction + JSON context (+ read-only tools)
    L-->>S: comment + at most 4 proposals
    S->>S: validates each proposal
    Note over S: cited rule exists - publication exists<br/>reduction between 0.5 and 0.95: never adds load<br/>future, unprocessed session - day not blocked
    S->>S: logs the cost and applies the monthly cap
</pre>

## Validation, the central piece

Each proposal goes through `check_proposal`: the cited rule and publication must exist in the lists provided, the reduction factor must stay within a range that can only *decrease* the load, the session must be in the future and still planned, and a move can neither leave the week, nor land on a blocked day, nor bring a key session closer to heavy legs. Whatever fails is discarded, counted and logged with its reason. Even a model hijacked by malicious text (an activity name coming from a watch, for example) can at worst produce a rejected proposal.

## What the model sees, and what it does not

A snapshot built by the server: age (not the date of birth), goals, recent sessions, position in the cycle, load trend, a summary of the watch history, citable rules and publications. No name, no e-mail, no account identifier: a test fails if identity leaks into a prompt. The tools offered to the model (search in the watch history) are read-only, size-bounded, and tied to the current user by construction.

## Interchangeable providers

A provider catalogue (`data/llm_providers.yaml`) describes Anthropic, OpenAI, Gemini, Mistral, OpenRouter, Ollama and any OpenAI-compatible server, with their suggested models and their "fast" model for short tasks such as estimating a meal. You switch provider by changing two variables and a key. Ollama makes it possible to keep everything on the machine. The API exposes the active provider and model, never the key.

## Controlled cost

Each call is logged (model, tokens, estimated cost) and a **monthly cap** enforced server-side refuses calls beyond it. That is what makes the "coach" part affordable: a few euros a month at most, or nothing with a local model.

## It works without AI

Without a key (or with `LLM_PROVIDER=none`), the questionnaire, the plan, nutrition, strength training and tracking all work. Only the weekly review, the chat and meal estimation from a photo are inactive, and the interface says so rather than crashing.
