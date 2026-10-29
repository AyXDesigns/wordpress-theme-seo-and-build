#!/usr/bin/env node
// seo-snapshot: record the search-facing output of a list of URLs, or compare two snapshots.
// Zero dependencies. Requires Node.js 18 or later (global fetch).
//
//   node seo-snapshot.mjs --urls urls.txt --out before.json
//   node seo-snapshot.mjs --urls https://example.com/,https://example.com/about/ --sitemap https://example.com/wp-sitemap.xml --out before.json
//   node seo-snapshot.mjs --diff before.json after.json [--md]

import { readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';

const TOOL = 'seo-snapshot';
const VERSION = '0.2.0';
const MAX_REDIRECTS = 10;
const MAX_SITEMAP_FILES = 50;

const HELP = `${TOOL} ${VERSION}

Snapshot mode:
  --urls <file|list>   File with one URL per line, or a comma-separated list
  --sitemap <url>      Optional sitemap or sitemap index; records whether each URL is listed
  --from-sitemap       Snapshot every URL found in --sitemap (use --limit to cap it)
  --limit <n>          Maximum URLs to fetch (default 200)
  --out <file>         Where to write the JSON snapshot (default: print to stdout)
  --user-agent <ua>    User agent (default identifies this tool)
  --timeout <ms>       Per-request timeout (default 15000)
  --concurrency <n>    Parallel requests (default 4)

Diff mode:
  --diff <before.json> <after.json>   Compare two snapshots
  --md                                Print a Markdown table instead of JSON
  --by-path                           Match URLs by path and query, ignoring the host (staging vs production)
  --fail-on <critical|warning>        Exit with code 2 if any change reaches this severity

Only fetch sites you own or are authorised to test. The tool sends ordinary GET requests.`;

function parseArgs(argv) {
  const args = { limit: 200, timeout: 15000, concurrency: 4 };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    switch (a) {
      case '--urls': args.urls = next(); break;
      case '--sitemap': args.sitemap = next(); break;
      case '--from-sitemap': args.fromSitemap = true; break;
      case '--limit': args.limit = Number(next()); break;
      case '--out': args.out = next(); break;
      case '--user-agent': args.userAgent = next(); break;
      case '--timeout': args.timeout = Number(next()); break;
      case '--concurrency': args.concurrency = Number(next()); break;
      case '--diff': args.diff = [next(), next()]; break;
      case '--md': args.md = true; break;
      case '--by-path': args.byPath = true; break;
      case '--fail-on': args.failOn = next(); break;
      case '-h': case '--help': args.help = true; break;
      default: throw new Error(`Unknown argument: ${a}`);
    }
  }
  return args;
}

// ---------- HTML helpers (deliberately small; good enough for <head> metadata) ----------

