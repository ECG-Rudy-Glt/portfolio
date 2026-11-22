---
title: "Ops Delivery Suite - Open source DevOps toolbox"
category: perso
summary: "Eleven standalone DevOps tools, published as open source (MIT): Ansible hardening, continuous hardening, Trivy and OpenSCAP security audits, encrypted S3 backups, server migration, Traefik HTTPS proxy, monitoring, CI/CD templates."
period: "2025 - ongoing"
role: "Solo design, development and open source release"
stack: ["Ansible", "Docker", "Traefik", "Trivy", "OpenSCAP", "Python", "GitLab CI", "GitHub Actions", "Prometheus", "Grafana"]
tags: ["DevOps", "Security", "CI/CD", "Automation", "Monitoring", "Infrastructure as Code"]
links:
  repo: "https://github.com/ECG-Rudy-Glt/ops-delivery-suite"
featured: true
relevance: "majeur"
order: 8
---

## The problem

The same operations tasks come back on every project: harden a new server, set up CI/CD, back up properly, audit security, expose a service over HTTPS, monitor it. Redoing them by hand takes time and leaves every server configured slightly differently.

The project started as an attempt to sell packaged DevOps services to small companies alongside my work-study programme. Doing both at once was too much; the commercial side is on hold, but the tools are still useful, so I published them as open source.

## The solution

