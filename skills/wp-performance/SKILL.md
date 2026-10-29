---
name: wp-performance
description: Diagnoses and fixes slow WordPress sites and failing Core Web Vitals (LCP, INP, CLS). Measures first with field and lab data, then works layer by layer through hosting and TTFB, page and object cache, autoloaded options, images, fonts, render-blocking assets and third-party scripts. Use when the user says "site is slow", "high TTFB", "poor Core Web Vitals", or mentions PageSpeed Insights, Lighthouse, CrUX, Query Monitor, WP Rocket, LiteSpeed Cache, W3 Total Cache, WP Super Cache or Performance Lab. For ongoing Search Console monitoring use `seo-measure-and-monitor`.
license: MIT
metadata:
  author: AyXDesigns
  version: "0.2.0"
---

# WordPress performance

Find out why a WordPress site is slow, fix the cause at the layer that owns it, and prove the change helped. Measure before changing anything; a score without recorded conditions is not evidence.

## Before you start

Confirm, or ask the user:

- **Environment**: which copy you are working on (local, staging, production) and whether a staging copy exists for trying changes.
- **Access**: WP-CLI with `--path=`, hosting control panel, CDN dashboard, or front-end only.
- **Pages that matter**: pick 3–5 representative URLs by template (home, single post, archive, key landing page, a page with a form), not just the home page.
- **Device focus**: mobile, desktop or both. Most sites are judged on mobile.
- **Existing layers**: host page cache, CDN, caching or optimisation plugins already active, persistent object cache (Redis or Memcached).
- **Who is affected**: anonymous visitors, logged-in users, editors in wp-admin, or checkout/basket pages (often uncacheable).

