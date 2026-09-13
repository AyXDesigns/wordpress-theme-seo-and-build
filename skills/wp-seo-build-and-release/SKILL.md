---
name: wp-seo-build-and-release
description: Implement or verify WordPress-owned SEO output and produce evidence for pre-launch indexation, metadata, links, schema, sitemap, redirects, and launch baselines.
---

# WordPress SEO build and release

Use when a WordPress theme or plugin controls search-facing output, or when pre-launch SEO verification is required. Inspect rendered HTML and real response behaviour; template source alone is not proof.

## Ownership and implementation

- Establish one owner for each search-facing concern. Disable or remove a fallback when an approved SEO tool owns the same output.
- Use WordPress APIs for URLs and encoded structured data. Do not hard-code production domains or concatenate editor input into JSON-LD.
- Keep titles, descriptions, canonicals, robots rules, social cards, sitemaps, redirects, and schema consistent with visible content and page purpose.
- Ensure important pages are reached by ordinary links without JavaScript.
- Keep preview/staging environments protected from unintended indexing. Confirm production has the intended indexing policy before launch.

## Evidence-led release check

For each finding, record the affected URL/template, observed evidence, user/search impact, priority, owner, dependency, acceptance test, and verification method.

Check applicable representative pages for response status, canonical URL, robots directives, visible H1 and heading order, title, description, internal links, image meaning, structured data, sitemap inclusion, redirect destination, and duplicate output.

Choose one primary broad audit method for a release. Use a crawl-led live/staging audit when rendered crawl evidence is needed; use a comprehensive strategy-to-implementation audit when broader review is needed. Do not duplicate both by default.

Capture a launch baseline for the agreed URLs, indexation state, top landing pages/queries where authorised, conversions, crawl errors, Core Web Vitals, and sitemap state. Recheck meaningful changes after releases.