A set of standalone tools in [a single GitHub repository](https://github.com/ECG-Rudy-Glt/ops-delivery-suite). Each one lives in its own folder with its own README and works on its own: copy the folder, fill in an inventory or a `.env`, run it. No default credentials are shipped, and the repository CI checks every commit for secrets, Ansible syntax and linters.

A typical path for a new server: **VPS Shield** hardens it, **Traefik Edge Proxy** serves the apps over HTTPS, **Data Sentinel** backs it up, **Ops Vision** watches it, **CI Hardening** checks every night that nothing has drifted, and **Infra Flash Audit** or **Trivy Audit** produce the audit report.

## The modules

Click a module to see how it is used, then "Explore the module" for the details.

<details class="module">
<summary>VPS Shield <span class="module-role">Hardening a new server</span></summary>
<div class="module-body">

One Ansible playbook with fifteen roles you can switch on or off: SSH-key admin account, hardened SSH, UFW or FirewallD, fail2ban, sysctl, PAM, auditd, AIDE, legal banner. Based on ANSSI-BP-028 and the CIS Benchmarks.

```bash
cd vps-shield && ./setup.sh
cp inventory.ini.example inventory.ini   # server IP
ansible-playbook playbook.yml --check --diff
ansible-playbook playbook.yml
```

<p class="module-links"><a href="/en/projets/ops-delivery-suite/vps-shield/">Explore the module →</a><a href="https://github.com/ECG-Rudy-Glt/ops-delivery-suite/tree/main/vps-shield">Code</a></p>
</div>
</details>

<details class="module">
<summary>CI Hardening <span class="module-role">Continuous hardening and auto-remediation</span></summary>
<div class="module-body">

A scheduled pipeline compares the real state of the servers with the desired state every night (SSH, firewall, sysctl, services, ports, accounts, file integrity), fixes the drift and sends a report by e-mail.

```bash
cd ci-hardening
ansible-playbook playbooks/audit.yml        # detect only
ansible-playbook playbooks/full-cycle.yml   # detect, fix, notify
```

<p class="module-links"><a href="/en/projets/ops-delivery-suite/ci-hardening/">Explore the module →</a><a href="https://github.com/ECG-Rudy-Glt/ops-delivery-suite/tree/main/ci-hardening">Code</a></p>
</div>
</details>

<details class="module">
<summary>Infra Flash Audit <span class="module-role">Agentless security audit, HTML/PDF report</span></summary>
<div class="module-body">

Audits Linux and Windows servers over SSH or WinRM without installing anything: system, accounts, SSH, containers, logs, SSL, HTTP headers, ports, and optionally Lynis, OpenSCAP CIS and an AI summary. The report gives a score and an A to F grade.

```bash
cd infra-flash-audit
cp -r inventories/example inventories/client-a
ansible-playbook site.yml -i inventories/client-a/hosts.yml --ask-vault-pass
```

<p class="module-links"><a href="/en/projets/ops-delivery-suite/infra-flash-audit/">Explore the module →</a><a href="https://github.com/ECG-Rudy-Glt/ops-delivery-suite/tree/main/infra-flash-audit">Code</a></p>
</div>
</details>

<details class="module">
<summary>Trivy Audit <span class="module-role">OS, image and IaC vulnerabilities, SBOM</span></summary>
<div class="module-body">

Installs Trivy on the target if needed, scans packages, every Docker image and the Dockerfile or Compose files it finds, produces CycloneDX SBOMs and an HTML/PDF report, with an optional remediation plan written by an LLM.

```bash
cd trivy-audit
ansible-playbook -i inventories/example.yml site.yml
# report: reports/<host>/trivy_report_latest.html
```

<p class="module-links"><a href="/en/projets/ops-delivery-suite/trivy-audit/">Explore the module →</a><a href="https://github.com/ECG-Rudy-Glt/ops-delivery-suite/tree/main/trivy-audit">Code</a></p>
</div>
</details>

<details class="module">
<summary>Data Sentinel <span class="module-role">Encrypted backups to S3</span></summary>
<div class="module-body">

Dumps MySQL, PostgreSQL and MongoDB databases running in containers, archives folders, encrypts with GPG, uploads to S3-compatible storage (AWS, Scaleway, MinIO…), applies daily, weekly and monthly retention, then notifies Discord or Slack.

```bash
cd data-sentinel
cp config.example.yaml config.yaml   # bucket, databases, folders
make dry-run          # simulation, nothing uploaded
make backup           # backup now
make install-cron     # daily backup at 3 am
make list             # backups stored on S3
```

<p class="module-links"><a href="/en/projets/ops-delivery-suite/data-sentinel/">Explore the module →</a><a href="https://github.com/ECG-Rudy-Glt/ops-delivery-suite/tree/main/data-sentinel">Code</a></p>
</div>
</details>

<details class="module">
<summary>Server Migration Kit <span class="module-role">Moving a server to another one</span></summary>
<div class="module-body">

Six playbooks: pre-flight checks, source audit, file copy, database transfer, Docker stack migration with a Restic backup, and checksum verification. Every step writes a report.

```bash
cd server-migration-kit
cp inventory/examples/migration.ini.example inventory/migration.ini
ansible-playbook -i inventory/migration.ini playbooks/00_preflight_checks.yml
ansible-playbook -i inventory/migration.ini playbooks/04_full_migration.yml --ask-vault-pass
```

<p class="module-links"><a href="/en/projets/ops-delivery-suite/server-migration-kit/">Explore the module →</a><a href="https://github.com/ECG-Rudy-Glt/ops-delivery-suite/tree/main/server-migration-kit">Code</a></p>
</div>
</details>

<details class="module">
<summary>Traefik Edge Proxy <span class="module-role">Automatic HTTPS reverse proxy</span></summary>
<div class="module-body">

Traefik with Let's Encrypt certificates, HTTP to HTTPS redirection, security headers, a protected dashboard, and an Ansible playbook that prepares the server and deploys the stack. Exposing an app takes four Docker labels.

```bash
cd traefik-edge-proxy
make setup && cp .env.example .env
make password      # dashboard credentials, paste into .env
make start
```

<p class="module-links"><a href="/en/projets/ops-delivery-suite/traefik-edge-proxy/">Explore the module →</a><a href="https://github.com/ECG-Rudy-Glt/ops-delivery-suite/tree/main/traefik-edge-proxy">Code</a></p>
</div>
</details>

<details class="module">
<summary>Ops Vision <span class="module-role">Lightweight monitoring</span></summary>
<div class="module-body">

Uptime Kuma for uptime and certificates, plus optional Prometheus, Grafana and node-exporter for metrics, with Discord, Slack, Telegram or e-mail alerts.

```bash
cd ops-vision
docker compose up -d                                 # Uptime Kuma only
docker compose -f docker-compose.full.yml up -d      # + Prometheus and Grafana
```

<p class="module-links"><a href="/en/projets/ops-delivery-suite/ops-vision/">Explore the module →</a><a href="https://github.com/ECG-Rudy-Glt/ops-delivery-suite/tree/main/ops-vision">Code</a></p>
</div>
</details>

<details class="module">
<summary>Docker Stack Builder <span class="module-role">Docker stacks ready for dev and production</span></summary>
<div class="module-body">

Four complete environments: Node.js Express, PHP Laravel, Python Django and WordPress, each with its database, cache, healthchecks and a Makefile.

```bash
cp -r docker-stack-builder/templates/php-laravel my-project/
cd my-project && cp .env.example .env
make dev
```

<p class="module-links"><a href="/en/projets/ops-delivery-suite/docker-stack-builder/">Explore the module →</a><a href="https://github.com/ECG-Rudy-Glt/ops-delivery-suite/tree/main/docker-stack-builder">Code</a></p>
</div>
</details>

<details class="module">
<summary>CI/CD Templates <span class="module-role">GitHub Actions and GitLab CI pipelines</span></summary>
<div class="module-body">

Seven pipeline templates (Node with PM2, PHP Laravel, Python, Docker Compose, Go, Rust, static site), each for GitHub Actions and GitLab CI: tests, build and SSH deployment, with a rollback guide.

```bash
cp cicd-templates/templates/node-pm2/github-action.yml .github/workflows/deploy.yml
# repository secrets: SSH_PRIVATE_KEY, DEPLOY_HOST, DEPLOY_USER, DEPLOY_PATH
```

<p class="module-links"><a href="/en/projets/ops-delivery-suite/cicd-templates/">Explore the module →</a><a href="https://github.com/ECG-Rudy-Glt/ops-delivery-suite/tree/main/cicd-templates">Code</a></p>
</div>
</details>

<details class="module">
<summary>GitLab Runner Provisioner <span class="module-role">A GitLab runner in one command</span></summary>
<div class="module-body">

Installs Docker and GitLab Runner on a VPS, registers the runner and keeps its disk usage in check, from an IP and a token. Bash and PowerShell versions.

```bash
cd gitlab-runner-provisioner
./provision.sh 203.0.113.10 glrt-xxxx -u ubuntu -k ~/.ssh/id_ed25519
```

<p class="module-links"><a href="/en/projets/ops-delivery-suite/gitlab-runner-provisioner/">Explore the module →</a><a href="https://github.com/ECG-Rudy-Glt/ops-delivery-suite/tree/main/gitlab-runner-provisioner">Code</a></p>
</div>
</details>

## Going open source

The tools lived in nineteen private GitLab repositories. To publish them:

- **Fresh history.** Old commits contained private keys, a runner token, an API key and inventories of real servers. Rather than risk missing something while rewriting history, the public repository starts from one clean commit, and inventories are replaced by examples.
- **Sorting.** Twelve real repositories out of nineteen (the others were empty or off-topic), including two duplicates merged together: Automate HTTPS and Traefik Edge Proxy.
- **Fixes.** Testing each tool on throwaway containers turned up bugs that stopped some features from working at all: the PostgreSQL dump failed, Trivy Audit's IaC scan never ran, Traefik saw no containers with Docker 29, the middlewares file was rejected, and CI Hardening trusted `sshd_config` while a file in `sshd_config.d` could turn password login back on. I also removed every default credential and added a guard against losing SSH access. Each module page has the details.

## Takeaways

These tools run my [homelab](/en/projets/homelab/) and deploy this portfolio. On the project side, the lesson is to arbitrate my workload rather than run everything at once. On the technical side: a security tool is only trustworthy once it has run on a real machine. Several bugs showed up neither in linting nor in review, only at run time.
