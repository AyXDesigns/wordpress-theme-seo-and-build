---
name: wp-site-migration
description: Plan and run a WordPress site move between environments or hosts, including local to staging to production, host to host, a domain or URL change, HTTP to HTTPS, or a subdirectory move. Offers migration methods with pros and cons, then covers backups, serialisation-safe search-replace, uploads sync, wp-config per environment, DNS cut-over and post-move checks. Use when the user mentions migrate, move host, change domain, push staging live, wp search-replace, Duplicator, All-in-One WP Migration, Migrate Guru, mixed content or "site broke after the move". For first publishing or hosting choice, use `site-preview-and-publish`; for changing stored theme data, use `wp-theme-content-migrations`.
license: MIT
metadata:
  author: AyXDesigns
  version: "0.2.0"
---

# WordPress site migration

Move a whole WordPress site (database, uploads, code and configuration) from one environment or address to another without losing data, breaking serialised settings or leaking a staging copy to search engines. This skill covers the move itself. Choosing a host or publishing for the first time belongs to `site-preview-and-publish`; changing the shape of stored theme data belongs to `wp-theme-content-migrations`.

## Before you start

Confirm these facts. Ask the user for anything you cannot read safely.

1. **Source and destination.** Which environments (local, staging, production) and which hosts. Is this a copy (source stays live) or a move (source is retired)?
2. **Address changes.** Old and new URLs, including protocol, `www` or not, and any subdirectory. Placeholders such as `https://old.example.com` and `https://example.com` are enough for planning.
3. **Access.** SSH with WP-CLI, SFTP only, cPanel or another control panel, host staging or migration tools, or WordPress admin only. Do not ask the user to paste passwords into the conversation; ask them to configure access themselves.
4. **Size.** Database size, uploads size and file count. Read-only checks are in step 1.
5. **Downtime and write tolerance.** Can the site be frozen (no orders, comments, form entries or editor changes) during the switch, and for how long?
6. **Special cases.** Multisite, ecommerce, membership or booking data, custom tables, object cache, CDN, or a different PHP or database version on the destination.

If the site is multisite, say so early: domain mapping, `wp_blogs`, `wp_site` and `DOMAIN_CURRENT_SITE` need extra steps that this skill only outlines.

## Workflow

### 1. Inventory both environments (read-only)

```bash
wp --path=<site-root> core version
wp --path=<site-root> option get siteurl
wp --path=<site-root> option get home
wp --path=<site-root> db prefix
wp --path=<site-root> db size --tables
wp --path=<site-root> plugin list --status=active
wp --path=<site-root> eval 'echo is_multisite() ? "multisite" : "single";'
du -sh <site-root>/wp-content/uploads
```

```powershell
wp --path=<site-root> option get siteurl
wp --path=<site-root> db size --tables
(Get-ChildItem -Recurse "<site-root>\wp-content\uploads" | Measure-Object -Property Length -Sum).Sum / 1MB
```

