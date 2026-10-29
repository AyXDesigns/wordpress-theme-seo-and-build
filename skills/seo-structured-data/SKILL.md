---
name: seo-structured-data
description: Choose, implement and validate schema.org JSON-LD for WordPress page types, including Organization or NGO, LocalBusiness, WebSite, BreadcrumbList, Article, Event and Product, and decide what to do with legacy FAQPage and HowTo markup. Extends an SEO plugin's graph instead of duplicating it. Use when the user mentions schema, structured data, JSON-LD, rich results, rich snippets, Rich Results Test, Schema Markup Validator, Search Console enhancements, Yoast, Rank Math or SEOPress schema, duplicate schema, or knowledge panel details. For full pre-launch SEO checks use `wp-seo-build-and-release`; for listings, citations and reviews use `seo-local`.
license: MIT
metadata:
  author: AyXDesigns
  version: "0.2.0"
---

# Structured data for WordPress

Use this skill to decide which schema.org types each WordPress page type should carry, who should output them, and how to prove the result is valid, truthful and not duplicated. Output JSON-LD only. Markup must describe content that a visitor can see on the same page.

It does not cover titles, canonicals, sitemaps or redirects (use `wp-seo-build-and-release` if installed), or business listings and reviews (use `seo-local` if installed). If those skills are not installed, note the gap and stay within schema.

## Before you start

Confirm, or ask the user:

- Which page types exist: home, about, contact, location, service, post, event, product, FAQ or help, listing and archive pages.
- Which SEO plugin is active, and whether its schema output is turned on. Yoast, Rank Math and SEOPress each output a connected graph by default.
- Whether the theme, a page builder, WooCommerce, an events plugin or a schema plugin also outputs JSON-LD.
- The organisation's approved facts: legal name, logo, address, contact points, social profiles, and for charities the regulator and registered number.
- Who owns schema changes after launch: the SEO plugin's settings (editors), or code (developers).

## Google support status, as of October 2026

