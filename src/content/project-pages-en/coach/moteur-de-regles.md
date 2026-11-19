---
project: coach
title: "The rules engine"
summary: "How a plan is built without a language model: cycles, rules with identifiers, evidence level, tests, and attached publications."
order: 3
---

## Principle

The engine is **deterministic**: same facts, same plan. Each rule has an **identifier**, a value, an **evidence level** (A strong, B moderate, C field practice) and an effect verifiable by a test. Each session of the plan lists the rules it applies, and the interface displays them. When in doubt (missing data, injury, warning sign), the engine **reduces** rather than extrapolates.

## What the engine decides

- **The cycle**: blocks of 3 build-up weeks followed by a lighter week (2+1 after age 45, after a return to training or if feedback deteriorates), then phases towards the target event: base, development, peak form, taper.
- **The distribution of the week**: at most one quality session, long run capped as a share of volume, at least one rest day, days blocked by the user respected, legs never the day before a key session.
- **The strength sessions**: slots by movement pattern (push, pull, legs…) filled with exercises from the library, loads and sets that progress from one block to the next.
- **Nutrition**: estimated expenditure (Mifflin-St Jeor equation), calorie target according to the goal and the day's load, protein and carbohydrates, and reading of the weight trend to adjust.

## Rules that point to publications

The rules are linked to a base of 60 publications (`data/evidence/`). Each entry keeps the reference (DOI, PMID), the result as reported in the abstract, its **limitations** (sample size, population, duration) and a confidence level. A few examples of attachments:

- the **intensity distribution** (about 80% easy, 20% hard) relies on reviews and trials on polarised training;
- the **volume progression** and the use of the **acute/chronic workload ratio** are attached to studies that mostly show their limits: the base cites them for that, not to present them as certainties;
- the **taper** relies on a meta-analysis and a systematic review;
- the **AI estimation of a meal** is attached to studies that show its imprecision, hence calories presented as estimates (≈).

When the evidence is weak, it is written in the entry: the choice then becomes a cautious field practice, not an established result.

## How a rule enters the engine

1. It is written in `docs/rules.md` with its identifier, value and evidence level, then copied into a summary that the LLM coach is allowed to cite.
2. It is implemented in a pure function, with a cautious default value when data is missing.
3. It has a test for the nominal case, the bounds and the case where it must not trigger. A test also checks that the rules document and the summary do not diverge.

## What remains to be done

The publication abstracts have been verified (title, journal, DOI/PMID, result), but **not the full texts**, and no specialised human review has been done. The rules are a version 0. This is written in the repository, and it is an open issue.
