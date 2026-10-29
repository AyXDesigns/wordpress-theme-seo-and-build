---
name: wp-seo-build-and-release
description: Implement and verify the SEO output a WordPress site actually serves before launch or release. Detects which SEO plugin owns titles, canonicals, robots and sitemaps (Yoast, Rank Math, SEOPress, The SEO Framework or core only), removes duplicate output, and checks robots.txt, wp-sitemap.xml or plugin sitemaps, staging noindex, redirects, X-Robots-Tag and hreflang with curl. Use when preparing a pre-launch SEO check or go-live, or for "noindex left on", duplicate meta tags, canonical wrong, sitemap 404 or redirects after a redesign. Ongoing monitoring belongs to `seo-measure-and-monitor`.
license: MIT
metadata:
  author: AyXDesigns
  version: "0.2.0"
---

# WordPress SEO build and release

Make sure each search-facing output is produced once, by the agreed owner, and that the rendered pages, headers, sitemaps and redirects say what the plan says. Source code alone is not proof: check what the server returns.

## Before you start

Confirm, and ask the user when unknown:

- Environments and their URLs: local (`https://example.test`), staging (`https://staging.example.com`), production (`https://example.com`). Which one are you checking?
- WordPress path for WP-CLI (`--path=<wp-path>`) and whether you have shell access.
- Whether staging is behind HTTP authentication. If so, the user supplies credentials through a `.netrc` file or environment variable; never paste them into commands you show or into reports.
- The page map and ownership matrix, if `wp-seo-discovery-brief` produced them. If not, ask which pages matter most and pick 5–15 representative URLs: home, each template type, a post, an archive, a utility page.
- Whether the site is multilingual. If not, skip hreflang entirely.
- Intended launch date and who approves go-live.

## Workflow

### 1. Detect who owns SEO output

Read-only checks:

```bash
wp plugin list --status=active --fields=name,version --path=<wp-path>
wp option get blog_public --path=<wp-path>
wp eval 'echo wp_sitemaps_get_server()->sitemaps_enabled() ? "core sitemaps: on" : "core sitemaps: off";' --path=<wp-path>
grep -rniE "og:title|application/ld\+json|rel=.canonical|name=.description" wp-content/themes/<theme-slug>/
```

```powershell
wp plugin list --status=active --fields=name,version --path=<wp-path>
Get-ChildItem -Recurse -File "wp-content\themes\<theme-slug>" | Select-String -Pattern 'og:title|application/ld\+json|rel=.canonical|name=.description'
```

Then compare with the rendered head (step 4). Use `references/plugin-ownership.md` to identify each plugin's output and its usual sitemap location.

Done when every row of the ownership matrix has a confirmed owner, and any second producer of the same output is listed as a finding.

### 2. Choose the SEO plugin (only if none is chosen)

Ask how many people edit the site, whether they need redirects or local business features in the same tool, whether the budget allows a paid tier, and how much admin interface they want. Then present the options as a short question with choices, using the comparison in `references/plugin-ownership.md` (Yoast SEO, Rank Math, SEOPress, The SEO Framework, core only plus theme). Give advantages, disadvantages and effort for each, recommend one with a reason, and wait for the choice before installing anything.

### 3. Remove duplicates and fix ownership

- Two SEO plugins active: keep the chosen one; deactivate the other only after the user agrees, and check its redirects or settings are migrated first (most of these plugins offer an import tool).
- Theme prints titles, descriptions, Open Graph or JSON-LD while a plugin also does: turn off the theme output through a theme option or a guarded condition, rather than deleting code the theme may need when no plugin is present.
- Theme hard-codes `<title>`: replace with `add_theme_support( 'title-tag' )`.
- URLs in templates or JSON-LD: build them with WordPress functions (`home_url()`, `get_permalink()`, `wp_json_encode()`), never a hard-coded domain or string concatenation of editor input.
- Structured data per page type and its validation: use `seo-structured-data` if installed. If not, at least confirm there is one JSON-LD graph per page, it matches visible content, and it parses (see `references/verification-commands.md`).

Done when the rendered head of each sample URL contains each tag once.

### 4. Verify the rendered output

