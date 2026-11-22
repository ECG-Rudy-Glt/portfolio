---
project: ops-delivery-suite
title: "CI Hardening"
summary: "Continuous hardening: a scheduled pipeline detects every configuration drift, fixes it and sends a report."
order: 2
---

## What it is for

Hardening is a snapshot. Afterwards, an admin turns `PasswordAuthentication yes` back on to troubleshoot, an update overwrites a `sysctl` setting, a forbidden service comes back after a reboot. CI Hardening turns the snapshot into monitoring: on a schedule, it compares the real state of the servers with the desired state and fixes the gaps.

## How it works

| Step | Checks |
|---|---|
| Detection | SSH (effective config), firewall, sysctl, forbidden services, open ports, accounts (UID 0, accounts without a password), integrity of sensitive files |
| Remediation | SSH, firewall, sysctl, services, with a backup of modified files |
| Report | Compliance score, drifts and fixes, HTML e-mail above a severity threshold |

The desired state is described in `group_vars/all.yml` (`desired_permit_root_login: "no"`, `desired_max_auth_tries: 3`…).

## Usage

```bash
cd ci-hardening
ansible-galaxy collection install -r requirements-collections.yml
ansible-playbook playbooks/audit.yml        # detect, change nothing
ansible-playbook playbooks/remediate.yml    # fix
ansible-playbook playbooks/full-cycle.yml   # detect, fix, verify, notify
```

Without GitLab, `scripts/install-cron.sh` sets up a local scheduled run. With GitLab, the provided `.gitlab-ci.yml` runs on a *schedule* (`RUN_MODE=audit` or `full-cycle`) and needs only one variable: the vault password.

## What I fixed before publishing

- **Invisible drift.** Detection read the `/etc/ssh/sshd_config` file. But on Debian 12, Ubuntu 22.04+ and RHEL 9, a file in `sshd_config.d/` (for example `50-cloud-init.conf` with `PasswordAuthentication yes`) takes precedence. The tool reported "compliant" while password login was enabled: exactly the drift it is meant to catch. It now reads the effective configuration with `sshd -T`.
- **Remediation without a safety net.** SSH fixes were written without validation before restarting sshd: one mistake and the server became unreachable. They now go to `sshd_config.d/00-ci-hardening.conf` (which wins over cloud-init), and the full configuration is validated with `sshd -t` before any restart.
- A check like `MaxAuthTries 3` also accepted `MaxAuthTries 30`.

Verified on a Debian 12 container simulating the cloud-init trap: drift detected, fixed, and the effective configuration back to `passwordauthentication no`.

[See the code on GitHub](https://github.com/ECG-Rudy-Glt/ops-delivery-suite/tree/main/ci-hardening)
