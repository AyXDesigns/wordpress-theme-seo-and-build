---
name: wp-theme-triage
description: Read-only inspection of an unfamiliar or inherited WordPress theme before anyone changes it. Identifies the theme type (classic, block, hybrid or child), the canonical source, who owns each piece of content, plugin dependencies, saved-data risks and a proportionate test plan. Use when the user says "inherited theme", "what does this theme do", "before I change anything", "previous developer built it", or mentions style.css, functions.php, theme.json, a parent or child theme, or Site Editor changes that do not match the files. For building or redesigning a site, use `wp-site-experience-build`; for architecture baselines, use `wp-theme-foundations`.
license: MIT
metadata:
  author: AyXDesigns
  version: "0.2.0"
---

# WordPress theme triage

Work out what an unfamiliar theme is, where its truth lives and what could break, then hand back a written report. Triage is read-only: nothing is edited, installed, activated or deployed.

## Before you start

Confirm, and ask the user when unknown:

- **The eventual change.** Triage depth should match it. A colour tweak needs a short report; a redesign or migration needs the full one.
- **Where the theme lives.** A git repository, a local site's `wp-content/themes/<theme-slug>`, a zip, or a copy pulled from a server. There may be several.
- **Which WordPress install you may query.** Use a local or staging copy. Do not run WP-CLI against production, even read-only, without explicit permission.
- **Tools available.** WP-CLI, git and Node.js 18 or later. Each step below has a fallback when a tool is missing.

## Workflow

### 1. Find every copy and name the canonical source

List each copy of the theme, then decide which one is authoritative.

```bash
# Theme folders under a project or site root
find <project-root> -maxdepth 5 -name style.css -not -path "*/node_modules/*" -exec grep -l "Theme Name:" {} +

# Repository state (do not print remote URLs that contain tokens)
git -C <theme-dir> status --short
git -C <theme-dir> log --oneline -10
git -C <theme-dir> tag --sort=-creatordate | head -5

# Compare a repository copy with the copy the site runs
git diff --no-index --stat <theme-dir> <wp-path>/wp-content/themes/<theme-slug>
```

```powershell
Get-ChildItem <project-root> -Recurse -Depth 5 -Filter style.css |
  Where-Object { $_.FullName -notmatch '\\node_modules\\' } |
  Select-String -Pattern 'Theme Name:' -List | Select-Object Path

git -C <theme-dir> status --short
git -C <theme-dir> log --oneline -10
git diff --no-index --stat <theme-dir> <wp-path>\wp-content\themes\<theme-slug>
```

Done when one copy is named canonical with evidence (newest commits, matching deployed files, build scripts), or the report says plainly that it cannot be decided yet. Never treat a deployed copy as canonical just because it is live.

### 2. Run the inventory script

Run the bundled script from the project, against the canonical theme directory. `<skill-dir>` is the folder that contains this `SKILL.md`; the script only reads files and writes nothing unless you redirect its output:

```bash
node <skill-dir>/scripts/theme-inventory.mjs <theme-dir>
node <skill-dir>/scripts/theme-inventory.mjs <theme-dir> --json > <scratch-dir>/theme-inventory.json
```

It reports the theme type, `style.css` header fields, the `theme.json` version and key settings, templates, parts and patterns, `add_theme_support` calls, enqueued handles, calls to plugin functions and classes (with or without availability guards) and global symbol prefixes.

Treat the output as leads, not findings. Confirm each item you put in the report by reading the file it came from (steps 4 to 6). If Node.js or the script is unavailable, do steps 4 to 6 by hand.

### 3. Read the site's state with WP-CLI

Only on an install you are allowed to query. All commands are read-only and identical in bash and PowerShell.

```bash
wp core version --extra --path=<wp-path>
wp --info
wp option get template --path=<wp-path>
wp option get stylesheet --path=<wp-path>
wp theme list --fields=name,status,version,update --path=<wp-path>
wp plugin list --fields=name,status,version,update --path=<wp-path>
wp plugin list --status=must-use --path=<wp-path>
wp eval 'echo wp_is_block_theme() ? 1 : 0;' --path=<wp-path>
wp theme mod list --path=<wp-path>
wp post list --post_type=wp_template,wp_template_part,wp_global_styles,wp_navigation,wp_block --post_status=any --fields=ID,post_type,post_name,post_modified --path=<wp-path>
```

Read the results like this:

- `template` and `stylesheet` differ: a child theme is active. `template` is the parent slug.
- `wp_template` or `wp_template_part` rows: the Site Editor has saved copies in the database that **override the theme files**. Editing the file will not change the site until those are dealt with.
- `wp_global_styles` rows: user style changes sit on top of `theme.json`.
- `wp_block` rows: synced patterns. They are content, not theme code.
- Theme mods: Customizer values. They survive theme edits and may hold visitor-facing copy.

If WP-CLI is unavailable, record these as unknowns and ask the user to check **Appearance > Editor** for customised templates.

### 4. Confirm the theme type from the files

```bash
head -n 25 <theme-dir>/style.css
ls <theme-dir>/templates <theme-dir>/parts <theme-dir>/patterns <theme-dir>/styles 2>/dev/null
grep -n '"version"' <theme-dir>/theme.json
```

```powershell
Get-Content <theme-dir>\style.css -TotalCount 25
Get-ChildItem <theme-dir>\templates, <theme-dir>\parts, <theme-dir>\patterns, <theme-dir>\styles -ErrorAction SilentlyContinue
Select-String -Path <theme-dir>\theme.json -Pattern '"version"'
```

