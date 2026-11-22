---
project: ops-delivery-suite
title: "GitLab Runner Provisioner"
summary: "Install and register a GitLab runner on a VPS from an IP and a token, in Bash or PowerShell."
order: 11
---

## What it is for

GitLab's shared runners are limited and slow for some jobs. Running your own runner on a VPS means installing Docker and GitLab Runner, registering it and configuring it: this script does it in one command.

## What the playbook does

- Installs Docker and GitLab Runner (Debian, Ubuntu, RHEL)
- Registers the runner (Docker or shell executor), only once even when re-run
- Caps Docker log size and schedules a weekly image cleanup, so the disk does not fill up
- Sets the number of concurrent jobs and a restrictive `umask`

## Usage

```bash
cd gitlab-runner-provisioner
# Token: GitLab > Settings > CI/CD > Runners > New project runner (starts with glrt-)
./provision.sh 203.0.113.10 glrt-xxxx -u ubuntu -k ~/.ssh/id_ed25519 -c 4
./provision.sh 203.0.113.10 glrt-xxxx --executor shell --tags shell,build
```

On Windows: `.\provision.ps1 -IP "203.0.113.10" -Token "glrt-xxxx" -User "ubuntu"`.

## What I fixed before publishing

- **Token in clear text.** A deployment script contained a real runner token and a server IP; removed.
- **Duplicates.** The "runner already registered?" check read the standard output of `gitlab-runner list`, which actually writes to standard error. Every re-run registered one more runner.
- **Privileged mode by default.** A job in Docker `privileged` mode can take over the host. It is now off by default, to be enabled only for Docker-in-Docker.
- The registration token no longer appears in Ansible logs.

[See the code on GitHub](https://github.com/ECG-Rudy-Glt/ops-delivery-suite/tree/main/gitlab-runner-provisioner)
