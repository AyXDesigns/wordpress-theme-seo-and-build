# Measurement data sources

Facts below were checked in October 2026 against the linked official pages. Quotas, thresholds and report names change; re-check the source before quoting a number to the user.

Credentials rule for every command: keep tokens and API keys in environment variables the user sets (`GSC_TOKEN`, `CRUX_API_KEY`). Never print them, paste them into reports, or commit them.

## Choosing sources: the questions to ask

1. Is the site verified in Google Search Console and Bing Webmaster Tools, and who has access?
2. How many pages and how often does content change?
3. One-off check or recurring monitoring?
4. Will the user create a Google Cloud project and credentials, or prefer to export from the browser?
5. Is there budget for a paid tool, and is sharing the domain and data with a third party acceptable?

Then offer 2–4 options from the table in `SKILL.md`, with advantages, disadvantages and cost, recommend one, and wait.

## Google Search Console (browser)

- **Performance report**: clicks, impressions, CTR, average position by query, page, country, device, search appearance and date. Up to 16 months of history. The newest data is preliminary and can change. Some queries are anonymised for privacy, so query totals do not add up to page totals.
- **Generative AI performance reports**: impressions of your URLs in AI Overviews and AI Mode (Search) and in Discover's generative features. Announced June 2026, reported as rolled out to all sites by 31 August 2026. AI feature traffic also stays inside the main Performance report under the Web search type.
- **Page indexing**: indexed and not-indexed counts with reasons (crawled but not indexed, duplicate without user-selected canonical, excluded by noindex, and so on).
- **URL Inspection**: per-URL index status, Google-selected and user-declared canonical, last crawl, robots.txt state; "Test live URL" and "Request indexing" (rate-limited; ask before using).
- **Sitemaps**: submission status and discovered URL counts.
- **Core Web Vitals report**: groups of URLs by status, from CrUX field data.

Advantages: official, free, no third party. Disadvantages: manual; tables and exports are row-capped, so use the API or bulk export for large sites.

Sources: <https://developers.google.com/search/docs/monitor-debug/debugging-search-traffic-drops>, <https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports>, <https://developers.google.com/search/docs/appearance/ai-features>.

## Google Search Console API

The user creates a Google Cloud project, enables the Search Console API, and obtains an OAuth access token with the read-only scope `https://www.googleapis.com/auth/webmasters.readonly` by their preferred method (a Google client library, or a service account added as a user on the property). The agent does not handle the sign-in.

Search Analytics (rows of performance data; `rowLimit` 1–25,000, page with `startRow`; `dataState` `final` by default or `all` for fresh data):

```bash
curl -sS -X POST "https://www.googleapis.com/webmasters/v3/sites/sc-domain%3Aexample.com/searchAnalytics/query" \
  -H "Authorization: Bearer $GSC_TOKEN" -H "Content-Type: application/json" \
  -d '{"startDate":"<YYYY-MM-DD>","endDate":"<YYYY-MM-DD>","dimensions":["page"],"rowLimit":25000,"type":"web"}' \
  > gsc-pages-<YYYY-MM-DD>.json
```

```powershell
$body = @{ startDate = '<YYYY-MM-DD>'; endDate = '<YYYY-MM-DD>'; dimensions = @('page'); rowLimit = 25000; type = 'web' } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "https://www.googleapis.com/webmasters/v3/sites/sc-domain%3Aexample.com/searchAnalytics/query" `
  -Headers @{ Authorization = "Bearer $env:GSC_TOKEN" } -ContentType 'application/json' -Body $body |
  ConvertTo-Json -Depth 6 | Out-File -Encoding utf8 "gsc-pages-<YYYY-MM-DD>.json"
```

URL Inspection (per URL; quota 2,000 per day and 600 per minute per property):

```bash
curl -sS -X POST "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect" \
  -H "Authorization: Bearer $GSC_TOKEN" -H "Content-Type: application/json" \
  -d '{"inspectionUrl":"https://example.com/services/<service-slug>/","siteUrl":"sc-domain:example.com"}'
