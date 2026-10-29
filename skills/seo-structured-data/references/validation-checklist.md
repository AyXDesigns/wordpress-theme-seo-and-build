# Structured data validation checklist

Complete one copy per page type. Test the rendered page while logged out, on the environment named below.

- Page type: <home / location / post / event / product / other>
- Test URL: `https://example.test/<path>/`
- Environment: local / staging / production
- SEO plugin and version: <plugin> <version>
- WordPress version: <version>
- Date checked: <YYYY-MM-DD>

## 1. Ownership and duplication

- [ ] Every JSON-LD block on the page has a named owner (SEO plugin, WooCommerce, theme, site plugin).
- [ ] Exactly one `Organization` (or subtype) node, with the same `@id` site-wide.
- [ ] At most one `WebSite` node and one `BreadcrumbList`.
- [ ] No leftover markup from a removed or deactivated plugin.
- [ ] No microdata or RDFa duplicating the JSON-LD (search the HTML for `itemscope` and `typeof=`).
- [ ] Nodes are linked with `@id` references, not repeated in full.

## 2. Truthfulness and visible content

- [ ] Every name, address, phone number, price, date and author in the markup appears on the page.
- [ ] Values match the approved business record and the SEO plugin's settings.
- [ ] No self-serving `aggregateRating` or `review` on `Organization` or `LocalBusiness` nodes.
- [ ] Reviews (where used) are genuine, and any incentive is disclosed on the page.
- [ ] Charity type, `nonprofitStatus` and registered number match the regulator's public record.
- [ ] Event dates, status and prices are current; past or cancelled events are updated.
- [ ] No hidden content created only for markup.

## 3. Technical correctness

- [ ] JSON parses (the validators load it without a syntax error).
- [ ] URLs are absolute, use the environment's own domain, and return 200.
- [ ] Dates use ISO 8601 with a time zone offset.
- [ ] Images referenced in markup are crawlable and are the ones shown on the page.
- [ ] Code builds arrays and encodes with `wp_json_encode()`; no string concatenation; `JSON_HEX_TAG` or escaped slashes used.
- [ ] Custom PHP passes `php -l`.

```bash
php -l wp-content/mu-plugins/<site-schema>.php
```

```powershell
php -l wp-content\mu-plugins\<site-schema>.php
```

## 4. Tool results

| Tool | URL | Result | Errors | Warnings and decision |
|---|---|---|---|---|
| Rich Results Test (<https://search.google.com/test/rich-results>) | | pass / fail / not eligible | | |
| Schema Markup Validator (<https://validator.schema.org/>) | | pass / fail | | |
| Search Console URL Inspection (production only) | | | | |
| Search Console enhancement report (production only) | | | | |

Notes:

- The Rich Results Test only reports types Google currently supports. "No items detected" for `NGO`, `Service` or `FAQPage` is expected as of October 2026; use the Schema Markup Validator for those.
- Staging sites behind a password cannot be fetched by Google's tools. Paste the rendered code into the tool's code option instead.
- Search Console reports fill only after Google crawls the page; an empty report is not a pass.

## 5. Status check

- [ ] The types used were checked against Google's search gallery and updates log on the date above.
- [ ] Deprecated types (`HowTo`) and retired features (FAQ rich results, sitelinks search box) are not presented to the user as ranking or display wins.

## 6. Sign-off

| Item | Value |
|---|---|
| Outstanding issues | |
| Accepted warnings and why | |
| Re-test trigger | SEO plugin, theme or WooCommerce update; content model change |
| Checked by | |
