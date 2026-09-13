---
name: wp-theme-foundations
description: Apply a reusable WordPress theme baseline covering architecture, editable content, templates, assets, security, accessibility, integrations, SEO, performance, testing, and release readiness.
---

# WordPress theme foundations

Use when creating a theme, substantially extending one, reviewing its basic architecture, or deciding what a theme must contain. Do not use it as a reason to rebuild a stable theme for a narrow change.

Read [references/theme-foundations.md](references/theme-foundations.md) before planning or implementing broad theme work. Apply only sections relevant to the confirmed theme type and project requirements.

## Working contract

1. Inspect the repository, environment, content ownership, dependencies, and production constraints.
2. Choose classic, block, hybrid, or child-theme architecture deliberately.
3. Define page types, content states, editor surfaces, plugin boundaries, and integration ownership before coding.
4. Implement the smallest coherent structure that meets those contracts.
5. Verify editor and visitor behaviour, clean-install and upgrade behaviour where applicable, and the exact release artifact.

For block-theme work, keep an explicit boundary between stable WordPress capabilities and optional experimental-editor work. Do not require a development plugin or experimental feature for ordinary production delivery without a confirmed compatibility and release plan.

Project requirements override generic examples. Verify version-sensitive WordPress behaviour against current official documentation for the target version.

Do not deploy, alter production data, install dependencies, or replace existing configuration without the authority required for that action.
