---
name: wp-theme-foundations
description: Sets the baseline contracts for a WordPress theme - block, classic, hybrid or child architecture, theme.json structure, editable-content ownership, plugin boundaries, accessibility, security, SEO and release basics - checked against WordPress 7.1. Use when starting a theme, choosing block vs classic, reviewing theme architecture, or when the user mentions theme.json, style variations, section styles, responsive styles, patterns, pattern overrides, block bindings, Font Library, child theme or add_theme_support. To design and build a whole site or redesign, use `wp-site-experience-build`; for an inherited theme, start with `wp-theme-triage`.
license: MIT
metadata:
  author: AyXDesigns
  version: "0.2.0"
---

# WordPress theme foundations

Decide and record the architecture and baseline contracts a theme must meet. This skill sets the rules; it does not design a site. Do not use it to justify rebuilding a stable theme for a narrow change.

## Before you start

Confirm, and ask the user when unknown:

- **Target versions.** The lowest WordPress and PHP versions the theme must support. As of October 2026 the latest WordPress is 7.1; WordPress 7.0 and 7.1 support PHP 7.4 to 8.5 and recommend PHP 8.3 or later. Re-check at <https://wordpress.org/about/requirements/>.
- **Existing theme.** If there is one and nobody has inspected it, use `wp-theme-triage` if installed. If not, at least read the `style.css` header, check for `templates/index.html` and `theme.json`, and run `wp post list --post_type=wp_template,wp_template_part --post_status=any --path=<wp-path>` to find database overrides.
- **Who edits.** Their confidence with the Site Editor decides how much should be locked or left open.
- **Plugins and hosting.** Required plugins, SEO plugin, form plugin, caching and any host restrictions.

```bash
wp core version --path=<wp-path>
wp --info
```

## Workflow

1. **Confirm the facts above.** Done when target versions, theme state and editors are written down.

2. **Choose the architecture with the user.** Ask about editors, existing code and plugins first, then present the options as a short question with choices. Recommend one with the reason and wait for the answer.

   | Option | Advantages | Disadvantages | Effort | Suits |
   | --- | --- | --- | --- | --- |
   | Block theme | Editors change templates, styles and patterns in the Site Editor; `theme.json` drives editor and front end; gets new core features first (responsive styles in 7.1) | Database copies of templates can drift from files; custom PHP logic moves into blocks or plugins; some teams find the Site Editor unfamiliar | Medium for a new theme | New builds, teams who want visual editing |
   | Classic theme | Full PHP control; familiar to many developers; mature plugin compatibility | Fewer visual editing tools; layout changes need a developer; misses most new site-editing features | Low to medium | Existing classic sites, heavy custom PHP |
   | Hybrid (classic plus `theme.json`, block parts, patterns) | Gradual move towards blocks; keeps PHP templates | Two systems to document; ownership can blur | Medium | Classic themes being modernised in steps |
   | Child theme | Keeps a maintained parent's updates; small codebase | Tied to the parent's decisions and release timing | Low | Small changes to a well-maintained parent |

   Done when the user has chosen and the reason is recorded.

3. **Define the contracts.** Using [references/theme-foundations.md](references/theme-foundations.md), write down: one source of truth per visitor-facing value, the page and state list, plugin boundaries and fallbacks, and the single owner of SEO output. Done when every item has an owner.

4. **Lay down the baseline files for the chosen type.**
   - Block or hybrid with `theme.json`: [references/block-themes.md](references/block-themes.md).
   - Classic, hybrid or child: [references/classic-and-hybrid.md](references/classic-and-hybrid.md).

   Add only the modern features the project needs. Use the feature table in `block-themes.md` to decide. Done when the theme activates cleanly on a local site and the minimum files are present.

5. **Apply the security and accessibility baseline.** Follow [references/security-accessibility-baseline.md](references/security-accessibility-baseline.md). Done when escaping, request handling and the accessibility checks listed there are met for every template touched. For a full audit, use `wp-security-review` or `wp-accessibility-audit` if installed; the baseline file is the minimum when they are not.

6. **Verify.**

   ```bash
   find <theme-dir> -name "*.php" -not -path "*/vendor/*" -exec php -l {} \;
   node -e "JSON.parse(require('fs').readFileSync('<theme-dir>/theme.json','utf8')); console.log('theme.json parses')"
   wp theme list --path=<wp-path>
   ```

   ```powershell
   Get-ChildItem <theme-dir> -Recurse -Filter *.php | Where-Object { $_.FullName -notmatch '\\vendor\\' } | ForEach-Object { php -l $_.FullName }
   node -e "JSON.parse(require('fs').readFileSync('<theme-dir>/theme.json','utf8')); console.log('theme.json parses')"
   wp theme list --path=<wp-path>
   ```

   Then check representative routes with `WP_DEBUG_LOG` on (log stays empty), the editor matches the front end, and optional plugins can be switched off on a local copy without a fatal error. Done when results are recorded as evidence.

7. **Record the decisions.** Fill in the decision record at the end of `references/theme-foundations.md`.

## Rules that always apply

- Keep stable WordPress features separate from experimental ones. Do not make production delivery depend on the Gutenberg plugin or an experimental flag without a confirmed compatibility and release plan.
- If the theme relies on a 7.1 feature such as responsive styles, set `Requires at least: 7.1` in `style.css`, or provide a fallback for older versions.
- Durable data (post types, custom fields, bindings sources, form records) belongs in a companion plugin, not the theme. Use `wp-companion-plugin` if installed; otherwise keep that code in a separate, prefixed plugin folder from the start.
- Project requirements override generic examples. Re-check version-sensitive behaviour against developer.wordpress.org for the target version.

## Ask before acting

Get explicit approval before you:

- install or activate plugins (including Create Block Theme or Theme Check) or Composer and npm dependencies;
- switch the active theme on any shared site;
- delete or reset database templates, global styles or synced patterns;
- replace existing configuration files (`theme.json`, `phpcs.xml.dist`, build config) rather than extending them;
- deploy or change production data.

## Output

Hand back:

1. The chosen architecture and why.
2. The completed decision record from `references/theme-foundations.md`.
3. Files created or changed, and verification evidence from step 6.
4. Open questions and anything deferred.
