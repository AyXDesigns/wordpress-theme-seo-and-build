#!/usr/bin/env node
// theme-inventory: read-only summary of a WordPress theme directory, for triage before any edit.
// Zero dependencies. Requires Node.js 18 or later.
//
//   node theme-inventory.mjs <theme-dir>          human-readable report
//   node theme-inventory.mjs <theme-dir> --json   machine-readable JSON

import { readdir, readFile, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const SKIP_DIRS = new Set(['node_modules', 'vendor', '.git', '.svn', 'dist', 'build', '.cache']);
const MAX_FILE_BYTES = 1_000_000;

// Calls that show the theme depends on a plugin. Each entry: label, regex for a call or use.
const PLUGIN_SIGNALS = [
  ['Contact Form 7', /\b(wpcf7_\w+|WPCF7\w*)\b/g],
  ['Flamingo', /\b(flamingo_\w+|Flamingo_\w+)\b/g],
  ['WooCommerce', /\b(WC\(\)|wc_get_\w+|is_woocommerce|WooCommerce\b)/g],
  ['Advanced Custom Fields', /\b(get_field|the_field|have_rows|get_sub_field|acf_\w+)\s*\(/g],
  ['Yoast SEO', /\b(WPSEO_\w+|wpseo_\w+|yoast_\w+)\b/g],
  ['Rank Math', /\b(RankMath\\\w+|rank_math_\w+)\b/g],
  ['Elementor', /\b(Elementor\\\w+|elementor_\w+)\b/g],
  ['Jetpack', /\b(Jetpack\w*|jetpack_\w+)\b/g],
  ['Polylang / WPML', /\b(pll_\w+|icl_\w+|wpml_\w+)\b/g],
];

const GUARD = /\b(function_exists|class_exists|defined|is_plugin_active|did_action)\s*\(/;

const HEADER_FIELDS = [
  'Theme Name', 'Template', 'Version', 'Requires at least', 'Tested up to', 'Requires PHP',
  'Text Domain', 'License', 'Author', 'Theme URI', 'Update URI', 'Tags',
];

async function walk(dir, root = dir, out = []) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') && entry.name !== '.gitattributes') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRS.has(entry.name)) await walk(full, root, out);
    } else {
      out.push(path.relative(root, full).split(path.sep).join('/'));
    }
  }
  return out;
}

const read = async (file) => ((await stat(file)).size > MAX_FILE_BYTES ? '' : readFile(file, 'utf8'));

