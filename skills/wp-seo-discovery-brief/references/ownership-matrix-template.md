# Ownership matrix template

Two tables: who or what produces each search-facing output (technical owner), and who keeps each page's content accurate (content owner). Each output gets exactly one technical owner. "Theme and plugin both" is never a valid answer.

## Technical ownership

Owner vocabulary: SEO plugin (`<plugin-name>`), WordPress core, Theme (`<theme-slug>`), Other plugin (`<plugin-name>`), Server or host config, Not output.

| Output | Owner | Where it is edited | Fallback switched off? | Notes |
| --- | --- | --- | --- | --- |
| `<title>` | e.g. SEO plugin | Per-page SEO panel; template in plugin settings | Theme declares `title-tag` support only | |
| Meta description | e.g. SEO plugin | Per-page SEO panel | Theme prints none | Core does not output one |
| Canonical | e.g. SEO plugin | Automatic; per-page override | Core `rel_canonical` replaced by plugin | |
| Meta robots | e.g. SEO plugin, built on core `wp_robots` | Per-page and per-type settings | n/a | Staging uses "Discourage search engines" or HTTP auth |
| XML sitemap | e.g. SEO plugin | Plugin sitemap settings | Core `wp-sitemap.xml` disabled by plugin | Confirm the index URL |
| robots.txt | e.g. WordPress core virtual file | Plugin editor or physical file | | A physical `robots.txt` overrides the virtual one |
| Redirects | e.g. server config / redirect plugin / SEO plugin | `<where>` | Only one system holds rules | |
| Open Graph and social cards | e.g. SEO plugin | Per-page social panel | Theme and other plugins print none | |
| Structured data (JSON-LD) | e.g. SEO plugin graph | Plugin schema settings | Theme prints none | Design via `seo-structured-data` if installed |
| Breadcrumbs (visible) | e.g. Theme block / SEO plugin block | Template | | Must match the BreadcrumbList data |
| hreflang | e.g. multilingual plugin | Translation links | SEO plugin does not also print it | Only if multilingual |
| Image alt text | Editors | Media library / block | | |
| Internal links and navigation | Theme menus / navigation block | Site Editor or Menus | | |
| Analytics and tag manager | `<tool>` | `<where>` | Single snippet only | Consent handling `<tool>` |

## Content ownership

| URL or page family | Content owner (role) | Reviewer for high-risk claims | Evidence source | Review frequency | Freshness trigger |
| --- | --- | --- | --- | --- | --- |
| `/services/*` | `<role>` | n/a | Service catalogue | Every 6 months | Price or process change |
| `/guides/*` | `<role>` | `<qualified reviewer role>` | Cited sources | Annually | Law or guidance change |
| `/about/` | `<role>` | n/a | Organisation records | Annually | Staff or accreditation change |

Use roles, not personal names, in anything that will be committed to a public repository.

## Decisions still open

| Decision | Options | Recommended | Decided by | Date |
| --- | --- | --- | --- | --- |
| SEO plugin | See `wp-seo-build-and-release` if installed | | | |
| Redirect system | Server / plugin / SEO plugin | | | |
