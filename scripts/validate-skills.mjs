#!/usr/bin/env node
// validate-skills: check every skill against the Agent Skills format and this pack's house rules,
// and scan the repository for personal data or secrets before a release.
// Zero dependencies. Requires Node.js 18 or later. Run from anywhere:
//
//   node scripts/validate-skills.mjs
//
// Exit code 0 = no errors (warnings allowed), 1 = errors found.

import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SKILLS = path.join(ROOT, 'skills');
const NAME_RE = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const TEXT_EXT = new Set(['.md', '.mjs', '.js', '.json', '.txt', '.php', '.html', '.css', '.yml', '.yaml', '']);
const SKIP = new Set(['.git', 'node_modules', 'assets']);

const errors = [];
const warnings = [];
const err = (where, msg) => errors.push(`${where}: ${msg}`);
const warn = (where, msg) => warnings.push(`${where}: ${msg}`);
const rel = (p) => path.relative(ROOT, p).split(path.sep).join('/');

// Small YAML subset: "key: value", quoted values, block scalars (| >), one nested map level.
function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
  if (!m) return null;
  const data = {};
  const lines = m[1].split(/\r?\n/);
  let parent = null;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith('#')) continue;
    const kv = line.match(/^(\s*)([\w-]+):\s*(.*)$/);
    if (!kv) continue;
    const [, indent, key, raw] = kv;
    let value = raw.trim();
    if (/^[|>][+-]?$/.test(value)) {
      const block = [];
      while (i + 1 < lines.length && (/^\s+\S/.test(lines[i + 1]) || !lines[i + 1].trim())) block.push(lines[++i].trim());
      value = value.startsWith('|') ? block.join('\n') : block.join(' ').replace(/\s+/g, ' ');
    } else {
      value = value.replace(/^(["'])([\s\S]*)\1$/, '$2');
    }
    if (indent.length && parent) data[parent][key] = value;
    else if (value === '') { data[key] = {}; parent = key; }
    else { data[key] = value; parent = null; }
  }
  return { data, body: text.slice(m[0].length) };
}

function checkSkill(dir, packVersion) {
  const name = path.basename(dir);
  const file = path.join(dir, 'SKILL.md');
  const where = `skills/${name}`;
  if (!existsSync(file)) return err(where, 'missing SKILL.md');
  const text = readFileSync(file, 'utf8');
  const fm = parseFrontmatter(text);
  if (!fm) return err(where, 'SKILL.md has no YAML frontmatter');
  const { data, body } = fm;

  if (data.name !== name) err(where, `name "${data.name}" must match the folder name`);
  if (!NAME_RE.test(name) || name.length > 64) err(where, 'folder name must be lowercase letters, digits and single hyphens, 64 characters at most');

  const d = typeof data.description === 'string' ? data.description : '';
  if (!d) err(where, 'description is missing');
  else {
    if (d.length > 1024) err(where, `description is ${d.length} characters; the limit is 1024`);
    if (d.length < 200) warn(where, `description is only ${d.length} characters; aim for 300–800 with trigger words`);
    if (!/\buse (it )?when\b/i.test(d)) warn(where, 'description should say "Use when…"');
  }
  if (!data.license) warn(where, 'license is missing');
  if (!data.metadata?.version) warn(where, 'metadata.version is missing');
  else if (packVersion && data.metadata.version !== packVersion) warn(where, `metadata.version ${data.metadata.version} differs from plugin version ${packVersion}`);

  const lines = body.split(/\r?\n/).length;
  if (lines > 500) err(where, `SKILL.md body is ${lines} lines; the limit is 500`);
  else if (lines > 300) warn(where, `SKILL.md body is ${lines} lines; move detail into references/`);

  const allMd = [file, ...listFiles(dir).filter((f) => f.endsWith('.md') && f !== file)];
  for (const md of allMd) {
    const src = readFileSync(md, 'utf8');
    const base = path.dirname(md);
    for (const [, target] of src.matchAll(/\]\(([^)\s]+)\)/g)) {
      if (/^(https?:|mailto:|#)/.test(target)) continue;
      const clean = decodeURI(target.split('#')[0]);
      if (clean.includes('..')) err(rel(md), `link "${target}" leaves the skill folder; skills are installed one at a time`);
      else if (!existsSync(path.join(base, clean))) err(rel(md), `broken link "${target}"`);
    }
  }
  for (const [, ref] of body.matchAll(/`((?:references|scripts)\/[\w./-]+)`/g)) {
    if (!existsSync(path.join(dir, ref))) err(where, `mentions ${ref}, which does not exist`);
  }
  return { name, description: d };
}

function listFiles(dir) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    if (SKIP.has(e.name)) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...listFiles(full));
    else out.push(full);
  }
  return out;
}

