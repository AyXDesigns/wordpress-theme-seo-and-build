# Release record template

The human-readable release record. It sits alongside the machine manifest (`<slug>-<version>.manifest.json`) written by `scripts/release-package.mjs`; copy the key values across rather than pasting the whole JSON.

## Candidate

| Field | Value |
|---|---|
| Theme slug | `<theme-slug>` |
| Version (`style.css`) | `<x.y.z>` |
| Git ref and commit | `<tag-or-branch>` / `<full-commit-hash>` |
| Previous release (rollback) | `<theme-slug>-<prev>.zip`, SHA-256 `<hash>` |
| Package | `<theme-slug>-<x.y.z>.zip` |
| Package SHA-256 | `<hash>` |
| Machine manifest | `<theme-slug>-<x.y.z>.manifest.json` |
| Built by / date | `<name>` / `<date>` |
| Target | client site(s) / WordPress.org directory |

## Environment

| Item | Version |
|---|---|
| WordPress (clean fixture / upgrade fixture) | `<version>` / `<version>` |
| PHP used for lint (lowest / newest) | `<version>` / `<version>` |
| Database | `<MySQL or MariaDB version>` |
| Required plugins | `<name version>`, or none |
| Companion plugin | `<slug version>`, or none |
| `Requires at least` / `Requires PHP` / `Tested up to` | `<values from style.css>` |

## Package verification (from the script)

| Check | Result |
|---|---|
| Script exit code and first line | `0 PASS …` / `<code and message>` |
| `pass` / `failures` | `true` / none |
| `version` = `style.css` Version = requested version | yes / no |
| `commit` = `git rev-parse <ref>` | yes / no |
| `counts.packaged` / `counts.source` / `counts.excludedByExportIgnore` | `<n>` / `<n>` / `<n>` |
| `missing` and `extra` | empty / `<list>` |
| `excludedByExportIgnore`, each with a reason | `<list>` |
| `warnings` reviewed (uncommitted changes, `changedFromSource`, submodules) | `<notes>` |
| Built by hand because the script was unavailable | no / yes (`git archive` + hash commands recorded) |

## Checks

| # | Check | Command or method | Result | Notes / accepted exception |
|---|---|---|---|---|
| 1 | Version metadata and changelog agree | `git show <ref>:<theme-dir>/style.css` | pass / fail | |
| 2 | PHP lint, lowest PHP | `php -l` loop | pass / fail | failures: `<n>` |
| 3 | PHP lint, newest PHP | `php -l` loop | pass / fail | |
| 4 | PHPCS `WordPress-Extra` | `vendor/bin/phpcs …` | pass / fail / skipped | |
| 5 | PHPCompatibilityWP | `vendor/bin/phpcs …` | pass / fail / skipped | |
| 6 | Theme Check (directory only) | `wp theme-check run <theme-slug>` | pass / fail / n/a | |
| 7 | Plugin Check (companion plugin) | `wp plugin check <plugin-slug>` | pass / fail / n/a | |
| 8 | Package installs on clean fixture | `wp theme install <zip>` | pass / fail | |
| 9 | Package upgrades the previous release; edits kept | upgrade fixture | pass / fail | |
| 10 | Migrations run, second run changes nothing | `wp eval-file …` | pass / fail / n/a | |
| 11 | Routes return expected status codes | `curl` loop | pass / fail | `<codes>` |
| 12 | No PHP messages in HTML | `curl` + `grep` / `Select-String` | pass / fail | |
| 13 | No new `debug.log` entries | line count before/after | pass / fail | |
| 14 | Forms end to end; form plugin off is handled | test matrix | pass / fail / n/a | |
| 15 | Keyboard, focus, zoom, reduced motion, no-JS | manual | pass / fail | |
| 16 | Narrow / medium / wide layouts, no overflow | manual | pass / fail | |
| 17 | Rendered HTML: escaping, title, canonical, copy | view source | pass / fail | |
| 18 | Editor-exported files free of site-specific data | `git diff` review | pass / fail / n/a | |

## Manual production actions

Steps someone must do on the live site after upload (for example: run the WP-CLI migration, clear the host cache, re-save permalinks). Write "none" if none.

## Known limitations

Anything accepted for this release, with the owner who accepted it.

## Decision

**Pass / Fail.** Blocking items, if any:

- `<item>`
