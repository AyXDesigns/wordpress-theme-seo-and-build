# SEO finding log template

One log per release or launch check. Each finding is something observed, not something suspected; if you could not observe it, list it under "Not checked".

## Check summary

| Field | Value |
| --- | --- |
| Site and environment | `https://staging.example.com` (staging) |
| Checked on | `<YYYY-MM-DD HH:MM>` `<timezone>` |
| Checked by | `<agent or role>` |
| WordPress / theme / SEO plugin versions | `<7.x>` / `<theme-slug> <version>` / `<plugin> <version>` |
| Method | Snapshot script from `seo-measure-and-monitor` / curl checks / both |
| Sample URLs | `<count>` URLs, list in appendix |
| Result | Ready / ready with accepted warnings / not ready |

## Severity

| Severity | Meaning | Release rule |
| --- | --- | --- |
| Critical | Stops indexing or sends visitors to the wrong place: `noindex` or `X-Robots-Tag: noindex` on indexable pages, robots.txt blocking the site, canonical pointing at another host or environment, 4xx/5xx on key pages, redirect loops, lost redirects for pages with traffic | Blocks release |
| Warning | Weakens search output or creates ambiguity: duplicate titles or canonicals, missing meta descriptions on key pages, two sitemap systems, redirect chains, missing H1, hreflang without return links, invalid JSON-LD | Fix before release, or record an accepted risk with an owner and date |
| Info | Tidy-up with little direct impact: long titles, minor sitemap extras, untidy parameters | Schedule |

## Findings

| ID | URL or template | Area | Observed evidence | Expected | Impact | Severity | Owner | Fix | Verified by | Status |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| SEO-001 | `/services/<service-slug>/` | Canonical | `<link rel="canonical" href="https://staging.example.com/...">` printed twice (theme and plugin) | One canonical from SEO plugin | Ambiguous canonical | Warning | `<role>` | Disable theme canonical output | Duplicate count = 1 after fix (`<date>`) | Fixed |
| SEO-002 | Site-wide | Robots | `X-Robots-Tag: noindex` header from server config | No header in production | Site deindexed if carried to production | Critical | `<role>` | Remove from production server config at go-live | Header absent on production (`<date>`) | Open |

Area vocabulary: Ownership, Title, Description, Canonical, Robots, Headers, Sitemap, robots.txt, Redirects, Links, Headings, Structured data, hreflang, Performance, Other.

Evidence must be reproducible: paste the relevant line of output or name the snapshot file and diff entry, not a paraphrase.

## Ownership confirmed

| Output | Owner | Duplicate found? | Resolved? |
| --- | --- | --- | --- |
| Title | | | |
| Meta description | | | |
| Canonical | | | |
| Meta robots | | | |
| Sitemap | | | |
| Open Graph | | | |
| JSON-LD | | | |
| Redirects | | | |
| hreflang | n/a / | | |

## Go-live checklist

- [ ] `blog_public` is 1 on production
- [ ] HTTP authentication removed from production (kept on staging)
- [ ] No staging-only `X-Robots-Tag` or robots.txt rules on production
- [ ] Canonicals and sitemap URLs use the production host
- [ ] One sitemap system; `Sitemap:` line in robots.txt points to it
- [ ] Redirect plan tested: all rows pass, one hop each
- [ ] Analytics and Search Console verification point at production
- [ ] Launch baseline recorded (location: `<path or handoff note>`)
- [ ] Post-launch check booked for `<YYYY-MM-DD>` via `seo-measure-and-monitor`, or as a manual task

## Not checked

| Item | Reason | Who will check | When |
| --- | --- | --- | --- |
| Rich result eligibility | `seo-structured-data` not installed | `<role>` | `<date>` |

## Appendix: sample URLs

| URL | Template | Expected index decision |
| --- | --- | --- |
| `/` | Front page | Index |