const ENTITIES = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', '#39': "'" };
function decode(s) {
  return s
    .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
    .replace(/&([a-z]+|#39);/gi, (m, n) => ENTITIES[n.toLowerCase()] ?? m);
}
const clean = (s) => decode(s.replace(/<[^>]*>/g, ' ')).replace(/\s+/g, ' ').trim();

function attrs(tag) {
  const out = {};
  const re = /([^\s=/<>]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g;
  let m;
  while ((m = re.exec(tag))) out[m[1].toLowerCase()] = decode(m[2] ?? m[3] ?? m[4] ?? '');
  return out;
}

function tags(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map((m) => attrs(m[0]));
}

function jsonLdTypes(html) {
  const types = new Set();
  const errors = [];
  const blocks = html.matchAll(/<script\b[^>]*type\s*=\s*["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script>/gi);
  const walk = (node) => {
    if (Array.isArray(node)) return node.forEach(walk);
    if (!node || typeof node !== 'object') return;
    const t = node['@type'];
    if (t) (Array.isArray(t) ? t : [t]).forEach((x) => types.add(String(x)));
    if (node['@graph']) walk(node['@graph']);
  };
  for (const [, body] of blocks) {
    try { walk(JSON.parse(body.trim())); } catch (e) { errors.push(e.message.slice(0, 120)); }
  }
  return { types: [...types].sort(), errors };
}

function extract(html) {
  const headEnd = html.search(/<\/head>/i);
  const head = headEnd > -1 ? html.slice(0, headEnd) : html;
  const meta = tags(head, 'meta');
  const links = tags(head, 'link');
  const rel = (l) => (l.rel || '').toLowerCase().split(/\s+/);
  const titleMatch = head.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  const metaByName = (n) => meta.filter((m) => (m.name || '').toLowerCase() === n).map((m) => m.content ?? '');
  const ld = jsonLdTypes(html);
  return {
    title: titleMatch ? clean(titleMatch[1]) : null,
    description: metaByName('description')[0] ?? null,
    canonical: links.filter((l) => rel(l).includes('canonical')).map((l) => l.href),
    metaRobots: [...metaByName('robots'), ...metaByName('googlebot')].join(', ') || null,
    h1: [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => clean(m[1])),
    hreflang: links
      .filter((l) => rel(l).includes('alternate') && l.hreflang)
      .map((l) => `${l.hreflang} ${l.href}`)
      .sort(),
    ogUrl: meta.find((m) => (m.property || '').toLowerCase() === 'og:url')?.content ?? null,
    jsonLdTypes: ld.types,
    jsonLdErrors: ld.errors,
  };
}

// ---------- fetching ----------

async function get(url, opts) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), opts.timeout);
  try {
    return await fetch(url, {
      redirect: 'manual',
      signal: ctrl.signal,
      headers: { 'user-agent': opts.userAgent, accept: 'text/html,application/xml;q=0.9,*/*;q=0.8' },
    });
  } finally {
    clearTimeout(timer);
  }
}

async function snapshotUrl(url, opts, sitemapSet) {
  const chain = [];
  let current = url;
  const started = Date.now();
  try {
    for (let hop = 0; hop <= MAX_REDIRECTS; hop++) {
      const res = await get(current, opts);
      const location = res.headers.get('location');
      if (res.status >= 300 && res.status < 400 && location) {
        chain.push({ status: res.status, url: current });
        current = new URL(location, current).href;
        await res.body?.cancel();
        continue;
      }
      const type = res.headers.get('content-type') || '';
      const html = /html/i.test(type) ? await res.text() : (await res.body?.cancel(), '');
      return {
        url,
        finalUrl: current,
        status: res.status,
        redirects: chain,
        contentType: type || null,
        xRobotsTag: res.headers.get('x-robots-tag'),
        inSitemap: sitemapSet ? sitemapSet.has(normalise(url)) : null,
        ms: Date.now() - started,
        ...(html ? extract(html) : {}),
      };
    }
    return { url, error: `More than ${MAX_REDIRECTS} redirects`, redirects: chain };
  } catch (e) {
    return { url, error: e.name === 'AbortError' ? `Timed out after ${opts.timeout} ms` : e.message, redirects: chain };
  }
}

const normalise = (u) => {
  try { const x = new URL(u); x.hash = ''; return x.href; } catch { return u; }
};

async function readSitemap(url, opts, seen = new Set()) {
  if (seen.size >= MAX_SITEMAP_FILES || seen.has(url)) return [];
  seen.add(url);
  const res = await get(url, opts);
  if (res.status !== 200) throw new Error(`Sitemap ${url} returned ${res.status}`);
  const xml = await res.text();
  const locs = [...xml.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/gi)].map((m) => decode(m[1]));
  if (/<sitemapindex\b/i.test(xml)) {
    const nested = [];
    for (const child of locs) nested.push(...(await readSitemap(child, opts, seen)));
    return nested;
  }
  return locs;
}

async function pool(items, size, fn) {
  const out = new Array(items.length);
  let next = 0;
  const workers = Array.from({ length: Math.max(1, size) }, async () => {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i]);
    }
  });
  await Promise.all(workers);
  return out;
}

async function loadUrls(spec) {
  if (!spec) return [];
  const text = existsSync(spec) ? await readFile(spec, 'utf8') : spec.replace(/,/g, '\n');
  return text.split(/\r?\n/).map((s) => s.trim()).filter((s) => s && !s.startsWith('#'));
}

