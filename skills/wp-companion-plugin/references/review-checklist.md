# Companion plugin review checklist

Run this before the plugin reaches staging, and again before each release. Record evidence (command output, screenshot reference or a short note) for every item. An item may be marked "exception" only with a reason and the approver's role.

## Scope and placement

- [ ] Every feature in the plugin is durable functionality (content model, data, endpoints, integrations); presentation stays in the theme.
- [ ] The plugin, mu-plugin or theme choice was offered to the user and recorded.
- [ ] Existing post type slugs, taxonomy slugs, meta keys, option names, shortcode tags and REST namespaces are unchanged, or a migration step is documented and tested.
- [ ] Code moved from the theme has been removed from it in a planned step, with no duplicate definitions.

## Header and identity

- [ ] `Plugin Name`, `Version`, `Requires at least`, `Requires PHP`, `License`, `Text Domain` and `Domain Path` are present and correct.
- [ ] `Update URI` is set for a private plugin, so a directory plugin with the same slug cannot overwrite it.
- [ ] `Requires Plugins` lists only WordPress.org slugs for hard dependencies; soft or non-directory dependencies are checked at runtime with an admin notice.
- [ ] The `Version` header, the version constant and the changelog agree.

## Naming

- [ ] All functions, classes, constants, options, transients, hooks, script handles and shortcode tags are prefixed or namespaced.
- [ ] Post type names are 20 characters or fewer; taxonomy names 32 or fewer.
- [ ] No generic names likely to clash (`settings`, `init`, `helpers`).

## Lifecycle

- [ ] Activation registers content types, flushes rewrite rules once and stores the schema version.
- [ ] An upgrade routine compares the stored schema version on load and is idempotent (safe to run twice).
- [ ] Deactivation clears the plugin's scheduled events and flushes rewrite rules, and deletes no data.
- [ ] `uninstall.php` starts with the `WP_UNINSTALL_PLUGIN` check and honours the retention choice.
- [ ] The default retention mode keeps data. Deleting content requires an explicit, labelled setting.
- [ ] Multisite behaviour of activation and uninstall is decided and tested, or the plugin is documented as single-site.

## Security

- [ ] Every PHP file blocks direct access with an `ABSPATH` check (except `uninstall.php`, which checks `WP_UNINSTALL_PLUGIN`).
- [ ] Every privileged action checks `current_user_can()` with the narrowest suitable capability.
- [ ] Every form and admin action verifies a nonce; REST calls from admin screens send the `wp_rest` nonce.
- [ ] Every REST route has a `permission_callback`; `__return_true` appears only on deliberately public, read-only routes.
- [ ] REST `args` declare `type`, `validate_callback` or `sanitize_callback`.
- [ ] Input is sanitised on save; output is escaped late with the function that fits the context.
- [ ] Every SQL query with variables uses `$wpdb->prepare()`.
- [ ] Non-scalar request values are rejected before sanitising.
- [ ] No API keys, passwords or tokens in the code or repository; secrets come from constants or environment variables.
- [ ] Remote requests use a timeout, check for `WP_Error` and handle non-200 responses.

## Data and privacy

- [ ] Large options are not autoloaded.
- [ ] Custom tables, if any, are created with `dbDelta()`, versioned and removed only in the "remove everything" mode.
- [ ] Personal data has a registered exporter and eraser, and the privacy policy text is updated.
- [ ] Logs and error messages never include personal data or secrets.

## Editor and front end

- [ ] Post types and meta that the block editor needs have `show_in_rest` enabled.
- [ ] Blocks have `block.json`, register from PHP, and render escaped output.
- [ ] Shortcodes return strings, set attribute defaults and escape output.
- [ ] Admin screens use proper labels, headings and keyboard-reachable controls.

## Internationalisation

- [ ] Every user-facing string uses a translation function with the literal text domain.
- [ ] No translation function runs before `init` (check for the "loaded too early" notice with `WP_DEBUG` on).
- [ ] `load_plugin_textdomain()` is present only if the plugin supports WordPress versions before 6.8, or is not needed.

## Checks and tests

- [ ] `wp plugin check <plugin-slug>` passes, or each finding is fixed or explained.
- [ ] No PHP notices, warnings or deprecations with `WP_DEBUG` on, on the lowest and highest supported PHP versions.
- [ ] Activate, deactivate, reactivate and delete were tested on a disposable site.
- [ ] A theme switch to a default theme keeps content types, shortcodes, blocks and endpoints working.
- [ ] An upgrade from the previous version with realistic data preserves edited content and settings.

## Release

- [ ] Changelog entry lists user-visible changes and any data changes.
- [ ] The release package excludes development files (`node_modules`, source maps if not wanted, tests, `.git`).
- [ ] Rollback plan: the previous plugin version is available and known to work with the current data.
