# Verification commands (curl fallback)

Use these when the snapshot script from `seo-measure-and-monitor` is not installed, or to look closer at one URL. Every command is read-only.

Windows notes: in Windows PowerShell 5.1 `curl` is an alias for `Invoke-WebRequest`, so call `curl.exe` (shipped with Windows 10 and later). Use `NUL` where bash uses `/dev/null`.

Staging behind HTTP authentication: ask the user to create a `.netrc` file (`machine staging.example.com login <user> password <password>`) and add `--netrc-file <path-to-netrc>` to each command. Never type credentials into a command you display, and never save them in the project.

Set the URL once:

```bash
URL="https://staging.example.com/services/<service-slug>/"
```

```powershell
$URL = "https://staging.example.com/services/<service-slug>/"
```

## Status and redirect chain

Every hop with its status and `Location` (uses GET, because some servers answer HEAD differently):

```bash
curl -sS -L -o /dev/null -D - "$URL" | grep -iE '^(HTTP/|location:)'
curl -sS -L -o /dev/null -w 'final: %{http_code} %{url_effective} hops: %{num_redirects}\n' "$URL"
```

```powershell
curl.exe -sS -L -o NUL -D - $URL | Select-String -Pattern '^(HTTP/|location:)'
curl.exe -sS -L -o NUL -w "final: %{http_code} %{url_effective} hops: %{num_redirects}`n" $URL
```

Pass: indexable pages end at 200 with zero hops; redirected URLs reach the target in one hop.

## Headers, including X-Robots-Tag

```bash
curl -sS -o /dev/null -D - "$URL" | grep -iE '^(x-robots-tag|content-type|link|cache-control):'
```

```powershell
curl.exe -sS -o NUL -D - $URL | Select-String -Pattern '^(x-robots-tag|content-type|link|cache-control):'
```

Pass: no `X-Robots-Tag: noindex` on pages meant to be indexed. Check a PDF as well if PDFs should (or should not) be indexed.

## Rendered head tags

WordPress prints some attributes with single quotes (`<meta name='robots' ...>`), so the patterns use `.` to match either quote.

```bash
curl -sS "$URL" | grep -oiE '<title>[^<]*</title>|<meta[^>]+name=.(description|robots).[^>]*>|<link[^>]+rel=.canonical.[^>]*>|<link[^>]+hreflang[^>]*>|<h1[^>]*>.*</h1>'
```

```powershell
$html = curl.exe -sS $URL | Out-String
[regex]::Matches($html, '<title>[^<]*</title>|<meta[^>]+name=.(description|robots).[^>]*>|<link[^>]+rel=.canonical.[^>]*>|<link[^>]+hreflang[^>]*>|<h1[^>]*>.*?</h1>', 'IgnoreCase') | ForEach-Object { $_.Value }
```

## Duplicate counts

Each count should be 1 (hreflang: one per language version, or 0 on single-language sites).

```bash
HTML="$(curl -sS "$URL")"
for p in '<title' 'name=.description' 'name=.robots' 'rel=.canonical' 'property=.og:title' 'application/ld\+json' '<h1'; do
  printf '%-22s %s\n' "$p" "$(printf '%s' "$HTML" | grep -oiE "$p" | wc -l)"
done
```

```powershell
$html = curl.exe -sS $URL | Out-String
'<title','name=.description','name=.robots','rel=.canonical','property=.og:title','application/ld\+json','<h1' | ForEach-Object {
  '{0,-22} {1}' -f $_, ([regex]::Matches($html, $_, 'IgnoreCase')).Count
}
```

More than one `application/ld+json` block is not always wrong (a plugin graph plus a WooCommerce product block, for example), but each must be explained in the ownership matrix.

## JSON-LD parses and lists its types

Requires Node.js 18 or later. Save as a scratch file outside the project, then run `node jsonld-types.mjs <url>`:

```js
// jsonld-types.mjs: prints @type values from each JSON-LD block, or the parse error
const html = await (await fetch(process.argv[2])).text();
const blocks = [...html.matchAll(/<script[^>]+application\/ld\+json[^>]*>([\s\S]*?)<\/script>/gi)];
const types = (n) => Array.isArray(n) ? n.flatMap(types) : n && typeof n === 'object'
  ? [].concat(n['@type'] ?? [], ...Object.values(n).filter(v => typeof v === 'object').map(types)) : [];
blocks.forEach((b, i) => {
  try { console.log(`block ${i + 1}:`, [...new Set(types(JSON.parse(b[1])))].join(', ')); }
  catch (e) { console.log(`block ${i + 1}: INVALID JSON (${e.message})`); }
});
```

For full validation and rich result eligibility, use `seo-structured-data` if installed, or Google's Rich Results Test and the Schema.org validator in a browser.

## robots.txt and sitemaps

```bash
curl -sS https://staging.example.com/robots.txt
curl -sS -o /dev/null -w '%{http_code} %{content_type}\n' https://staging.example.com/wp-sitemap.xml
curl -sS -o /dev/null -w '%{http_code} %{content_type}\n' https://staging.example.com/sitemap_index.xml
curl -sS https://staging.example.com/wp-sitemap.xml | grep -o '<loc>[^<]*</loc>' | head -20
```

```powershell
curl.exe -sS https://staging.example.com/robots.txt
curl.exe -sS -o NUL -w "%{http_code} %{content_type}`n" https://staging.example.com/wp-sitemap.xml
curl.exe -sS -o NUL -w "%{http_code} %{content_type}`n" https://staging.example.com/sitemap_index.xml
([xml](curl.exe -sS https://staging.example.com/wp-sitemap.xml)).sitemapindex.sitemap.loc
```

Is a URL in the sitemap? Fetch each child sitemap from the index and search for the URL. With many child sitemaps, prefer the snapshot script's `--sitemap` option.

## Redirect plan test

Put old and expected URLs in a two-column CSV (`old,expected`, no header), then:

```bash
while IFS=, read -r old expected; do
  got=$(curl -sS -o /dev/null -w '%{http_code} %{redirect_url}' "$old")
  echo "$old -> $got (expected $expected)"
done < redirects.csv
```

```powershell
Import-Csv redirects.csv -Header old,expected | ForEach-Object {
  $got = curl.exe -sS -o NUL -w "%{http_code} %{redirect_url}" $_.old
  "$($_.old) -> $got (expected $($_.expected))"
}
```

Pass: status 301 (or 410 where planned) and `redirect_url` equals the expected URL exactly. Then run the chain command above on a sample to confirm one hop.

## Staging protection and production switch

```bash
wp option get blog_public --path=<wp-path>          # 0 = discouraged (staging), 1 = public (production)
curl -sS "$URL" | grep -oiE '<meta[^>]+name=.robots.[^>]*>'
curl -sS -o /dev/null -w '%{http_code}\n' "$URL"    # 401 means HTTP auth is on
```

On production after go-live, the same commands should show `1`, no `noindex`, and 200.
