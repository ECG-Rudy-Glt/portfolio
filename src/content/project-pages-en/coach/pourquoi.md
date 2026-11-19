---
project: coach
title: "Why this project"
summary: "Sports tracking without a subscription and personalised coaching advice on the cheap: the entry point, and why no existing application suited me."
order: 1
---

## The starting point

I wanted an application able to handle my **sports tracking** without paying a subscription, and to get **personalised coaching advice on the cheap**. That is the entry point of the project. Paid offers bill every month for tracking and advice that you can produce yourself, and most applications that add "AI" let a language model invent training loads without saying where they come from.

## What I wanted out of it

**A tool of my own, with no subscription.** It runs on my homelab, my health data stays at home, and the "coach" part costs a few euros a month at most: the spending cap is adjustable server-side, and a local model (Ollama) makes it free.

**Advice that explains itself.** Each session of the plan must be able to answer "why this one, with this duration?" by citing a rule, itself attached to a publication when one exists. When the evidence is weak, the application says so.

**A complete project, not a script.** Questionnaire, plan engine, nutrition, watch synchronisation, an installable phone application, security, deployment, CI, documentation and open source release: the whole chain, alone, on a subject I actually use.

## Why not a fork of wger

[wger](https://wger.de) is the reference free application for strength training, but it only covers the workout log: no adaptive questionnaire, no multisport plan, no rules engine. A server fork would not have brought these functions into the mobile application. So I wrote the application, and took from wger only its **exercise base** (Creative Commons licence, author and licence displayed for each media item), completed by free-exercise-db.

## What the application does not claim to be

A medical device, dietary advice or a replacement for a human coach. It offers general suggestions, based on rules and publications whose limitations are stated, and refers to a professional as soon as pain or a warning sign is involved.
