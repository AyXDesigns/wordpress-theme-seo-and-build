# Migration runbook template

Copy this template into the project notes (not into the web root) and fill it in before the move. Use placeholders for anything sensitive. Never write passwords, keys or salts here.

## 1. Summary

| Item | Value |
|---|---|
| Migration type | Copy / move; local to staging / staging to production / host to host / domain change / HTTPS / subdirectory |
| Source | `<source-env>` at `https://old.example.com` |
| Destination | `<dest-env>` at `https://example.com` |
| Method chosen | WP-CLI / host tool / plugin name / manual |
| Reason for method | |
| Owner and approver | `<role>` / `<role>` |
| Planned window | `<date>` `<start>`–`<end>` `<timezone>` |
| Content freeze | Yes / no; from `<time>` to `<time>` |

## 2. Inventory

| Check | Source | Destination |
|---|---|---|
| WordPress version | | |
| PHP version | | |
| Database engine and version | | |
| Table prefix | | |
| Single site or multisite | | |
| Database size | | |
| Uploads size and file count | | |
| Custom (unregistered) tables | | |
| Object cache, page cache, CDN | | |
| Active plugins needing special handling | | |
| `WP_ENVIRONMENT_TYPE` | | |
| Search visibility (`blog_public`) | | |

## 3. Backups

| Backup | Location (placeholder) | Size | Checked by | Result |
|---|---|---|---|---|
| Source database | `<backup-dir>/source-<stamp>.sql` | | | Opens / ends cleanly |
| Source files | `<backup-dir>/source-files-<stamp>.tar.gz` | | | Archive opens |
| Destination database (if any) | | | | |
| Destination files (if any) | | | | |

## 4. Rollback plan

Write this before any destructive step.

1. Trigger: what failure means "roll back" (for example: checkout fails, admin unreachable, data missing).
2. Restore destination files from: `<backup>`.
3. Import destination database from: `<backup>`.
4. DNS: point records back to `<old-ip-or-target>`; current TTL `<seconds>`.
5. Who confirms the rollback worked, and how.

## 5. Configuration differences

| Setting | Source | Destination | Notes |
|---|---|---|---|
| `WP_HOME` / `WP_SITEURL` | | | |
| `WP_DEBUG` / `WP_DEBUG_DISPLAY` | | | |
| `DISABLE_WP_CRON` and server cron | | | |
| Email handling | | | Live / caught / blocked |
| Payment, webhook and sync integrations | | | Live / test mode / off |
| Cache and CDN | | | |
| HTTP authentication or IP restriction | | | |

## 6. Steps and commands

Record each command as run, with placeholders, and its result.

| # | Step | Command or action | Expected | Actual |
|---|---|---|---|---|
| 1 | Export source database | `wp --path=<source-root> db export <file>` | File created | |
| 2 | Import on destination | `wp --path=<dest-root> db import <file>` | Success | |
| 3 | Dry-run URL replace | `wp --path=<dest-root> search-replace '<old>' '<new>' --skip-columns=guid --report-changed-only --dry-run` | Counts per table | |
| 4 | Run URL replace | same without `--dry-run` | Counts match dry-run | |
| 5 | Check for missed variants | dry-run for `//old`, escaped form, old server path, `http://` | Zero or replaced | |
| 6 | Sync uploads | `rsync -avz` / `robocopy /E /XO` | Counts match | |
| 7 | Flush rewrites, caches, transients | `wp rewrite flush --hard`, `wp cache flush`, `wp transient delete --all` | Success | |
| 8 | Environment settings | `blog_public`, email, cron, integrations | As planned | |
| 9 | DNS change (production) | Record, old value, new value, TTL | Resolves to new host | |

## 7. Replacement report

| Search | Replace | Flags | Tables changed | Rows changed |
|---|---|---|---|---|
| `https://old.example.com` | `https://example.com` | `--skip-columns=guid` | | |

## 8. Sign-off

- Verification checklist completed: yes / no (link to evidence).
- Known exceptions accepted by: `<role>`.
- Source retirement date (if a move): `<date>`, only after approval.
