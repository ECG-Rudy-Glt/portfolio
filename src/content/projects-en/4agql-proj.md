---
title: "SchoolInc - School management on GraphQL microservices"
category: ecole
summary: "A school management app (students, classes, grades) built on 3 independent GraphQL microservices, stitched together with GraphQL Mesh."
period: "SUPINFO - 4th year"
role: "Individual project"
stack: ["Node.js", "GraphQL Mesh", "Next.js", "MongoDB", "Docker Compose", "JWT"]
tags: ["GraphQL", "Microservices", "Full-stack", "Docker"]
links:
  repo: "https://github.com/paulmzzn/4AGQL-PROJ"
relevance: "pertinent"
order: 13
---

## The problem

A school management application mixes several business domains (authentication, classes, grades) that evolve at different paces. Coding everything in a single monolithic REST service makes every change risky for the whole system, and a web client would have had to query several endpoints separately to assemble a single view.

## The solution

Split the system into 3 independent GraphQL microservices (auth, class, grade), each with its own database, and aggregate them behind a GraphQL Mesh gateway that exposes a single schema to the frontend - the client queries one entry point without knowing how many services answer behind it.

## Technical choices & architecture

- **Services**: 3 standalone Node.js/GraphQL microservices, each with its own MongoDB database - scalable and deployable independently of one another.
- **Gateway**: GraphQL Mesh to merge the schemas of the three services into a single, coherent API for the client.
- **Frontend**: Next.js, consuming this unified API.
- **Security**: JWT authentication propagated between services so that each microservice can verify the caller's identity without going back to the authentication service on every request.
- **Orchestration**: Docker Compose to start all the services and the gateway with a single command in local development.

## Result

An architecture where adding a fourth business domain (for example timetable management) would only require a new microservice and an update to the gateway, without touching the existing services.