// Personal data and secret patterns. Placeholders and documentation ranges are allowed.
const ALLOWED_EMAIL = /@(example\.(com|org|net|test)|users\.noreply\.github\.com|anthropic\.com)$/i;
const DOC_IP = /^(127\.|0\.0\.0\.0|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|192\.0\.2\.|198\.51\.100\.|203\.0\.113\.|255\.)/;
const SECRET_PATTERNS = [
  [/\bgh[pousr]_[A-Za-z0-9]{20,}/, 'GitHub token'],
  [/\bsk-(ant-)?[A-Za-z0-9_-]{20,}/, 'API secret key'],
  [/\bAKIA[0-9A-Z]{16}\b/, 'AWS access key'],
  [/\bxox[abpr]-[A-Za-z0-9-]{10,}/, 'Slack token'],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'private key'],
  [/\bAIza[0-9A-Za-z_-]{35}\b/, 'Google API key'],
];

function scanPrivacy() {
  for (const file of listFiles(ROOT)) {
    if (!TEXT_EXT.has(path.extname(file)) || statSync(file).size > 2_000_000) continue;
    if (rel(file) === 'scripts/validate-skills.mjs') continue;
    const lines = readFileSync(file, 'utf8').split(/\r?\n/);
    lines.forEach((line, i) => {
      const at = `${rel(file)}:${i + 1}`;
      for (const [email] of line.matchAll(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/g)) {
        if (!ALLOWED_EMAIL.test(email)) err(at, `email address "${email}"; use a placeholder such as name@example.com`);
      }
      for (const [ip] of line.matchAll(/\b(?:\d{1,3}\.){3}\d{1,3}\b/g)) {
        if (!DOC_IP.test(ip) && !/version|v\d/i.test(line)) warn(at, `IP address ${ip}; use 192.0.2.x or another documentation range`);
      }
      if (/[A-Z]:\\Users\\(?!<|you\b|name\b|example\b)[A-Za-z0-9._-]+/i.test(line) || /\/(Users|home)\/(?!<|you\b|name\b|example\b|runner\b)[a-z0-9._-]+\//i.test(line)) {
        warn(at, 'looks like a real local user path; use a placeholder such as C:\\Users\\<you>');
      }
      for (const [re, label] of SECRET_PATTERNS) if (re.test(line)) err(at, `possible ${label}`);
    });
  }
}

function crossCheck(skills) {
  const names = skills.map((s) => s.name);
  const readme = existsSync(path.join(ROOT, 'README.md')) ? readFileSync(path.join(ROOT, 'README.md'), 'utf8') : '';
  for (const n of names) if (!readme.includes(`\`${n}\``)) warn('README.md', `skill ${n} is not listed`);
  const routerFile = path.join(SKILLS, 'wp-delivery-router', 'SKILL.md');
  if (existsSync(routerFile)) {
    const router = readFileSync(routerFile, 'utf8');
    for (const n of names) if (n !== 'wp-delivery-router' && !router.includes(`\`${n}\``)) warn('wp-delivery-router', `does not route to ${n}`);
    for (const [, n] of router.matchAll(/\|\s*`([a-z0-9-]+)`\s*\|/g)) if (!names.includes(n)) err('wp-delivery-router', `routes to ${n}, which is not in the pack`);
  }
}

function packVersion() {
  const f = path.join(ROOT, '.claude-plugin', 'plugin.json');
  if (!existsSync(f)) return null;
  try { return JSON.parse(readFileSync(f, 'utf8')).version ?? null; } catch (e) { err('.claude-plugin/plugin.json', `invalid JSON: ${e.message}`); return null; }
}

const version = packVersion();
const skills = readdirSync(SKILLS, { withFileTypes: true })
  .filter((e) => e.isDirectory())
  .map((e) => checkSkill(path.join(SKILLS, e.name), version))
  .filter(Boolean);
crossCheck(skills);
scanPrivacy();

console.log(`Checked ${skills.length} skills${version ? ` against plugin version ${version}` : ''}.`);
warnings.forEach((w) => console.log(`warning  ${w}`));
errors.forEach((e) => console.log(`ERROR    ${e}`));
console.log(`${errors.length} error(s), ${warnings.length} warning(s).`);
process.exitCode = errors.length ? 1 : 0;
