---
name: wp-theme-release-gate
description: Decide whether one exact WordPress theme release candidate is ready to ship, with recorded evidence. Runs PHP lint, optional PHPCS with WordPress Coding Standards, Theme Check, Plugin Check for a companion plugin, route and debug.log checks, then builds and verifies a zip with a SHA-256 manifest. Use when preparing a theme release, tagging a version, "is this ready to deploy", building the theme zip, bumping the style.css Version, or submitting to the WordPress.org theme directory. Does not deploy; for publishing, use `site-preview-and-publish`.
license: MIT
metadata:
  author: AyXDesigns
  version: "0.2.0"
---

# WordPress theme release gate

Produce a pass or fail decision for one exact theme candidate (a Git tag or commit), backed by commands, results and a verified package. The gate does not deploy anything.

## Before you start

Confirm, or ask the user:

- The theme directory inside the repository (`<theme-dir>`), its slug and the candidate version.
- The Git ref to release (a tag such as `v<x.y.z>`, or a commit). Never release from uncommitted work: the package is built from Git, so uncommitted changes are not in it.
- Where the theme will go: a client site, several sites, or the WordPress.org theme directory.
- Whether a companion plugin ships with it.
- The minimum PHP and WordPress versions the theme claims (`Requires PHP`, `Requires at least` in `style.css`). As of October 2026, WordPress 7.1 supports PHP 7.4 to 8.5 and recommends 8.3 or later (<https://make.wordpress.org/core/handbook/references/php-compatibility-and-wordpress-versions/>). Re-check.
- A local or staging fixture to test on: one clean install and one upgrade fixture with the previous release and realistic content.

## Workflow

Record every check in [references/release-manifest-template.md](references/release-manifest-template.md) as you go: command, environment, result, and any accepted exception.

### 1. Fix the candidate

```bash
git status --short
git rev-parse <ref>
git show <ref>:<theme-dir>/style.css | grep -m1 -i "Version:"
```

```powershell
git status --short
git rev-parse <ref>
git show "<ref>:<theme-dir>/style.css" | Select-String -Pattern "Version:" | Select-Object -First 1
```

Done when the `style.css` Version, the changelog entry, any `readme.txt` "Stable tag" and the requested version all match.

### 2. Lint every PHP file

Lint with the lowest PHP version the theme supports, and again with the newest available.

```bash
fail=0
while IFS= read -r -d '' f; do
  php -l "$f" > /dev/null || { echo "FAIL: $f"; fail=1; }
done < <(find <theme-dir> -name '*.php' -not -path '*/vendor/*' -not -path '*/node_modules/*' -print0)
echo "lint failures: $fail"
```

```powershell
$fail = 0
$files = Get-ChildItem -Path "<theme-dir>" -Recurse -File -Filter *.php |
  Where-Object { $_.FullName -notmatch '\\(vendor|node_modules)\\' }
foreach ($f in $files) {
  php -l $f.FullName | Out-Null
  if ($LASTEXITCODE -ne 0) { Write-Output "FAIL: $($f.FullName)"; $fail = 1 }
}
Write-Output "lint failures: $fail"
```

Done when the failure count is 0 on both PHP versions.

### 3. Optional: coding-standards scan

Offer this as a short question with choices:

| Option | Advantages | Disadvantages | Suits |
|---|---|---|---|
| Skip | No setup | Misses escaping, sanitisation and compatibility problems | Tiny patch releases with lint passing |
| PHPCS, `WordPress-Extra` on changed files only | Fast, focused on the diff | Old issues remain | Ongoing client themes |
| PHPCS, `WordPress-Extra` plus `PHPCompatibilityWP` on the whole theme | Finds unescaped output and PHP-version breaks | First run is noisy; needs Composer dev dependencies | First release, directory submission, PHP upgrades |

```bash
composer config allow-plugins.dealerdirect/phpcodesniffer-composer-installer true
composer require --dev wp-coding-standards/wpcs:"^3.0" phpcompatibility/phpcompatibility-wp
vendor/bin/phpcs --standard=WordPress-Extra --extensions=php --ignore=*/vendor/*,*/node_modules/* <theme-dir>
vendor/bin/phpcs --standard=PHPCompatibilityWP --runtime-set testVersion <min-php>- --extensions=php <theme-dir>
```

On Windows use `vendor\bin\phpcs.bat`. Adding dev dependencies changes `composer.json`; ask first. Check current package versions at <https://github.com/WordPress/WordPress-Coding-Standards>.

### 4. Directory and plugin checks (only when they apply)

**Theme Check**, only if the theme is going to the WordPress.org directory. The Themes Team uses this plugin when reviewing submissions; as of October 2026 its version is 20260901 (<https://wordpress.org/plugins/theme-check/>). Run it on a local fixture:

```bash
wp plugin install theme-check --activate --path=<fixture-path>
wp theme-check run <theme-slug> --format=json --path=<fixture-path>
```

Fix every required item; record recommended items you accept. Theme Check is not needed for themes that never go to the directory.

**Plugin Check**, only for a companion plugin. It checks plugins, not themes (<https://github.com/WordPress/plugin-check>):

```bash
wp plugin check <plugin-slug> --format=json --path=<fixture-path>
wp plugin check <plugin-slug> --require=./wp-content/plugins/plugin-check/cli.php --path=<fixture-path>
```

By default WP-CLI runs static checks only; the `--require` form adds runtime checks. As of October 2026 Plugin Check is version 2.1.0 (<https://wordpress.org/plugins/plugin-check/>). Record any justified exceptions. For building or fixing the plugin itself, use `wp-companion-plugin` if installed.

### 5. Build and verify the package

Use the bundled script, run from the theme repository root. `<skill-dir>` is the folder that contains this `SKILL.md`; keep `--out` outside the skill folder:

```bash
node <skill-dir>/scripts/release-package.mjs <theme-dir> --out <dist-dir> --ref <ref> --version <x.y.z>
```

Always pass `--ref` and `--version` (the ref defaults to `HEAD`); add `--slug <theme-slug>` if the folder name is not the slug. The script builds `<slug>-<version>.zip` with `git archive` from that ref, re-opens the zip to check it, compares its file list with the source tree, and writes `<slug>-<version>.manifest.json` with a SHA-256 hash per file, the `style.css` Version, the Git ref and commit, and the files excluded by `export-ignore`.

Read the result:

- Exit code `0` and a first line starting `PASS`: continue. Exit code `2`: the zip was built but a check failed; the `failure:` lines say why. Exit code `1`: the script could not run (bad arguments, not a Git repository, no Version). For `1` or `2`, stop and report; do not hand-build a zip to get round it.
- In the manifest, `pass` must be `true` and `failures` empty. `version` must equal the requested version, and `commit` must equal `git rev-parse <ref>`.
- `missing` and `extra` must be empty. Each entry in `excludedByExportIgnore` must be something that should not ship (tests, build sources, `node_modules`).
- Read every `warnings` entry. "Working tree has uncommitted changes" means the package does not contain those changes; confirm that is intended. Files in `changedFromSource` differ because of Git attributes; check they are expected.
- The script fails the build if it finds risky files (`.env`, `wp-config.php`, dumps, logs, keys, `.git`, `node_modules`, nested archives), a missing top-level `style.css`, or no `index.php` / `templates/index.html`.
- Copy `zip.sha256` and the manifest file name into the release record.

If the script is not installed, build and check by hand and record that you did. If the theme is the repository root, use `<ref>` on its own instead of `<ref>:<theme-dir>`.

```bash
git archive --format=zip --prefix=<theme-slug>/ -o <dist-dir>/<theme-slug>-<x.y.z>.zip <ref>:<theme-dir>
unzip -l <dist-dir>/<theme-slug>-<x.y.z>.zip
sha256sum <dist-dir>/<theme-slug>-<x.y.z>.zip
```

```powershell
git archive --format=zip --prefix=<theme-slug>/ -o "<dist-dir>\<theme-slug>-<x.y.z>.zip" "<ref>:<theme-dir>"
tar -tf "<dist-dir>\<theme-slug>-<x.y.z>.zip"
Get-FileHash -Algorithm SHA256 "<dist-dir>\<theme-slug>-<x.y.z>.zip"
```

### 6. Install the package and check routes

Install the zip, not the working copy, on both fixtures:

```bash
wp theme install <dist-dir>/<theme-slug>-<x.y.z>.zip --force --activate --path=<fixture-path>
wp config get WP_DEBUG_LOG --path=<fixture-path>
```

Note the number of lines in `wp-content/debug.log` (or the path `WP_DEBUG_LOG` names), then request representative routes:

```bash
for p in / /<page>/ /<post>/ /<contact-page>/ /?s=qa /qa-missing-page/ /wp-sitemap.xml; do
  curl -s -o /dev/null -w "%{http_code} %{time_total}s $p\n" "http://example.test$p"
done
curl -s http://example.test/ | grep -iE "warning:|notice:|deprecated:|fatal error" || echo "no PHP messages in HTML"
```

```powershell
foreach ($p in '/', '/<page>/', '/<post>/', '/<contact-page>/', '/?s=qa', '/qa-missing-page/', '/wp-sitemap.xml') {
  curl.exe -s -o NUL -w "%{http_code} %{time_total}s $p\n" "http://example.test$p"
}
curl.exe -s http://example.test/ | Select-String -Pattern 'Warning:|Notice:|Deprecated:|Fatal error'
```

In Windows PowerShell 5.1, `curl` is an alias for `Invoke-WebRequest`; use `curl.exe`. Expect 200 for real pages, 404 for the missing page, and no new `debug.log` lines from the theme (compare with the line count you noted: `tail -n +<n+1>` or `Get-Content <log> | Select-Object -Skip <n>`).

### 7. Behaviour checks

On representative templates, check and record:

- Clean install shows sensible defaults; upgrade fixture keeps edited content. If stored data changed, run `wp-theme-content-migrations` if installed; otherwise confirm the migration ran twice without changes.
- Forms work end to end and the site survives with the form plugin deactivated. Use `wp-cf7-form-assurance` if installed for Contact Form 7.
- Keyboard use, visible focus, 200% zoom, reduced motion, no-JavaScript, and narrow, medium and wide widths. No horizontal overflow; contrast passes. For a full audit use `wp-accessibility-audit` if installed.
- Rendered HTML (not just templates) has escaped output, one title and canonical source, and correct user-visible copy.
- If templates were exported from the Site Editor, the committed files contain no site-specific IDs or media URLs.

### 8. Decide

Pass only if every applicable check passed or has an accepted, written exception. Otherwise fail, with the blocking items listed.

## Ask before acting

- Adding Composer dev dependencies or installing Theme Check or Plugin Check.
- Installing or activating the package anywhere other than a local fixture.
- Enabling `WP_DEBUG` on a shared or live site.
- Creating or pushing Git tags, uploading the zip, deploying, or deleting old releases.

## Output

Return the completed [references/release-manifest-template.md](references/release-manifest-template.md) with the script's manifest file name and zip hash, every check result, known limitations, the rollback package (previous release zip and hash), and a clear pass or fail.
