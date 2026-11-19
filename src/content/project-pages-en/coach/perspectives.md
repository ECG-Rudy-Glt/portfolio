---
project: coach
title: "Limitations and outlook"
summary: "What is not done or not validated, and what comes next: human review, English, other watches, account security."
order: 9
---

## What is not validated

**The rules and the publications.** The base holds 60 publications whose abstracts have been verified, but no full text has been reread by a specialist. The rules are a version 0. The application says so, and the human review issue is the priority before any wider promotion.

**The plans themselves.** They are consistent with the rules (that is what the tests check), not proven beneficial for a given individual. Hence the cautionary message repeated in the application and the documentation.

## What is missing

- **The interface is in French only** (code, documentation and API are in English). Internationalisation, with text extraction and a language file, is the biggest obstacle to adoption.
- **Only one watch brand is connected** (Garmin, through an unofficial library). FIT file import would open up Coros and the others.
- **No two-factor authentication**, no "my devices" screen, and not yet any data export and deletion from the application.
- **Accepted technical debt**: the interface's JavaScript file exceeds 1,400 lines and the data repository 900; no end-to-end tests of the interface.

## What comes next

1. Import of activity files (Coros, Suunto, Polar, Apple Watch).
2. English interface.
3. Human review of the rules and publications, and filling the gaps (long run, hills and descents, cycling, Hyrox).
4. Two-factor authentication, data export and deletion, encrypted backups.
5. End-to-end interface tests and an accessibility audit (VoiceOver, TalkBack, contrast of the three themes).

## What I take from it

A design rule that served me everywhere: **everything that touches a number belongs to testable code, not to the model**. It makes the project less spectacular than an "AI coach" that improvises, and much easier to audit, test and correct.
