---
name: wp-delivery-router
description: Pick the right AyXDesigns WordPress or SEO skill when a request is vague, spans several areas, or could pull in many overlapping workflows. Classifies the request by outcome, environment and risk, chooses one primary skill plus only the specialist checks the task needs, and says when no skill is needed at all. Use when someone asks "where do I start", hands over a mixed list (a broken form, a slow page and a launch), inherits a site, plans a launch or release, or when it is unclear whether a WordPress task is theme, plugin, data, hosting, performance, accessibility, security, privacy or SEO work.
license: MIT
metadata:
  author: AyXDesigns
  version: "0.2.0"
---

# WordPress delivery router

Choose the smallest workflow that will get the job done well. Classify first, pick one primary skill, add a specialist only for a distinct concern, and say plainly when a small task needs no skill.

## Before you start

Establish, from the request and a quick look at the project:

- **Outcome:** what the user wants to be true when the work is finished.
- **Environment:** local, preview, staging or production, and whether the canonical source is known.
- **Change type:** code, configuration, stored data, content, hosting or measurement.
- **Risk:** does it touch saved data, personal data, live visitors, payments, search visibility or money?
- **Authority:** what the user has approved, and what will need approval (installs, deploys, paid tools, deletions).

If the repository or site is unfamiliar, or nobody knows which copy is canonical, start with `wp-theme-triage` before any change. A deployed copy is not the source of truth without evidence.

If the request is ambiguous in a way that changes the route, ask one short question with 2–3 options instead of guessing.

## Primary skill

| Request signal | Primary skill |
|---|---|
| Unfamiliar or inherited theme, unclear ownership, "what does this theme do", diagnosis before editing | `wp-theme-triage` |
| Local WordPress environment: XAMPP, LocalWP, WordPress Studio, DDEV, wp-env, WP-CLI, ports, local database errors | `wp-local-stack-setup` |
| Theme architecture, block vs classic vs hybrid vs child, `theme.json`, template hierarchy, baseline for a new theme | `wp-theme-foundations` |
| New site, redesign, design direction, page and component build | `wp-site-experience-build` |
| Custom post types, taxonomies, shortcodes, blocks, REST endpoints or integrations that must survive a theme change; mu-plugins | `wp-companion-plugin` |
| Changed saved settings, theme mods, patterns, meta, seed data or a field's meaning; saving Site Editor changes into theme files | `wp-theme-content-migrations` |
| Contact Form 7, Flamingo, Turnstile or reCAPTCHA on CF7, form emails not arriving, form spam | `wp-cf7-form-assurance` |
| Slow site, TTFB, Core Web Vitals diagnosis (LCP, INP, CLS), PageSpeed or Lighthouse, cache plugin choice, autoloaded options | `wp-performance` |
| Accessibility, WCAG 2.2 AA audit, keyboard or screen reader testing, contrast, accessibility statement | `wp-accessibility-audit` |
| Security review, escaping, nonces, capabilities, PHPCS/WPCS, hardening, checksums, security plugin or WAF choice | `wp-security-review` |
| Cookies, consent banner, analytics consent, UK GDPR, PECR, privacy policy, personal data export or erasure | `wp-privacy-and-consent` |
| Release candidate, theme zip, packaging, deploy readiness, regression evidence, rollback artifact | `wp-theme-release-gate` |
| Preview or staging setup, choosing a host, going live, domain, DNS, SSL handover, keeping staging out of search | `site-preview-and-publish` |
| Moving a site between local, staging and production or between hosts, domain or HTTPS change, `wp search-replace`, DNS cut-over | `wp-site-migration` |
| Page architecture for a new site or redesign, one purpose per page, indexation plan, internal links, ownership matrix | `wp-seo-discovery-brief` |
| Titles, descriptions, canonicals, robots, sitemaps, redirects, SEO plugin conflicts, pre-launch SEO checks | `wp-seo-build-and-release` |
| Schema.org, JSON-LD, rich results, Organization, NGO, Event, Product, FAQ or Article markup | `seo-structured-data` |
| Google Business Profile, local pack or maps visibility, NAP, citations, reviews, service areas, location pages | `seo-local` |
| Keyword or market opportunity, competitors, backlinks, ecommerce or international opportunity, paid SEO data | `seo-research-and-strategy` |
| Content quality, briefs, topic clusters, comparison pages, scaled page families, intent mismatch, AI answer readiness | `seo-content-system` |
| Search Console, baselines, ranking or traffic drops, post-release SEO drift, Core Web Vitals monitoring over time | `seo-measure-and-monitor` |

### Boundaries that are easy to confuse

- **Foundations vs experience build:** `wp-theme-foundations` sets the rules and architecture; `wp-site-experience-build` designs and builds the site on top of them.
- **Content migrations vs site migration:** `wp-theme-content-migrations` changes the shape of saved data inside one site; `wp-site-migration` moves a whole site between environments or hosts.
- **Publish vs migration:** `site-preview-and-publish` chooses where and when a site goes live; `wp-site-migration` moves the files and database.
- **Performance vs monitoring:** `wp-performance` diagnoses and fixes speed; `seo-measure-and-monitor` owns baselines and watches for drift.
- **SEO build vs structured data:** `wp-seo-build-and-release` checks all search-facing output; `seo-structured-data` goes deep on schema.
- **Release gate vs SEO release:** `wp-theme-release-gate` proves the package; `wp-seo-build-and-release` proves the rendered SEO output. A launch may need both.

## Specialist checks

Add a second skill only when it covers a concern the primary skill does not, and say why:

- A redesign that changes URLs: add `wp-seo-discovery-brief` for the page map, and `seo-measure-and-monitor` to take a baseline before launch.
- A launch: `site-preview-and-publish` as primary, with `wp-seo-build-and-release` for search output and `seo-measure-and-monitor` for the launch baseline.
- New forms or analytics on a UK or EU site: add `wp-privacy-and-consent`.
- Code that handles requests, uploads or personal data: add `wp-security-review`.
- New templates or interactive components: add `wp-accessibility-audit` for the affected journeys.
- Theme code that registers post types or stores business data: add `wp-companion-plugin`.

For one broad pre-launch audit, choose one method, either a crawl-led check of the rendered site or a strategy-to-implementation review, not both by default.

If a skill named here is not installed, follow its intent with the user's agreement and state which checks you could not cover.

## Exclusions and safety

- Do not load several skills for an ordinary CSS, copy or template edit. Do the edit directly and check it.
- Do not introduce a page builder, new plugin, paid service, external data provider, production deployment or data deletion because a selected skill mentions one. Each needs its own approval.
- Generated images are a separate, approved production task that must respect image ownership, alt text and optimisation.
- Build a code relationship map only when the repository is too large to understand by direct reading.

## Output

State in a few lines:

1. The primary skill and why.
2. Any specialist checks and the concern each covers.
3. What will need the user's approval.
4. The evidence that will show the work is complete.

Where no skill is needed, say so and complete the task directly.
