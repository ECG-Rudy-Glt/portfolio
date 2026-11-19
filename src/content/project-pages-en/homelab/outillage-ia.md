---
project: homelab
title: "On using Claude Code"
summary: "This homelab was built with Claude Code as a day-to-day working tool - a deliberate choice, not a hidden one. Why, what it changed, and the limits I still know about."
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
4th year at Supinfo - the available time is constrained. Having an assistant able to go fast
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

## What I do not yet master in depth

Honestly: I did not configure 100% of this lab myself, by hand, line by line. Part of it
was produced with the help of Claude Code, which means there are corners of
my own infrastructure that I do not know as deeply as what I typed and
decided myself from end to end. It is a real blind spot that I own up to rather than pretending to
master every line of config at the same level.

## The plan to close that gap

Gradually going back over what was generated rather than handwritten - understanding it block
by block, not just checking that it runs - is part of the ongoing work, not just of the
"finished". In parallel, labs dedicated to AI are planned throughout my final school
year, to build a real technical understanding of LLMs themselves (beyond knowing how to
use them as a production tool). The lead already laid down on this homelab - a local,
self-hosted LLM wired to real infrastructure automations rather than to
toy use cases - is detailed in [what comes next](/en/projets/homelab/perspectives/).

## Staying lucid about using AI, not giving it up

AI-assisted work will remain part of my practice - denying it would be as
dishonest as claiming there was no assistance on this project. But it only makes sense if the
foundations of technical understanding remain solid behind it: knowing how to read and challenge
what is produced, knowing how to rebuild by hand if the tool is not available, knowing how to
tell a good architecture decision from a merely plausible answer. The goal is
not to choose between "do everything yourself" and "delegate everything" - it is to stay lucid about which
of the two is happening at any given moment, and to keep control of the first.
