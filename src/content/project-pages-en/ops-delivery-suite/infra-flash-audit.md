---
project: ops-delivery-suite
title: "Infra Flash Audit"
summary: "Agentless security audit of Linux and Windows servers, with an HTML/PDF report graded from A to F."
order: 3
---

## What it is for

"We need to prove to our enterprise customer that our servers are secure." Infra Flash Audit answers that need: it connects over SSH (or WinRM for Windows), collects the server's state without installing anything, and produces a report a non-specialist can read, with a score out of 100, an A to F grade and recommendations.

## What is audited

| Area | Content |
|---|---|
| System | OS, kernel, pending updates, reboot required, sysctl |
| Accounts | UID 0 accounts, accounts without a password, sudoers, PAM |
| SSH | Sensitive options, weak algorithms, host keys |
| Network | Listening ports, firewall rules, fail2ban |
| Services and CMS | Running or failed services, WordPress and Drupal, exposed `.env` files |
| Containers | Images, failed containers, sensitive mounts, Docker socket |
| Logs | Failed logins, suspicious IPs, OOM kills, log centralisation |
| External | SSL certificate, HTTP security headers, nmap scan |
| Options | Lynis, OpenSCAP (CIS level 1 profile), AI summary |

## Usage

```bash
cd infra-flash-audit
pip install ansible-core weasyprint
ansible-galaxy collection install ansible.windows community.general

cp -r inventories/example inventories/client-a      # IP, user, SSH key
ansible-vault encrypt inventories/client-a/group_vars/all/vault.yml

ansible-playbook site.yml -i inventories/client-a/hosts.yml --ask-vault-pass \
  -e "audit_company_name='Client A' audit_domain='example.com'"
```

HTML and PDF reports land in `reports/`. The AI analysis (`-e audit_ai_enabled=true`) sends a per-section summary to an OpenAI-compatible API and adds a synthesis with a remediation plan.

## What I fixed before publishing

- **Real data.** The original repository held the inventory of a real server, its private key, the audit account's password, an API key and two real audit reports. All of it was replaced by an example inventory and a `vault.yml.example`.
- **Hand-rebuilt SSH key.** The playbook copied a private key out of the vault, reformatted it with a Python script and wrote it to `~/.ssh`. Connections now go through the SSH agent or `ansible_ssh_private_key_file`.
- **Host key checking.** It was disabled everywhere (`StrictHostKeyChecking=no`), which leaves the audit session open to interception. It is enabled by default again.

Verified end to end on a Debian 12 container: 267 tasks and a generated report.

[See the code on GitHub](https://github.com/ECG-Rudy-Glt/ops-delivery-suite/tree/main/infra-flash-audit)
