---
project: ops-delivery-suite
title: "VPS Shield"
summary: "Harden a new Linux server with one Ansible command: SSH-key admin account, SSH, firewall, fail2ban, kernel, PAM, auditd, AIDE."
order: 1
---

## What it is for

A freshly delivered VPS often accepts root login with a password, has no firewall and receives thousands of SSH attempts a day. VPS Shield applies a hardening baseline in a few minutes, inspired by the ANSSI-BP-028 guide and the CIS Benchmarks, and identical from one server to the next.

Tested on Debian 12, Ubuntu 22.04 and 24.04, Rocky Linux 9 (a `Vagrantfile` is provided to test safely).

## What the playbook does

| Role | Effect |
|---|---|
| ssh_keygen | Generates an ED25519 key pair for the admin account |
| common | Updates, base packages, automatic security updates |
| user | Admin account with sudo and an SSH key, password locked |
| ssh | No root, no password, modern algorithms, config validated by `sshd -t` |
| firewall | UFW or FirewallD: everything denied inbound except listed ports |
| fail2ban | Bans IPs after repeated SSH failures |
| sysctl_hardening | Anti-spoofing, ICMP redirects, ASLR, `kptr_restrict`… |
| pam_hardening | Password policy, lockout after failures |
| security_modules | AppArmor or SELinux in enforcing mode |
| auditd, aide | Logging of sensitive events, file integrity checks |
| filesystem_hardening | `/tmp` mount options, unused filesystems disabled |
| legal_banner | Login banner |

Each role is switched on or off with `enable_<role>` in `group_vars/all.yml`.

## Usage

```bash
cd vps-shield
./setup.sh                                   # Ansible and collections
cp inventory.ini.example inventory.ini       # server IP
ansible-playbook playbook.yml --check --diff # dry run
ansible-playbook playbook.yml
```

Then, in a **second terminal**, before closing the current session:

```bash
ssh -i keys/id_ed25519_admin admin@203.0.113.10
```

For a single area: `ansible-playbook playbook.yml --tags ssh,firewall`. For a Docker host, add it to the `[docker_hosts]` group, which opens 80/443 and keeps the IP forwarding Docker needs.

## What I fixed before publishing

- **Default password.** The admin account, which has sudo, was given the password `TestVagrant123!`, written in `group_vars`. It is now locked: key-based login only.
- **Lockout.** Nothing stopped the playbook from disabling password login while the admin account had no key. The `ssh` role now checks `authorized_keys` and stops with a clear message if it is empty.
- **Missing variable.** The `ssh_keygen` role, enabled by default, used an `admin_user` variable defined nowhere: the first run outside the CI failed.

[See the code on GitHub](https://github.com/ECG-Rudy-Glt/ops-delivery-suite/tree/main/vps-shield)