function parseHeader(css) {
  const block = css.match(/\/\*([\s\S]*?)\*\//)?.[1] ?? '';
  const header = {};
  for (const field of HEADER_FIELDS) {
    const m = block.match(new RegExp(`^[\\s*]*${field}\\s*:\\s*(.+)$`, 'mi'));
    if (m) header[field] = m[1].trim();
  }
  return header;
}

function phpFileHeader(src, key) {
  return src.match(new RegExp(`^[\\s*]*${key}\\s*:\\s*(.+)$`, 'mi'))?.[1].trim() ?? null;
}

function summariseThemeJson(json) {
  const s = json.settings ?? {};
  const count = (v) => (Array.isArray(v) ? v.length : 0);
  return {
    version: json.version ?? null,
    appearanceTools: s.appearanceTools ?? null,
    useRootPaddingAwareAlignments: s.useRootPaddingAwareAlignments ?? null,
    layout: s.layout ? { contentSize: s.layout.contentSize ?? null, wideSize: s.layout.wideSize ?? null } : null,
    viewport: s.viewport ?? null,
    palette: count(s.color?.palette),
    gradients: count(s.color?.gradients),
    fontFamilies: count(s.typography?.fontFamilies),
    fontSizes: count(s.typography?.fontSizes),
    spacingSizes: count(s.spacing?.spacingSizes),
    customTemplates: (json.customTemplates ?? []).map((t) => t.name),
    templateParts: (json.templateParts ?? []).map((t) => `${t.name}${t.area ? ` (${t.area})` : ''}`),
    blockSettings: Object.keys(s.blocks ?? {}).length,
    blockStyles: Object.keys(json.styles?.blocks ?? {}).length,
  };
}

function matchesAll(src, re, group = 1) {
  return [...src.matchAll(re)].map((m) => m[group]);
}

function classify({ hasBlockIndex, hasPhpIndex, hasThemeJson, hasParts, header }) {
  let type;
  if (hasBlockIndex) type = 'block';
  else if (hasPhpIndex && (hasThemeJson || hasParts)) type = 'hybrid';
  else if (hasPhpIndex) type = 'classic';
  else type = header.Template ? 'unknown (child relies on parent templates)' : 'unknown';
  return header.Template ? `child of "${header.Template}" (${type})` : type;
}

async function inventory(themeDir) {
  const dir = path.resolve(themeDir);
  if (!existsSync(path.join(dir, 'style.css'))) {
    throw new Error(`No style.css in ${dir}. Point the script at a single theme folder.`);
  }
  const files = await walk(dir);
  const has = (f) => files.includes(f);
  const inDir = (prefix, ext) => files.filter((f) => f.startsWith(prefix) && f.endsWith(ext) && !f.slice(prefix.length).includes('/'));

  const header = parseHeader(await read(path.join(dir, 'style.css')));

  let themeJson = null;
  let themeJsonError = null;
  if (has('theme.json')) {
    try { themeJson = summariseThemeJson(JSON.parse(await read(path.join(dir, 'theme.json')))); }
    catch (e) { themeJsonError = e.message; }
  }

  const templates = [...inDir('templates/', '.html'), ...inDir('block-templates/', '.html')];
  const parts = [...inDir('parts/', '.html'), ...inDir('block-template-parts/', '.html')];
  const styleVariations = inDir('styles/', '.json');
  const phpTemplates = files.filter((f) => f.endsWith('.php') && !f.includes('/'));

  const patterns = [];
  for (const f of inDir('patterns/', '.php')) {
    const src = await read(path.join(dir, f));
    patterns.push({ file: f, title: phpFileHeader(src, 'Title'), slug: phpFileHeader(src, 'Slug') });
  }

  const php = files.filter((f) => f.endsWith('.php'));
  const supports = new Set();
  const styles = new Set();
  const scripts = new Set();
  const includes = new Set();
  const durable = [];
  const pluginUse = new Map();
  const functionPrefixes = new Map();
  let unescapedEchoes = 0;

  for (const f of php) {
    const src = await read(path.join(dir, f));
    matchesAll(src, /add_theme_support\s*\(\s*['"]([^'"]+)['"]/g).forEach((s) => supports.add(s));
    matchesAll(src, /wp_(?:enqueue|register)_style\s*\(\s*['"]([^'"]+)['"]/g).forEach((s) => styles.add(s));
    matchesAll(src, /wp_(?:enqueue|register)_script(?:_module)?\s*\(\s*['"]([^'"]+)['"]/g).forEach((s) => scripts.add(s));
    matchesAll(src, /\b(?:require|include)(?:_once)?\s*\(?\s*([^;]+);/g).forEach((s) => includes.add(`${f}: ${s.trim().slice(0, 100)}`));

    for (const [fn, label] of [
      ['register_post_type', 'custom post type'],
      ['register_taxonomy', 'taxonomy'],
      ['add_shortcode', 'shortcode'],
      ['register_rest_route', 'REST route'],
      ['register_block_type', 'block'],
    ]) {
      for (const name of matchesAll(src, new RegExp(`${fn}\\s*\\(\\s*['"]([^'"]+)['"]`, 'g'))) durable.push({ kind: label, name, file: f });
    }

    for (const [label, re] of PLUGIN_SIGNALS) {
      const hits = src.match(re);
      if (!hits) continue;
      const entry = pluginUse.get(label) ?? { files: new Set(), unguardedFiles: new Set() };
      entry.files.add(f);
      if (!GUARD.test(src)) entry.unguardedFiles.add(f);
      pluginUse.set(label, entry);
    }

    for (const name of matchesAll(src, /^\s*function\s+&?\s*([A-Za-z_]\w*)\s*\(/gm)) {
      const prefix = name.includes('_') ? name.split('_')[0] + '_' : '(no prefix)';
      functionPrefixes.set(prefix, (functionPrefixes.get(prefix) ?? 0) + 1);
    }

    unescapedEchoes += (src.match(/\becho\s+\$(?!this\b)\w+/g) ?? []).length;
  }

  return {
    tool: 'theme-inventory',
    version: '0.2.0',
    theme: path.basename(dir),
    type: classify({
      hasBlockIndex: has('templates/index.html') || has('block-templates/index.html'),
      hasPhpIndex: has('index.php'),
      hasThemeJson: has('theme.json'),
      hasParts: parts.length > 0,
      header,
    }),
    header,
    themeJson,
    themeJsonError,
    files: { total: files.length, php: php.length },
    templates,
    phpTemplates,
    parts,
    patterns,
    styleVariations,
    themeSupports: [...supports].sort(),
    enqueuedStyles: [...styles].sort(),
    enqueuedScripts: [...scripts].sort(),
    includes: [...includes].sort(),
    durableFeaturesInTheme: durable,
    pluginDependencies: [...pluginUse].map(([plugin, e]) => ({
      plugin,
      files: [...e.files].sort(),
      filesWithoutAnyAvailabilityGuard: [...e.unguardedFiles].sort(),
    })),
    functionPrefixes: Object.fromEntries([...functionPrefixes].sort((a, b) => b[1] - a[1])),
    signals: {
      hasComposer: has('composer.json'),
      hasPackageJson: has('package.json'),
      hasPhpcsConfig: files.some((f) => /^(\.?phpcs\.xml(\.dist)?)$/.test(f)),
      hasTests: files.some((f) => /^tests?\//.test(f)),
      hasReadme: files.some((f) => /^readme\.(txt|md)$/i.test(f)),
      hasChangelog: files.some((f) => /^changelog/i.test(f)),
      hasScreenshot: files.some((f) => /^screenshot\.(png|jpg|jpeg|webp)$/i.test(f)),
      hasLanguages: files.some((f) => f.startsWith('languages/')),
      echoOfRawVariable: unescapedEchoes,
    },
  };
}

function report(r) {
  const list = (items, empty = 'none') => (items.length ? items.map((i) => `  - ${i}`).join('\n') : `  ${empty}`);
  const lines = [
    `Theme inventory: ${r.theme}`,
    `Type: ${r.type}`,
    '',
    'style.css header:',
    list(Object.entries(r.header).map(([k, v]) => `${k}: ${v}`), 'no header fields found'),
    '',
    `theme.json: ${r.themeJsonError ? `INVALID JSON (${r.themeJsonError})` : r.themeJson ? `version ${r.themeJson.version}` : 'absent'}`,
  ];
  if (r.themeJson) {
    const t = r.themeJson;
    lines.push(
      `  palette ${t.palette}, font families ${t.fontFamilies}, font sizes ${t.fontSizes}, spacing sizes ${t.spacingSizes}`,
      `  layout ${t.layout ? `${t.layout.contentSize} / ${t.layout.wideSize}` : 'not set'}, viewport ${t.viewport ? JSON.stringify(t.viewport) : 'default'}, appearanceTools ${t.appearanceTools}`,
    );
  }
  lines.push(
    '',
    `Block templates (${r.templates.length}):`, list(r.templates),
    `Template parts (${r.parts.length}):`, list(r.parts),
    `Patterns (${r.patterns.length}):`, list(r.patterns.map((p) => `${p.file}${p.slug ? ` [${p.slug}]` : ''}`)),
    `Style variations (${r.styleVariations.length}):`, list(r.styleVariations),
    `Root PHP files (${r.phpTemplates.length}):`, list(r.phpTemplates),
    `Includes (${r.includes.length}):`, list(r.includes),
    '',
    'Theme supports:', list(r.themeSupports),
    'Enqueued styles:', list(r.enqueuedStyles),
    'Enqueued scripts:', list(r.enqueuedScripts),
    '',
    'Durable features defined in the theme (candidates for a companion plugin):',
    list(r.durableFeaturesInTheme.map((d) => `${d.kind} "${d.name}" in ${d.file}`)),
    '',
    'Plugin dependencies:',
    list(r.pluginDependencies.map((p) => `${p.plugin}: ${p.files.length} file(s)${p.filesWithoutAnyAvailabilityGuard.length ? `, NO availability guard in ${p.filesWithoutAnyAvailabilityGuard.join(', ')}` : ''}`)),
    '',
    'Function name prefixes:', list(Object.entries(r.functionPrefixes).map(([k, v]) => `${k} ×${v}`)),
    '',
    'Signals:', list(Object.entries(r.signals).map(([k, v]) => `${k}: ${v}`)),
    '',
    'This is a static scan. Confirm each finding by reading the files and, where possible, with WP-CLI on a local copy.',
  );
  return lines.join('\n');
}

const [themeDir, flag] = process.argv.slice(2);
if (!themeDir || themeDir === '--help' || themeDir === '-h') {
  console.log('Usage: node theme-inventory.mjs <theme-dir> [--json]');
} else {
  try {
    const r = await inventory(themeDir);
    console.log(flag === '--json' ? JSON.stringify(r, null, 2) : report(r));
  } catch (e) {
    console.error(`theme-inventory: ${e.message}`);
    process.exitCode = 1;
  }
}
