---
title: "Work-study at Cloud Temple - Infrastructure & Automation"
category: entreprise
summary: "Three-year work-study contract at Cloud Temple: ESXi/Ansible automation, large-scale network monitoring (~1,000 devices) and AIOps (AI applied to CI/CD and reporting)."
period: "2024 - Sept. 2027 (planned)"
role: "Infrastructure & automation work-study engineer"
stack: ["VMware ESXi", "Ansible", "govc", "Nagios", "SNMP", "Azure DevOps", "Confluence", "SendGrid", "Python", "Bash", "YAML"]
tags: ["Virtualisation", "Ansible", "CI/CD", "Monitoring", "Scripting", "AI / AIOps", "Project management"]
images: ["/logos/cloud-temple.png"]
featured: true
relevance: "majeur"
order: 6
---

Three-year work-study contract at **Cloud Temple**, a cloud hosting provider. End clients remain confidential; what follows describes the assignments and skills developed, without naming any specific client environment.

## Automation & virtualisation

- **Hypervisor lifecycle**: complete automation of the configuration and post-configuration of ESXi hosts with Ansible, where it used to be done host by host by hand.
- **VM deployment**: automated deployment of virtual machines (Windows/Linux) on standalone ESXi through the `govc` library.
- **Compliance auditing**: design of audit pipelines to check that remote ESXi hosts meet clients' contractual requirements, and a dedicated Ansible role for auditing Windows/Linux VMs.

## Large-scale monitoring & networking

- **Automated monitoring management**: automated deployment and management of Nagios monitoring infrastructures covering about 1,000 devices (switches, routers).
- **Probe configuration**: automatic generation of ICMP/SNMP monitoring probes, with no device-by-device manual configuration.
- **Event-driven monitoring**: design of a microservices project to automatically monitor devices through cross-pipeline triggers on Nagios - detecting an event on one pipeline triggers a monitoring action on another.

## DevOps & innovation (AIOps)

- **Azure DevOps automation**: design of CI/CD pipelines on Azure DevOps to make the delivery of internal tools more reliable (build, tests, deployment), with AI models integrated to generate automated feedback directly on pull requests and builds - reducing manual review time.
- **Automated report delivery**: a complete chain for generating and sending activity and KPI reports via SendGrid, triggered automatically by the pipelines rather than produced by hand at the end of the period.
- **KPIs & steering**: construction of tracking indicators (progress, compliance, incidents) consolidated automatically, to give an up-to-date, quantified view without manual data extraction.
- **Living documentation**: dynamic generation of technical documentation on Confluence from the pipelines, so that it stays in sync with the actual state of the infrastructure rather than becoming obsolete.
- **Hardware auditing**: a dedicated Ansible role for ESXi/iLO/iDRAC auditing, with automatic generation of audit PDFs and acceptance sheets - the same principle applied to the audit of Windows/Linux VMs.
- **Automated monitoring** of all these processes, to detect drift without manual intervention.

## Internal automation platform

Towards the end of the work-study, the multiplication of these isolated tools (audit, monitoring, reporting, AI) produced its own technical debt - scattered entry points, duplicated secrets, knowledge of the architecture concentrated in a single person. In response, I designed and built an internal platform that unifies them behind a secured portal (SSO, single edge, containerised microservices) - details in the dedicated project [Internal automation platform](/en/projets/plateforme-automatisation/).

## Method and approach

Daily work in Bash, Python and YAML, with a requirement for systematic documentation (any automation must be able to be taken over by a colleague). Beyond the technical side, this work-study was also an opportunity to take charge of cross-functional project tracking - planning, coordination with several teams - with a clear appetite for moving towards responsibilities combining technical expertise and project management.
