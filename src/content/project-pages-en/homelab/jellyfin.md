---
project: homelab
title: "Jellyfin - family streaming without local storage"
summary: "The most complex service of the lab: zero media stored locally, real hardened public exposure, easy casting for the whole family via Streamyfin, and the complete technical chain behind a simple movie search."
order: 9
---

## Why zero local storage

Investing in several terabytes of disks for a media library was not an option consistent with the
rest of the project (see [the equipment](/en/projets/homelab/materiel/)). The chosen chain relies entirely on a
debrid service: the content is never downloaded onto the infrastructure itself.

## The complete technical chain

From the family's click to playback, several distinct components follow one another:

```
Family (♥ favourite OR search + request)
   │
   ▼
Jellyseerr (request interface, Netflix-style)
   │
   ▼
Radarr / Sonarr (movie / series library, quality profiles, language)
   │  ← Prowlarr (sources) · Bazarr (subtitles)
   ▼
Debrid client (the file stays stored remotely)
   │
   ▼
WebDAV mount (rclone) + symbolic links - the file appears as local
   │
   ▼
Jellyfin core (hardware transcoding via the iGPU if needed, catalogue, accounts)
   │
   ▼
Client (Streamyfin / Wholphin / web) - direct playback or cast
```

Two request mechanisms coexist, independent of the client used: the ♥ (favourite) on a
suggested item automatically triggers the chain above through a server plugin that watches
this standard Jellyfin API action - universal, available on all clients. Manual
search with quality selection goes through a different integration depending on the
client (see below for Streamyfin).

> **September 2026: Riven replaced by the *arr stack.** The first version relied on Riven,
> an all-in-one orchestrator. It was abandoned by its maintainers, and more and more
> in-house monitoring scripts were needed to keep it stable. Radarr/Sonarr are
> standard, maintained and widely documented components: less originality, far less code to
> maintain myself.

## Why Streamyfin for the family

The real problem to solve was not "playing a video" - the official Jellyfin app already does that
very well - but **casting easily to the living-room TV from a household with a mix of
iPhone and Android**. On that specific point, Streamyfin is to date more or less the only
third-party client with a Chromecast that works **on iOS and Android at the same time** - most
alternatives only cover one of the two platforms (Findroid: Android only,
Infuse: AirPlay only on iOS, no Google Cast).

A technical detail that matters: the Chromecast does not relay the phone's screen, it
fetches the stream **itself**, directly on the home network. This required solving a
local network problem before casting worked reliably - independent of the choice of
app, but discovered while setting up Streamyfin.

A bonus that weighed in the choice: Streamyfin has its **own native Jellyseerr integration** (no
need for the web plugin injected into the client, which only works on the official apps) -
authentication delegated to the user's Jellyfin account, no separate API key to manage on the
family side. For televisions (Android TV, Google TV, Fire TV), a different client -
**Wholphin**, designed TV-first rather than as a port of the mobile app - completes the setup without
changing anything on the server side: both clients talk to the same Jellyfin instance, and the request
mechanism remains identical.

## Public exposure - not just an open port

Unlike the rest of the lab, accessible only through VPN (see
[the infrastructure](/en/projets/homelab/infrastructure/)), Jellyfin is deliberately exposed to the
Internet so that the family can reach it without configuring a VPN on every device. This exception
is protected by several independent layers rather than a single one: a geographic allowlist
at the firewall level, behavioural detection with automatic network remediation, rate limiting
on the reverse proxy side. The detail of what was verified in real conditions is in
[the security page](/en/projets/homelab/securite/).

## Family multi-accounts

Each family member has their own account, with their own access and their own history,
not a shared account. This has a cost in complexity: handling content requests per
user, making sure administration permissions stay at the right level for each person, and
debugging bugs that affect only one specific account while the others work - the
kind of problem that never appears on a single-user instance.

## The most fragile service of the lab

It is also the service that has generated the most real incidents - a backup job that freezes
on the FUSE mount point, a locked container, a chain of fixes that moves the
problem before solving it. The full story is in
[the real outages](/en/projets/homelab/incidents/). It is directly linked to its complexity: it is
the service with the most moving parts (virtual filesystem, hardware transcoding,
public exposure, multiple accounts, two distinct clients), and therefore statistically the one with
the most surface for an incident to occur.
