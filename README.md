<div align="center">

<img src="assets/readme-hero.jpg" alt="AyXDesigns WordPress and SEO skills for Codex and Claude Code" width="100%">

<h1>WordPress Skill Pack</h1>

<p><strong>22 agent skills for building, shipping and ranking WordPress sites, without surprises.</strong><br>
For Claude Code, Codex and any agent that reads Agent Skills.</p>

<p>
<a href="https://github.com/AyXDesigns/wordpress-theme-seo-and-build/releases/latest"><img alt="Latest release" src="https://img.shields.io/github/v/release/AyXDesigns/wordpress-theme-seo-and-build?label=release&color=21759b"></a>
<a href="LICENSE"><img alt="MIT licence" src="https://img.shields.io/badge/licence-MIT-21759b"></a>
<img alt="22 skills" src="https://img.shields.io/badge/skills-22-21759b">
<img alt="Checked against WordPress 7.1" src="https://img.shields.io/badge/WordPress-7.1-21759b?logo=wordpress&logoColor=white">
</p>

<p>
<a href="#install">Install</a> ·
<a href="#how-the-skills-behave">How they behave</a> ·
<a href="#the-skills">The skills</a> ·
<a href="#bundled-scripts">Scripts</a> ·
<a href="#contributing">Contributing</a>
</p>

</div>

<br>

Each skill tells your agent what to check first, which commands to run, when to stop and ask you, and what a finished result looks like. The pack covers the whole life of a site: local setup, theme architecture, forms, performance, accessibility, security, privacy, migration, release and SEO.

> [!IMPORTANT]
> This is a skill pack, not a WordPress theme or plugin. It gives an agent working instructions, templates and small helper scripts. It never installs WordPress, changes a website or publishes anything by itself.

## Install

**Claude Code plugin.** Add the marketplace once, then install the pack:

```text
/plugin marketplace add AyXDesigns/wordpress-theme-seo-and-build
/plugin install wordpress-theme-seo-and-build@ayxdesigns
```

Then ask in your own words. Claude picks the right skill from your request.

<details>
<summary><strong>Install with the skills CLI (Claude Code, Codex and others)</strong></summary>

<br>