Compare PHP, MySQL or MariaDB versions and the table prefix on both sides. As of WordPress 7.1, WordPress recommends PHP 8.3 or later and MySQL 8.0+ or MariaDB 10.11+ (re-check <https://wordpress.org/about/requirements/>).

Done when the runbook's inventory section ([references/migration-runbook-template.md](references/migration-runbook-template.md)) is filled in.

### 2. Choose the migration method

Present the options as a short question with choices. Recommend one based on access, size and downtime tolerance, and wait for the user's answer.

| Method | Advantages | Disadvantages | Effort or cost | Suits |
|---|---|---|---|---|
| **WP-CLI** export, import and `wp search-replace` | Precise, scriptable, repeatable, handles serialised data, dry-run available, no third party sees the data | Needs SSH and WP-CLI on both sides; files moved separately | Moderate skill, free | Developers, large sites, repeat staging pushes |
| **Host migration or staging tools** | Often one click, host handles server paths and URL rewrite, built-in rollback on some hosts | Only works inside that host or into it; behaviour varies; may skip custom tables or files | Low effort, usually included in the plan | Same-host staging to live, moving onto a host that offers a migration service |
| **Migration plugin** (All-in-One WP Migration, Duplicator, Migrate Guru) | Works from WordPress admin, packages files and database together, rewrites URLs | Free tiers have limits; large archives can hit upload or timeout limits; some route data through the vendor's servers | Low effort; paid tiers for larger or advanced jobs | Admin-only access, small to medium sites |
| **Manual** SFTP plus phpMyAdmin | Works on almost any host, no extra software | Slow, error-prone, needs a serialisation-safe replace tool afterwards; easy to miss files | High effort, free | Last resort when nothing else is available |

Before stating any plugin's free-tier limits, open its WordPress.org page and confirm them. As of October 2026 the listings said:

- **All-in-One WP Migration:** the free import is limited by the host's upload size; restoring means downloading and re-uploading the archive; WP-CLI, cloud storage, multisite and scheduled backups are paid extensions. <https://wordpress.org/plugins/all-in-one-wp-migration/>
- **Duplicator (Lite):** no stated size cap; the free plugin does not support multisite; scheduled backups and most cloud destinations are Pro. <https://wordpress.org/plugins/duplicator/>
- **Migrate Guru:** no charge stated, with a limit of five site migrations per user per month and sites up to 200 GB; it copies through its own servers and needs WordPress and the plugin on the destination. <https://wordpress.org/plugins/migrate-guru/>

Installing any of these is a new plugin on a live site, so it needs approval.

### 3. Back up and write the rollback first

Take a full backup of the **destination** (if it already holds a site) and the **source** before changing anything.

```bash
wp --path=<site-root> db export <backup-dir>/<site>-$(date +%Y%m%d-%H%M).sql
tar -czf <backup-dir>/<site>-files.tar.gz -C <site-root> wp-content wp-config.php .htaccess
```

```powershell
$stamp = Get-Date -Format "yyyyMMdd-HHmm"
wp --path=<site-root> db export "<backup-dir>\<site>-$stamp.sql"
Compress-Archive -Path "<site-root>\wp-content" -DestinationPath "<backup-dir>\<site>-files-$stamp.zip"
```

Check the backup: the SQL file is non-empty and ends cleanly, the archive opens, and the backup sits outside the web root. Write the rollback steps in the runbook (restore which files, import which SQL, point DNS where) before step 4. Done when a rollback could be run by someone else from the runbook alone.

### 4. Prepare the destination configuration

Do not copy `wp-config.php` blindly. Each environment keeps its own:

- database name, user, password and host (read only the constants you need; never print secrets);
- `$table_prefix`, which must match the imported tables;
- `WP_ENVIRONMENT_TYPE` (`local`, `development`, `staging` or `production`; the default is `production`);
- `WP_DEBUG` and `WP_DEBUG_DISPLAY` (off and not displayed on production);
- optional `WP_HOME` and `WP_SITEURL` (these override the database values and lock the General settings fields);
- `DISABLE_WP_CRON` if a server cron will run `wp cron event run --due-now`;
- cache constants and object-cache drop-ins that may point at a server the destination cannot reach.

```bash
wp --path=<site-root> config get table_prefix
wp --path=<site-root> config get WP_ENVIRONMENT_TYPE
```

Done when the destination `wp-config.php` is correct for that environment and WordPress loads (even if URLs still point at the old address).

### 5. Move the database and replace URLs safely

Export from the source, transfer it, and import on the destination.

```bash
wp --path=<source-root> db export <transfer-dir>/source.sql
wp --path=<dest-root> db import <transfer-dir>/source.sql
```

**Why raw SQL replace breaks sites.** Options, widgets, theme settings and many plugin settings are stored as PHP serialised strings that record each string's length, for example `s:22:"https://old.example.com"`. A plain SQL `REPLACE()` or a text editor changes the URL but not the length, so PHP can no longer unserialise the value and the setting silently resets or disappears. Use a serialisation-aware tool, such as `wp search-replace`.

Always dry-run first, then run for real:

```bash
wp --path=<dest-root> search-replace 'https://old.example.com' 'https://example.com' \
  --skip-columns=guid --report-changed-only --dry-run
wp --path=<dest-root> search-replace 'https://old.example.com' 'https://example.com' \
  --skip-columns=guid --report-changed-only
```

```powershell
wp --path=<dest-root> search-replace "https://old.example.com" "https://example.com" --skip-columns=guid --report-changed-only --dry-run
```

| Flag | When to use it |
|---|---|
| `--dry-run` | Always first. Shows the count per table and column without saving. |
| `--skip-columns=guid` | Default. WordPress documentation says never to change post GUIDs, because feed readers use them to recognise posts already seen. |
| `--all-tables-with-prefix` | When plugins create their own tables with the site prefix that are not registered with `$wpdb` (forms, SEO, booking tables). Compare the dry-run counts with and without it. |
| `--all-tables` | Only if the database holds non-prefixed tables that also need changing. It overrides `--network` and `--all-tables-with-prefix`. Confirm the database is not shared with another site. |
| `--precise` | When serialised data is complex (nested objects) or a dry-run shows suspicious results. Slower, because PHP processes every column. |
| `--network` | Multisite, to include every site's tables. |
| `--export=<file>` | To produce a transformed SQL file instead of writing to the database, for example when the destination has no WP-CLI. |

Also search, read-only, for variants the main replace may miss and add replacements only if found: the protocol-less form (`//old.example.com`), the JSON-escaped form some builders store (`https:\/\/old.example.com`), the old absolute server path, and `http://` when moving to HTTPS. Tables without a primary key are skipped by `search-replace`; check any the dry-run omits.

Done when a second dry-run for the old URL reports zero replacements in the tables that matter.

### 6. Sync uploads and code

Move `wp-content/uploads`. Move themes and plugins too, unless they are deployed from version control. List first, copy second, and never delete on the destination without approval.

```bash
rsync -avzn <source-root>/wp-content/uploads/ <user>@<dest-host>:<dest-root>/wp-content/uploads/
rsync -avz  <source-root>/wp-content/uploads/ <user>@<dest-host>:<dest-root>/wp-content/uploads/
```

```powershell
robocopy "<source-root>\wp-content\uploads" "<dest-root>\wp-content\uploads" /E /L /NP
robocopy "<source-root>\wp-content\uploads" "<dest-root>\wp-content\uploads" /E /XO /R:2 /W:5 /NP
```

`rsync -n` and `robocopy /L` only list. `rsync --delete` and `robocopy /MIR` remove destination files, so ask before using them. Done when file counts and total size match within an expected margin.

### 7. Settle the environment

```bash
wp --path=<dest-root> option get siteurl
wp --path=<dest-root> option get home
wp --path=<dest-root> rewrite flush --hard
wp --path=<dest-root> cache flush
wp --path=<dest-root> transient delete --all
wp --path=<dest-root> cron event list
```

- **Permalinks:** if `.htaccess` cannot be written, re-save Settings > Permalinks or ask the host to apply the rules.
- **Caches and CDN:** clear the page cache plugin, server cache and CDN after the replace, or visitors see old URLs.
- **Cron:** check scheduled events on the destination. On staging, decide whether jobs that email, charge or sync should run at all.
- **Email on staging and local:** stop real mail leaving non-production copies. Offer: a mail-catching tool in the local stack; an SMTP sandbox service; or a small mu-plugin that returns early from the `pre_wp_mail` filter (available since WordPress 5.7). Mention integrations too: payment gateways in test mode, webhooks and newsletter syncs off.
- **Search visibility:** on staging and local run `wp option update blog_public 0` and add HTTP authentication or IP restriction, because a robots request alone does not keep a public staging site out of search. On production check `wp option get blog_public` returns `1`.

### 8. Address changes: domain, HTTPS or subdirectory

- **HTTPS:** install and test the certificate before replacing `http://` with `https://`, then add a server-level 301 from HTTP. Treat HSTS as a later, deliberate step.
- **Domain change:** plan 301 redirects from every old URL to its new equivalent and keep the old domain registered. Use `wp-seo-build-and-release` if installed for the redirect map; otherwise list old and new URLs for the top pages and test each. The site owner should also use Search Console's change-of-address process.
- **Subdirectory move:** update siteurl and home, move the files, re-save permalinks so `.htaccess` lands next to `index.php`, then replace media and menu URLs.

### 9. DNS cut-over (production moves)

1. 24 to 48 hours ahead, lower the TTL on the records that will change (for example to 300 seconds).
2. Test the destination before DNS changes, without touching system files: `curl -I --resolve example.com:443:<new-ip> https://example.com/` (on Windows use `curl.exe`).
3. Start the content freeze, run a final database export and delta file sync, and repeat step 5 if needed.
4. Change the A, AAAA or CNAME records. Keep the old host running until the old TTL has passed, plus a margin.
5. After the switch is stable, raise the TTL again.

### 10. Verify

Run [references/verification-checklist.md](references/verification-checklist.md) on the destination. Done when every item has evidence or an accepted exception.

## Ask before acting

- Overwriting a destination database or files, or running `search-replace` without `--dry-run`.
- Installing a migration plugin, using a paid tier or sending site data through a third-party service.
- Deleting files (`--delete`, `/MIR`) or dropping tables.
- Changing DNS, certificates, HTTPS redirects or HSTS.
- Changing `blog_public`, email or cron behaviour on production.
- Retiring or wiping the source site.

## Output

Hand back the completed runbook ([references/migration-runbook-template.md](references/migration-runbook-template.md)) and the verification checklist with evidence. State what was moved, the commands run, replacement counts, anything skipped and why, and the rollback steps that remain available.