Search features change often. Re-check the search gallery (<https://developers.google.com/search/docs/appearance/structured-data/search-gallery>) and the documentation updates log (<https://developers.google.com/search/updates>) before advising.

| Type | Google Search status (October 2026) | Recommendation |
|---|---|---|
| `Organization` (and subtypes such as `NGO`, `OnlineStore`) | Supported. Google recommends it on the home page or an about page; no properties are required. | Use on every site. Pick the most specific subtype that is true. |
| `LocalBusiness` subtypes | Supported. `name` and `address` are required. | Use for real premises; one node per location page. |
| `WebSite` | Sitelinks search box removed from 21 November 2024. `WebSite` is still used for site names. | Keep a `WebSite` node with `name` and `url`. A `SearchAction` is harmless but no longer needed. |
| `BreadcrumbList` | Supported. Google's docs say breadcrumbs show on desktop results only (January 2025 update). | Use where visible breadcrumbs exist. |
| `Article`, `BlogPosting`, `NewsArticle` | Supported. | Use on posts with a real author and dates. |
| `Event` | Supported. Online-event properties were removed from Google's docs in June 2025. | Use for real events with dates, location and status. |
| `Product` | Supported (product snippets and merchant listings). | Use only with real prices, availability and genuine reviews. |
| `FAQPage` | FAQ rich results stopped showing on 7 May 2026, and Google removed the documentation on 15 June 2026. | Do not add new FAQ markup for Google. Existing markup does no harm and may be left for other consumers; keep the visible FAQ content. |
| `HowTo` | Deprecated; Google stopped showing HowTo rich results on 13 September 2023. | Do not add. Leave or remove existing markup; it causes no errors. |
| `Review`, `AggregateRating` | Supported, but reviews an organisation controls about itself are not eligible on `LocalBusiness` or `Organization`. Google added a guideline against fake and undisclosed incentivised reviews in July 2026. | Use only for genuine third-party reviews, or for reviews of other things (such as products), with incentives disclosed. |

Other search engines and AI tools also read schema.org, so a type with no Google feature can still be worth keeping when it is accurate and cheap to maintain. Say this honestly; do not promise rankings.

## Workflow

### 1. Map page types to schema types

Fill in this table for the site and agree it with the user.

| Page type | Types | Notes |
|---|---|---|
| Home | `Organization` (or `NGO`, or a `LocalBusiness` subtype), `WebSite`, `WebPage` | One organisation node for the whole site, referenced by `@id` everywhere else |
| About or contact | `AboutPage` or `ContactPage` referencing the organisation | Contact points must match the visible page |
| Location | `LocalBusiness` subtype with `parentOrganization` | Only for real premises |
| Post | `BlogPosting` or `Article`, `BreadcrumbList` | `author` is a real `Person` or the organisation |
| Event | `Event` with `location`, `startDate`, `eventStatus`, `offers` | Remove or update when cancelled or past |
| Product | `Product` with `offers` | Use WooCommerce's or the SEO plugin's product output if present |
| Service | `Service` with `provider` (optional) | No Google feature; describe only what the page offers |

### 2. Detect existing output on the rendered page

Template source is not proof. Check the rendered HTML of each page type, logged out.

```bash
wp plugin list --status=active --fields=name,version --path=<wp-path>

# Count JSON-LD blocks, then print each one
curl -sL https://example.test/ | grep -c 'application/ld+json'
curl -sL https://example.test/ | perl -0777 -ne 'print "$1\n---\n" while /<script[^>]*application\/ld\+json[^>]*>(.*?)<\/script>/sg'
```

```powershell
wp plugin list --status=active --fields=name,version --path=<wp-path>

$html = (Invoke-WebRequest -UseBasicParsing -Uri 'https://example.test/').Content
$blocks = [regex]::Matches($html, '(?s)<script[^>]*application/ld\+json[^>]*>(.*?)</script>')
$blocks.Count
$blocks | ForEach-Object { $_.Groups[1].Value; '---' }
```

Look for: more than one `Organization` node, two `WebSite` nodes, two breadcrumb lists, schema left by a removed plugin, and nodes that are not connected by `@id`.

Done when you can name the owner of every JSON-LD block on each page type.

### 3. Choose who owns the graph

Present this as a short choice and recommend one. Wait for the user's answer before changing anything.

| Option | Advantages | Disadvantages | Effort | Suits |
|---|---|---|---|---|
| Configure the active SEO plugin's settings | No code; editors can maintain it; stays one graph | Limited to the types and fields the plugin offers | Low | Most sites with Yoast, Rank Math or SEOPress |
| Extend the SEO plugin's graph with its filters (in a small site plugin) | One connected graph; adds missing types or properties; survives theme changes | Needs PHP; must be re-tested when the plugin updates | Medium | Sites needing `NGO`, `Event` details or custom post types |
| Theme- or plugin-owned graph, with the SEO plugin's schema turned off | Full control; no plugin dependency | You maintain everything; easy to duplicate if the plugin is re-enabled | High | Sites with no SEO plugin, or a deliberate custom build |
| Add a dedicated schema plugin | Wide type coverage through a UI | Another dependency; high risk of duplicating the SEO plugin's output | Medium | Rarely; only when the other options cannot meet a real need |

Prefer a small site-specific plugin (or `mu-plugins`) over `functions.php` for filter code, so a theme switch does not remove it.

### 4. Implement

Rules for any code:

- Build PHP arrays and encode with `wp_json_encode()`. Never build JSON by joining strings, and never paste editor input into a JSON string.
- Encode with `JSON_HEX_TAG` (or leave slashes escaped) so text containing `</script>` cannot break out of the script element.
- Use WordPress functions for every URL (`home_url()`, `get_permalink()`, `wp_get_attachment_image_url()`). Never hard-code a production domain.
- Give shared nodes a stable `@id` such as `home_url( '/#organization' )`, and reference them instead of repeating them.
- Output only facts that are visible on the page and true today. No invented ratings, prices, dates, awards or authors.

Extending each SEO plugin (hook names as of October 2026; confirm against the plugin's current documentation):

- **Yoast SEO**: `wpseo_schema_organization` (change the organisation node), `wpseo_schema_graph_pieces` (add a piece), `wpseo_schema_graph` (change the whole graph), `wpseo_json_ld_output` (return `false` to turn Yoast's output off). Docs: <https://developer.yoast.com/features/schema/api/>.
- **Rank Math**: `rank_math/json_ld`, which receives the full data array and the JSON-LD object; add, change or remove entries there. Docs: <https://rankmath.com/kb/filters-hooks-api-developer/>.
- **SEOPress**: `seopress_get_json_data_organization` for the organisation node, `seopress_json_schema_generator_get_jsons` for generated schemas, and per-type automatic schema hooks such as `seopress_schemas_auto_lb_json`. Docs: <https://www.seopress.org/support/hooks/>.

Minimal patterns for each plugin, and for a theme-owned graph, are in [references/schema-recipes.md](references/schema-recipes.md).

Done when each page type outputs one connected graph and the code passes `php -l`.

### 5. Validate

Use [references/validation-checklist.md](references/validation-checklist.md) for every page type.

- **Rich Results Test** (<https://search.google.com/test/rich-results>): which Google features the page is eligible for, and errors that block them. It only reports Google-supported types.
- **Schema Markup Validator** (<https://validator.schema.org/>): checks all schema.org types, including those with no Google feature (`NGO`, `Service`, `FAQPage`).
- **Search Console**: enhancement reports for supported types, and URL Inspection for the indexed version. Reports appear only after Google has crawled the page, so do not treat an empty report as a pass.
- Compare every value in the markup with the visible page.

Done when every page type passes both tools with no errors, any warnings are explained, and the visible-content comparison is recorded.

### 6. Monitor

After release, watch the enhancement reports for new errors and re-test after SEO plugin, theme or WooCommerce updates. Use `seo-measure-and-monitor` if installed.

## Ask before acting

Get explicit approval before you:

- install, activate or deactivate any plugin, or turn an SEO plugin's schema output on or off;
- add, change or remove schema code on a shared, staging or live site;
- remove existing markup, even deprecated `FAQPage` or `HowTo`;
- add facts the user has not confirmed (ratings, prices, registration numbers, awards, founding dates).

## Output

Return the page-type map, the ownership decision, the code or settings changed, and a completed [references/validation-checklist.md](references/validation-checklist.md) per page type, with tool results and the date checked.
