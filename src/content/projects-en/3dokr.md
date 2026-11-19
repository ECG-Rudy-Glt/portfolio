---
title: "3DOKR - Docker Swarm orchestration"
category: ecole
summary: "A Docker Swarm cluster deployable three ways: automated with Vagrant, manually on 3 VMs, or locally with Docker Compose."
period: "SUPINFO - 3rd year"
role: "Individual project"
stack: ["Docker Swarm", "Docker Compose", "Vagrant"]
tags: ["Orchestration", "Infrastructure as Code", "Docker"]
links:
  repo: "https://github.com/ECG-Rudy-Glt/3DOKR-"
relevance: "secondaire"
order: 14
---

## The problem

Relying solely on ready-made automation is not enough to grasp how Docker Swarm orchestration works: you also have to know how to build a cluster by hand to understand what the automation hides.

## The solution

Three branches of the same repository, each a different way of approaching the same problem:

- **`swarm_config`**: a multi-VM Swarm cluster fully automated with Vagrant - started and configured with a single command, for reproducible use.
- **`mano`**: manual construction of the cluster on 3 virtual machines, step by step - each `docker swarm init` / `docker swarm join` command run and understood individually, rather than hidden behind a script.
- **`docker_dev`**: a local development environment in plain Docker Compose, without the complexity of a cluster, to iterate quickly without VMs.

## What it demonstrates

Three levels of abstraction on the same problem: automated production, manual learning, local development - a way of showing that automating a task is only worth something if you can explain it without the automation.
