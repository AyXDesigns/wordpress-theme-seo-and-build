---
name: wp-security-review
description: Reviews WordPress theme and plugin code and site configuration for security problems, read-only by default, with findings rated by severity and fix suggestions. Covers output escaping, input sanitising, nonces versus capability checks, $wpdb->prepare, REST permission_callback, file uploads, direct file access, secrets in source, PHPCS WordPress Coding Standards, Plugin Check, checksums, user roles, DISALLOW_FILE_EDIT and XML-RPC. Use when the user asks for a security review, code audit or hardening check, or mentions Wordfence, Solid Security, WPCS, "site hacked" or a suspicious file. For release packaging evidence use `wp-theme-release-gate`.
license: MIT
metadata:
  author: AyXDesigns
  version: "0.2.0"
---

# WordPress security review

Find security weaknesses in WordPress code the user owns and in the configuration of sites they manage, then explain each one with its severity and a fix. The review is read-only unless the user approves a change. It is not a penetration test.

## Before you start

Confirm, or ask the user:

- **Authority**: the user owns or is authorised to review this code and site. If not, stop. Never probe, scan or attempt to exploit a site the user does not own or manage, and never run exploits against any live site.
- **Mode**: code review (a theme, plugin or `mu-plugins` folder), site configuration review (a WordPress install), or both.
- **Environment**: local, staging or production. Prefer a local or staging copy; on production run only read-only commands.
- **Suspected incident**: if the user thinks the site is already compromised, say so plainly, recommend they involve their host and keep evidence (logs, a file and database copy) before cleaning anything, and run only the read-only integrity checks in step 6 until they decide.
- **Constraints**: WordPress and PHP versions, whether the code is distributed (WordPress.org directory, client sites) or private, and any existing security plugin or host firewall.

## Workflow

### 1. Map the attack surface

List, with file and line:

- entry points: `$_GET`, `$_POST`, `$_REQUEST`, `$_COOKIE`, `$_SERVER`, `$_FILES`, `php://input`;
- AJAX handlers (`wp_ajax_*`, and especially `wp_ajax_nopriv_*` which run for logged-out visitors);
- REST routes (`register_rest_route`), admin-post handlers (`admin_post_*`), shortcodes, block render callbacks, form handlers and cron callbacks;
- database writes, file writes, remote requests, redirects and emails.

```bash
grep -rnE --include='*.php' '\$_(GET|POST|REQUEST|COOKIE|SERVER|FILES)|wp_ajax_|register_rest_route|admin_post_' wp-content/themes/<theme-slug>
```

```powershell
Get-ChildItem -Path wp-content\themes\<theme-slug> -Recurse -Include *.php | Select-String -Pattern '\$_(GET|POST|REQUEST|COOKIE|SERVER|FILES)|wp_ajax_|register_rest_route|admin_post_'
```

**Done when** every entry point is listed with what it does and who can reach it.

### 2. Review each entry point by hand

Follow data from input to output. Use [references/code-review-checklist.md](references/code-review-checklist.md). The core rules:

| Concern | Rule | Typical fix |
| --- | --- | --- |
| Output escaping | Escape late, at the point of output, for the exact context | `esc_html()`, `esc_attr()`, `esc_url()`, `esc_js()` (inline JS only), `esc_textarea()`, `wp_kses_post()` or `wp_kses()` for allowed HTML |
| Input | Validate the expected shape first, then sanitise for storage; unslash superglobals | `wp_unslash()`, then `sanitize_text_field()`, `sanitize_email()`, `absint()`, `sanitize_key()`, `esc_url_raw()` |
| Intent | A nonce proves the request came from your form; it is not permission | `wp_nonce_field()` with `check_admin_referer()`, `check_ajax_referer()` or `wp_verify_nonce()` |
| Permission | Check the capability for the action, every time | `current_user_can( 'edit_post', $post_id )`; `is_admin()` is not a permission check |
| SQL | Never put variables straight into SQL | `$wpdb->prepare()` with `%s`, `%d`, `%f` and `%i` (identifiers, WordPress 6.2+); prefer WP_Query and other APIs |
| REST | Every route needs a `permission_callback` | A capability check; `__return_true` only for genuinely public, read-only data |
| Redirects | Do not redirect to user-supplied hosts | `wp_safe_redirect()` then `exit` |
| File uploads | Never trust the browser's MIME type or file name | `wp_handle_upload()`, `wp_check_filetype_and_ext()`, an allow-list of types, size limits, capability and nonce checks |
| Direct access | PHP files that are not entry points must not run on their own | `defined( 'ABSPATH' ) \|\| exit;` at the top |
| Dangerous functions | Avoid on any user-influenced data | `unserialize()`, `eval()`, `extract()`, `assert()`, `system()`, `shell_exec()`, `create_function()`, `preg_replace` with `/e` |

