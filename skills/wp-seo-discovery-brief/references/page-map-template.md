# Page map template

Copy this into the project's planning document. One row per proposed or existing URL. Replace every `<placeholder>`; leave a cell as `TBC` rather than guessing.

## Project summary

| Field | Value |
| --- | --- |
| Site | `https://example.com` (production), `https://staging.example.com` (staging) |
| Project type | New site / redesign / expansion |
| Permalink structure | `/%postname%/` |
| Trailing slash | Yes / no |
| Languages | `en-GB` only / list |
| Prepared by, date | `<name>`, `<YYYY-MM-DD>` |
| Research source | Strategy document `<link>` / user interviews / none yet |

## Page map

| URL | Page type | Primary intent (visitor's words) | Purpose (one sentence, unique) | Audience | Parent | WP template / pattern | Next step (CTA) | Index decision | Canonical | Content owner | Evidence source | Review trigger |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/` | Home | "`<who you are and what you do>`" | Route visitors to the right service and build trust | All | none | `front-page` | Enquire | Index | Self | `<role>` | About copy, accreditations | Annual review |
| `/services/` | Hub | "`<what services do you offer>`" | List services and help visitors choose | Prospective clients | `/` | `page-hub` | View a service | Index | Self | `<role>` | Service catalogue | New service added |
| `/services/<service-slug>/` | Service | "`<service> for <audience>`" | Explain `<service>`, price range, process, proof | `<audience>` | `/services/` | `single-service` | Book a call | Index | Self | `<role>` | Case studies `<ids>` | Price change; every 6 months |
| `/thank-you/` | Utility | n/a | Confirm form submission | Converted visitors | none | `page` | Return home | Noindex | Self | `<role>` | n/a | Form change |
| `/?s=` | Search results | n/a | Internal search | All | none | `search` | n/a | Noindex (core default) | n/a | Core | n/a | n/a |

Page type vocabulary: Home, Hub, Service, Product, Category, Location, Article, Guide, Comparison, Case study, About, Contact, Legal, Utility, Archive.

Index decision vocabulary: Index, Noindex, Canonical to `<url>`, 301 to `<url>`, 410.

## Internal links

| Page | Links out to (contextual) | Linked from | Breadcrumb trail | In main nav? |
| --- | --- | --- | --- | --- |
| `/services/<service-slug>/` | `/case-studies/<case-slug>/`, `/contact/` | `/services/`, `/` | Home > Services > `<Service>` | Under Services |

Check: every indexable row appears in at least one "Linked from" cell.

## Redirect plan (redesign only)

| Old URL | New URL | Status | Reason | Has traffic or links? |
| --- | --- | --- | --- | --- |
| `/old-service-name/` | `/services/<service-slug>/` | 301 | Renamed service | Yes |
| `/2019/05/<old-post>/` | `/guides/<guide-slug>/` | 301 | Merged into guide | Yes |
| `/<retired-offer>/` | none | 410 | Offer discontinued, no equivalent | No |

Rules: one hop only; no blanket redirects to the homepage; keep the list for at least a year after launch.

## URL families

| Family | Example | Decision | Reason |
| --- | --- | --- | --- |
| Categories | `/category/<slug>/` | Index with intro / noindex | |
| Tags | `/tag/<slug>/` | Noindex | Thin, duplicates categories |
| Author archives | `/author/<slug>/` | Index if multi-author with bios / otherwise disable or noindex | |
| Date archives | `/2026/10/` | Noindex or disable | |
| Attachment pages | `/<post>/<image>/` | Off (`wp_attachment_pages_enabled` = 0) | |
| Paginated archives | `/blog/page/2/` | Index, self-canonical | Do not canonical page 2 to page 1 |
| Custom post types | `/<cpt-slug>/<item>/` | | |

## Evidence gaps

| Gap | Affects | Owner | Needed by |
| --- | --- | --- | --- |
| No case study for `<service>` | `/services/<service-slug>/` | `<role>` | `<YYYY-MM-DD>` |
