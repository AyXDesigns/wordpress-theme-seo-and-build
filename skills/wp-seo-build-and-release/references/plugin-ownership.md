# SEO plugin ownership: detection, comparison and duplicates

Plugin behaviour changes between versions. Treat the details below as starting points (checked October 2026) and confirm against the installed version: read the plugin's settings screen, its sitemap URL in `robots.txt`, and the rendered HTML.

## How to tell who owns an output

Use three pieces of evidence together. One alone can mislead.

1. **Active plugins**: `wp plugin list --status=active --path=<wp-path>`. Two SEO plugins active is a finding on its own.
2. **Rendered HTML**: fetch the page (see `verification-commands.md`) and count each tag. Many SEO plugins print an HTML comment naming themselves near their block of tags, and their JSON-LD `<script>` often carries a plugin-specific class (Yoast commonly uses `yoast-schema-graph`, Rank Math commonly uses a `rank-math-schema` class). These are clues, not guarantees: they can be filtered out or changed.
3. **Theme source**: search the theme for `og:`, `twitter:`, `application/ld+json`, `rel="canonical"`, `name="description"` and a hard-coded `<title>`. Also check child themes and must-use plugins (`wp-content/mu-plugins/`).

If the rendered tag cannot be traced, temporarily compare with the SEO plugin's output for that page in its admin preview, or ask the user to deactivate one candidate on a local copy only.

## What each option usually owns

"Check" means the feature exists in some form but its scope or tier varies by version; confirm in the installed plugin.

| Output | WordPress core only | Yoast SEO | Rank Math | SEOPress | The SEO Framework |
| --- | --- | --- | --- | --- | --- |
| `<title>` | Yes, if theme declares `title-tag` | Replaces core | Replaces core | Replaces core | Replaces core |
| Meta description | No | Yes | Yes | Yes | Yes |
| Canonical | Singular pages only (`rel_canonical`) | Yes, all templates | Yes | Yes | Yes |
| Meta robots | Yes (`wp_robots`: noindex on search results and when discouraged; `max-image-preview:large` when public) | Yes | Yes | Yes | Yes |
| XML sitemap | `/wp-sitemap.xml` | `/sitemap_index.xml`; disables the core sitemap when its sitemap is on | `/sitemap_index.xml` | Own index; disables the core sitemap (index URL: check settings) | Own sitemap (index URL and core handling: check settings) |
| Open Graph / social | No | Yes | Yes | Yes | Yes |
| JSON-LD | No | Connected graph | Yes, with per-post schema options | Yes (more in Pro) | Basic graph |
| Redirects | Old-slug redirects only | Paid tier | Yes, free | Check (largely Pro) | Check (limited; often a separate plugin) |
| Breadcrumbs | No | Yes | Yes | Yes | Check |

The most reliable way to find the sitemap a site really uses is the `Sitemap:` line in its `robots.txt`, then fetching that URL and `/wp-sitemap.xml` to confirm only one serves a sitemap.

Also check for: All in One SEO, Slim SEO, Squirrly and similar plugins (same detection method); Jetpack and social-sharing plugins that may print Open Graph tags; WooCommerce, which prints its own Product structured data; multilingual plugins (WPML, Polylang, TranslatePress) that print hreflang; page builders that add their own meta.

## Choosing a plugin: options to present

Ask first: who edits the site, whether they want redirects and local business fields in the same tool, budget for a paid tier, and preference for a simple or detailed admin. All of the plugins below have free versions on WordPress.org and paid tiers; check current prices on each vendor's site before quoting them.

| Option | Advantages | Disadvantages | Effort | Suits |
| --- | --- | --- | --- | --- |
| Yoast SEO | Very widely used, large documentation base, readable editor guidance, well-structured schema graph | Redirect manager and some features need the paid tier; busy admin with upsell notices | Low | Teams with non-technical editors who want guidance |
| Rank Math | Many features free (redirects, schema options, 404 log); detailed controls | Feature-dense admin; setup wizard asks for an account connection for some features; more settings to get wrong | Medium | Hands-on owners who want one tool for most jobs |
| SEOPress | Clean interface, no branding in output, white-label options; data stays on the site | Smaller community; several features (redirects, some schema) in Pro | Medium | Agencies and privacy-minded owners |
| The SEO Framework | Lightweight, sensible automatic defaults, few settings to misconfigure | Fewer manual controls; redirects and some extras need extensions or another plugin | Low | Small sites that want "set and forget" |
| Core only plus theme | No plugin to maintain; minimal output | You must build meta descriptions, Open Graph, schema and redirects yourself, and they are lost if the theme changes | High | Developers with a custom theme and a small, stable site |

Recommend one based on the answers. Example reasoning: "Your editors are non-technical and need redirects; Rank Math gives both without a paid tier, but Yoast's editor guidance may suit them better if you accept the paid redirect manager."

## Avoiding duplicates

| Duplicate | How it shows | Fix |
| --- | --- | --- |
| Two SEO plugins | Two titles, two canonicals, two JSON-LD graphs | Import settings into the chosen plugin, then deactivate the other (with approval) |
| Theme Open Graph plus plugin | Two `og:title` tags | Theme option to disable, or wrap theme output in a check for the active plugin |
| Theme JSON-LD plus plugin graph | Two `Organization` or `WebSite` nodes | Remove theme schema or feed it into the plugin's graph through its filters |
| Hard-coded `<title>` in `header.php` | Two `<title>` tags | Use `add_theme_support( 'title-tag' )` |
| Core sitemap plus plugin sitemap | `/wp-sitemap.xml` and plugin index both return 200 | Enable the plugin's sitemap setting that disables core, or `add_filter( 'wp_sitemaps_enabled', '__return_false' );` |
| Multilingual plugin and SEO plugin both print hreflang | Repeated `hreflang` sets | Keep the multilingual plugin's output; disable the other |
| Redirect rules in server config and a plugin | Chains or loops | Move all rules to one system |

A theme distributed to others should not disable a plugin's output from its own code without a setting; prefer detecting the plugin and skipping the theme's version.