```

```powershell
$body = @{ inspectionUrl = 'https://example.com/services/<service-slug>/'; siteUrl = 'sc-domain:example.com' } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "https://searchconsole.googleapis.com/v1/urlInspection/index:inspect" `
  -Headers @{ Authorization = "Bearer $env:GSC_TOKEN" } -ContentType 'application/json' -Body $body
```

Read `inspectionResult.indexStatusResult` for the verdict, coverage state, crawl time and both canonicals.

Search Analytics quotas include 1,200 queries per minute per site and per user, and a "load" quota that grows with date range and page-plus-query grouping. For very large sites, Search Console's bulk data export to BigQuery avoids row limits; BigQuery storage and queries may cost money.

Sources: <https://developers.google.com/webmaster-tools/v1/searchanalytics/query>, <https://developers.google.com/webmaster-tools/v1/urlInspection.index/inspect>, <https://developers.google.com/webmaster-tools/limits>.

## Core Web Vitals: CrUX API and PageSpeed Insights

Current Core Web Vitals (web.dev, last updated October 2024; re-check): LCP, INP and CLS, judged at the 75th percentile of page loads, mobile and desktop separately. INP replaced FID in March 2024.

| Metric | Good | Needs improvement | Poor |
| --- | --- | --- | --- |
| LCP | ≤ 2.5 s | > 2.5 s to 4 s | > 4 s |
| INP | ≤ 200 ms | > 200 ms to 500 ms | > 500 ms |
| CLS | ≤ 0.1 | > 0.1 to 0.25 | > 0.25 |

**Field data, CrUX API** (real Chrome users, 28-day rolling window, updated daily, about two days behind; needs an API key; 150 queries per minute per project, free). Pages or origins with too little traffic return 404 "not found"; record that as "insufficient field data", not as a failure.

```bash
curl -sS -X POST "https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=$CRUX_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"origin":"https://example.com","formFactor":"PHONE","metrics":["largest_contentful_paint","interaction_to_next_paint","cumulative_layout_shift"]}'
```

```powershell
$body = @{ origin = 'https://example.com'; formFactor = 'PHONE'; metrics = @('largest_contentful_paint','interaction_to_next_paint','cumulative_layout_shift') } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri "https://chromeuxreport.googleapis.com/v1/records:queryRecord?key=$env:CRUX_API_KEY" `
  -ContentType 'application/json' -Body $body
