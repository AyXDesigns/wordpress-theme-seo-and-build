---
name: wp-theme-content-migrations
description: Safely change WordPress theme content contracts, including settings, repeaters, seeders, and stored records, while preserving edited data and providing upgrade evidence.
---

# WordPress theme content migrations

Use when a change affects persisted content or configuration: theme settings, Customizer data, block/pattern content, repeaters, form mappings, custom-post meta, seed data, or a field's meaning.

## Preserve the content contract

- Identify the editing surface and the data source before editing a template.
- Keep defaults and editor controls aligned. Verify that the front end and editor use compatible keys, sanitisation, and fallback behaviour.
- Keep repeated content easy for the intended editor to maintain. Define its delimiter, field count, escaping, and malformed-line behaviour.
- Match saved-value sanitisation to permitted rendered markup. Never silently remove editorial markup that the interface appears to support.
- Guard request values before type-specific sanitisation. Public endpoints must reject non-scalar values safely.

## Migration contract

For each stored-data change, state:

1. Existing-data shape and new-data shape.
2. Whether the transformation is needed, idempotent, and reversible.
3. What happens to user-edited content.
4. How absent dependencies and incomplete records are handled.
5. How cache/transient invalidation is scoped.
6. How results, failures, and manual follow-up are reported without logging sensitive content.

Use a dry run where possible. Do not overwrite edited content merely to make a fixture match a default.

## Editor-exported block themes

Treat exporting or saving block-theme customisations as a source migration, not a harmless editor action. Before export, identify which editor changes should become versioned theme files and preserve a recoverable snapshot of the existing source and site state.

- Export to an isolated working copy first; do not overwrite the canonical theme blindly.
- Review every changed template, template part, pattern, style, asset, and translation-facing string before merging it into source control.
- Confirm that site-specific settings, navigation assignments, content, or plugin data have not been mistaken for portable theme source.
- Re-import or activate the candidate in a clean local fixture and an upgrade fixture before calling the export complete.

## Verification

Test both a clean install and an upgrade fixture with realistic edited values and old records. Re-run the migration. Confirm preserved edits, expected new fields, safe handling of missing values, and no unexpected duplicate records.
