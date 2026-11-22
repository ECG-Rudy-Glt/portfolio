---
project: homelab
title: "Security - and the pentest run on my own infra"
summary: "The protection layers (PKI, SSO, IDS, hardened public exposure) are on the project page. Here: the complete credential rotation, and above all the raw results of a pentest run in real conditions."
order: 7
---

The protection layers already in place - internal PKI, SSO, Suricata, CrowdSec, geographic
blocking - are detailed on the
[project page](/en/projets/homelab/#network-security-detection-blocking-visibility) and in the article
[Building an internal PKI](/blog/homelab-pki-secrets/). This page covers what is written
nowhere else: the verification approach, and what a real penetration test found.

## Not settling for documenting what you believe is secure

Many personal projects stop at "I put in a firewall and a VPN, so it is
secure". Once the protections were built, they were **deliberately attacked** from
the outside to check that they really hold - not just on paper. The internal side
(the scenario of an attacker already present on a VLAN) is still to be done.

## The complete credential rotation before any test

Before launching the slightest penetration test, all the secrets created during the construction
phase were considered burned and rotated in full - system access, shared SSH keys,
application secrets, third-party API tokens. Testing with potentially already exposed credentials
would have skewed the results.

## The pentest - what was really found

### What holds, verified in real conditions

Tested from a genuinely external point of view (mobile connection, foreign VPN - not from the internal
network, which would have bypassed the protections and skewed the results):

- **No internal route leak**: impossible to reach an internal service (reverse proxy
  dashboard, DNS administration interface) by pointing directly at the public IP with the
  right host header
- **Rate limiting really works**: a burst of requests beyond the configured threshold
  triggers a controlled rejection, without ever bringing the service down
- **Brute-force detection works end to end**: an attempt with repeated failed logins
  was detected, a blocking decision created, and applied at the network level
  - not just at the application level
- **Geographic filtering really blocks**: tested from a VPN located outside the
  allowed zone, the connection is cut before even reaching the application

### The internal side, still to do

The external test covers only one scenario: an attacker who has never set foot on the network.
The complementary scenario - an attacker who already has partial access, on a
compromised VLAN for example - is still to be run from inside the network. It is part of
[what comes next](/en/projets/homelab/perspectives/).

The pentest also raised several points to fix, handled as they came - an audit
that never finds anything was not done seriously. The precise detail of each gap does not belong
here (public attack surface), but the method and the honesty of the result are
the real subject of this page: it is not a vague claim of "strengthened security", it is
an audit with facts that were verified, fixed, and tracked.

## What has been hardened since the pentest

Security is not a state reached once, and incidents have often shown where to harden:

- **Proxmox over proper HTTPS**: the nodes' admin interface now presents a certificate signed by
  the internal PKI, renewed daily by an OpenBao role that can only issue that certificate.
- **The reverse proxy no longer needs the Internet to start**: the CrowdSec plugin is embedded in
  its configuration, after an outage in which it silently disabled every public route (see
  [the real outages](/en/projets/homelab/incidents/)). Probes continuously check that the public
  routes and DNS respond.
- **No secret can enter the repository**: a secret scan before every commit, and a hook that
  blocks commands containing a plain-text token, including those run by an agent.
- **A guarded AI agent, not a free one**: the lab assistant has no direct network access to the
  house's services, goes through a policy service that holds the tokens, and cannot confirm a
  sensitive action itself. It had its own security pass (locks, rate limits, service hardening,
  file permissions) - detail in [AI tooling](/en/projets/homelab/outillage-ia/).