Prefer the snapshot script from `seo-measure-and-monitor` if that skill is installed: it records status, redirect chain, title, description, canonical, robots meta, `X-Robots-Tag`, H1s, hreflang, JSON-LD types and sitemap inclusion for every URL in one run, and its diff mode compares two snapshots of the same environment (for example staging before and after a fix). Follow that skill's instructions for the commands. The snapshot lists every canonical and H1 it finds, but keeps only the first title and description and does not count Open Graph tags or JSON-LD blocks, so still run the duplicate counts in `references/verification-commands.md` on a few URLs.

If it is not installed, use the curl checks in `references/verification-commands.md` for each sample URL:

- Final status is 200 for indexable pages; no unexpected redirect.
- Exactly one `<title>`, one meta description, one canonical, one robots meta.
- Canonical is absolute, points at the same environment's host, and matches the page map.
- No `noindex` in the meta robots or the `X-Robots-Tag` header of pages meant to be indexed.
- One visible H1 that states the page's purpose.
- Important pages are linked with ordinary `<a href>` links in the server HTML.

### 5. Check robots.txt and sitemaps

- Fetch `/robots.txt`. It should not block CSS, JavaScript or pages you want indexed, and should list the sitemap index the owner produces.
- Exactly one sitemap system: core `wp-sitemap.xml` or the plugin's. When an SEO plugin owns sitemaps, `/wp-sitemap.xml` should redirect to the plugin index or return 404, not serve a second sitemap.
- The sitemap lists only indexable, canonical, 200-status URLs. Spot-check five URLs from it.
- A physical `robots.txt` file in the web root overrides WordPress's virtual one. Check which is served.

### 6. Protect staging, then plan the production switch

Present these as a choice when staging is not yet protected:

| Method | Advantages | Disadvantages | Suits |
| --- | --- | --- | --- |
| HTTP authentication (host panel or server config) | Nothing can be crawled or indexed; also hides unfinished work | Testing tools and clients need credentials | Most staging sites (recommended) |
| "Discourage search engines" (`blog_public` = 0) | One setting; core prints `noindex, nofollow` and disables core sitemaps | Pages still crawlable; easy to copy to production by mistake | Quick previews |
| `X-Robots-Tag: noindex` header at server level | Covers PDFs and images too; independent of WordPress | Needs server access; also easy to carry to production | Hosts with config access |
| `Disallow: /` in robots.txt only | Simple | Does not stop indexing of linked URLs, and hides any noindex from crawlers | Not recommended on its own |

Before go-live, write the production switch as a checklist: `blog_public` = 1, HTTP auth removed, staging-only headers removed, canonical and sitemap hosts are the production host, analytics points at production.

### 7. Implement and test redirects

Use the redirect plan from the page map. If no redirect system is chosen, present: server config (fast, needs access, invisible to editors), a dedicated redirect plugin (editor-friendly, logs 404s, adds a plugin), or the SEO plugin's redirect manager (one tool, sometimes a paid tier). Keep all rules in one system.

Test every row: one hop, correct status (301 or 410), correct destination, no loops, trailing-slash and `http` to `https` variants included.

### 8. hreflang (multilingual sites only)

Check that each language version lists itself and every alternate with absolute URLs, that the return links exist, that `x-default` points at a sensible fallback, and that only one system (usually the multilingual plugin) prints the tags. Codes use ISO 639-1 language plus optional ISO 3166-1 region, for example `en-GB`; `UK` is not a valid region code.

### 9. Hand off the launch baseline

Baselines, post-release drift and ongoing monitoring belong to `seo-measure-and-monitor`. If installed, ask it to record a pre-launch snapshot of the agreed URLs and a post-launch snapshot within a day of go-live. If not installed, save the curl outputs from step 4 for the same URLs with the date, and tell the user someone must repeat them after launch and connect Search Console.

## Ask before acting

- Installing, activating, deactivating or switching an SEO, redirect or multilingual plugin.
- Changing `blog_public`, robots.txt, server config or HTTP authentication.
- Adding, editing or deleting redirects.
- Editing theme files or plugin settings on staging or production.
- Submitting sitemaps or requesting indexing in any search engine tool.

## Output

Hand back:

1. The finding log (`references/seo-finding-log-template.md`): one row per issue with URL, evidence, impact, severity, owner, fix and how it was verified.
2. The confirmed ownership matrix (owner per output, duplicates removed).
3. The go-live checklist from step 6 with each item ticked or open.
4. Redirect test results.
5. Where the launch baseline is stored, or the handoff note for `seo-measure-and-monitor`.