async function runSnapshot(args) {
  const opts = {
    timeout: args.timeout,
    userAgent: args.userAgent || `${TOOL}/${VERSION} (site owner audit)`,
  };
  let sitemapUrls = null;
  if (args.sitemap) sitemapUrls = await readSitemap(args.sitemap, opts);
  let urls = await loadUrls(args.urls);
  if (args.fromSitemap) {
    if (!sitemapUrls) throw new Error('--from-sitemap needs --sitemap');
    urls = [...urls, ...sitemapUrls];
  }
  urls = [...new Set(urls.map(normalise))].slice(0, args.limit);
  if (!urls.length) throw new Error('No URLs to fetch. Use --urls or --sitemap with --from-sitemap.');

  const sitemapSet = sitemapUrls ? new Set(sitemapUrls.map(normalise)) : null;
  const results = await pool(urls, args.concurrency, (u) => snapshotUrl(u, opts, sitemapSet));
  const snapshot = {
    tool: TOOL,
    version: VERSION,
    createdAt: new Date().toISOString(),
    sitemap: args.sitemap ?? null,
    sitemapUrlCount: sitemapUrls?.length ?? null,
    urlCount: results.length,
    results,
  };
  const json = JSON.stringify(snapshot, null, 2);
  if (args.out) {
    await writeFile(args.out, json + '\n');
    const failed = results.filter((r) => r.error || r.status >= 400).length;
    console.error(`Saved ${results.length} URLs to ${args.out} (${failed} errors or 4xx/5xx).`);
  } else {
    console.log(json);
  }
}

// ---------- diff ----------

const FIELDS = [
  'error', 'status', 'finalUrl', 'xRobotsTag', 'metaRobots', 'canonical', 'inSitemap',
  'title', 'description', 'h1', 'hreflang', 'jsonLdTypes', 'jsonLdErrors', 'ogUrl',
];

const same = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null);

/**
 * Decide how serious one changed field is for search visibility.
 *
 * @param {string} field   One of FIELDS, or 'missing' / 'added' for a URL present in only one snapshot.
 * @param {*} before       Value in the earlier snapshot (null when absent).
 * @param {*} after        Value in the later snapshot (null when absent).
 * @param {object} page    The full "after" result for the URL (or "before" if the URL disappeared).
 * @returns {'critical'|'warning'|'info'}
 */
function classifyChange(field, before, after, page) {
  const text = (v) => (Array.isArray(v) ? v.join(' ') : String(v ?? '')).toLowerCase();
  const noindex = (v) => /\b(noindex|none)\b/.test(text(v));
  const broken = (s) => typeof s === 'number' && s >= 400;

  // On a page that now errors, everything else changed because of that; the status line carries the severity.
  if (broken(page.status) && !['status', 'error', 'missing', 'added'].includes(field)) return 'info';

  switch (field) {
    case 'error':
      return after ? 'critical' : 'info'; // started failing vs. recovered
    case 'status':
      if (broken(after)) return 'critical';
      return broken(before) ? 'info' : 'warning';
    case 'missing':
      return 'warning'; // URL dropped from the list: check it was intentional
    case 'added':
      return 'info';
    case 'xRobotsTag':
    case 'metaRobots':
      if (noindex(after) && !noindex(before)) return 'critical'; // page newly hidden from search
      if (noindex(before) && !noindex(after)) return 'warning'; // newly indexable: staging leak?
      return 'info';
    case 'canonical': {
      const list = after ?? [];
      if (list.length > 1) return 'warning';
      if (!list.length) return before?.length ? 'warning' : 'info';
      const self = pathKey(page.finalUrl ?? page.url);
      return pathKey(list[0]) === self ? 'warning' : 'critical'; // now points at another page
    }
    case 'finalUrl':
      return 'warning'; // redirect target changed
    case 'inSitemap':
      return before === true && after === false ? 'warning' : 'info';
    case 'jsonLdErrors':
      return (after?.length ?? 0) > (before?.length ?? 0) ? 'warning' : 'info';
    case 'jsonLdTypes':
      return (before ?? []).some((t) => !(after ?? []).includes(t)) ? 'warning' : 'info';
    case 'hreflang':
      return 'warning';
    case 'title':
    case 'h1':
      // Losing the title or every H1 on a working page matters; ordinary edits do not.
      return !broken(page.status) && !text(after).trim() && text(before).trim() ? 'warning' : 'info';
    default:
      return 'info'; // description, ogUrl and anything new
  }
}