### 3. Look for secrets in source

Search for API keys, tokens, passwords and private keys in the code and the git history. Report the file and line only; never print the secret value.

```bash
grep -rniE '(api[_-]?key|secret|token|password|passwd|private[_-]?key)[[:space:]]*[=:]' wp-content/themes/<theme-slug>
git -C wp-content/themes/<theme-slug> log -p -S '<suspected-key-prefix>' --oneline
```

```powershell
Get-ChildItem -Path wp-content\themes\<theme-slug> -Recurse -File | Select-String -Pattern '(api[_-]?key|secret|token|password|passwd|private[_-]?key)\s*[=:]'
git -C wp-content\themes\<theme-slug> log -p -S '<suspected-key-prefix>' --oneline
```

A secret found in git history is exposed even if the current file is clean: recommend rotating it with the provider.

### 4. Run automated checks (with approval)

Automated tools support manual review; they do not replace it. Both options below install software, so ask first and prefer a local copy.

**PHP_CodeSniffer with WordPress Coding Standards** (as of October 2026: package `wp-coding-standards/wpcs`, latest 3.4.1; source <https://github.com/WordPress/WordPress-Coding-Standards>):

```bash
composer config allow-plugins.dealerdirect/phpcodesniffer-composer-installer true
composer require --dev wp-coding-standards/wpcs:"^3.0"
vendor/bin/phpcs --standard=WordPress --extensions=php \
  --sniffs=WordPress.Security.EscapeOutput,WordPress.Security.ValidatedSanitizedInput,WordPress.Security.NonceVerification,WordPress.Security.SafeRedirect,WordPress.DB.PreparedSQL,WordPress.DB.PreparedSQLPlaceholders \
  wp-content/themes/<theme-slug>
```

```powershell
composer config allow-plugins.dealerdirect/phpcodesniffer-composer-installer true
composer require --dev wp-coding-standards/wpcs:"^3.0"
vendor\bin\phpcs.bat --standard=WordPress --extensions=php --sniffs=WordPress.Security.EscapeOutput,WordPress.Security.ValidatedSanitizedInput,WordPress.Security.NonceVerification,WordPress.Security.SafeRedirect,WordPress.DB.PreparedSQL,WordPress.DB.PreparedSQLPlaceholders wp-content\themes\<theme-slug>
```

Treat every `phpcs:ignore` comment in the code as a claim to check, not a pass.

**Plugin Check** (WordPress.org plugin, version 2.1.0 as of October 2026, <https://wordpress.org/plugins/plugin-check/>) runs most WordPress.org directory checks, including security checks, against a plugin:

```bash
wp plugin check <plugin-slug> --path=<wp-path>
```

Run `wp help plugin check` for the current options and categories. For themes, the Theme Check plugin covers the theme directory requirements.

**Done when** every automated result is confirmed as a real finding, a false positive (with the reason) or a duplicate.

### 5. Review site configuration

All read-only. Never run `wp config list` or print `wp-config.php`: it holds database passwords and salts. Read only the named constants you need.

```bash
wp core version --path=<wp-path>
wp core check-update --path=<wp-path>
wp plugin list --update=available --fields=name,version,update_version --path=<wp-path>
wp theme list --update=available --fields=name,version,update_version --path=<wp-path>
wp plugin list --status=inactive --fields=name --path=<wp-path>
wp user list --role=administrator --fields=ID,user_login,user_registered --path=<wp-path>
wp config get DISALLOW_FILE_EDIT --path=<wp-path>
wp config get WP_DEBUG --path=<wp-path>
wp config get WP_DEBUG_DISPLAY --path=<wp-path>
```

The same commands work in PowerShell. A "constant not defined" message from `wp config get` is itself a finding to record.

Check:

- WordPress core, plugins and themes are on supported, updated versions; abandoned or closed plugins are listed.
- Inactive plugins and themes are removed unless needed (inactive code can still be reached).
- Administrator accounts are few, named and needed; no shared logins. Do not paste usernames into public reports.
- `DISALLOW_FILE_EDIT` is `true` in production, so the dashboard cannot edit PHP files. It does not stop malicious uploads.
- `WP_DEBUG_DISPLAY` is `false` (or `WP_DEBUG` off) in production, and `debug.log` is not publicly reachable.
- XML-RPC: decide, do not assume. Keep it if Jetpack, the mobile app or a publishing tool needs it; otherwise disabling it at the server, firewall or a plugin reduces brute-force and pingback abuse. Offer this as a choice.
- File permissions follow the hardening guide (directories 755, files 644, `wp-config.php` 400 or 440) as of October 2026, <https://developer.wordpress.org/advanced-administration/security/hardening/>.

### 6. Check file integrity

```bash
wp core verify-checksums --path=<wp-path>
wp plugin verify-checksums --all --path=<wp-path>
```

Plugins not hosted on WordPress.org (premium or custom) cannot be verified this way; list them and use `--exclude=<plugin-slug>` if they stop the run. Treat unexpected files in `wp-content/uploads` ending in `.php`, or recently changed core files, as possible compromise and stop for the user's decision.

### 7. Rate and report findings

| Severity | Meaning | Examples |
| --- | --- | --- |
| Critical | Unauthenticated attacker can run code, read private data or take over accounts | Unauthenticated SQL injection, arbitrary file upload, missing capability check on a `nopriv` handler that changes data |
| High | Authenticated low-privilege user can escalate, or stored XSS on public pages | Subscriber can change settings, stored XSS from a form field |
| Medium | Needs user interaction or unusual conditions | Reflected XSS needing a crafted link, CSRF on a non-critical setting, debug output on production |
| Low | Defence in depth or hard to exploit | Missing direct access guard on a file with no side effects, verbose version disclosure |
| Info | Good practice or hardening suggestion | Enable two-factor authentication for administrators |

Explain each finding in terms of who can trigger it and what they gain. Describe how it could be exploited in words; do not write or run working exploit code. A harmless reproduction on the user's own local copy is acceptable only with approval.

## Choosing a security plugin or firewall

Ask first: who hosts the site, whether the host or a CDN already provides a web application firewall (WAF), who will watch alerts, the budget, and whether the site has had incidents. Then present 2–4 options as a short question with choices:

| Option | Advantages | Disadvantages | Cost and effort | Suits |
| --- | --- | --- | --- | --- |
| Host or CDN WAF | Blocks attacks before WordPress loads; no plugin overhead | Less WordPress-specific insight; features vary by host | Often included or a CDN plan | Managed hosting, sites already behind a CDN |
| Wordfence | Application firewall, malware scan, login security, two-factor | Runs inside WordPress, adds load; free rules arrive later than paid | Free; paid licence for real-time rules | Self-managed hosting with no WAF |
| Solid Security | Hardening settings, two-factor, login protection, user checks | Many settings to own; some features paid | Free; paid tiers | Owners who want guided hardening |
| No security plugin | Nothing extra to maintain or conflict | Relies on updates, good passwords and host protection | Free, needs discipline | Sites with a host WAF and a strong update routine |

Recommend one. Never stack two firewall or login-protection plugins. Check current features and prices on the vendor's site. Wait for the user's choice before installing anything.

## Ask before acting

- Any code change, configuration change or update (core, plugin, theme).
- Installing Composer packages, PHPCS, Plugin Check or any security plugin.
- Changing user roles, passwords, `wp-config.php` constants, file permissions or XML-RPC access.
- Deleting suspicious files or database rows (keep a copy and the evidence first).
- Any request against a live site beyond read-only WP-CLI commands and ordinary page loads.
- Sharing the report outside the user's organisation, or contacting a plugin vendor about a vulnerability.

## Output

Hand back findings using [references/findings-template.md](references/findings-template.md): scope, what was and was not reviewed, findings ordered by severity with file and line, impact, fix and verification step, plus configuration results. Keep secrets, real usernames and exploit details out of the report.
