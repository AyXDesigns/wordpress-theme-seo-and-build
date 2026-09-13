---
name: wp-theme-triage
description: Inspect an unfamiliar WordPress theme before changes, identifying its canonical source, content ownership, dependencies, data risks, and proportionate verification plan.
---

# WordPress theme triage

Use this before modifying an unfamiliar theme or after major structural/tooling changes. Produce a read-only report first.

## Establish the project facts

Identify:

- canonical source directory and any deployed or preview copies;
- classic, block, hybrid, child-theme, and companion-plugin boundaries;
- WordPress, PHP, plugin, and local-server versions relevant to the task;
- where public copy, repeated content, settings, forms, structured data, and media are owned;
- build, test, deployment, rollback, and release-package conventions;
- existing instructions, tests, changelog, known defects, and unresolved migrations.

Treat a saved setting, stored meta value, or old form record as production-like data. Do not assume a code default will replace it.

## Report format

Return:

1. Project classification and canonical source.
2. Relevant files and ownership boundaries.
3. Dependencies and safe degraded states.
4. Saved-data and deployment risks.
5. Smallest sufficient test plan.
6. Explicit assumptions, unknowns, and actions requiring authorisation.

Do not edit, seed, activate, deploy, remove, or overwrite anything during triage unless separately asked.
