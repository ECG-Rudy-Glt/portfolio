---
title: "Internal automation platform - Portal & microservices"
category: entreprise
summary: "Unifying some twenty isolated automation tools (audit, monitoring, reporting, AI) behind a single web portal: secured edge, SSO, containerised microservices and a hardened CI/CD chain."
period: "2025 - 2026 (ongoing)"
role: "Solo design and development, as part of my work-study"
stack: ["Caddy", "Authelia (SSO/OIDC)", "React", "FastAPI", "Docker", "PostgreSQL", "GitLab CI", "gitleaks", "Grype", "Checkov", "Syft (SBOM)", "Python", "LLM / tool-calling"]
tags: ["Architecture", "Microservices", "Security", "SSO", "CI/CD", "DevOps", "AI / AIOps"]
featured: true
relevance: "majeur"
order: 5
---

## The problem

Over the course of my work-study, I created or took over some twenty independent automation tools (infrastructure audit, network monitoring, reporting, document generation, first AI use cases). Each had been built in isolation to meet a specific need quickly - a sound choice at the start, with minimal cost and coupling. But at this scale, the model showed its limits: as many entry points as tools, no common authentication, API clients reimplemented in every project, secrets duplicated across several repositories, and a single person (me) holding the knowledge of the architecture of the triggers between pipelines - a real risk for team continuity.

I formalised this finding in two scoping documents submitted to my management: one proposed a web portal to unify access to the tools, the other a microservices platform to industrialise their execution. Rather than treating them as two separate workstreams, I ended up merging them into a single real project.

## The solution: a single entry point, secure by construction

The architecture rests on a single edge (Caddy reverse proxy, internal TLS) that replaces the many independent entry points, shared authentication through SSO (Authelia - named accounts, groups, optional 2FA) so that no satellite tool reimplements its own access management, a React landing portal that shows each user the tools available to their group, and a shared Docker network that connects the modules to one another without exposing them individually.

```
User ─► Caddy edge (TLS) ─► Authelia SSO
                     │
        ┌────────────┼────────────────────┬───────────────┐
   Network       Reporting /         Operations         Azure DevOps
   monitoring    alert tracking      documentation      orchestrator
   (dashboard,   (replaces manual    (port of a         (webhook + polling,
   inventory)    Excel files)        desktop tool       shared API client)
                                     to the web)
        │
   AI agent (read-only tool-calling on the internal APIs)
```

Eight modules are federated behind this entry point today: a declarative tool for managing the lifecycle of monitored network devices (Terraform-style, `plan`/`apply` on a versioned inventory), its consultation frontend, a critical-alert tracking tool that replaces a 42-tab Excel file that had become unmanageable, a module that detects disabled monitoring probes with batch reactivation, a web reader for operations documentation (a port of an old standalone desktop application), an orchestrator that centralises automations on the project management tool side (shared API client, replacing 6 legacy webhook projects with a single entry point), and an AI conversational agent detailed below.

## DevOps and security process

Each module goes through a common CI/CD chain that I built for the whole platform rather than project by project:

- **Secret detection** (gitleaks) over the full history of the repositories, not just the latest commit.
- **Dockerfile linting** and **image vulnerability scanning** (Grype, after dismissing a competing tool following documented security incidents).
- **Misconfiguration checks** (Checkov) and **systematic SBOM generation** (Syft, CycloneDX format) to trace the dependencies of each service.
- **"Push"-mode deployment** (build → image export → transfer → load) because the production VM has no direct access to the registry - a real network constraint, worked around rather than ignored.

Before going into production, I carried out a security audit of the platform itself, which revealed default passwords on a database, an API exposed without authentication and open CORS on one of the modules - all fixed before opening, in a security-by-design approach rather than bolted on afterwards.

## A scoped AI use case rather than unlimited ambition

Earlier in my journey, I had developed a chatbot for automatic ticket analysis that had to be abandoned: hallucinations were too frequent and the data scope too heterogeneous for an LLM to process reliably. That experience directly shaped how I integrate AI into this platform: the conversational agent that runs there today answers natural-language questions about the monitoring data by querying the modules' real APIs through **tool-calling** - no invented value, only data fetched live - with a fully stateless service on the server side, strictly read-only calls, and an audit log of all exchanges. It is the same guardrail principle as the one applied to my cross-checking compliance tool, which systematically combines the LLM with deterministic rules rather than letting it decide alone.

## Status and results

The platform has been built at a near-daily pace since it started, with several modules already in production and others still being integrated - I prefer to document it as it is rather than present an active workstream as finished. Concretely, it has already made it possible to retire six redundant webhook projects in favour of a single orchestrator, to replace several manual tracking processes with shared, secured tools, and to give the whole squad a common entry point instead of one tool per need.

Above all, it was designed from the start not to stay frozen at these eight modules: new services (reporting, AI, monitoring) are already planned to join it as needs arise, without having to recreate an entry point, authentication or a CI/CD chain for each tool as used to be the case - which is precisely what this architecture was meant to solve.

## What remains to be done

Finalise the CI/CD hardening of the last modules, put the conversational agent into production, fully share the last API clients that are still duplicated, and start the governance side that I have not yet addressed (centralised secrets management, distributed observability). In the longer term, move the current Docker Compose deployment to a real cluster orchestrator to open the platform to other teams - the initial vision, but its end point, not yet its current state.
