# WordPress Skill Pack

![AyXDesigns WordPress and SEO skills](assets/readme-hero.jpg)

> 22 focused skills for WordPress theme delivery, SEO, and safer releases in Claude Code, Codex and other agents that read Agent Skills.

If this pack helps your work, please star the repository.

Practical agent skills for secure, editable WordPress sites and evidence-led SEO. Each skill tells the agent what to check first, which commands to run, when to stop and ask you, and what a finished result looks like.

> [!IMPORTANT]
> This is a skill pack, not a WordPress theme or plugin. It gives an agent working instructions, templates and small helper scripts. It does not install WordPress, change a website, or publish anything by itself.

## What's new in 0.2.0

- **8 new skills:** site migration, companion plugins, performance, accessibility audits, security review, local SEO, structured data, and UK privacy and consent.
- **Every existing skill rewritten:** clearer triggers, step-by-step commands (bash and PowerShell), and report templates.
- **Choices with pros and cons:** when there is a real decision (a local stack, a host, a cache plugin, an analytics tool), the agent asks about your situation, lays out the options with advantages and disadvantages, recommends one, and waits for you.
- **Bundled scripts** (Node.js 18+, no dependencies): an SEO snapshot and drift checker, a theme inventory for triage, and a verified release packager.
- **Claude Code plugin:** install the whole pack with `/plugin`.
- **MIT licence.**

## Included skills

### Route and set up

| Skill | Use it for |
| --- | --- |
| `wp-delivery-router` | Pick the smallest suitable workflow when a request is unclear or touches several areas. |
| `wp-local-stack-setup` | Choose and set up a local environment (XAMPP, wp-env, LocalWP, WordPress Studio, DDEV) on Windows, macOS or Linux, with options explained first. |
| `wp-theme-triage` | Understand an unfamiliar theme before changing it. Includes a theme inventory script. |

### Build

| Skill | Use it for |
| --- | --- |
| `wp-theme-foundations` | The baseline every theme needs: architecture, editable content, block-theme features, security, accessibility and SEO ownership. |
| `wp-site-experience-build` | Design and build a whole site or a major redesign that editors can maintain. |
| `wp-companion-plugin` | Put durable features (post types, blocks, integrations, private data) in a small plugin that survives a theme change. |
| `wp-theme-content-migrations` | Change saved settings, patterns, meta and seed data without losing edits. |
| `wp-cf7-form-assurance` | Build and test Contact Form 7 journeys, storage, spam protection and email delivery. |

### Check and release

| Skill | Use it for |
| --- | --- |
| `wp-performance` | Diagnose and fix Core Web Vitals and slow WordPress pages. |
| `wp-accessibility-audit` | Audit journeys against WCAG 2.2 AA with keyboard, screen reader and zoom testing. |
| `wp-security-review` | Review theme and plugin code and site configuration for security problems. |
| `wp-privacy-and-consent` | Cookies, consent banners, analytics and personal data under UK GDPR and PECR. |
| `wp-theme-release-gate` | Prove one exact theme package is ready to release. Includes a release packager script. |

### Publish and move

| Skill | Use it for |
| --- | --- |
| `site-preview-and-publish` | Previews, staging, choosing a host and going live, with approval at each external step. |
| `wp-site-migration` | Move a site between local, staging, production or hosts, or change its domain. |

### SEO

| Skill | Use it for |
| --- | --- |
| `wp-seo-discovery-brief` | Plan page architecture and ownership for a new site or redesign. |
| `wp-seo-build-and-release` | Implement and verify titles, canonicals, robots, sitemaps and redirects before launch. |
| `seo-structured-data` | Choose, implement and validate schema.org JSON-LD without duplicating your SEO plugin. |
| `seo-local` | Google Business Profile, NAP consistency, reviews and location pages. |
| `seo-research-and-strategy` | Research demand, competitors and backlinks, with free and paid data options. |
| `seo-content-system` | Content briefs, clusters, comparison pages and content quality. |
| `seo-measure-and-monitor` | Baselines, Search Console, Core Web Vitals and drift after releases. Includes an SEO snapshot script. |

## Install

### Claude Code plugin

Add this repository as a plugin marketplace, then install the pack:

