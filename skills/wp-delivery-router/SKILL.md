---
name: wp-delivery-router
description: Route WordPress theme, form, release, and SEO requests to the smallest suitable AyXDesigns workflow and any justified specialist checks.
---

# WordPress delivery router

Use when the correct WordPress workflow is unclear, several workstreams may apply, or a request risks loading broad overlapping skills. Classify first. Then select one primary workflow and only the conditional checks required by the task.

## Classify the request

Identify the requested outcome, affected site environment, change type, stored-data impact, visitor-risk level, external dependencies, and whether the work is local, staging, or production.

If the repository is unfamiliar or the canonical source is uncertain, select `wp-theme-triage` before implementation. Do not treat a deployed copy as authoritative without evidence.

## Primary workflow selection

| Request signal | Primary skill |
|---|---|
| Unfamiliar theme, unclear ownership, unclear deployment path, or broad diagnosis before editing | `wp-theme-triage` |
| Local WordPress stack, XAMPP, PHP executable, database service, WP-CLI, or local URL configuration | `wp-local-stack-setup` |
| General theme architecture, template hierarchy, theme setup, block/classic/hybrid choice, or baseline implementation guidance | `wp-theme-foundations` |
| New WordPress site, major redesign, design system, page/component build, or architecture-led implementation | `wp-site-experience-build` |
| Preview creation/recovery, hosting choice, publication, deployment, domain connection, or hosting handover | `site-preview-and-publish` |
| Changed saved options, page/pattern content, repeaters, seed data, form mapping, CPT meta, or stored-data meaning | `wp-theme-content-migrations` |
| Exporting or saving block-theme editor customisations into source files | `wp-theme-content-migrations` |
| Contact Form 7, Flamingo, Turnstile, form storage, notification reliability, bot protection, or form privacy | `wp-cf7-form-assurance` |
| Release candidate, packaging, deploy-readiness, regression evidence, or rollback proof | `wp-theme-release-gate` |
| New-site SEO architecture, page purpose, indexation planning, content ownership, or internal-link design | `wp-seo-discovery-brief` |
| Metadata, canonical, robots, sitemap, schema, redirects, rendered SEO output, or launch baseline | `wp-seo-build-and-release` |
| Keyword/market opportunity, competitors, backlinks, local/maps visibility, ecommerce opportunity, or paid SEO datasets | `seo-research-and-strategy` |
| Content quality, briefs, clusters, comparison pages, scaled page families, intent mismatch, or AI-search citation readiness | `seo-content-system` |
| Search Console, analytics, field performance, index inspection, baseline, drift, or post-release SEO monitoring | `seo-measure-and-monitor` |

## Conditional specialists

Add a specialist only for its distinct concern:

- general WordPress theme structure or block/editor implementation: use an approved WordPress-theme implementation workflow;
- visual-system or component design: use an approved frontend-design workflow;
- local/service-area business evidence: use a local SEO workflow;
- a large editorial programme: use topic-cluster or content-brief workflow;
- a feature-specific SEO diagnosis: use the relevant page, schema, sitemap, image, or technical SEO workflow;
- broad pre-launch audit: select one primary audit approach, either comprehensive review or crawl-led evidence, not both by default;
- post-launch SEO comparison: use a drift/baseline workflow when available.
- architecture graph generation is optional and justified only when cross-file relationships cannot be established cheaply by direct inspection;
- generated imagery is a separate authorised production action and must follow the project's image ownership, accessibility, and optimisation rules.

## Exclusions and safety

Do not route ordinary CSS, copy, or template edits to every available skill. Do not introduce a page builder, new plugin, paid service, external data provider, production deployment, or data deletion merely because a selected workflow mentions it.

State the chosen primary skill, any conditional skills, the reason for each, and the checks that will demonstrate completion. Where no skill is needed, say so and complete the focused task directly.
