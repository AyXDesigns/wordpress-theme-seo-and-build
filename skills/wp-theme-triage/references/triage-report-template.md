# Theme triage report template

Copy this template and fill every section. Write "not confirmed" rather than guessing. Each finding needs evidence: a file and line, or a command and what it returned.

```markdown
# Theme triage: <theme-slug>

Date: <yyyy-mm-dd>
Environment inspected: <local | staging | files only>   Site URL: <https://example.test>
Planned change that prompted triage: <one line>
Triage depth: <short | full>

## Summary

<Three to five sentences: what the theme is, where its source of truth lives,
the biggest risk, and whether the planned change is safe to start.>

## 1. Classification

| Item | Value | Evidence |
| --- | --- | --- |
| Theme type | <classic / block / hybrid / child of <parent-slug>> | <templates/index.html present; style.css line N> |
| Active template / stylesheet | <parent-slug> / <theme-slug> | `wp option get template`, `wp option get stylesheet` |
| Theme version | <x.y.z> | style.css `Version:` |
| Requires at least / Tested up to / Requires PHP | <x.y> / <x.y> / <x.y> | style.css header |
| theme.json version | <2 / 3 / none> | theme.json line N |
| WordPress / PHP on inspected site | <x.y.z> / <x.y> | `wp core version --extra`, `wp --info` |
| Text domain | <text-domain> | style.css header |

## 2. Canonical source and copies

| Copy | Location | Last change | Matches canonical? |
| --- | --- | --- | --- |
| Repository | <path placeholder> | <commit hash, date> | Canonical |
| Local site | <wp-path>/wp-content/themes/<theme-slug> | <date> | <yes / N files differ> |
| Other (zip, server copy) | <placeholder> | <date> | <unknown> |

Reasoning for the canonical choice: <evidence>.

## 3. Structure

- Templates: <list or count>
- Template parts: <list>
- Patterns: <list or count; note any that contain hard-coded copy>
- Style variations and section styles (`styles/`): <list>
- PHP includes from functions.php: <list>
- `add_theme_support` calls: <list>
- Enqueued handles: <handle - file - where loaded (front end, editor, both)>
- Global prefixes in use: <prefix_ ; any unprefixed functions or classes>

## 4. Content ownership

| Visitor-facing item | Stored in | Editable by | Evidence | Concern |
| --- | --- | --- | --- | --- |
| Header and navigation | <wp_navigation post / menu / hard-coded> | <role> | <evidence> | <none / note> |
| Footer contact details | <pattern / theme mod / option / template file> | <role> | | |
| Home page sections | <post content / pattern / database template> | | | |
| Forms | <plugin and form ID> | | | |
| SEO titles, descriptions, schema | <plugin / theme / both> | | | <duplicate output?> |

## 5. Dependencies

| Plugin or service | Used for | Call sites | Guarded? | Behaviour if missing | Class |
| --- | --- | --- | --- | --- | --- |
| <plugin-slug> | <purpose> | <file:line> | <yes / no> | <fallback / fatal / not tested> | <required / optional-guarded / optional-unguarded> |

Theme-owned data that would vanish on a theme switch (post types, taxonomies, shortcodes, block bindings sources): <list or none>.

## 6. Saved data and database overrides

| Type | Items found | Effect |
| --- | --- | --- |
| Database templates and parts (`wp_template`, `wp_template_part`) | <names, modified dates> | Override theme files |
| Global styles (`wp_global_styles`) | <yes / no> | Override theme.json styles |
| Synced patterns (`wp_block`) | <count, names> | Content, survives theme changes |
| Theme mods / options written by the theme | <keys> | Must be migrated, not replaced |
| Custom fields and post meta | <keys> | |

## 7. Build, test and deployment conventions

- Package manager and scripts: <npm / composer scripts, read not run>
- Built assets committed? <yes / no>
- Coding standards and tests: <phpcs config, test folders, CI workflow names>
- Release packaging: <script / .distignore / manual>
- Branch and tag pattern: <pattern>
- Deployment route: <method, if documented; otherwise unknown>

## 8. Risks (highest first)

| # | Risk | Likelihood | Impact | Evidence | Mitigation |
| --- | --- | --- | --- | --- | --- |
| 1 | <e.g. home template overridden in database> | <high/med/low> | <high/med/low> | <evidence> | <action> |

## 9. Proportionate test plan

| Check | How | Pass condition |
| --- | --- | --- |
| <e.g. affected templates at 3 widths> | <browser, widths> | <no overflow, matches editor> |
| <e.g. plugin-off state> | <local copy, deactivate plugin> | <no fatal error, fallback shown> |

## 10. Assumptions, unknowns and authorisation needed

- Assumptions: <list>
- Unknowns and how to resolve them: <list>
- Actions that need the user's approval: <list>

## Recommended next step

<One step, and the skill to use if installed.>
```
