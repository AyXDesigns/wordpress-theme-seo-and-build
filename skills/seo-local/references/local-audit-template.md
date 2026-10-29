# Local SEO audit: <organisation name>

- Site: `https://example.com/`
- Audited by: <name or role>
- Date checked: <YYYY-MM-DD>
- Business model: storefront / service-area / hybrid / online-only (not eligible for a profile)
- Active SEO plugin: Yoast / Rank Math / SEOPress / none

## 1. Canonical business record

Approved by <name or role> on <YYYY-MM-DD>. Every listing, page and schema block must match this record exactly.

| Field | Approved value | Notes |
|---|---|---|
| Registered or legal name | `<legal-name>` | As on Companies House or the charity register |
| Trading name (as on signage) | `<trading-name>` | Used for profiles |
| Address | `<street>, <town>, <postcode>` | Hidden on profiles? yes / no |
| Phone | `<0000 000000>` | Local and under the organisation's control? Call tracking? |
| Website URL | `https://example.com/` | Location page URL if multi-site |
| Opening hours | `<Mon–Fri 09:00–17:00>` | Holiday or seasonal hours |
| Primary category | `<category>` | Most specific "is a" category |
| Additional categories | `<category>, <category>` | As few as possible |
| Service areas | `<town or postcode district>` | Up to 20; about two hours' drive at most |
| Charity regulator and number | `<regulator> <number>` | Only if registered |
| Company number | `<number>` | Only if incorporated |

## 2. Website signals

| Location on site | Source (option, pattern, widget, template) | Matches record? | Action |
|---|---|---|---|
| Header | | yes / no | |
| Footer | | yes / no | |
| Contact page | | yes / no | |
| Embedded map | | yes / no | Loads before consent? Check with `wp-privacy-and-consent` if installed |
| JSON-LD (`Organization`, `NGO`, `LocalBusiness`) | | yes / no | |
| SEO plugin organisation settings | | yes / no | |

## 3. Google Business Profile

| Check | Status | Evidence |
|---|---|---|
| Profile exists and the organisation has owner access | | |
| Duplicate or unofficial profiles found | | |
| Name has no added keywords, places or taglines | | |
| Primary category is the most specific fit | | |
| Address shown or hidden correctly for the business model | | |
| Service areas set (if applicable) | | |
| Hours and special hours correct | | |
| Website link points to this location's page | | |
| Verification status | | Method offered by Google: |
| Photos current and owned by the organisation | | |

## 4. Other platforms

| Platform | Exists? | Owner login held by | Matches record? | Decision (manage / leave / close) |
|---|---|---|---|---|
| Bing Places for Business | | | | |
| Apple Business (Maps place card) | | | | |
| Facebook page | | | | |
| <sector directory> | | | | |

## 5. Citations

| Directory or site | URL | Name | Address | Phone | Action (correct / claim / close duplicate / add / none) | Cost |
|---|---|---|---|---|---|---|
| <directory> | `https://directory.example/listing` | ok / wrong | ok / wrong | ok / wrong | | free / paid |

## 6. Reviews

- Where reviews are requested: <channel and moment>
- Same request sent to every customer (no gating): yes / no
- Incentives offered: none / describe (must stop, or be disclosed where the platform allows)
- Staff quotas or staff reviews: none / describe
- Replies: who replies, target response time, safeguarding rule for sensitive services
- Own reviews marked up with `aggregateRating`: no / yes (remove)

## 7. Location pages

| Proposed or existing page | Real presence or local work? | Unique content available | Decision (keep / create / merge / remove) |
|---|---|---|---|
| `/locations/<place>/` | | | |

## 8. Schema

| Page | Type(s) | Owner (SEO plugin / theme / plugin) | Matches record? | Rich Results Test | Schema Markup Validator |
|---|---|---|---|---|---|
| Home | | | | pass / warnings / fail | |
| Contact | | | | | |

## 9. Charity and nonprofit notes

- Regulator record checked on: <YYYY-MM-DD>
- Name and number shown on the home page (Scotland) or fundraising pages (England and Wales): yes / no / not applicable
- `NGO` and `nonprofitStatus` used, and match the register: yes / no / not used
- Claims (accreditations, awards, partners) confirmed by the user: list

## 10. Findings

| Priority | Finding | Evidence | Impact | Owner | Acceptance test | Needs approval? |
|---|---|---|---|---|---|---|
| High | | | | | | yes / no |

## 11. Measures and baseline

| Measure | Source | Baseline value | Date |
|---|---|---|---|
| Profile website clicks | Business Profile performance | | |
| Calls and direction requests | Business Profile performance | | |
| Branded and local queries | Search Console | | |
| Location-page conversions | Analytics (with consent where required) | | |

## Sources checked

List each guideline page you relied on, with the date you checked it.