const pathKey = (u) => {
  try { const x = new URL(u); return x.pathname + x.search; } catch { return u; }
};

// With byPath, hosts are ignored when matching URLs, and host-only differences in
// URL-valued fields (finalUrl, canonical, ogUrl, hreflang) are not reported as changes.
function comparable(field, value, byPath) {
  if (!byPath || value == null) return value;
  if (field === 'finalUrl' || field === 'ogUrl') return pathKey(value);
  if (field === 'canonical') return value.map(pathKey);
  if (field === 'hreflang') return value.map((h) => h.replace(/\S+$/, (u) => pathKey(u)));
  return value;
}

function diffSnapshots(before, after, byPath = false) {
  const key = byPath ? pathKey : normalise;
  const index = (s) => new Map(s.results.map((r) => [key(r.url), r]));
  const a = index(before);
  const b = index(after);
  const changes = [];
  for (const [url, prev] of a) {
    const next = b.get(url);
    if (!next) {
      changes.push({ url, field: 'missing', before: prev.status ?? null, after: null, severity: classifyChange('missing', prev.status ?? null, null, prev) });
      continue;
    }
    for (const field of FIELDS) {
      if (same(comparable(field, prev[field], byPath), comparable(field, next[field], byPath))) continue;
      changes.push({ url, field, before: prev[field] ?? null, after: next[field] ?? null, severity: classifyChange(field, prev[field] ?? null, next[field] ?? null, next) });
    }
  }
  for (const [url, next] of b) {
    if (!a.has(url)) changes.push({ url, field: 'added', before: null, after: next.status ?? null, severity: classifyChange('added', null, next.status ?? null, next) });
  }
  const rank = { critical: 0, warning: 1, info: 2 };
  changes.sort((x, y) => rank[x.severity] - rank[y.severity] || x.url.localeCompare(y.url));
  const counts = { critical: 0, warning: 0, info: 0 };
  changes.forEach((c) => counts[c.severity]++);
  return { tool: TOOL, version: VERSION, before: before.createdAt, after: after.createdAt, counts, changes };
}

const cell = (v) => {
  if (v === null || v === undefined) return '—';
  const s = Array.isArray(v) ? v.join('; ') : typeof v === 'object' ? JSON.stringify(v) : String(v);
  return s.replace(/\|/g, '\\|').replace(/\s+/g, ' ').slice(0, 140) || '(empty)';
};

function toMarkdown(d) {
  const lines = [
    `# SEO snapshot diff`,
    ``,
    `Before: ${d.before}  `,
    `After: ${d.after}  `,
    `Critical: ${d.counts.critical} · Warning: ${d.counts.warning} · Info: ${d.counts.info}`,
    ``,
  ];
  if (!d.changes.length) return lines.concat('No changes.').join('\n');
  lines.push('| Severity | URL | Field | Before | After |', '|---|---|---|---|---|');
  for (const c of d.changes) lines.push(`| ${c.severity} | ${c.url} | ${c.field} | ${cell(c.before)} | ${cell(c.after)} |`);
  return lines.join('\n');
}

async function runDiff(args) {
  const [before, after] = await Promise.all(args.diff.map(async (f) => JSON.parse(await readFile(f, 'utf8'))));
  const d = diffSnapshots(before, after, args.byPath);
  console.log(args.md ? toMarkdown(d) : JSON.stringify(d, null, 2));
  if (args.failOn === 'critical' && d.counts.critical) process.exitCode = 2;
  if (args.failOn === 'warning' && (d.counts.critical || d.counts.warning)) process.exitCode = 2;
}

// ---------- main ----------

try {
  const args = parseArgs(process.argv.slice(2));
  if (args.help || process.argv.length <= 2) console.log(HELP);
  else if (args.diff) await runDiff(args);
  else await runSnapshot(args);
} catch (e) {
  console.error(`${TOOL}: ${e.message}`);
  process.exitCode = 1;
}
