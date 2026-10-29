---
name: wp-seo-discovery-brief
description: Plan the search-aware page architecture for a new WordPress site or redesign. Produces a page map with one purpose per indexable URL, indexation and redirect decisions, an internal-link plan and an ownership matrix that says which WordPress surface or plugin owns each SEO output. Use when someone says sitemap planning, site structure, information architecture, URL structure, "which pages do we need", redesign, rebuild, relaunch, new service pages or "keep our rankings after the redesign". For keyword research use `seo-research-and-strategy`; for writing briefs use `seo-content-system`.
license: MIT
metadata:
  author: AyXDesigns
  version: "0.2.0"
---

# WordPress SEO discovery brief

Decide which pages a WordPress site should have, what each one is for, whether search engines should index it, and who or what owns every search-facing output. This is planning work done before build; it does not change the site and does not promise rankings.

## Before you start

Confirm these facts. Ask the user for anything you cannot find.

- Project type: new site, redesign of an existing site, or expansion (new services, locations, languages).
- For a redesign: where the current site lives (production URL placeholder such as `https://example.com`, staging, or a local copy) and whether URLs are allowed to change.
- Offerings, audiences and the main actions visitors should take (enquire, donate, buy, book).
- Geography: one place, a service area or several locations. Several locations or a service area means local search is in scope.
- Languages or regions. More than one means hreflang is in scope later.
- Whether research already exists. If `seo-research-and-strategy` has produced a strategy, use its topics and priorities rather than inventing intents.
- Who edits the site after launch and which WordPress surfaces they can use (block editor, patterns, Customizer, plugin settings).
- Whether an SEO plugin is already chosen. If not, record "to be decided" and let `wp-seo-build-and-release` run that choice if installed.

## Workflow

### 1. Inventory what exists (redesign or expansion only)

Collect every URL that currently exists or carries traffic, so nothing is lost.

Read-only WP-CLI on a local or staging copy:

```bash
wp post list --post_type=page,post --post_status=publish --fields=ID,post_type,post_name,post_title --format=csv --path=<wp-path> > current-urls.csv
wp option get permalink_structure --path=<wp-path>
wp option get wp_attachment_pages_enabled --path=<wp-path>
```

From the live sitemap (bash, then PowerShell):

```bash
curl -sS https://example.com/wp-sitemap.xml | grep -o '<loc>[^<]*</loc>' | sed -E 's#</?loc>##g'
```

```powershell
([xml](curl.exe -sS "https://example.com/wp-sitemap.xml")).sitemapindex.sitemap.loc
([xml](curl.exe -sS "https://example.com/wp-sitemap-posts-page-1.xml")).urlset.url.loc
```

If the site uses a plugin sitemap, read the `Sitemap:` line in `https://example.com/robots.txt` for the right index URL.

For which URLs actually earn search traffic and links, use `seo-measure-and-monitor` if installed: it owns the baseline and can export top landing pages from Search Console. If it is not installed, ask the user for a Search Console "Pages" export for the last 12 months.

Done when every existing URL is listed with its type and whether it has traffic, links or conversions.

### 2. Define intents and page purposes

For each topic, write the visitor's question or task in their words, then the single page that answers it. One indexable page per intent. Two pages answering the same question compete with each other; merge them.

Done when each proposed page has a one-sentence purpose that no other page shares.

### 3. Build the page map

Fill `references/page-map-template.md`. Each row covers URL, page type, primary intent, purpose, audience, parent, WordPress template, next step, index decision, content owner, evidence source and review trigger.

URL rules:

- Keep existing URLs that work. Changing a URL costs a redirect and some risk; only change it for a clear gain.
- Lowercase, hyphenated, short, readable. No dates in evergreen URLs.
- Shallow hierarchy that mirrors the navigation (`/services/<service-slug>/`), not deeper than the content needs.
- One trailing-slash convention, matching the permalink setting.

### 4. Decide indexation for every URL type

Use this table for each row and for whole URL families (archives, tags, attachments, search results).

| Situation | Decision |
| --- | --- |
| Unique purpose, useful to a searcher landing on it | Index; self-referencing canonical |
| Useful to visitors but not to searchers (thank-you, account, cart, internal search results) | Noindex; keep linked where people need it |
| Near-duplicate of another page (print view, filtered list, tracking parameters) | Canonical to the main version, or stop generating it |
| Old URL replaced by a new page with the same purpose | 301 redirect to that page |
| Old URL with no replacement and no value | 410 or 404; do not redirect everything to the homepage |
| Two thin pages on one intent | Merge into one, 301 the other |
| Tag or category archive with no unique introduction | Noindex, or add real content and index |
| Attachment pages | Off (WordPress 6.4+ disables them on new installs via `wp_attachment_pages_enabled`; existing sites keep them on until changed) |
| Location or service variants | Only if each has genuinely local or specific content and an owner; otherwise one page that lists the areas served |

WordPress core already adds `noindex` to internal search results (since 5.7) and to the whole site when "Discourage search engines" is ticked. Note this in the map so nobody duplicates it.

For location pages, service areas and business details, use `seo-local` if installed. If it is not, keep to the rule above and record local evidence (address, staff, projects in that area) per page.

### 5. Plan redirects (redesign only)

Add every old URL that changes to the redirect section of the page map: old URL, new URL, status (301 or 410), reason. Map each to the most relevant new page. Avoid chains (A to B to C): point A straight at C. Implementation and testing belong to `wp-seo-build-and-release` if installed; if not, hand the table to whoever builds the site.

### 6. Plan internal links

- Every indexable page is reachable through ordinary `<a href>` links, without needing JavaScript, search or a form.
- Hubs link to their supporting pages and supporting pages link back to the hub.
- Breadcrumbs follow the parent column.
- Each page has at least one contextual link from a related page, with descriptive anchor text.

Record these in the page map's internal-link columns. For topic clusters on editorial content, use `seo-content-system` if installed.

### 7. Fill the ownership matrix

Fill `references/ownership-matrix-template.md`. It names exactly one owner for each output: title, meta description, canonical, robots meta, XML sitemap, robots.txt, redirects, Open Graph and social cards, structured data, breadcrumbs, hreflang. It also names the person who owns each page's content and its review date.

One owner per output is the point. A theme that prints Open Graph tags while an SEO plugin does the same produces duplicates that are hard to spot later.

Record only the intended schema type per page type (for example "Organization on home, Service on service pages"). Detailed schema design and validation belong to `seo-structured-data` if installed; if not, note "schema to be designed" as an evidence gap.

### 8. List evidence gaps and hand off

List what is still unknown: missing testimonials, unconfirmed service areas, no case studies, no author for advice content. Then state the next skill for each strand:

- Content briefs and clusters: `seo-content-system` if installed.
- Building and verifying SEO output: `wp-seo-build-and-release` if installed.
- Launch baseline and post-launch monitoring: `seo-measure-and-monitor` if installed. If not, note that someone must record current titles, canonicals, status codes and top pages before launch.

If a sibling skill is not installed, include its strand as a plain to-do list in the output so the work is not lost.

## Ask before acting

- Changing any URL that currently receives search traffic or links.
- Removing, merging or noindexing an existing page.
- Accessing Search Console, analytics or any account.
- Running anything that writes to WordPress (this skill should not need to).

## Output

Hand back one brief containing:

1. The page map (`references/page-map-template.md`), including the redirect plan and internal links.
2. The ownership matrix (`references/ownership-matrix-template.md`).
3. Evidence gaps, each with an owner.
4. Handoffs to sibling skills, or to-do lists where those skills are not installed.
5. Open decisions for the user, each phrased as a question.
