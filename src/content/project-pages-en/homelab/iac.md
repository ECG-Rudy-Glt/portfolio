---
project: homelab
title: "Infrastructure as Code - the technical detail"
summary: "Nothing is created without being codified. The concrete detail: how Terraform, Ansible, OpenBao and FluxCD fit together, with real code rather than a general description."
order: 5
---

## The principle

A rule held from the start: **nothing is created manually without being immediately
codified.** If a VM is provisioned by hand one evening to test quickly, it is taken over in
Terraform as soon as possible - otherwise it does not really exist in the eyes of the rest of the
infrastructure.

## Terraform - provisioning

The [`bpg/proxmox`](https://registry.terraform.io/providers/bpg/proxmox) provider drives Proxmox
through its API. Every VM and LXC container of the lab is a versioned resource:

```hcl
resource "proxmox_virtual_environment_vm" "vm_pbs" {
  node_name = local.node1
  vm_id     = 116
  name      = "vm-pbs"

  cpu {
    cores   = 2
    sockets = 1
  }

  memory {
    dedicated = 2048
  }

  disk {
    datastore_id = "local-lvm"
    size         = 20
    interface    = "scsi0"
  }

  network_device {
    bridge  = "vmbr0"
    vlan_id = local.vlan_lab
  }
}
```

Authentication by API token - no plaintext password - and the secrets (Proxmox credentials,
SSH keys) are read from the vault at `terraform apply` time, never
committed in a `.tfvars`.

### A shared, locked state

For months the Terraform state stayed local, on the admin workstation: two workstations could
drift apart, and losing the file would have meant re-importing everything. Since November 2026 the
states are merged into a **locked S3 backend** (object storage with a European host), and CI uses a
Terraform version that handles this lock natively. The merge was a chance to realign the code with
reality: `terraform plan` now shows no difference across the 22 managed guests.

## Ansible - configuring

Once a machine is provisioned, Ansible takes over: packages, users,
hardening, application deployment. Each service has its role
(`Ansible/roles/<service>/`) and its deployment playbook.

Application secrets are **never hardcoded in a playbook** - they are fetched at runtime
from OpenBao:

```yaml
vaultwarden_admin_token: "{{ lookup('community.hashi_vault.vault_kv2_get', 'homelab/vaultwarden').secret.admin_token }}"
```

## OpenBao - the central vault

Detailed in the dedicated article [Building an internal PKI](/blog/homelab-pki-secrets/). In
short for this page: application secrets in a versioned KV, a two-level internal PKI (Root CA
+ Intermediate CA) with automatic renewal of TLS certificates through a dedicated agent on the
reverse proxy.

## FluxCD - GitOps on Kubernetes

For everything running on k3s, no manual `kubectl apply`. Each application keeps its own
repository (Patrimoine, COACH, the freelance CRM), and Flux follows both the lab repository and
the application repositories:

1. A manifest is modified in the repository
2. `git push` to Forgejo, the lab's self-hosted Git repository
3. FluxCD detects the change and applies it automatically to the cluster
4. The state can be checked directly: `flux get kustomizations`

The Git repository becomes the only source of truth for the cluster's desired state - no silent
drift between "what is documented" and "what actually runs".

## The generated inventory, source of truth

With 25 guests and 41 routes, a hand-maintained table always ends up lying (a VM's RAM changed, a
service moved). A script reads Proxmox, Terraform, Traefik, k3s and Ansible in **read-only** mode
and generates the full inventory: each guest with its node, resources, network, backups and
routes, plus a graph of the whole. It also flags gaps, such as a guest with no backup or no
off-site copy. Each guest has its own card, with a "known pitfalls" section fed by past incidents.

## Forgejo - the central repository

This whole chain (Terraform, Ansible, Kubernetes manifests) lives in a Git repository self-hosted
on Forgejo, with its own CI/CD that validates each change (Terraform lint, Ansible lint)
before it is applied.

## This portfolio itself: Cloudflare Tunnel + Forgejo Actions CI/CD

This site runs on the same lab, with an exposure model different from that of
[Jellyfin](/en/projets/homelab/jellyfin/). Jellyfin goes out directly (port-forward + GeoIP + CrowdSec)
because Chromecast casting needs direct access to the stream. The portfolio has no constraint
of this kind - static pages, no heavy stream - so the most restrictive possible model was
chosen: **Cloudflare Tunnel**. The container hosting the site opens **no inbound port**
on the home network - it itself initiates an outbound connection to Cloudflare, which relays
public traffic to it. Zero ports to defend on the home side, unlike the Jellyfin path.

Deployment follows the same GitOps principle as the rest of the lab: each `git push` to this repository
triggers a **Forgejo Actions** pipeline, run on the self-hosted runner already mentioned
above (isolated LXC, Docker executor) - site build, then deployment, with no manual
intervention. The portfolio you are reading literally built and published itself
at the last commit.

## Why this discipline matters

On a solo project, the temptation of "I'll do it quickly by hand, I'll codify later" is
permanent - and "later" never comes if you do not commit to it from the start. This
discipline has paid off concretely: during serious incidents (see
[the incidents](/en/projets/homelab/incidents/)), the question was never "do I have the
commands to rebuild everything" - it was already written down.
