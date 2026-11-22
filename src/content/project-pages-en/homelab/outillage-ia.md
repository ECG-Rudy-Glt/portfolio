---
project: homelab
title: "Claude Code, the repository harness and the lab assistant"
summary: "This homelab is built with Claude Code, a deliberate choice. Since November, the repository has its own harness (instructions, guardrails, inventory, task tracking), and the lab has a guarded AI assistant. What it changes, and the limits I know about."
order: 9.5
---

## A deliberate choice, not a hidden shortcut

A good part of this project - the Terraform and Ansible code, the technical documentation, the
incident diagnosis, including all the work on this site - was produced with
[Claude Code](https://claude.com/claude-code) as a working assistant. I say so explicitly
rather than gloss over it: it is a tooling choice, just like choosing
Terraform over a bash script, or OpenBao over an `.env` file.

That said, this lab remains an enormous personal piece of work - hundreds of hours of design,
decisions, mistakes corrected, architecture thought and rethought, condensed into one summer. The tool
changed the pace at which this work could progress, not the amount of thinking it required.

## What it changed concretely

**Keeping to deadlines all summer.** This homelab moves forward alongside a work-study contract and a
5th year at Supinfo - the available time is constrained. Having an assistant able to go fast
on writing repetitive code (a new Ansible role, a Terraform resource modelled on
another one), to dig through official documentation while I think about the
architecture, or to help me diagnose a network incident by cross-referencing several sources in
parallel, was the factor that made it possible to keep a realistic pace without sacrificing
depth - notably on the discipline of documenting everything (see
[Infrastructure as Code](/en/projets/homelab/iac/) and [the real outages](/en/projets/homelab/incidents/)),
which is precisely the first thing abandoned when time runs short.

**Staying the decision-maker, not the spectator.** Every architecture choice documented on this site - the
VLANs, the choice of OpenBao over Ansible Vault, the way of handling an incident - remains a
decision taken and understood by me, not delegated. The tool speeds up execution and helps explore
options; it does not replace understanding what runs on my own infrastructure.
It is a line I hold deliberately: I do not want to be able to make a
service work without knowing why it works.

## Two places where it really made a difference

**The pentest** (see [security](/en/projets/homelab/securite/)) is the clearest example. Running
a serious penetration test requires methodically working through dozens of checks on
several surfaces (network, application, public exposure), then interpreting each result
correctly before moving on to the next - the kind of work where having an assistant able to
run commands, read raw results and propose the next step with reasoning made it possible to go
considerably further in the time available, without skipping verification steps for lack of time.

**Infrastructure as Code** (see [IaC](/en/projets/homelab/iac/)) also benefited
directly: writing a new Ansible role or a Terraform resource modelled on a
service already in place is repetitive work where assistance speeds things up a lot, while keeping
a consistent style with the rest of the repository - a detail that matters so that the code stays
readable and maintainable, not just functional.

## From a plain assistant to a harness

Over the summer, Claude Code was a very capable assistant, but one that started from scratch every
session and could repeat a mistake already made. In November 2026 the repository got its own
**harness**: the environment that frames the agent, so it can work fast without being able to
break what matters.

- **Written instructions, enforced.** The repository's instruction file gives the map of the
  infrastructure and ten hard rules: never a hard-coded secret (everything goes through the vault),
  never a Terraform `apply` without reading the plan, never a force push, never a snapshot of the
  Jellyfin container, nothing on the machines without my approval. These rules do not rely on the
  model's goodwill: a deny list in the configuration and a **hook** that inspects every command
  before it runs enforce them.
- **The memory of past outages, at the right moment.** When a command targets a specific guest,
  the hook automatically attaches the "known pitfalls" section of its card. The November incident
  on the Jellyfin container (see [the real outages](/en/projets/homelab/incidents/)) became a rule, a
  block and a documented pitfall, so that neither I nor an agent repeats it.
- **A generated inventory rather than a described one.** The agent reads the lab's real state
  (Proxmox, Terraform, Traefik, k3s, Ansible) from an inventory produced by a read-only script,
  instead of trusting documentation that drifts (see [IaC](/en/projets/homelab/iac/)).
- **Tracking that survives sessions.** OpenSpec describes each piece of work (the what and the why:
  proposal, design, tasks), Beads tracks who does what right now. At the start of every session, a
  hook shows the ready tasks and restates the hard rules; [Relai](/en/projets/relai/), a tool I
  wrote, helps pick up the thread across several repositories.
- **Skills for repeated actions** (deploying a playbook, decommissioning a guest, touring the lab)
  and a secret scan before every commit.

This is exactly what is called *harness engineering*, and it has become a subject of study in its
own right: see my [Platform × Harness engineer learning path](/en/projets/parcours-platform-harness/).

## Hermes, the lab and household assistant

The lab also has its own agent: **Hermes**, a Telegram bot open to the family, with different
rights depending on the person. It explains every new alert (with the metrics and the known
pitfalls of the guest concerned), takes film requests, controls a few devices in the house and
sends a technical watch every Monday (new versions and known vulnerabilities of the lab's tools).

The model (Claude Haiku) is not the point; the framing is:

- **No direct access.** The bot cannot reach Home Assistant or the rest of the lab: a per-account
  network rule prevents it. It goes through a separate policy service, which holds the tokens,
  enforces roles (admin, household, family) and an allowlist of actions.
- **Out-of-band confirmation** for sensitive actions: the confirmation code is sent by the bot to
  the person, never to the model, which therefore cannot confirm itself.
- **A capped budget**: a local budget guard refuses any call beyond $1 a month (one exchange costs
  between $0.001 and $0.003), with alerts at 80% and 100%.
- **Quotas** on film requests, and a dedicated security pass (locks, rate limits, service
  hardening, file permissions).

The initial idea of a **local** LLM was measured and dropped as the default: on these mini-PCs
without a GPU, one answer took 1 to 6 minutes. The local model stays installed for cases where
privacy matters more than latency. The accepted trade-off is a remote model, behind guardrails
that do not depend on it.

## What I do not yet master in depth

Honestly: I did not configure 100% of this lab myself, by hand, line by line. Part of it
was produced with the help of Claude Code, which means there are corners of
my own infrastructure that I do not know as deeply as what I typed and
decided myself from end to end. It is a real blind spot that I own up to rather than pretending to
master every line of config at the same level.

## Staying lucid about using AI, not giving it up

AI-assisted work will remain part of my practice - denying it would be as
dishonest as claiming there was no assistance on this project. But it only makes sense if the
foundations of technical understanding remain solid behind it: knowing how to read and challenge
what is produced, knowing how to rebuild by hand if the tool is not available, knowing how to
tell a good architecture decision from a merely plausible answer. The goal is
not to choose between "do everything yourself" and "delegate everything" - it is to stay lucid about which
of the two is happening at any given moment, and to keep control of the first.
