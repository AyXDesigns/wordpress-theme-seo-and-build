---
name: wp-theme-content-migrations
description: Plan, dry-run and apply versioned WordPress theme data migrations without losing editor changes. Covers theme mods, options and autoload, post meta, serialised data, seed content, cache invalidation and block-theme editor exports. Use when a theme change renames or reshapes saved settings, Customizer values, theme_mods, repeaters, custom fields, seeders or patterns, when "settings disappeared after update", or when saving Site Editor changes with Create Block Theme. For moving a whole site between hosts or changing its domain, use `wp-site-migration`.
license: MIT
metadata:
  author: AyXDesigns
  version: "0.2.0"
---

# WordPress theme content migrations

Change what a theme stores (settings, theme mods, post meta, seeded posts, editor-exported templates) so that existing sites upgrade cleanly, edited content survives, and every run can be repeated safely.

## Before you start

Confirm these facts. Ask the user for anything you cannot find in the repository.

- Which environment you are working on (local, staging, production) and whether a fresh backup exists.
- The theme's directory name (its *stylesheet*), whether it is a child theme, and the function/option prefix it uses (shown here as `exampletheme_`).
- Every place the data is read and written: Customizer controls, `register_setting()`, meta boxes, `register_post_meta()`, block attributes, seeders, REST routes.
- Whether any user has edited the values you are changing. Assume yes unless proven otherwise.
- The current schema version, stored in the option `exampletheme_content_version`. If none exists, the site is at version 1.

## How WordPress stores theme data

| Store | Where it lives | Points to watch |
|---|---|---|
| Theme mods | One option per theme: `theme_mods_<stylesheet>`, a serialised array | Keyed by the *active* stylesheet. Switching to a child theme starts with empty mods; the parent's mods stay under the parent's key. |
| Options | One row each in `wp_options` | Prefix every key. Autoload decides whether the value loads on every request (see below). |
| Post meta | `wp_postmeta`, many rows per post | `add_post_meta()` and `update_post_meta()` unslash their input, so wrap values that may contain backslashes in `wp_slash()`. |
| Block content | `post_content` of posts, `wp_template`, `wp_template_part`, `wp_global_styles`, `wp_navigation` | Block attributes are JSON inside HTML comments, with characters such as `<`, `>` and `--` written as Unicode escapes. |
| Transients | `wp_options` or the object cache | Disposable. Never store the only copy of anything in a transient. |

**Autoload.** Since WordPress 6.6, `add_option()` and `update_option()` accept `true`, `false` or `null` for autoload, and the column holds `on`, `off`, `auto`, `auto-on` or `auto-off`. With `null`, WordPress decides, and large values are not autoloaded. Set small, always-needed settings to `true` and large or rarely read data to `false`. Source: <https://make.wordpress.org/core/2024/06/18/options-api-disabling-autoload-for-large-options/>. Re-check for the target version.

**Serialised data.** PHP serialisation records the byte length of every string (`s:5:"hello";`). A raw SQL `REPLACE()` that changes a string's length breaks the record. `unserialize()` then fails, `get_option()` returns the default, and the setting looks wiped. Change serialised data through WordPress APIs or `wp search-replace` (which rewrites lengths; run it with `--dry-run` first), never with hand-written SQL. For site-wide URL changes, use `wp-site-migration` if installed; otherwise follow the `wp search-replace` documentation for the current WP-CLI version.

## Workflow

### 1. Inspect the current data (read-only)

```bash
wp theme list --path=<wp-path>
wp theme mod list --format=json --path=<wp-path>
wp option get theme_mods_<theme-slug> --format=json --path=<wp-path>
wp option list --search="exampletheme_*" --fields=option_name,autoload,size_bytes --path=<wp-path>
wp option get exampletheme_content_version --path=<wp-path>
wp post meta list <post-id> --format=json --path=<wp-path>
wp post list --post_type=wp_template,wp_template_part,wp_global_styles --fields=ID,post_name,post_modified --path=<wp-path>
```

`wp theme mod list` reads the active theme only. Use `wp option get theme_mods_<theme-slug>` for any other theme. PowerShell runs the same commands; quote wildcards the same way.

Done when you can describe the current data shape, with one real example per changed key. Do not paste personal data into the report.

### 2. Write the migration contract

Fill in [references/migration-contract-template.md](references/migration-contract-template.md) for every changed key, before writing code. It records the old shape, new shape, how edited values are kept, how missing or malformed data is handled, the caches to clear and how to roll back.

Done when the user has seen the contract and agreed what happens to edited content.

### 3. Choose how migrations run

Present the options as a short question with choices, then recommend one:

| Option | Advantages | Disadvantages | Suits |
|---|---|---|---|
| Automatic on `admin_init` when the stored version is behind | No manual step; works for clients who update themes themselves | Runs inside a web request with a time limit; harder to dry-run; runs on whichever environment updates first | Small changes: a few options or theme mods |
| Manual through WP-CLI (`wp eval-file`) | Dry-run first, full output, no request time limit, run when you choose | Someone with shell access must run it on each environment | Post meta across many posts, large or risky changes |
| Both: automatic for small steps, WP-CLI for named large steps | Matches effort to risk | Two paths to test | Themes shipped to several sites |

Recommend WP-CLI when the change touches more than a few hundred posts or anything the user cannot easily re-create.

### 4. Implement a versioned, idempotent runner

Use the pattern in [references/migration-snippet.md](references/migration-snippet.md):

- Each migration is a function keyed by the version it produces, run in ascending order.
- The version option is raised only after a step succeeds, so a failure stops the run where it is.
- Each step checks whether its work is already done, so running it twice changes nothing.
- A lock option stops two requests running the same migration at once.
- Old keys stay in place for at least one release, so you can roll back. Remove them in a later, separate migration.
- Values are sanitised on the way in (`sanitize_text_field()`, `esc_url_raw()`, `absint()`, `wp_kses_post()`), matched to what the template is allowed to output. Do not strip markup the editor appears to support.
- If you truly need `$wpdb`, use `$wpdb->prepare()`. Never build SQL by joining strings.
- Reports list IDs, keys and counts, never submitted or personal content.

### 5. Back up, then dry-run

```bash
wp db export <backup-dir>/<site>-before-v<n>.sql --path=<wp-path>
wp eval-file <theme-dir>/inc/migrate-cli.php --path=<wp-path>
```

```powershell
wp db export "<backup-dir>\<site>-before-v<n>.sql" --path="<wp-path>"
wp eval-file "<theme-dir>\inc\migrate-cli.php" --path="<wp-path>"
```

The snippet treats every run as a dry run (`DRY_RUN` is true) unless you pass the positional argument `apply`. Keep backups outside the web root and out of Git.

Done when the dry-run report shows the expected counts and lists every record that needs a manual decision.

### 6. Apply and invalidate caches

```bash
wp eval-file <theme-dir>/inc/migrate-cli.php apply --path=<wp-path>
wp option get exampletheme_content_version --path=<wp-path>
wp transient delete exampletheme_<transient-name> --path=<wp-path>
```

Clear only what the change affects: the theme's own transients (`delete_transient()`), post caches through the normal APIs, and any page cache or CDN purge the host provides. `wp cache flush` clears the whole object cache, which on shared or multisite caches affects other sites. Ask before using it.

Run the command a second time. Done when the second run reports nothing to change.

### 7. Verify on two fixtures

Test on a **clean install** (no old data: defaults must appear) and an **upgrade fixture** (old version with realistic edited values, missing values, a malformed value and duplicates). Check the front end and the editor, not just the database.

## Block-theme editor exports

Saving Site Editor changes into theme files is a source migration. User changes live in `wp_template`, `wp_template_part` and `wp_global_styles` posts until exported. Present the options:

| Option | Advantages | Disadvantages |
|---|---|---|
| Create Block Theme plugin, "Save Changes" | Writes templates, styles and fonts straight into the theme folder | Changes files in place; it calls itself a development tool; check its "Tested up to" against the site's WordPress version before installing |
| Create Block Theme, "Export Zip" | Leaves the active theme untouched; easy to diff | Manual unzip and merge |
| Site Editor's built-in export (core since 6.0) | No plugin needed | Zip only; fewer options than the plugin |
| Copy specific templates by hand from the editor's code view | Smallest, most precise change | Slow for many templates |

Rules for any route: run it on a local or staging copy, export into a separate working copy, and review every changed file with `git diff`. Remove site-specific data before committing: navigation menu IDs, media URLs and attachment IDs, post IDs in query blocks, and real copy that belongs in content. After committing, reset the exported templates in the editor (so the database copy no longer overrides the file), then check that the site still looks right.

## Ask before acting

- Running any migration with `apply`, or on staging or production.
- Restoring a backup (`wp db import`), deleting old keys, or running `wp search-replace` without `--dry-run`.
- `wp cache flush` or purging a host or CDN cache.
- Installing Create Block Theme or saving editor changes into theme files.
- Overwriting a user-edited value with a default.

## Output

Return the completed contract from [references/migration-contract-template.md](references/migration-contract-template.md), the dry-run and apply reports, the second-run result, the backup file name, fixture results and any records needing manual follow-up.
