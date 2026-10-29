---
name: seo-measure-and-monitor
description: Own SEO baselines, release drift checks and ongoing monitoring. Records per-URL snapshots (status, redirects, title, canonical, robots, H1, hreflang, JSON-LD, sitemap) with a bundled script, diffs them after a release, and reads Google Search Console, the Search Console API, PageSpeed Insights, the CrUX API (LCP, INP, CLS), Bing Webmaster Tools and IndexNow. Use when someone reports "traffic dropped" or "pages not indexed", or asks about Core Web Vitals, a launch baseline, a before/after comparison, a post-migration check or SEO alerts. Pre-launch fixes belong to `wp-seo-build-and-release`.
license: MIT
metadata:
  author: AyXDesigns
  version: "0.2.0"
---

# SEO measurement and monitoring

This skill is the single owner of SEO baselines, drift detection and ongoing monitoring in the pack. Other skills hand off to it. It records what the site serves and how search engines report it, compares one point in time with another, and turns meaningful change into actions with evidence.

## Before you start

Confirm, and ask when unknown:

- Site, environment and the URL list to track (from the page map if `wp-seo-discovery-brief` produced one; otherwise home, one URL per template type, and the top landing pages).
- Search Console property type: Domain property (`sc-domain:example.com`) or URL-prefix (`https://example.com/`), and whether the user has access. The agent never asks for a Google password; the user signs in or exports data.
- Comparison window and timezone. Search Console reports dates in Pacific Time.
- Known events that explain change: release dates, migrations, content pruning, tracking changes, seasonal peaks, campaigns.
- Where baselines may be stored. Snapshots of public pages are safe to keep; Search Console and analytics exports are private and must not go into a public repository.
- Whether the user wants a one-off check or recurring monitoring.

## Workflow

### 1. Choose data sources

Ask what accounts exist, the site's size, budget, and how comfortable the user is creating API credentials. Then present the options as a short question with choices, using `references/data-sources.md`. Summary:

| Option | Advantages | Disadvantages | Cost | Suits |
| --- | --- | --- | --- | --- |
| Public checks only (snapshot script, PageSpeed Insights) | No accounts or credentials; works on any site | No clicks, queries or Google index view | Free | First look; sites without Search Console |
| Search Console and Bing Webmaster Tools in the browser, with exports | Official first-party data; user keeps control of the login | Manual; UI tables are row-capped; 16-month history | Free | Small sites, occasional checks |
| Search Console API and CrUX API with the user's own Google Cloud project | Repeatable, scriptable, more rows | Setup effort; OAuth token and API key to manage | Free within quotas | Regular monitoring, larger sites |
| Paid SEO suite rank tracking (Ahrefs, Semrush or similar) | Competitor and rank views, alerts | Modelled estimates, not Google data; subscription; data shared with a third party | Paid | Teams already paying for one |

Recommend one. Privacy: Search Console and analytics data stay with the user. Do not paste exports into third-party tools, or commit them, without approval.

### 2. Record a technical baseline with the snapshot script

The bundled script is `scripts/seo-snapshot.mjs`. Run it from the project, as `node <skill-dir>/scripts/seo-snapshot.mjs`, where `<skill-dir>` is the folder that contains this `SKILL.md`; keep snapshot files in the project, never in the skill folder. It needs Node.js 18 or later and makes only read-only HTTP requests. If the file is missing, use the curl checks described in `references/data-sources.md` and record the same fields by hand.

```bash
node <skill-dir>/scripts/seo-snapshot.mjs --urls urls.txt --sitemap https://example.com/sitemap_index.xml --out seo-baselines/production-2026-10-29.json
node <skill-dir>/scripts/seo-snapshot.mjs --urls "https://example.com/,https://example.com/services/" --out seo-baselines/quick.json
```

```powershell
node <skill-dir>\scripts\seo-snapshot.mjs --urls urls.txt --sitemap https://example.com/sitemap_index.xml --out seo-baselines\production-2026-10-29.json
```

`--urls` takes a file (one URL per line, `#` for comments) or a comma-separated list. `--sitemap` adds a sitemap-inclusion flag per URL; use the index named in `robots.txt`. Add `--from-sitemap` to snapshot every URL in the sitemap as well, capped by `--limit` (default 200). Per URL it records final status, redirect chain, title, meta description, canonical, meta robots and `X-Robots-Tag`, H1s, hreflang, JSON-LD `@type` values and sitemap inclusion. Run `node <skill-dir>/scripts/seo-snapshot.mjs --help` for the remaining options (timeout, concurrency, user agent).

Name files `<environment>-<YYYY-MM-DD>.json`. Run against staging and production separately; never mix environments in one file. Only snapshot sites the user owns or is authorised to test.

Done when the snapshot file exists, every URL has a status, and failures (timeouts, 401) are noted.

### 3. Record a search baseline

Using the source chosen in step 1, fill `references/baseline-template.md`:

- Search Console Performance: clicks, impressions, CTR and average position for the last 28 days and the same period a year earlier, by page and top queries. Note that recent days are preliminary.
- Search Console Page indexing: indexed and not-indexed counts with the main reasons; Sitemaps report status.
- Search Console generative AI performance reports (impressions in AI Overviews and AI Mode), if shown for the property. As of October 2026 Google reports these as rolled out to all sites; re-check before relying on them.
- Core Web Vitals field data from the CrUX API for the origin and key URLs, phone and desktop. Thresholds at the 75th percentile (web.dev, re-check before use): LCP good at 2.5 s or less, poor above 4 s; INP good at 200 ms or less, poor above 500 ms; CLS good at 0.1 or less, poor above 0.25.
- Bing Webmaster Tools: indexed pages, crawl errors, search performance.
- Conversions from the user's analytics, if authorised. Note consent banners and ad blockers mean analytics undercounts.

