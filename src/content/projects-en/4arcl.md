---
title: "4ARCL - FlyAway Airlines architecture"
category: ecole
summary: "Design of a full architecture (frontend, backend, data, storage) for an airline serving millions of users, with SLO and compliance requirements."
period: "SUPINFO - 4th year"
role: "Team project (2 people)"
stack: ["Cloud architecture", "Microservices", "Event Bus", "Excalidraw"]
tags: ["Architecture", "Design", "Security", "Compliance (GDPR/PCI-DSS)", "Teamwork"]
images:
  - "/projets/4arcl/Architecture-Globale.png"
  - "/projets/4arcl/Microservices-et-Event-Bus.png"
  - "/projets/4arcl/Couche-de-Donnees.png"
  - "/projets/4arcl/Securite-et-Reseau.png"
relevance: "pertinent"
order: 11
---

## The problem

FlyAway, the fictional airline of the brief, has to handle flight search and booking for millions of concurrent users, with a 500 ms SLO target and GDPR and PCI-DSS (payment) compliance constraints. Not a single line of code to write here: the exercise is about designing an architecture that meets these constraints before writing any code.

## The solution

A microservices architecture decoupled by an event bus, with a critical, justified analysis of each structuring choice rather than a "default" solution.

## Approach & architecture choices

- **Compute & hosting**: a reasoned comparison between an own datacenter and the public cloud, weighing cost, elasticity under load peaks (high season) and control over data.
- **Decoupling**: a microservices architecture with an event bus, so that the failure of one service (payment, for example) does not block flight search.
- **Security & compliance**: a dedicated layer to meet GDPR (personal data) and PCI-DSS (payment data) requirements - encryption, network segmentation, access rights.
- **Deliverable**: a detailed 12-to-15-page architecture document and 4 diagrams (overall architecture, microservices & event bus, data layer, security/network).

## Skill highlighted

Reasoning about large-scale architecture (scalability, resilience, compliance) before implementation, as a pair - a structuring approach that complements more execution-oriented projects such as 4KUBE or SUPCHAT.
