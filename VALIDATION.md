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

Record fixture version, WordPress/PHP/plugin versions, commands run, observed output, and any accepted limitation in the release notes.
