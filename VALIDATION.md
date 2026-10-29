# Skill validation

Validate a skill with a realistic task and observable results. A valid YAML header or a successful command alone is not evidence that the skill works.

| Skill | Fixture | Required evidence |
|---|---|---|
| `wp-delivery-router` | A mixed set of requests: CSS tweak, form failure, data migration, unfamiliar theme, SEO launch check, and release candidate. | One primary skill selected per request, conditional skills justified, and no irrelevant workflow loaded. |
| `wp-local-stack-setup` | Windows machine with no stack, partial XAMPP install, and working XAMPP/WP-CLI install. | Read-only diagnosis first; installation choices and impacts shown; no mutation before approval; post-change PHP, database, WordPress, and WP-CLI checks recorded. |
| `wp-theme-foundations` | Empty classic theme, block theme, and established hybrid theme. | Correct architecture selected; content remains editable; security/accessibility/SEO ownership is explicit; irrelevant optional features are not added. |
| `wp-site-experience-build` | One classic theme and one block theme with different content ownership models. | Architecture map, design rationale, editable content, responsive states, and implementation verification without unnecessary dependencies. |
| `site-preview-and-publish` | Working preview, failed preview, and publish request. | Preview recovery remains non-destructive; destination and rollback are stated; no public deployment happens without explicit approval. |
| `wp-theme-triage` | Two structurally different local themes. | Canonical source, dependencies, content ownership, deployment constraints, and test plan identified without edits. |
| `wp-theme-content-migrations` | Clean install and upgrade fixture containing edited settings, legacy meta, duplicate records, and a missing dependency. | Re-run safety, preserved user edits, expected migration report, and no unexplained data loss. |
| `wp-cf7-form-assurance` | Local Contact Form 7 install with Flamingo/Turnstile variants. | Valid and rejected submission results, dependency fallbacks, stored-record inspection, and exact QA-record cleanup. |
| `wp-theme-release-gate` | Release candidate built from a clean checkout. | Syntax, route, dependency-off, browser, package-integrity, and source/package comparison evidence. |
| `wp-seo-discovery-brief` | New or redesigned site with a page inventory. | One purpose, intent, owner, evidence source, freshness trigger, and next step per indexable page. |
| `wp-seo-build-and-release` | Rendered local/staging site. | URL-specific checks for output ownership, indexation, links, sitemap, redirects, schema, and launch baseline. |
| `seo-research-and-strategy` | Local charity, service business, and ecommerce examples with different available data. | Evidence sources and costs declared; unsupported estimates separated from observed data; strategy changes by business model. |
| `seo-content-system` | Service page, editorial cluster, comparison page, and proposed location-page set. | Intent fit, unique value, evidence, ownership, internal links, and scale limits are explicit; thin variants are rejected. |
| `seo-measure-and-monitor` | Site with a baseline, site without one, and a release with intentional metadata changes. | Meaningful regressions distinguished from intended changes; source freshness and permissions recorded; alerts have acceptance thresholds. |
| `wp-site-migration` | Local-to-staging move, host-to-host move with a domain change, and a request to "just copy the database". | Backup and rollback stated first; method chosen by the user from options with pros and cons; serialised data handled with `wp search-replace --dry-run` first; staging kept out of search; post-move checks recorded. |
| `wp-companion-plugin` | Theme that registers post types and shortcodes, and a request for a new REST integration. | Plugin versus theme versus mu-plugin decision explained; prefixed, capability-checked, escaped code; uninstall behaviour agreed with the user; Plugin Check result recorded. |
| `wp-performance` | Slow page with a lazy-loaded LCP image, a site with two cache plugins, and a site with no field data. | Field and lab data separated; baseline measured before changes; cause found at the right layer; no overlapping cache plugins; before/after evidence. |
| `wp-accessibility-audit` | Block theme with a navigation submenu, a Contact Form 7 form, and an embedded video. | Journeys tested by keyboard, zoom and screen reader spot checks; automated results treated as a starting point; findings mapped to WCAG 2.2 criteria with fixes. |
| `wp-security-review` | Theme with unescaped output and a missing nonce, a REST route without a permission check, and a request to test someone else's site. | Read-only review; findings rated by severity with fixes; core and plugin checksums verified; refuses to probe sites the user does not own. |
| `wp-privacy-and-consent` | UK site with GA4 and YouTube embeds, a site with no banner, and a site using a privacy-friendly analytics tool. | Cookie inventory made from observation; options presented with pros and cons; legal points dated and sourced; clearly not legal advice. |
| `seo-local` | Single-location charity, a service-area business, and a request for 50 town pages. | Business Profile and NAP checks; location pages only with genuine local content; no fake or incentivised reviews. |
| `seo-structured-data` | Site where Yoast already emits a graph, a site with FAQ markup, and an events page. | Existing graph detected and extended, not duplicated; only supported and truthful types; JSON-LD built with `wp_json_encode`; validation results recorded. |

## Scripts

| Script | Fixture | Required evidence |
|---|---|---|
| `theme-inventory.mjs` | One block theme, one classic theme with an unguarded plugin call, and a folder without `style.css`. | Correct type; unguarded dependency flagged; clear error for a non-theme folder. |
| `release-package.mjs` | Theme in a repository subfolder with an `export-ignore` folder, a theme at the repository root, and a ref containing a `.env` file. | Pass for clean packages; export-ignored files listed as excluded, not missing; `.env` fails the gate; line endings match the commit on Windows. |
| `seo-snapshot.mjs` | Local server with a redirect, a 404, an `X-Robots-Tag: noindex` page, invalid JSON-LD and a sitemap index. | Each signal recorded; sitemap inclusion correct; `--diff` rates a new noindex or 404 above a title change. |
| `validate-skills.mjs` | The repository itself. | 0 errors before release. |

Run `node scripts/validate-skills.mjs` and `claude plugin eval .` before every release.

Record fixture version, WordPress/PHP/plugin versions, commands run, observed output, and any accepted limitation in the release notes.
