---
project: homelab
title: "Home automation, network extension and local video surveillance"
summary: "Home Assistant as the only gateway to the isolated IoT VLAN, and the ongoing work to extend it: a dedicated multi-SSID WiFi AP (replacing an abandoned powerline project) and a 100% local indoor camera, with no third-party cloud dependency."
order: 9.8
---

## Home Assistant - a hub, not an open door

[Home Assistant](https://www.home-assistant.io/) runs as a dedicated service on the lab, and it is the
**only** one allowed to talk to the isolated IoT VLAN (see [the network infrastructure](/en/projets/homelab/infrastructure/)
for details on the 4 VLANs). The principle is simple: the home automation devices themselves have
no direct access to the rest of the network or to the Internet - only Home Assistant, on its own segment,
is allowed to talk to them. A compromised IoT device stays confined to its VLAN, with no possible
pivot to the rest of the infrastructure.

## Why extend the network now

Two needs appeared in parallel, both blocked by the same physical limit: the wall Ethernet
socket in some rooms does not lead to the lab's VLANs, but to the internet provider box's
own network (two distinct IP networks, no gateway between them without
rewiring everything). First need: a TV in a room with no direct access to the lab network, hence
no possible Jellyfin discovery. Second need, which appeared at the same time: an apartment
surveillance camera, to be connected to the lab rather than to the manufacturer's cloud.

A first attempt with powerline (CPL) for the TV was abandoned after several evenings of
inconclusive tests (results polluted by WiFi left active on the test devices, one
test even cutting off Internet access while I fixed it) - no point in persisting
with a technology whose reliability, by nature, depends on the quality of the apartment's
electrical wiring. The solution chosen instead: a single dedicated WiFi access point, shared between
the two needs.

## The choice of access point - and a limit found after purchase

Chosen model: **Cudy WR3000E** (WiFi 6 AX3000, 5 Gigabit ports, native "access point" mode in
the stock firmware) rather than a more expensive model initially considered - the right
features/price ratio for a simple AP, without the cost of a centralised controller that is unnecessary here.

An important point discovered while digging into the datasheet before purchase: the stock Cudy firmware,
although probably built on an OpenWrt base internally, does not expose its LuCI interface or
per-SSID VLANs - it is impossible to attach an SSID to a specific VLAN directly from the
proprietary UI. Good news: Cudy itself documents and signs the flash path to
official OpenWrt for this model - not an unsupported third-party hack. The plan chosen therefore goes through
a full flash to OpenWrt, to regain the fine control needed: two SSIDs (`lab-media`
for the TV, `lab-iot` for the camera), each attached to its own tagged VLAN, with the uplink port
configured as a trunk to the main switch.

Another point settled even before purchase: Cudy offers its own cloud management app (Cudy
Mesh, TR-069 remote administration) - **ruled out from the start**, same logic as for the camera
below. Internal network equipment is managed locally, not through a third-party cloud account.

## The camera - local RTSP, zero cloud

Chosen model: **Reolink E1 Pro**, chosen specifically because it exposes RTSP/ONVIF
locally without depending on the manufacturer's cloud - unlike mainstream alternatives such as
Ring or Nest, structurally built around a cloud subscription. The Reolink app's P2P/cloud will be
disabled in favour of local-only mode: a security camera that continuously "phones home"
to a third party defeats the purpose.

On the network side, the camera connects to the `lab-iot` SSID (IoT VLAN) like any other
home automation device - the same isolation model as for Home Assistant: no outbound Internet access
for this VLAN, only the recording service is allowed to pull the RTSP stream.
The recording itself will be handled by [Frigate](https://frigate.video/) (object/person
detection on top of plain continuous recording), with storage on the NAS already in place
for the rest of the lab (see [storage](/en/projets/homelab/stockage-hdd/)).

## Remote access - reuse what already exists

No new VPN to deploy to view the stream from outside: Tailscale already runs at the level of
the OPNsense firewall, with subnet routing over the whole lab network - the IoT VLAN
will be part of it once created. Once connected to Tailscale from an external device, access to the
NVR works exactly as from the apartment. Duplicating this mechanism with a VPN specific to
the AP would have been redundant - the right answer here was to build nothing more, not to add
a layer.

## Where things stand

The hardware (AP + camera) is still to be ordered as I write these lines, but the design
is complete: which model, why, what the stock firmware does not allow, how to work around it
cleanly, and a detailed configuration checklist ready to run on receipt (OpenWrt flash,
VLANs, SSIDs, firewall rules). The conscious choice was to invest the time in
design before purchase, rather than buy and then discover a blocking limit afterwards -
which is exactly what happened with the stock firmware, but before ordering, not
after.
