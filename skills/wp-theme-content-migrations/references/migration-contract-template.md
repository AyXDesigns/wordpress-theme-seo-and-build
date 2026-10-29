# Migration contract template

Copy this once per release that changes stored data. Fill in one "Change" block per key. Keep examples free of personal data.

## Release

| Field | Value |
|---|---|
| Theme and stylesheet | `<theme-slug>` (child theme: yes / no) |
| Theme version | `<old-version>` to `<new-version>` |
| Schema version | `exampletheme_content_version` from `<n>` to `<n+1>` |
| How it runs | automatic on `admin_init` / WP-CLI `wp eval-file` / both |
| Environments | local / staging / production |
| Backup taken | `<backup-file-name>` on `<date>` (location not committed) |

## Change `<n+1>`: `<short name>`

| Question | Answer |
|---|---|
| Store | theme mod / option / post meta / block content / seeded post |
| Old key and shape | `<key>`: `<type and example, no personal data>` |
| New key and shape | `<key>`: `<type and example>` |
| Why it is needed | `<one sentence>` |
| Edited values | How a value the user changed is carried over unchanged |
| Missing value | What the template shows when the key is absent (default) |
| Malformed value | What happens to a value of the wrong type or format |
| Already migrated | The check that makes a second run a no-op |
| Sanitisation | Function used on write, and the escaping used on output |
| Autoload | `true` / `false` / `null`, with the reason |
| Caches to clear | Transient names, page cache, CDN; scope of each |
| Old key kept until | `<version>` (removed by migration `<m>`) |
| Rollback | Restore backup, or reverse step `<describe>` |
| Manual follow-up | Records the script cannot decide on, and who decides |

## Dry-run report

```text
from_version: <n>
target_version: <n+1>
dry_run: true
step <n+1>: changed=<count> skipped=<count> manual=[<ids>]
```

## Apply report

```text
dry_run: false
step <n+1>: changed=<count> skipped=<count> manual=[<ids>]
version now: <n+1>
second run: up-to-date
```

## Fixture results

| Fixture | Result | Notes |
|---|---|---|
| Clean install: defaults render, editor controls show defaults | pass / fail | |
| Upgrade: edited values preserved on front end and in editor | pass / fail | |
| Upgrade: missing and malformed values handled | pass / fail | |
| Second run changes nothing | pass / fail | |
| No duplicate records or orphaned meta | pass / fail | |
| No new `debug.log` entries | pass / fail | |