```

Use `"url":"https://example.com/<path>/"` instead of `origin` for one page. Read `record.metrics.<metric>.percentiles.p75`. For trends, the CrUX History API (`records:queryHistoryRecord`, same body plus `collectionPeriodCount` up to 40 weekly periods) shows about ten months.

**Lab data, PageSpeed Insights** (a Lighthouse run from Google's servers; good for diagnosing causes, not for pass or fail). Works without a key for occasional use.

```bash
curl -sS "https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed?url=https%3A%2F%2Fexample.com%2F&strategy=MOBILE&category=PERFORMANCE"
```

```powershell
Invoke-RestMethod "https://pagespeedonline.googleapis.com/pagespeedonline/v5/runPagespeed?url=https%3A%2F%2Fexample.com%2F&strategy=MOBILE&category=PERFORMANCE"
```

Google has said it plans to stop including CrUX field data in the PageSpeed Insights API; use the CrUX API for field data.

Sources: <https://web.dev/articles/vitals>, <https://web.dev/articles/lcp>, <https://web.dev/articles/inp>, <https://web.dev/articles/cls>, <https://developer.chrome.com/docs/crux/api>, <https://developer.chrome.com/docs/crux/history-api>, <https://developers.google.com/speed/docs/insights/v5/get-started>.

## Bing Webmaster Tools

Free. A site verified in Google Search Console can be imported (sign in to Google from Bing Webmaster Tools and pick the sites), which also brings its sitemaps. Useful reports: Search Performance, URL Inspection, Site Explorer, Sitemaps, and an IndexNow tab showing received URLs. An API key (Settings, API Access) allows scripted access; the older Bing URL Submission API is Bing-only and Microsoft recommends IndexNow instead.

Advantages: second search engine's view, often catches crawl problems Google tolerates; Bing's index also feeds other services. Disadvantages: smaller traffic share in most markets, so smaller samples.

Sources: <https://www.bing.com/webmasters/help/url-submission-62f2860b>, <https://www.bing.com/indexnow/getstarted>, <https://learn.microsoft.com/en-us/bingwebmaster/getting-access>.

## IndexNow

What it is: a shared ping protocol. You host a key file on the site, then tell one participating engine which URLs changed; participants share submissions with each other. Participants listed at indexnow.org (October 2026): Bing, Yandex, Seznam, Naver, Yep, Internet Archive, Amazonbot. Google does not participate.

When to offer: sites whose content changes often (news, events, listings, stock levels) and where Bing or the other participants matter. Not worth the setup for a small brochure site that changes monthly; its sitemap is enough.

Options to present:

| Option | Advantages | Disadvantages | Effort |
| --- | --- | --- | --- |
| A WordPress plugin that pings on publish (some SEO plugins include an IndexNow setting; Microsoft also publishes one) | Automatic on publish, update and delete | Another plugin or setting to own; check it does not double-ping alongside another | Low |
| Manual or scripted pings | Full control; no plugin | Someone must remember or schedule it | Medium |
| Do nothing; rely on sitemaps | No setup | Slower discovery on participating engines | None |

Manual ping, after the user approves creating the key file (`https://example.com/<key>.txt`, UTF-8, containing only the key; keys are 8–128 characters of letters, digits and dashes):

```bash
curl -sS -X POST "https://api.indexnow.org/indexnow" -H "Content-Type: application/json; charset=utf-8" \
  -d '{"host":"example.com","key":"<key>","urlList":["https://example.com/<changed-page>/"]}' -w '%{http_code}\n'
```

```powershell
$body = @{ host = 'example.com'; key = '<key>'; urlList = @('https://example.com/<changed-page>/') } | ConvertTo-Json
Invoke-WebRequest -Method Post -Uri "https://api.indexnow.org/indexnow" -ContentType 'application/json; charset=utf-8' -Body $body -UseBasicParsing | Select-Object StatusCode
```

Responses: 200 accepted, 202 accepted with key validation pending, 400 bad format, 403 key not found or wrong, 422 URLs not on the host, 429 too many requests. Up to 10,000 URLs per POST. Only submit URLs that actually changed.

Sources: <https://www.indexnow.org/documentation>, <https://www.indexnow.org/searchengines.json>.

## Not for ordinary pages

Google's Indexing API only supports pages with `JobPosting` or a `BroadcastEvent` inside a `VideoObject`. Do not use it to push other pages. Source: <https://developers.google.com/search/apis/indexing-api/v3/quickstart>.

## Paid suites

Ahrefs, Semrush and similar tools provide rank tracking, site audits and alerts. Their traffic and ranking figures are modelled estimates, not Google data; use them for trend and competitor context, not as the baseline of record. Entry plans are roughly US$130–140 a month when billed monthly as of October 2026 (third-party reports); confirm on the vendor's pricing page before quoting.

## Curl fallback for snapshots

If `scripts/seo-snapshot.mjs` is missing, record per URL by hand: `curl -sS -L -o /dev/null -w '%{http_code} %{url_effective} %{num_redirects}\n' <url>` for status and redirects, `curl -sS -o /dev/null -D - <url>` for `X-Robots-Tag`, and the page HTML for title, description, canonical, robots meta, H1, hreflang and JSON-LD. Save outputs with the date in the file name so a later run can be compared line by line.
