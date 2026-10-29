# Baseline and drift report template

Keep one baseline per environment per date. Mark any field you could not collect as "not available: `<reason>`" rather than leaving it blank. Do not commit Search Console or analytics figures to a public repository.

## Baseline

### Context

| Field | Value |
| --- | --- |
| Site and environment | `https://example.com` (production) |
| Captured on | `<YYYY-MM-DD>` (Search Console dates are Pacific Time) |
| Captured by | `<agent or role>` |
| Reason | Pre-launch / post-launch / pre-release / routine |
| Search Console property | `sc-domain:example.com` / `https://example.com/` |
| Sources used | Snapshot script / Search Console UI / Search Console API / CrUX API / PageSpeed Insights / Bing Webmaster Tools / analytics `<tool>` |
| Known events near this date | `<release, migration, campaign, seasonal peak>` |
| Snapshot file | `seo-baselines/production-<YYYY-MM-DD>.json` |
| URL list file | `urls.txt` (`<count>` URLs) |

### Technical snapshot summary

From the snapshot JSON (or curl fallback).

| Check | Count | Notes |
| --- | --- | --- |
| URLs checked | | |
| Final status 200 | | |
| Redirected (with hop counts) | | |
| 4xx / 5xx | | List them |
| `noindex` (meta or header) | | Expected on: `<list>` |
| Canonical not self-referencing | | Expected on: `<list>` |
| Missing or duplicate title | | |
| Missing meta description | | |
| No H1 / more than one H1 | | |
| Not in sitemap (but indexable) | | |
| JSON-LD types seen | | e.g. `Organization`, `WebPage`, `BreadcrumbList` |
| hreflang sets | | n/a if single-language |

### Search performance (Google)

| Measure | Last 28 days | Same 28 days last year | Previous 28 days |
| --- | --- | --- | --- |
| Clicks | | | |
| Impressions | | | |
| CTR | | | |
| Average position | | | |
| AI features impressions (generative AI report) | | | |

Top landing pages (by clicks, last 28 days):

| Page | Clicks | Impressions | CTR | Avg position |
| --- | --- | --- | --- | --- |
| `/` | | | | |

Top queries (exclude or group branded terms):

| Query | Clicks | Impressions | CTR | Avg position |
| --- | --- | --- | --- | --- |

### Indexing (Google)

| Measure | Value |
| --- | --- |
| Indexed pages | |
| Not indexed | |
| Top 3 not-indexed reasons with counts | |
| Sitemaps submitted and status | |
| Key URLs inspected (verdict, Google-selected canonical) | |

### Core Web Vitals (field, CrUX, 75th percentile)

| Scope | Form factor | LCP | INP | CLS | Status |
| --- | --- | --- | --- | --- | --- |
| Origin | Phone | | | | Good / needs improvement / poor |
| Origin | Desktop | | | | |
| `/<key-page>/` | Phone | | | | or "insufficient field data" |

Thresholds used (re-check at web.dev): LCP ≤ 2.5 s good, > 4 s poor; INP ≤ 200 ms good, > 500 ms poor; CLS ≤ 0.1 good, > 0.25 poor.

### Bing Webmaster Tools

| Measure | Value |
| --- | --- |
| Clicks / impressions (last 28 days) | |
| Indexed pages | |
| Crawl errors | |
| IndexNow in use? | Yes (`<method>`) / no |

### Conversions (if authorised)

| Conversion | Last 28 days | Source | Caveats (consent, blockers) |
| --- | --- | --- | --- |

### Gaps

| Missing field | Reason | How to get it |
| --- | --- | --- |

---

## Drift report

Use after a release, migration or a reported drop.

### Context

| Field | Value |
| --- | --- |
| Before | `seo-baselines/production-<YYYY-MM-DD>.json` |
| After | `seo-baselines/production-<YYYY-MM-DD>.json` |
| Diff | `seo-baselines/drift-<YYYY-MM-DD>.md` |
| Release or event | `<description, date>` |
| Intended changes provided? | Yes (`<link>`) / no |

### Summary

`<Two or three sentences: how many critical, warning and info changes; how many were expected; the one thing that needs action first.>`

### Changes

| URL | Field | Before | After | Severity | Expected? | Likely cause (confidence) | Owner | Action | Verify by |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/services/<service-slug>/` | Robots | `index, follow` | `noindex, nofollow` | Critical | No | `blog_public` copied from staging (high) | `<role>` | Set `blog_public` to 1 | Re-run snapshot: robots = index |
| `/about/` | Title | `About us` | `About <Organisation>` | Info | Yes | Planned rewrite | n/a | none | n/a |

### Search data comparison (when at least 7 days after the event)

| Measure | Before period | After period | Change | Seasonality checked? | Interpretation |
| --- | --- | --- | --- | --- | --- |
| Clicks | | | | | |
| Indexed pages | | | | | |

Explanations considered, in order: tracking change, technical change (diff above), content change, demand or seasonality, search engine updates (Search Status Dashboard). State which were ruled out and how.

### Next check

`<YYYY-MM-DD>`: re-run snapshot and compare with this "after" file.
