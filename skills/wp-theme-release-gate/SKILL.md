---
name: wp-theme-release-gate
description: Verify one exact WordPress theme release candidate through syntax, runtime, dependency, accessibility, responsive, data-compatibility, and package-integrity evidence.
---

# WordPress theme release gate

Use for a release candidate, deployment-readiness review, or evidence-led release investigation. Work from the canonical source and identify the exact candidate version first.

## Release evidence

Check only criteria that apply to the theme, but record each check, command, environment, result, and accepted limitation.

- PHP and seed files parse cleanly.
- Representative routes return the intended response and leave no relevant debug-log entries.
- Public routes tolerate missing optional dependencies, especially a deactivated Contact Form 7 integration.
- Forms are tested end to end, including stored-record verification and relevant cache behaviour.
- Editable content, activation, and migrations work on both clean-install and upgrade fixtures.
- When block-theme changes were exported from the editor, the committed source is reviewed against the export and does not accidentally include site-specific data or unreviewed assets.
- Keyboard, no-JavaScript, reduced-motion, zoom, narrow/medium/wide responsive states, focus visibility, contrast, overflow, and plugin-style interactions are checked on representative templates.
- Rendered output, not only source templates, is checked for escaping, metadata/schema ownership, and user-visible copy.
- When the release also ships a companion plugin, run the current official WordPress Plugin Check where it applies and record any justified exceptions. Do not treat a plugin-only checker as theme proof.
- Version metadata, changelog, install notes, decision records, and release manifest match the candidate.
- The archive is created from a fresh source walk, passes an archive integrity check, and matches the intended source tree.

## Output

Return a release manifest with candidate version, environment versions, dependencies, migrations, manual production actions, evidence, known limitations, rollback artifact, and a clear pass/fail decision.

Do not deploy, activate on production, or make destructive cleanup changes unless separately authorised.