Done when each field is filled or marked "not available" with the reason.

### 4. Compare after a release (drift)

Take a new snapshot of the same URL list in the same environment, then diff:

```bash
node <skill-dir>/scripts/seo-snapshot.mjs --urls urls.txt --sitemap https://example.com/sitemap_index.xml --out seo-baselines/production-2026-11-05.json
node <skill-dir>/scripts/seo-snapshot.mjs --diff seo-baselines/production-2026-10-29.json seo-baselines/production-2026-11-05.json --md > seo-baselines/drift-2026-11-05.md
```

```powershell
node <skill-dir>\scripts\seo-snapshot.mjs --diff seo-baselines\production-2026-10-29.json seo-baselines\production-2026-11-05.json --md | Out-File -Encoding utf8 seo-baselines\drift-2026-11-05.md
```

By default the diff matches URLs exactly, host included, which suits before-and-after snapshots of one environment. To compare staging with production, add `--by-path`: URLs are matched by path and query, and differences that are only the host (in final URL, canonical, `og:url` and hreflang) are ignored. Add `--fail-on critical` (or `warning`) to make the command exit with code 2 when such a change exists, which suits CI or a scheduled job. If the diff command fails, compare the two JSON files by hand for the fields listed above.

The diff labels each change with the script's default rules:

- **Critical:** a new `noindex` (meta robots or `X-Robots-Tag`), a status that becomes 4xx/5xx, a fetch that starts failing (timeout, redirect loop), or a canonical that now points at a different page.
- **Warning:** `noindex` removed (check staging has not become indexable), a changed redirect target, a missing, empty or duplicated canonical, a page dropped from the sitemap, removed JSON-LD types or new JSON-LD errors, hreflang changes, a lost title or H1, or a URL missing from the new snapshot.
- **Info:** ordinary title, H1, description and `og:url` edits, added schema types, recoveries, and any knock-on change on a page that now errors (the status line carries the severity).

Then:

1. Match every change against the release's list of intended changes. Ask for that list if you do not have it.
2. Intended and correct: mark "expected" and move on.
3. Unintended critical: report immediately and recommend a fix or rollback.
4. Unintended warning or info: add to the drift report with an owner. Treat a warning as critical when it hits a high-traffic or high-conversion page.

For a launch, take the pre-launch snapshot on the old production site (or on staging for a new site), then a post-launch snapshot of the same URLs on production. Where hosts differ (a new site moving from staging to production), compare the two files row by row by path rather than with `--diff`.

Search data lags by about two days and moves for many reasons. Wait at least 7 days, preferably 28, before judging traffic change, compare like-for-like periods (same weekdays; year-on-year for seasonal sites), and test explanations in this order: tracking change, technical change (from the snapshot diff), content change, demand or seasonality, search engine updates. Correlation is not cause.

### 5. Investigate a drop or an indexing problem

1. Snapshot and diff first: most self-inflicted drops show up as status, robots, canonical or sitemap changes.
2. Search Console Performance: compare periods by page, then by query, country and device, to find where the loss is concentrated.
3. URL Inspection (UI or API) for affected URLs: indexing state, Google-selected canonical against user-declared canonical, last crawl, robots.txt state.
4. Page indexing report reasons for the affected URL pattern.
5. Check Google's Search Status Dashboard for ranking updates or incidents around the date.

Report findings with confidence levels, not certainties.

### 6. Offer IndexNow where it fits

IndexNow is an open protocol for notifying participating search engines (Bing, Yandex, Seznam, Naver, Yep and others, listed at indexnow.org) that URLs were added, changed or deleted. Google does not participate. Offer it when content changes often (news, listings, stock, events) and Bing traffic matters; skip it for small, rarely changing sites. Options and commands are in `references/data-sources.md`. Do not use Google's Indexing API for ordinary pages; Google limits it to job posting and livestream pages.

### 7. Set up ongoing monitoring (only if asked)

Agree with the user: URL list, frequency (weekly is enough for most sites; daily during a migration), where snapshots go, who receives the report, and thresholds. Suggested thresholds:

- Any critical item in the diff: alert at once.
- Clicks to the top 20 pages down more than 25% over 28 days against the previous 28 days, not explained by seasonality: investigate.
- Indexed page count down more than 10%: investigate.
- Any Core Web Vital moving from good to needs improvement at the 75th percentile: investigate.

Report only on a threshold breach, a failure of the check itself, or when user action is needed. Scheduling belongs to the user's tool (cron, Task Scheduler, CI, or an agent scheduler); describe it and wait for approval before creating it.

## Ask before acting

- Connecting to any account, creating API keys, OAuth clients or Google Cloud projects.
- Storing Search Console or analytics data anywhere, especially in a repository.
- Requesting indexing, submitting sitemaps, or sending IndexNow pings.
- Creating a key file on the server, or any scheduled or recurring job.
- Starting a paid trial or using paid credits.
- Changing analytics, consent or tracking configuration.

## Output

- Baseline: `references/baseline-template.md` filled in, plus the snapshot JSON path.
- Drift or investigation: a report using the "Drift report" section of `references/baseline-template.md`: what changed, evidence, expected or not, severity, likely cause with confidence, owner, action and the check that will confirm the fix.
- Monitoring: the agreed schedule, thresholds and recipients, written down, with approval recorded.
