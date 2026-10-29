# Changelog

## 0.2.0 - 2026-10-29

### Added

- Eight new skills: `wp-site-migration`, `wp-companion-plugin`, `wp-performance`, `wp-accessibility-audit`, `wp-security-review`, `seo-local`, `seo-structured-data` and `wp-privacy-and-consent`.
- Bundled zero-dependency Node.js scripts: `theme-inventory.mjs` (triage), `release-package.mjs` (verified theme zip and manifest) and `seo-snapshot.mjs` (SEO snapshot and severity-rated drift diff).
- `scripts/validate-skills.mjs` to check skill format, links, routing and personal data before a release.
- Claude Code plugin manifest and marketplace file, so the pack installs with `/plugin`.
- Eval cases under `evals/` for `claude plugin eval`.
- `CONTRIBUTING.md` house style for writing skills.

### Changed

- Rewrote all 14 existing skills: descriptions now say when to use each skill and include the words people actually type; workflows include concrete WP-CLI, bash and PowerShell commands; reports use templates in `references/`.
- Skills now ask about the user's situation and present options with advantages and disadvantages before any real choice, then wait for a decision.
- `wp-local-stack-setup` now covers Windows, macOS and Linux with XAMPP, wp-env, LocalWP, WordPress Studio and DDEV.
- `wp-theme-foundations` reference updated for WordPress 7.1 block-theme features.
- `wp-delivery-router` routes to every skill in the pack and no longer refers to workflows that do not exist. Baselines and drift now have one owner, `seo-measure-and-monitor`.
- Skills no longer link to files in other skill folders, so each works when installed on its own.
- Licence changed from all rights reserved to MIT.

## 0.1.0 - 2026-09-12

- Initial AyXDesigns WordPress skill pack.
- Added theme triage, content migration, Contact Form 7 assurance, release gate, SEO discovery and SEO build/release skills.
- Added XAMPP and WP-CLI local-stack setup, site build, preview/publish, SEO research, SEO content and SEO measurement workflows.
- Added the delivery router and a general WordPress theme foundations skill with a reusable reference.
