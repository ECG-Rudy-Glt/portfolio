---
project: ops-delivery-suite
title: "Trivy Audit"
summary: "Vulnerabilities in the OS, Docker images and Dockerfiles, CycloneDX SBOMs and an optional AI remediation plan."
order: 4
---

## What it is for

Knowing which critical CVEs affect a server and the containers it runs, without installing an agent. Trivy Audit drives [Trivy](https://trivy.dev) with Ansible and gathers everything in one report.

## What is scanned

| Scan | Result |
|---|---|
| System (`trivy rootfs`) | HIGH and CRITICAL CVEs in installed packages |
| Docker images | CVEs per image, sorted by severity (20 images at most) |
| IaC (`trivy config`) | Misconfigurations in Dockerfile and Compose files found in `/opt`, `/srv`, `/home`, `/root`, `/var/www` |
| SBOM | One CycloneDX inventory per image |

Trivy is installed on the target if missing and can be removed at the end. Working files and the cache are always cleaned up.

## Usage

```bash
cd trivy-audit
pip install ansible-core jinja2 weasyprint
cp inventories/example.yml inventories/my-servers.yml
ansible-playbook -i inventories/my-servers.yml site.yml
# report: reports/<host>/trivy_report_latest.html (and .pdf)
```

Common options: `-e audit_scan_images=false`, `-e audit_severity=MEDIUM,HIGH,CRITICAL`, `-e audit_trivy_version=0.58.1` to pin the version.

### AI remediation plan

With `-e audit_ai_enabled=true` and a key in `AUDIT_AI_API_KEY`, the generator sends **a summary** to an OpenAI-compatible API (Groq, OpenAI, Mistral or a local Ollama): CVE IDs, packages, versions, IaC rules, never the server's name or IP. The plan comes back in a report section marked "to be reviewed".

## What I fixed before publishing

Running the tool against a Debian container showed that several advertised features did not work:

- **The IaC scan never ran.** `trivy config` expects a directory and rejects `--no-progress`; every call failed silently (`failed_when: false`). On top of that, the search started at `/` and `excludes` only filters file names, so `/proc` and `/sys` were walked. The scan now targets the listed directories, and its results finally have a section in the report.
- **The "AI analysis" was an `echo`.** It is now real and optional.
- **Private registry login.** The `TRIVY_USERNAME=… trivy registry login` syntax does not exist: it now uses `--username` and `--password-stdin`, with no password on the command line.
- **Trivy version.** A badly written `when` condition prevented reading the version when Trivy was already installed; the report also showed a hard-coded version.
- **Report.** HTML was rendered without escaping (injection possible through CVE data), image names containing `_` were mangled, and results from a previous run were mixed into the next one.

[See the code on GitHub](https://github.com/ECG-Rudy-Glt/ops-delivery-suite/tree/main/trivy-audit)
