---
project: ops-delivery-suite
title: "Server Migration Kit"
summary: "Move a server to another one with Ansible: audit, files, databases, Docker containers, checksum verification."
order: 6
---

## What it is for

Changing host or machine without forgetting anything: a config folder, a database, a cron job, a Docker volume. The kit splits the migration into replayable steps, each with its own report.

## The steps

| Playbook | Role |
|---|---|
| 00_preflight_checks | Connectivity, disk space, required tools on both servers |
| 01_audit_source | Source inventory (OS, services, users, cron, databases) |
| 02_sync_files | Copies the chosen folders with rsync |
| 03_sync_db | Database dumps, transfer, import on the destination |
| 04_full_migration | Everything chained, with checksums and a security audit before and after |
| 05_docker_migration | Restic backup, export of volumes and Compose files, restart on the destination |

## Usage

```bash
cd server-migration-kit
ansible-galaxy collection install -r requirements.yml
cp inventory/examples/migration.ini.example inventory/migration.ini
# [source], [destination], folders to migrate, database types; passwords in a vault

ansible-playbook -i inventory/migration.ini playbooks/00_preflight_checks.yml
ansible-playbook -i inventory/migration.ini playbooks/01_audit_source.yml
ansible-playbook -i inventory/migration.ini playbooks/04_full_migration.yml --ask-vault-pass
```

In `selective` mode (the default), only `folders_to_migrate` are copied; in `full` mode, a wider list including nginx, Let's Encrypt, cron and systemd configuration. The before and after audits use [Infra Flash Audit](/en/projets/ops-delivery-suite/infra-flash-audit/).

## What I fixed before publishing

- Local tasks used a `local_action` form that is being removed from Ansible: they now use `delegate_to: localhost`.
- The path to the audit tool pointed to the old separate repository; it now follows the single-repository layout.
- Wrote the README: the original repository had none.

This is the tool I have tested least in real conditions: try it between two throwaway machines first.

[See the code on GitHub](https://github.com/ECG-Rudy-Glt/ops-delivery-suite/tree/main/server-migration-kit)