Version-sensitive facts (as of October 2026, re-check at <https://web.dev/articles/vitals>):

| Metric | Good | Needs improvement | Poor |
| --- | --- | --- | --- |
| LCP (loading) | ≤ 2.5 s | > 2.5 s to 4.0 s | > 4.0 s |
| INP (responsiveness) | ≤ 200 ms | > 200 ms to 500 ms | > 500 ms |
| CLS (visual stability) | ≤ 0.1 | > 0.1 to 0.25 | > 0.25 |

Thresholds apply at the 75th percentile of page loads, separately for mobile and desktop. INP replaced First Input Delay as a Core Web Vital in March 2024.

## Workflow

### 1. Capture a baseline

Use both kinds of data and label them clearly in the report:

| Source | Type | Good for | Limits |
| --- | --- | --- | --- |
| PageSpeed Insights "Discover what your real users are experiencing" section, Search Console Core Web Vitals report | Field (CrUX) | What real visitors experience; the pass/fail Google uses | Rolling 28-day window; low-traffic URLs may have no data; slow to reflect fixes |
| Lighthouse (Chrome DevTools or PSI lab section), DevTools Performance panel | Lab | Reproducible diagnosis, LCP sub-parts, long tasks | Single simulated device and network; INP is not measured in a page-load test (use Total Blocking Time as a proxy) |

Record for every measurement: URL, date, device profile, tool and version, cache state (warm or cold), logged in or out, and environment.

Check server response time and cache headers from the command line:

```bash
curl -s -o /dev/null -w "ttfb=%{time_starttransfer}s total=%{time_total}s\n" https://example.com/
curl -sI https://example.com/ | grep -iE "cache|age|x-|server"
```

```powershell
curl.exe -s -o NUL -w "ttfb=%{time_starttransfer}s total=%{time_total}s`n" https://example.com/
curl.exe -sI https://example.com/ | Select-String -Pattern "cache|age|x-|server"
```

In Windows PowerShell 5.1, `curl` is an alias for `Invoke-WebRequest`; call `curl.exe` explicitly. Run each request three times and use the median.

Lighthouse CLI is optional and downloads a package, so ask first:

```bash
npx lighthouse https://example.com/ --only-categories=performance --output=json --output-path=./baseline-home-mobile.json
npx lighthouse https://example.com/ --only-categories=performance --preset=desktop --output=json --output-path=./baseline-home-desktop.json
```

**Done when** the baseline table in [references/performance-report-template.md](references/performance-report-template.md) is filled for every chosen URL, with field data marked "no data" where CrUX has none.

### 2. Find the failing layer

Start from the worst metric, then use this table:

| Symptom | Most likely layer | Go to step |
| --- | --- | --- |
| TTFB over about 0.8 s on a cached page, or no cache hit header | Page cache or CDN | 4 |
| TTFB fast when cached, slow when uncached or logged in | PHP, database, object cache, plugins | 3, 5, 6 |
| LCP slow but TTFB fine; LCP element is an image | Image discovery, size or priority | 7 |
| LCP element is text and appears late | Fonts or render-blocking CSS | 8, 9 |
| High CLS | Images or embeds without dimensions, late banners, font swap | 7, 8, 10 |
| Poor INP or high Total Blocking Time | Heavy JavaScript, third parties, page builder or slider scripts | 9, 10 |
| wp-admin or the editor is slow, front end fine | Autoloaded options, admin-only plugins, heartbeat, external HTTP calls | 6 |

Use the LCP sub-parts from Lighthouse or the DevTools Performance panel: TTFB, resource load delay, resource load duration and element render delay. As a guide, delay and render delay should each be near zero, and the remaining time split roughly evenly between TTFB and download (source: <https://web.dev/articles/optimize-lcp>).

### 3. Hosting and PHP

- Read the PHP and WordPress versions from Site Health (Tools → Site Health → Info) or `wp core version --path=<wp-path>`. WordPress recommends PHP 8.3 or later (as of October 2026, <https://wordpress.org/about/requirements/>).
- Ask the user about the hosting plan: shared hosting with few PHP workers often explains slow uncached TTFB under load, and no plugin can fix that.
- Check for an OPcache-enabled PHP build in Site Health or the host panel.

**Done when** you can say whether uncached TTFB is a hosting limit or an application cost.

### 4. Page cache and CDN

Read the response headers from step 1. A cache hit usually shows as an `age` above zero, or a host-specific header such as `x-cache: HIT` or `cf-cache-status: HIT`. Identify every layer that caches HTML: host, CDN and plugin. If more than one caches pages or minifies assets, note it as a finding before going further.

If there is no page cache, present the choices in "Choosing a caching or optimisation approach" below.

### 5. Object cache

```bash
wp cache type --path=<wp-path>
```

`Default` means no persistent object cache. A persistent cache (Redis or Memcached) helps logged-in, basket and admin traffic that page caching cannot serve. It needs a server service, normally provided by the host. Offer it as a choice: the host's Redis add-on (low effort, may cost extra), a self-managed service (more control, more upkeep), or none (fine for small, mostly anonymous brochure sites).

### 6. Database, autoloaded options and plugin cost

Autoloaded options are read on every request. Check their total size (WP-CLI syntax as of October 2026, <https://developer.wordpress.org/cli/commands/option/list/>):

```bash
wp option list --autoload=on --format=total_bytes --path=<wp-path>
wp option list --autoload=on --fields=option_name,size_bytes --format=csv --path=<wp-path> | sort -t, -k2 -n -r | head -20
```

```powershell
wp option list --autoload=on --format=total_bytes --path=<wp-path>
wp option list --autoload=on --fields=option_name,size_bytes --format=json --path=<wp-path> | ConvertFrom-Json | Sort-Object { [int]$_.size_bytes } -Descending | Select-Object -First 20
```

Since WordPress 6.6, Site Health flags autoloaded options above about 800 KB, and new options over 150 KB are not autoloaded by default. Map each large option to the plugin or theme that owns it; leftovers from removed plugins are common. Do not delete or change options without approval and a database backup (`wp db export`). Prefer the owning plugin's own setting or uninstall routine.

For per-request cost, use the Query Monitor plugin on local or staging: slow and duplicate queries by component, external HTTP API calls, hooks, and enqueued scripts and styles. Its output is visible only to administrators by default. Ask before installing it, and remove it when the diagnosis is finished.

### 7. Images

- Identify the LCP element per template in Lighthouse. Check the rendered HTML for its `<img>` attributes:

```bash
curl -s https://example.com/ | grep -oE '<img[^>]+>' | head -5
```

```powershell
[regex]::Matches((curl.exe -s https://example.com/ | Out-String), '<img[^>]+>') | Select-Object -First 5 -ExpandProperty Value
```

- **Never lazy-load the LCP image.** Since WordPress 6.3, core skips `loading="lazy"` and adds `fetchpriority="high"` for the image it predicts is the LCP. The guess fails with sliders, Cover blocks using CSS backgrounds, page builders and custom templates. Fix at the template or block, and give `fetchpriority="high"` to one image, two at most.
- Check `width` and `height` attributes (prevents CLS) and that `srcset`/`sizes` serve a size close to the displayed size.
- Modern formats: WordPress supports WebP and AVIF uploads; output conversion is controlled by the `image_editor_output_format` filter or a plugin such as Performance Lab's Modern Image Formats.
- WordPress 7.1 adds client-side media processing: in supported Chromium browsers the editor generates sub-sizes in the browser (WebAssembly libvips), respects `image_editor_output_format`, accepts AVIF even where the server lacks AVIF support, and falls back to the server elsewhere. It needs a Content Security Policy that allows `blob:` in `worker-src`. It affects new uploads only; existing images keep their sizes until regenerated (`wp media regenerate --only-missing`, which is heavy, so ask first). Source: <https://make.wordpress.org/core/2026/07/22/client-side-media-processing-in-wordpress-7-1/>.

### 8. Fonts

- Prefer self-hosted WOFF2 files registered through `theme.json` `fontFace` or the Font Library, instead of third-party font CSS.
- Limit families and weights; use a variable font where it replaces several files.
- Use `font-display: swap` (or `optional` for non-brand text) and preload only the one font file used above the fold.
- Reduce swap-related CLS with a matched fallback (`size-adjust`, `ascent-override`).

### 9. Render-blocking CSS and JavaScript

- List what loads in `<head>` and why. Block themes load per-block core styles only where blocks appear; check that a plugin or classic setup has not turned this off.
- Use the script loading strategies (`'strategy' => 'defer'` or `'async'` in `wp_register_script()` / `wp_enqueue_script()`, WordPress 6.3+) for theme scripts that are not needed for first paint.
- Load plugin assets only on pages that use them (for example form scripts only on form pages), through the plugin's own setting or a documented filter.
- Remove duplicate libraries (two copies of a slider, icons or jQuery plugins).

### 10. Third-party scripts and INP

Inventory every third party: analytics, tag manager, consent banner, chat widget, video and map embeds, ads, A/B testing. For each, record owner, purpose and cost (bytes, long tasks). Common fixes: load after consent or interaction, use a click-to-load facade for video and maps, reserve space for banners and embeds, and drop scripts nobody owns. Removing a third party is a business decision, so ask.

For INP, record an interaction in the DevTools Performance panel and look for long tasks in event handlers, menus, sliders, filters and form validation.

### 11. Change one thing, then re-measure

Apply one change at a time on staging, re-run the same lab tests under the same conditions, and keep the before and after files. Field data will take up to 28 days to reflect a fix; say so rather than claiming success early.

## Choosing a caching or optimisation approach

Ask first: who hosts the site, which web server (Apache, Nginx, LiteSpeed), whether the host already caches pages, whether there is a CDN, the budget, and who will maintain the settings. Then present 2–4 of these options as a short question with choices:

| Option | Advantages | Disadvantages | Cost and effort | Suits |
| --- | --- | --- | --- | --- |
| Host or CDN page cache | Fastest layer, no plugin, purged by the host | Fewer controls; behaviour varies by host | Usually included | Managed WordPress hosting |
| WP Super Cache | Simple, free, low risk | Page cache only; no asset optimisation | Free, low effort | Small sites on basic hosting |
| W3 Total Cache | Very configurable (page, object, browser, CDN) | Easy to misconfigure; many settings to own | Free core, paid tier; high effort | Technical teams |
| LiteSpeed Cache | Server-level cache plus image and asset tools | Full page cache needs a LiteSpeed or QUIC.cloud server | Free; some services use paid credits | LiteSpeed hosting |
| WP Rocket | Polished defaults, page cache plus asset tuning | Paid licence; aggressive options can break layouts | Annual licence, low effort | Non-technical owners without host cache |
| Performance Lab (WordPress performance team) | Core-track features: modern image formats, speculative loading, image prioritiser | Not a page cache; beta features | Free, moderate testing | Any site, alongside one cache |

Recommend one based on the answers. Rules:

- **Never stack overlapping cache plugins** or two tools that both cache pages or both minify and combine assets. Pick one owner per job.
- Prefer the host cache when it exists; add a plugin only for a gap you can name.
- Check pricing and features on the vendor's site at the time; they change.
- Wait for the user's choice before installing anything.

## Ask before acting

- Installing, activating or removing any plugin, including Query Monitor and Lighthouse CLI.
- Changing cache, CDN, PHP version or server settings.
- Deleting or changing autoload on options, cleaning transients, or any database write (export a backup first).
- Regenerating thumbnails or bulk-converting images.
- Removing or delaying third-party scripts, analytics or consent tooling.
- Any change on production, or purging a production cache.

## Output

Hand back a report using [references/performance-report-template.md](references/performance-report-template.md): baseline, findings by layer with evidence, changes made or proposed, before and after results under the same conditions, and what still needs field data to confirm.
