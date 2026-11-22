---
project: ops-delivery-suite
title: "Data Sentinel"
summary: "Fire-and-forget backups: databases and files, GPG encryption, S3 upload, automatic retention and Discord or Slack alerts."
order: 5
---

## What it is for

"Even if the server burns down or gets hacked, I restore everything within an hour." Data Sentinel backs up what matters off the server, every night, unattended.

## How it works

1. **Dump** MySQL/MariaDB, PostgreSQL and MongoDB databases running in Docker containers (`docker exec`).
2. **Archive** application folders, with exclusions.
3. **Encrypt** with GPG (optional).
4. **Upload** to S3-compatible storage: AWS, Scaleway, MinIO, Backblaze, DigitalOcean.
5. **Retention**: 7 daily, 4 weekly and 3 monthly backups by default.
6. **Notify** Discord or Slack with size and duration, or the error.

## Usage

```bash
cd data-sentinel
cp config.example.yaml config.yaml   # bucket, databases, folders, retention
make dry-run                          # simulation, nothing uploaded
make backup                           # backup now
make install-cron                     # every day at 3 am
make list                             # backups stored on S3
python restore.py --latest            # restore (--db-only, --files-only, --date)
```

Database passwords are not in the configuration: you give the name of the container environment variable that holds them (`password_env: MYSQL_ROOT_PASSWORD`).

## What I fixed before publishing

All three dumpers were tested against real containers (MariaDB 11, PostgreSQL 16, MongoDB) with a booby-trapped password (`p@ss w0rd;$(id)"`…), all the way to restore:

- **PostgreSQL did not work.** The `--no-owner --no-acl` options reached `pg_dump` as a single argument, which it rejected. The file also had a `.sql` extension while the restore script expects `.dump`.
- **MySQL went through a shell.** The command was a concatenated string, password included: a password with a space or a `;` broke the dump (or ran something else), and it showed in clear text in `ps`. The password now stays in the container (`MYSQL_PWD`), with no host shell, and falls back to `mariadb-dump` on recent MariaDB images.
- **MongoDB** also got the password as an argument; it now goes through a temporary config file.
- **Retention.** S3 dates (UTC) were compared with local time, shifting deletions by a few hours.
- Dumps are created with `600` permissions, and a failed dump is deleted instead of being left half-written.

[See the code on GitHub](https://github.com/ECG-Rudy-Glt/ops-delivery-suite/tree/main/data-sentinel)