The [`skills` CLI](https://github.com/vercel-labs/skills) installs individual skills.

Every skill, globally, for Claude Code:

```bash
npx skills add AyXDesigns/wordpress-theme-seo-and-build --skill '*' -g -a claude-code -y
```

Every skill, globally, for Codex:

```bash
npx skills add AyXDesigns/wordpress-theme-seo-and-build --skill '*' -g -a codex -y
```

One skill, for the current project:

```bash
npx skills add AyXDesigns/wordpress-theme-seo-and-build --skill wp-theme-triage -a claude-code
```

</details>

<details>
<summary><strong>Install by hand</strong></summary>

<br>

Copy one or more folders from `skills/` into your agent's skills folder:

| Agent | Global folder | Project folder |
| --- | --- | --- |
| Claude Code | `~/.claude/skills/` | `.claude/skills/` |
| Codex | `~/.codex/skills/` | `.agents/skills/` |

Restart the agent or start a new session if it does not find the new skills straight away. Every skill works on its own; where one hands off to another, it says what to do if that skill is not installed.

</details>

## How the skills behave

Ask the way you would ask a colleague:

```text
Set up a local WordPress site for a new client theme. I'm on a Mac and have never used Docker.

Review this inherited theme and tell me the lowest-risk way to make the homepage editable.

Move the staging site to production on the new host. Nothing goes live until I say so.

Our pages dropped out of Google after last week's release. Compare against the baseline.

Do we need a cookie banner for Google Analytics on a UK charity site?
```

When a request involves a real decision, such as a local stack, a host, a cache plugin or an analytics tool, the agent asks about your situation, lays out the options with their advantages and disadvantages, recommends one and waits for your answer. For example, the first request above gets a reply along these lines:

> A few quick questions first: which macOS version, and do you need to share this setup with a team? Based on what you've said, these suit you best:
>
> - **LocalWP.** A desktop app with one-click sites and built-in email capture. Free. Heavier than Studio and less suited to config shared in a repository.
> - **WordPress Studio.** Very quick to start, no Docker, open source. Its database setup differs from most live hosts, so it is a looser match for production.
>
> I'd recommend LocalWP, because it matches a typical host more closely. Which would you like? Nothing is installed until you choose.

Underneath, every skill follows the same rules:

- Visitor-facing copy stays editable through the agreed WordPress surface.
- Saved content, settings, form records and metadata are real data, not disposable fixtures.
- Local, staging, preview and production stay distinct.
- Installing software, deploying, paid services, new plugins and destructive changes need your explicit approval.
- A success message is not proof. Claims about a release need evidence you can see.
- Version-sensitive facts (WordPress, PHP, Google, legal guidance) are dated and re-checked against the official source.

## The skills

Not sure where to start? `wp-delivery-router` reads a mixed or vague request and picks one primary skill, plus only the checks the task needs.

### Set up

- **[`wp-delivery-router`](skills/wp-delivery-router/SKILL.md)** chooses the smallest suitable workflow when a request is unclear or spans several areas.
- **[`wp-local-stack-setup`](skills/wp-local-stack-setup/SKILL.md)** chooses and sets up a local environment (XAMPP, wp-env, LocalWP, WordPress Studio, DDEV) on Windows, macOS or Linux.
- **[`wp-theme-triage`](skills/wp-theme-triage/SKILL.md)** explains an unfamiliar theme before anyone changes it.

### Build

- **[`wp-theme-foundations`](skills/wp-theme-foundations/SKILL.md)** sets the baseline every theme needs: architecture, editable content, block-theme features, security, accessibility and SEO ownership.
- **[`wp-site-experience-build`](skills/wp-site-experience-build/SKILL.md)** designs and builds a whole site, or a major redesign, that editors can maintain.
- **[`wp-companion-plugin`](skills/wp-companion-plugin/SKILL.md)** keeps post types, blocks, integrations and private data in a small plugin that survives a theme change.
- **[`wp-theme-content-migrations`](skills/wp-theme-content-migrations/SKILL.md)** changes saved settings, patterns, meta and seed data without losing edits.
- **[`wp-cf7-form-assurance`](skills/wp-cf7-form-assurance/SKILL.md)** builds and tests Contact Form 7 journeys, storage, spam protection and email delivery.

### Check

- **[`wp-performance`](skills/wp-performance/SKILL.md)** diagnoses and fixes Core Web Vitals and slow pages.
- **[`wp-accessibility-audit`](skills/wp-accessibility-audit/SKILL.md)** audits journeys against WCAG 2.2 AA with keyboard, screen reader and zoom testing.
- **[`wp-security-review`](skills/wp-security-review/SKILL.md)** reviews theme and plugin code and site configuration for security problems.
- **[`wp-privacy-and-consent`](skills/wp-privacy-and-consent/SKILL.md)** handles cookies, consent banners, analytics and personal data under UK GDPR and PECR.

### Ship

- **[`wp-theme-release-gate`](skills/wp-theme-release-gate/SKILL.md)** proves one exact theme package is ready to release.
- **[`site-preview-and-publish`](skills/site-preview-and-publish/SKILL.md)** covers previews, staging, choosing a host and going live, with your approval at each external step.
- **[`wp-site-migration`](skills/wp-site-migration/SKILL.md)** moves a site between local, staging, production or hosts, or changes its domain.

### Search

- **[`wp-seo-discovery-brief`](skills/wp-seo-discovery-brief/SKILL.md)** plans page architecture and ownership for a new site or redesign.
- **[`wp-seo-build-and-release`](skills/wp-seo-build-and-release/SKILL.md)** implements and verifies titles, canonicals, robots, sitemaps and redirects before launch.
- **[`seo-structured-data`](skills/seo-structured-data/SKILL.md)** chooses, adds and validates schema.org JSON-LD without duplicating your SEO plugin.
- **[`seo-local`](skills/seo-local/SKILL.md)** covers Google Business Profile, consistent business details, reviews and location pages.
- **[`seo-research-and-strategy`](skills/seo-research-and-strategy/SKILL.md)** researches demand, competitors and backlinks, with free and paid data options.
- **[`seo-content-system`](skills/seo-content-system/SKILL.md)** handles content briefs, topic clusters, comparison pages and content quality.
- **[`seo-measure-and-monitor`](skills/seo-measure-and-monitor/SKILL.md)** owns baselines, Search Console, Core Web Vitals and drift after each release.

## Bundled scripts

Three skills carry a small helper script. Each needs Node.js 18 or later and nothing else.

- **[`theme-inventory.mjs`](skills/wp-theme-triage/scripts/theme-inventory.mjs)** reads a theme folder and reports its type, `theme.json` settings, templates and patterns. It also flags plugin calls with no availability check and features that belong in a plugin.
- **[`release-package.mjs`](skills/wp-theme-release-gate/scripts/release-package.mjs)** builds a theme zip from a git ref, re-reads it to prove it matches the source, flags risky files such as `.env`, and writes a manifest of SHA-256 hashes.
- **[`seo-snapshot.mjs`](skills/seo-measure-and-monitor/scripts/seo-snapshot.mjs)** records status, redirects, titles, canonicals, robots, H1s, hreflang, JSON-LD and sitemap inclusion for a list of URLs. It also compares two snapshots and rates each change critical, warning or info.

Add `--help` to any script to see its options. A before-and-after check of a release looks like this:

```bash
node seo-snapshot.mjs --urls urls.txt --out before.json
node seo-snapshot.mjs --urls urls.txt --out after.json
node seo-snapshot.mjs --diff before.json after.json --md --fail-on critical
```

Only point the snapshot at sites you own or are authorised to test.

## What's new in 0.2.0

Eight new skills, every existing skill rewritten with concrete commands and report templates, the three bundled scripts, Claude Code plugin packaging and an MIT licence. See the [release notes](https://github.com/AyXDesigns/wordpress-theme-seo-and-build/releases/tag/v0.2.0) or the [changelog](CHANGELOG.md).

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) before changing a skill. It sets the house style for descriptions, workflows, choices and commands. Before a release, run:

```bash
node scripts/validate-skills.mjs
claude plugin eval .
```

and work through the scenarios in [VALIDATION.md](VALIDATION.md).

<details>
<summary><strong>Repository layout</strong></summary>

<br>

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

</details>

## Licence

Released under the [MIT licence](LICENSE). Copyright (c) 2026 AyXDesigns. The instructions in this repository are original; see [ORIGIN.md](ORIGIN.md).

If this pack helps your work, please star the repository.
