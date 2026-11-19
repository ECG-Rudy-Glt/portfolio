---
project: coach
title: "Security and health data"
summary: "Authentication, user isolation, headers and CSP, secrets, hardened containers: what protects the data, and the known limitations."
order: 5
---

## Why it is central

The application handles health data: weight, training, meals, possibly a watch's history. Each choice below answers a specific risk, and the limitations are written in the repository's documentation rather than glossed over.

## What is in place

- **Passwords and sessions**: scrypt with a random salt, constant-time comparison, a random session token of which only the hash is stored, HttpOnly and SameSite cookie, 30-day expiry, revocation of the other sessions on password change.
- **Brute force**: attempt limiting per address/e-mail pair and, separately, per account regardless of address. The client address is read from `X-Forwarded-For` only if a trusted proxy is declared: without that, a forged header would bypass the limit.
- **Registration**: open only until the first account is created, then closed by default.
- **Isolation**: every `/users/{id}/…` route checks that the identifier in the path is the session's; tests verify it.
- **Browser**: CSP policy with no inline script, framing forbidden, `nosniff`, HSTS over HTTPS, rejection of writes whose origin differs from the host, API documentation disabled by default.
- **Inputs**: meal photos validated by their magic bytes and size, daily quotas, image proxy limited to an allowlist of HTTPS hosts (no SSRF), SQL always parameterised.
- **Secrets**: provided as files (`NAME_FILE`) and not as environment variables, hence absent from `docker inspect`. Garmin tokens are encrypted (Fernet) and the Garmin password is never kept.
- **Containers**: unprivileged user, read-only filesystem, all Linux capabilities dropped, `no-new-privileges`, database on an *internal* Docker network with no route to the Internet.

## Automatic checks

Each PR goes through lint, tests (including the security ones), a dependency audit and a secret scan. The audit actually flagged known vulnerabilities in Starlette as soon as they were published: the dependency update that fixes them was the first merged PR.

## Known limitations

No two-factor authentication yet; attempt limiting is in memory (reset on restart); the Garmin library is unofficial and may break or raise a terms-of-use issue; backups are not encrypted by default; a third-party AI provider receives the configured context. Each has an issue or a mention in `docs/security.md`.

## Reporting a vulnerability

The repository publishes a private reporting policy (`SECURITY.md`) and a hardening guide for those who self-host it.
