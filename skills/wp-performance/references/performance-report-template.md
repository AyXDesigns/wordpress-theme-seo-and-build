# Performance report: <site-name>

- **Environment tested**: local / staging / production
- **Date**: <yyyy-mm-dd>
- **Prepared by**: <name or agent>
- **WordPress / PHP version**: <x.y.z> / <x.y>
- **Theme**: <theme-slug> (block / classic / hybrid)
- **Cache layers found**: host cache <yes/no>, CDN <name or none>, cache plugin <name or none>, object cache <Default / Redis / Memcached>

## 1. Summary

Two or three sentences: the main cause, the fix, and how much it helped. Say plainly what is still unproven (for example "field data not yet updated").

## 2. Test conditions

| Item | Value |
| --- | --- |
| Lab tool and version | Lighthouse <version> / DevTools / PSI lab |
| Device profile | Mobile (default throttling) / Desktop |
| Cache state | Warm (second request) / Cold |
| Logged in | No / Yes (role) |
| Runs per URL | 3, median reported |

## 3. Baseline

| URL (template) | Field LCP | Field INP | Field CLS | Lab LCP | Lab TBT | Lab CLS | TTFB (median) | Cache hit? |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` (home) | | | | | | | | |
| `/<post-slug>/` (single) | | | | | | | | |
| `/<archive>/` (archive) | | | | | | | | |

Write "no data" where CrUX has no field data for a URL. Field data source: PageSpeed Insights / Search Console, collection period <dates>.

## 4. LCP breakdown (worst URL)

| Sub-part | Time | Share |
| --- | --- | --- |
| TTFB | | |
| Resource load delay | | |
| Resource load duration | | |
| Element render delay | | |

LCP element: <description, e.g. hero image in Cover block>

## 5. Findings by layer

| # | Layer | Finding | Evidence | Impact (metric) | Suggested fix | Effort | Needs approval |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Hosting / PHP | | | | | | |
| 2 | Page cache / CDN | | | | | | |
| 3 | Object cache | | | | | | |
| 4 | Database / autoload | Autoloaded total: <bytes> | `wp option list --autoload=on --format=total_bytes` | | | | |
| 5 | Images | | | | | | |
| 6 | Fonts | | | | | | |
| 7 | CSS / JS | | | | | | |
| 8 | Third parties | | | | | | |

Remove rows that do not apply. Each finding needs evidence a reader can reproduce.

## 6. Largest autoloaded options

| Option name | Size (bytes) | Owner (plugin/theme) | Still in use? | Proposal |
| --- | --- | --- | --- | --- |
| | | | | |

## 7. Third-party inventory

| Script / service | Purpose | Owner | Loads on | Cost | Proposal |
| --- | --- | --- | --- | --- | --- |
| | | | | | |

## 8. Changes made

| Change | Environment | Approved by | Date | Rollback |
| --- | --- | --- | --- | --- |
| | | | | |

## 9. Before and after (same conditions)

| URL | Metric | Before | After | Change |
| --- | --- | --- | --- | --- |
| | | | | |

## 10. Still to confirm

- Field data re-check due: <date, about 28 days after the change>
- Open questions for the user or host:
- Recommended next steps, in priority order:
