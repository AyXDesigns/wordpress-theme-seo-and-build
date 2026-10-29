# Contributing and authoring guide

This guide is the house style for every skill in the pack. Follow it when you add a skill or change one, so the pack stays consistent and agents behave predictably.

## Skill layout

```text
skills/<skill-name>/
  SKILL.md              required: frontmatter + instructions
  references/           optional: templates, checklists, deep detail loaded on demand
  scripts/              optional: zero-dependency Node.js (>= 18) helpers
```

- The directory name and the `name` field must match: lowercase letters, digits and single hyphens, 64 characters at most.
- Keep `SKILL.md` under about 250 lines. Move long checklists, report templates and background into `references/`.
- Link only to files inside the skill's own folder, one level deep (`references/x.md`, `scripts/x.mjs`). Skills are installed one at a time, so a path such as `../other-skill/` may not exist.
- Mention another skill by name in backticks, with "if installed", for example "use `wp-site-migration` if installed". Say what to do when it is not installed.

## Frontmatter

```yaml
---
name: wp-example-skill
description: <what it does>. Use when <situations>, or when the user mentions <words people actually type>. <one line on what it does not cover, if confusion is likely>.
license: MIT
metadata:
  author: AyXDesigns
  version: "0.2.0"
---
```

The `description` is the only part an agent reads before it decides to load the skill, so it carries all the routing.

- Say what the skill does, then "Use when…" with concrete situations.
- Include everyday trigger words: plugin and tool names (Yoast, Rank Math, Search Console, LocalWP, Contact Form 7), symptoms ("emails not arriving", "site is slow", "pages not indexed") and file names (`theme.json`, `wp-config.php`).
- Name the nearest neighbour skill when the two are easy to confuse ("For moving a site between hosts, use `wp-site-migration`").
- Aim for 300–800 characters. The hard limit is 1024.

## Body structure

Use these sections, in this order, leaving out any that do not apply:

1. `# Title` and one or two sentences on scope.
2. `## Before you start`: facts to confirm, and what to ask the user if they are unknown.
3. `## Workflow`: numbered steps. Each step says what to do, how to do it (commands) and what counts as done.
4. Decision tables for choices the agent makes.
5. `## Ask before acting`: actions that need explicit user approval.
6. `## Output`: what to hand back, linking a template in `references/`.

## Offering choices to the user

Whenever a step involves a real choice (a local stack, a host, a plugin, a data source, a paid service, a migration method), the skill must tell the agent to:

1. Ask the questions needed to understand the user's situation first.
2. Present 2–4 options. For each give **advantages**, **disadvantages**, cost or effort, and who it suits.
3. Recommend one, with the reason, based on what the user said.
4. Wait for the user's choice before installing, changing or publishing anything.

Phrase it so it works in any agent: "present the options as a short question with choices" rather than naming one tool.

## Commands

- Show commands in fenced blocks. Where Windows PowerShell differs from bash, give both.
- Prefer WP-CLI with an explicit `--path=` and read-only commands first (`wp option get`, `wp theme list`, `--dry-run`).
- Use placeholders, never real values: `example.com`, `example.test`, `wp_example`, `<db-name>`, `<theme-slug>`.
- Never print secrets. Reading `wp-config.php` means reading only the constants needed, never echoing passwords or salts.

## Version-sensitive facts

WordPress, PHP, browser and search-engine facts go out of date. Write them as "as of <date/version>", give the official source, and tell the agent to re-check it. Facts confirmed for this release (October 2026):

- Latest WordPress: 7.1 (7.1.4 maintenance release, 28 October 2026). Next major: 7.2, in beta and planned for December 2026.
- WordPress 7.0 and 7.1 support PHP 7.4 to 8.5. WordPress recommends PHP 8.3 or later, and MySQL 8.0+ or MariaDB 10.11+.
- WordPress 7.1 adds responsive styles in `theme.json` (`settings.viewport`, `@mobile`/`@tablet` keys), an always-iframed post editor, client-side media processing with AVIF/HEIC support, and Tabs and Playlist blocks.
- WordPress 7.0 added client-side Abilities API support, broader content-only editing (`"role": "content"` in `block.json`) and pattern overrides for custom blocks through `block_bindings_supported_attributes`.

Sources: <https://wordpress.org/about/requirements/>, <https://make.wordpress.org/core/handbook/references/php-compatibility-and-wordpress-versions/>, <https://wordpress.org/news/category/releases/>.

## Writing style

- British English (organisation, licence, authorise).
- Plain, direct instructions. Prefer "Check that the form saves a Flamingo record" to "verify persisted-record integrity".
- Short guardrails: one "Ask before acting" list, not the same warning in every section.
- No client names, real domains, email addresses, credentials, local file paths or copied third-party text.

## Before you open a pull request

- Run `node scripts/validate-skills.mjs` from the repository root.
- Run the relevant scenarios in [VALIDATION.md](VALIDATION.md) and the prompts in `evals/`.
- Scan the diff for personal data, credentials, production URLs and copied material. Commit with your GitHub no-reply email address.