```text
/plugin marketplace add AyXDesigns/wordpress-theme-seo-and-build
/plugin install wordpress-theme-seo-and-build@ayxdesigns
```

Plugin skills are namespaced, for example `/wordpress-theme-seo-and-build:wp-theme-triage`. You rarely need to type them: Claude picks the right skill from your request.

### skills CLI (Claude Code, Codex and others)

The [`skills` CLI](https://github.com/vercel-labs/skills) installs individual skills.

Install every skill globally for Claude Code:

```bash
npx skills add AyXDesigns/wordpress-theme-seo-and-build --skill '*' -g -a claude-code -y
```

Install every skill globally for Codex:

```bash
npx skills add AyXDesigns/wordpress-theme-seo-and-build --skill '*' -g -a codex -y
```

Install one skill for the current project:

```bash
npx skills add AyXDesigns/wordpress-theme-seo-and-build --skill wp-theme-triage -a claude-code
```

### Manual installation

Copy one or more folders from `skills/` into your agent's skills folder.

| Agent | Global folder | Project folder |
| --- | --- | --- |
| Claude Code | `~/.claude/skills/` | `.claude/skills/` |
| Codex | `~/.codex/skills/` | `.agents/skills/` |

Restart the agent or start a new session if it does not find the new skills straight away. Every skill works on its own; where one skill hands off to another, it says what to do if that skill is not installed.

## How to use the pack

Ask in your own words. The agent picks the relevant skill from its description.

```text
Set up a local WordPress site for a new client theme. I'm on a Mac and have never used Docker.

Review this inherited theme and tell me the lowest-risk way to make the homepage editable.

Move the staging site to production on the new host. Nothing goes live until I say so.

Our pages dropped out of Google after last week's release. Compare against the baseline.

Do we need a cookie banner for Google Analytics on a UK charity site?
```

For a request that spans several areas, start with `wp-delivery-router`.

## Bundled scripts

All scripts need Node.js 18 or later and nothing else. Run them with `--help` for options.

| Script | What it does |
| --- | --- |
| `skills/wp-theme-triage/scripts/theme-inventory.mjs` | Reads a theme folder and reports its type, `theme.json` settings, templates, patterns, plugin dependencies (and missing availability guards) and features that belong in a plugin. |
| `skills/wp-theme-release-gate/scripts/release-package.mjs` | Builds a theme zip from a git ref, re-reads it to prove it matches the source, flags risky files, and writes a manifest with SHA-256 hashes. |
| `skills/seo-measure-and-monitor/scripts/seo-snapshot.mjs` | Records status, redirects, titles, canonicals, robots, H1s, hreflang, JSON-LD and sitemap inclusion for a list of URLs, and compares two snapshots by severity. |
| `scripts/validate-skills.mjs` | Checks every skill's format and links and scans the repository for personal data before a release. |

Only point the SEO snapshot at sites you own or are authorised to test.

## Operating principles

- Visitor-facing copy stays editable through the agreed WordPress surface.
- Saved content, settings, form records and metadata are treated as real data, not disposable fixtures.
- Local, staging, preview and production stay distinct.
- Installing software, deploying, paid services, new plugins and destructive changes need your explicit approval.
- When there is a real choice, you see the options with their trade-offs before anything changes.
- A success message is not proof. Release claims need observable evidence.
- Version-sensitive facts (WordPress, PHP, Google, legal guidance) are dated and should be re-checked against the official source.

## Repository layout

```text
.claude-plugin/        Claude Code plugin manifest and marketplace file
skills/<name>/
  SKILL.md             instructions the agent loads
  references/          templates and detail loaded on demand
  scripts/             optional helper scripts
evals/                 test prompts for claude plugin eval
scripts/               repository tooling
CONTRIBUTING.md        house style for writing skills
VALIDATION.md          release validation scenarios
```

## Contributing and validation

Read [CONTRIBUTING.md](CONTRIBUTING.md) before changing a skill. Before a release, run `node scripts/validate-skills.mjs`, the scenarios in [VALIDATION.md](VALIDATION.md), and the eval suite with `claude plugin eval .`.

## Provenance and licence

The instructions in this repository are original. See [ORIGIN.md](ORIGIN.md).

Released under the [MIT licence](LICENSE). Copyright (c) 2026 AyXDesigns.