| Evidence | Classification |
| --- | --- |
| `templates/index.html` exists | Block theme |
| PHP templates (`index.php` and others), no `templates/index.html`, no `theme.json` | Classic theme |
| PHP templates plus `theme.json`, or `add_theme_support( 'block-template-parts' )`, or some `parts/*.html` | Hybrid (classic with block features) |
| `Template: <parent-slug>` in the `style.css` header | Child theme of that parent; inspect the parent too |

Record the header fields `Version`, `Requires at least`, `Tested up to`, `Requires PHP` and `Text Domain`. As of WordPress 7.1 (October 2026) the current `theme.json` schema version is 3; a theme on version 2 still works but has not been migrated.

### 5. Map the PHP bootstrap and dependencies

Search the theme's PHP, skipping `vendor` and `node_modules`:

```bash
cd <theme-dir>
grep -nE "require|include" functions.php
grep -rnE --include=*.php --exclude-dir={vendor,node_modules} "add_theme_support|register_nav_menus|register_sidebar"
grep -rnE --include=*.php --exclude-dir={vendor,node_modules} "wp_(enqueue|register)_(style|script)|wp_enqueue_script_module|add_editor_style"
grep -rnE --include=*.php --exclude-dir={vendor,node_modules} "function_exists|class_exists|defined\(|is_plugin_active"
grep -rnE --include=*.php --exclude-dir={vendor,node_modules} "register_post_type|register_taxonomy|register_meta|add_shortcode|register_block_type|register_block_bindings_source"
grep -rnE --include=*.php --exclude-dir={vendor,node_modules} "update_option|add_option|set_theme_mod|update_post_meta|wp_insert_post"
```

```powershell
$php = Get-ChildItem <theme-dir> -Recurse -Include *.php | Where-Object { $_.FullName -notmatch '\\(vendor|node_modules)\\' }
Select-String -Path <theme-dir>\functions.php -Pattern 'require|include'
$php | Select-String -Pattern 'add_theme_support|register_nav_menus|register_sidebar'
$php | Select-String -Pattern 'wp_(enqueue|register)_(style|script)|wp_enqueue_script_module|add_editor_style'
$php | Select-String -Pattern 'function_exists|class_exists|defined\(|is_plugin_active'
$php | Select-String -Pattern 'register_post_type|register_taxonomy|register_meta|add_shortcode|register_block_type|register_block_bindings_source'
$php | Select-String -Pattern 'update_option|add_option|set_theme_mod|update_post_meta|wp_insert_post'
```

Classify every plugin the theme calls:

| Class | Meaning | Risk |
| --- | --- | --- |
| Required | The theme cannot work without it, and says so | Document; check the admin notice |
| Optional, guarded | Call sits behind `function_exists`, `class_exists` or similar at the point of use | Low; test the fallback |
| Optional, unguarded | Call has no guard | Fatal error if the plugin is deactivated or renamed |

Also flag post types, taxonomies and shortcodes registered in the theme: content that disappears when the theme changes. Moving them out is a later job for `wp-companion-plugin` if installed; triage only records them. Note any code that writes options or post meta, because it creates saved data.

### 6. Map content ownership

For each visitor-facing item (header, footer, navigation, home page sections, contact details, forms, structured data, SEO metadata, media), name where it is stored: post content, a theme pattern, a synced pattern, a database template, a theme mod, an option, a custom field, a plugin, or hard-coded in a template file. Hard-coded copy that editors expect to change is a finding.

### 7. Record build, test and deployment conventions

Read, do not run: `package.json` scripts, `composer.json`, `phpcs.xml` or `phpcs.xml.dist`, CI workflows, `.distignore`, release scripts, `README`, `CHANGELOG` and existing tests. Note whether built assets are committed or generated, how the release zip is made, and the branch and tag pattern. Do not install dependencies or run builds during triage.

### 8. Assess risk and propose tests

Rank risks by impact: database overrides, unguarded plugin calls, theme-owned data, copies that have drifted, missing build steps, outdated `Requires` headers. Then pick the smallest test plan that covers the planned change:

| Planned change | Minimum checks |
| --- | --- |
| CSS or `theme.json` styles only | Affected templates at narrow, medium and wide widths; editor view matches front end; `wp_global_styles` overrides noted |
| Template, part or pattern | Front end and Site Editor; database copies checked; empty and long-content states |
| PHP hooks or functions | `php -l` on changed files; debug log clean on tested routes; plugin-off state on a local copy |
| Saved options, meta or content | Hand to `wp-theme-content-migrations` if installed; otherwise test a clean install and an upgrade from a copy of real data |
| Release | Use `wp-theme-release-gate` if installed; otherwise build the zip from the canonical source and compare its file list |

### 9. Write the report

Fill in [references/triage-report-template.md](references/triage-report-template.md). Every finding cites its evidence: a file and line, a command and its output, or "not confirmed".

## Ask before acting

Get explicit approval before you:

- run any command against a production or shared live site, including read-only WP-CLI;
- switch themes, or activate or deactivate plugins (test plugin-off states on a local copy only);
- run `npm install`, `composer install` or a build that writes files;
- reset, delete or export Site Editor templates, global styles or synced patterns;
- copy a production database or uploads folder;
- read `wp-config.php` beyond the constants you need. Never print passwords, keys or salts.

## Output

Return the completed [triage report](references/triage-report-template.md), with:

1. Classification and canonical source.
2. Structure, content ownership and dependencies.
3. Saved-data and deployment risks, ranked.
4. The proportionate test plan.
5. Assumptions, unknowns and the actions that need authorisation.

End by naming the next skill: for example `wp-theme-content-migrations`, `wp-site-experience-build` or `wp-theme-release-gate`, if installed.
