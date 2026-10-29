#!/usr/bin/env node
// release-package: build a theme zip from one git ref, then prove the zip matches that source.
// Zero dependencies. Requires Node.js 18 or later and git.
//
//   node release-package.mjs <theme-dir> --out <dir> [--ref HEAD] [--version 1.2.0] [--slug my-theme]
//
// Writes <slug>-<version>.zip and <slug>-<version>.manifest.json into --out.
// Exit code 0 = pass, 2 = built but a check failed, 1 = could not run.

import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const TOOL = 'release-package';
const VERSION = '0.2.0';

// Files that should almost never ship inside a theme package.
const RISKY = [
  [/(^|\/)\.env(\.|$)/, 'environment file'],
  [/(^|\/)wp-config\.php$/, 'wp-config.php'],
  [/\.(sql|sql\.gz|bak|log)$/i, 'database dump, backup or log'],
  [/(^|\/)node_modules\//, 'node_modules'],
  [/(^|\/)\.git\//, '.git directory'],
  [/(^|\/)\.DS_Store$|(^|\/)Thumbs\.db$/, 'OS metadata file'],
  [/\.(zip|tar|gz|7z)$/i, 'nested archive'],
  [/(^|\/)(id_rsa|.*\.pem|.*\.key)$/i, 'private key'],
];

function parseArgs(argv) {
  const args = { ref: 'HEAD' };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--out') args.out = argv[++i];
    else if (a === '--ref') args.ref = argv[++i];
    else if (a === '--version') args.version = argv[++i];
    else if (a === '--slug') args.slug = argv[++i];
    else if (a === '-h' || a === '--help') args.help = true;
    else if (!args.themeDir) args.themeDir = a;
    else throw new Error(`Unknown argument: ${a}`);
  }
  return args;
}

const git = (cwd, ...args) => execFileSync('git', ['-C', cwd, ...args], { encoding: 'buffer', maxBuffer: 1 << 30 });
const gitText = (cwd, ...args) => git(cwd, ...args).toString('utf8').trim();

const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');
const gitBlobId = (buf) => createHash('sha1').update(`blob ${buf.length}\0`).update(buf).digest('hex');

let crcTable;
function crc32(buf) {
  if (typeof zlib.crc32 === 'function') return zlib.crc32(buf) >>> 0;
  crcTable ??= Array.from({ length: 256 }, (_, n) => {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    return c >>> 0;
  });
  let c = 0xffffffff;
  for (const byte of buf) c = crcTable[(c ^ byte) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

// Minimal ZIP reader: central directory + stored/deflated entries. Enough to verify a theme archive.
function readZip(buf) {
  let eocd = -1;
  for (let i = buf.length - 22; i >= Math.max(0, buf.length - 65557); i--) {
    if (buf.readUInt32LE(i) === 0x06054b50) { eocd = i; break; }
  }
  if (eocd < 0) throw new Error('Not a zip file: end of central directory not found');
  const count = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  const entries = [];
  for (let n = 0; n < count; n++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) throw new Error(`Corrupt central directory at entry ${n}`);
    const method = buf.readUInt16LE(p + 10);
    const crc = buf.readUInt32LE(p + 16);
    const compSize = buf.readUInt32LE(p + 20);
    const nameLen = buf.readUInt16LE(p + 28);
    const extraLen = buf.readUInt16LE(p + 30);
    const commentLen = buf.readUInt16LE(p + 32);
    const local = buf.readUInt32LE(p + 42);
    const name = buf.toString('utf8', p + 46, p + 46 + nameLen);
    p += 46 + nameLen + extraLen + commentLen;
    if (name.endsWith('/')) continue;
    const dataStart = local + 30 + buf.readUInt16LE(local + 26) + buf.readUInt16LE(local + 28);
    const raw = buf.subarray(dataStart, dataStart + compSize);
    let data;
    if (method === 0) data = raw;
    else if (method === 8) data = zlib.inflateRawSync(raw);
    else throw new Error(`Unsupported compression method ${method} for ${name}`);
    entries.push({ name, data, crcOk: crc32(data) === crc });
  }
  return entries;
}

function styleVersion(css) {
  return css.match(/^[\s*]*Version\s*:\s*(.+)$/mi)?.[1].trim() ?? null;
}

function run(args) {
  if (!args.themeDir || !args.out) throw new Error('Usage: node release-package.mjs <theme-dir> --out <dir> [--ref HEAD] [--version x.y.z] [--slug name]');
  const themeDir = path.resolve(args.themeDir);
  const top = gitText(themeDir, 'rev-parse', '--show-toplevel');
  const rel = path.relative(path.resolve(top), themeDir).split(path.sep).join('/');
  const treeish = rel ? `${args.ref}:${rel}` : `${args.ref}^{tree}`;
  const blobSpec = (file) => `${args.ref}:${rel ? `${rel}/` : ''}${file}`;
  const commit = gitText(themeDir, 'rev-parse', '--verify', `${args.ref}^{commit}`);
  const slug = args.slug ?? path.basename(themeDir);

  const warnings = [];
  const failures = [];

  const dirty = gitText(top, 'status', '--porcelain', '--', rel || '.');
  if (dirty) warnings.push(`Working tree has uncommitted changes under the theme. The package uses ${args.ref} (${commit.slice(0, 12)}), not those changes.`);

  const sourceStyle = git(themeDir, 'show', blobSpec('style.css')).toString('utf8');
  const headerVersion = styleVersion(sourceStyle);
  const version = args.version ?? headerVersion;
  if (!version) throw new Error('No Version in style.css and no --version given');
  if (args.version && headerVersion !== args.version) failures.push(`--version ${args.version} does not match style.css Version ${headerVersion ?? '(missing)'}`);

  mkdirSync(args.out, { recursive: true });
  const zipPath = path.join(path.resolve(args.out), `${slug}-${version}.zip`);
  // Ignore the local core.autocrlf so the package carries the committed line endings, not this machine's.
  git(top, '-c', 'core.autocrlf=false', 'archive', '--format=zip', `--prefix=${slug}/`, '-o', zipPath, treeish);

  // Source tree as git sees it at the ref.
  const source = new Map();
  for (const line of git(top, 'ls-tree', '-r', '-z', treeish).toString('utf8').split('\0').filter(Boolean)) {
    const [meta, file] = line.split('\t');
    const [, type, id] = meta.split(' ');
    if (type === 'commit') warnings.push(`Submodule ${file} is not included by git archive`);
    else source.set(file, id);
  }

  const zipBuf = readFileSync(zipPath);
  const entries = readZip(zipBuf);
  const files = [];
  const inZip = new Set();
  const changed = [];
  const extra = [];
  for (const e of entries) {
    if (!e.name.startsWith(`${slug}/`)) { extra.push(e.name); continue; }
    const file = e.name.slice(slug.length + 1);
    inZip.add(file);
    if (!e.crcOk) failures.push(`CRC mismatch in ${file}: the archive is corrupt`);
    const expected = source.get(file);
    if (!expected) extra.push(file);
    else if (expected !== gitBlobId(e.data)) changed.push(file);
    for (const [re, label] of RISKY) if (re.test(file)) failures.push(`Packaged ${label}: ${file}`);
    files.push({ path: file, bytes: e.data.length, sha256: sha256(e.data) });
  }

  const notPackaged = [...source.keys()].filter((f) => !inZip.has(f));
  const excluded = [];
  const missing = [];
  if (notPackaged.length) {
    // export-ignore can be set on a file or on any folder above it (e.g. "tests/ export-ignore").
    // Folders need a trailing slash, or check-attr treats them as files and misses "dir/" patterns.
    const repoPath = (f) => (rel ? `${rel}/${f}` : f);
    const pathsFor = (f) => {
      const parts = f.split('/');
      return parts.map((_, i) => repoPath(parts.slice(0, i + 1).join('/')) + (i < parts.length - 1 ? '/' : ''));
    };
    const candidates = new Set(notPackaged.flatMap(pathsFor));
    const out = git(top, 'check-attr', '-z', 'export-ignore', '--', ...candidates).toString('utf8').split('\0');
    const ignored = new Set();
    for (let i = 0; i + 2 < out.length; i += 3) if (out[i + 2] === 'set') ignored.add(out[i]);
    for (const f of notPackaged) (pathsFor(f).some((p) => ignored.has(p)) ? excluded : missing).push(f);
  }
  if (missing.length) failures.push(`${missing.length} source file(s) missing from the zip without an export-ignore rule`);
  if (extra.length) failures.push(`${extra.length} file(s) in the zip that are not in the source tree`);
  if (changed.length) warnings.push(`${changed.length} file(s) differ from the git blob (export-subst or line-ending attributes): ${changed.slice(0, 5).join(', ')}`);

  const zipped = entries.find((e) => e.name === `${slug}/style.css`);
  if (!zipped) failures.push('style.css is not at the top level of the theme folder in the zip');
  else if (styleVersion(zipped.data.toString('utf8')) !== version) failures.push('style.css Version inside the zip does not match the package version');
  if (!entries.some((e) => e.name === `${slug}/index.php` || e.name === `${slug}/templates/index.html`)) {
    failures.push('Neither index.php nor templates/index.html is in the zip; WordPress will not recognise the theme');
  }

  const manifest = {
    tool: TOOL,
    toolVersion: VERSION,
    createdAt: new Date().toISOString(),
    slug,
    version,
    ref: args.ref,
    commit,
    sourcePath: rel || '.',
    zip: { file: path.basename(zipPath), bytes: zipBuf.length, sha256: sha256(zipBuf) },
    counts: { source: source.size, packaged: files.length, excludedByExportIgnore: excluded.length },
    excludedByExportIgnore: excluded.sort(),
    missing: missing.sort(),
    extra: extra.sort(),
    changedFromSource: changed.sort(),
    warnings,
    failures,
    pass: failures.length === 0,
    files: files.sort((a, b) => a.path.localeCompare(b.path)),
  };
  const manifestPath = zipPath.replace(/\.zip$/, '.manifest.json');
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');

  console.log(`${manifest.pass ? 'PASS' : 'FAIL'} ${slug} ${version} from ${args.ref} (${commit.slice(0, 12)})`);
  console.log(`  zip:      ${zipPath} (${zipBuf.length} bytes, sha256 ${manifest.zip.sha256.slice(0, 16)}…)`);
  console.log(`  manifest: ${manifestPath}`);
  console.log(`  files:    ${files.length} packaged, ${excluded.length} excluded by export-ignore`);
  warnings.forEach((w) => console.log(`  warning:  ${w}`));
  failures.forEach((f) => console.log(`  failure:  ${f}`));
  return manifest.pass ? 0 : 2;
}

try {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) console.log('Usage: node release-package.mjs <theme-dir> --out <dir> [--ref HEAD] [--version x.y.z] [--slug name]');
  else process.exitCode = run(args);
} catch (e) {
  console.error(`${TOOL}: ${e.stderr?.toString().trim() || e.message}`);
  process.exitCode = 1;
}
