---
name: wp-companion-plugin
description: Build a small site-specific companion plugin for functionality that must survive a theme change, such as custom post types, taxonomies, shortcodes, blocks, REST endpoints, settings pages, integrations and private data. Covers the plugin, theme or mu-plugin choice, header, prefixing, activation and uninstall, capabilities, nonces, sanitising, escaping, i18n and Plugin Check. Use when the user says "move this out of functions.php", "site plugin", "functionality plugin", "custom post type", "mu-plugin", "uninstall.php", "register_rest_route" or "settings page". For theme structure use `wp-theme-foundations`; for changing stored data, use `wp-theme-content-migrations`.
license: MIT
metadata:
  author: AyXDesigns
  version: "0.2.0"
---

# WordPress companion plugin

Build a small, site-specific plugin that holds the functionality a site depends on, so that content types, data, integrations and endpoints keep working when the theme changes. Theme architecture and presentation stay with `wp-theme-foundations`; changing the shape of data that already exists belongs to `wp-theme-content-migrations`.

## Before you start

Confirm these facts, and ask the user about anything you cannot find in the code:

1. **Features.** What the plugin must do, and where each feature lives today (`functions.php`, a theme include, a snippet plugin, another plugin).
2. **Existing identifiers.** Current post type slugs, taxonomy slugs, meta keys, option names, shortcode tags, REST namespaces and block names. These are stored-data contracts and must not change by accident.
3. **Distribution.** Private to one site, shared across several client sites, or intended for the WordPress.org directory.
4. **Targets.** Minimum WordPress and PHP versions, single site or multisite, and how code reaches the server (Git deploy, SFTP, host panel).
5. **Data.** What the plugin will store, whether any of it is personal data, and what should happen to it if the plugin is deleted.
6. **Editors.** Who uses the admin screens and which role they have.

## Workflow

### 1. Sort features into plugin or theme

| Belongs in the plugin (durable) | Belongs in the theme (presentation) |
|---|---|
| Custom post types, taxonomies, post meta registration | Templates, template parts, patterns, styles, `theme.json` |
| Shortcodes and blocks whose content would break without them | Block styles and variations that only change appearance |
| REST endpoints, webhooks, scheduled jobs, integrations | Enqueuing theme fonts, scripts and styles |
| Settings that hold business data or API configuration | Customizer or global style options that only change looks |
| Custom tables, privacy exporters and erasers | Navigation menus locations and image sizes used only by the theme |

Done when every feature has a home and a short reason.

### 2. Choose the home for the code

Present the options as a short question with choices, recommend one, and wait for the answer.

| Option | Advantages | Disadvantages | Effort | Suits |
|---|---|---|---|---|
| **Regular plugin** in `wp-content/plugins/<plugin-slug>/` | Survives theme changes; activation, deactivation and uninstall hooks; visible in the Plugins screen; can declare dependencies | Can be deactivated by any administrator, which hides content types | Low | Most companion features (the usual recommendation) |
| **Must-use plugin** in `wp-content/mu-plugins/` | Always loaded, cannot be deactivated from admin; loads before regular plugins | No activation or uninstall hooks; no update notices; only top-level files load (a folder needs a small loader file); easy to forget | Low, but needs server file access | Small guards that must always run, such as blocking email on staging or forcing environment settings |
| **Theme `functions.php`** (or child theme) | No extra component; quick for presentation-only code | Lost or broken on theme switch; mixes data with design | Lowest | Presentation-only behaviour, never content types or data |

A combination is common: a regular plugin for features, plus a one-file mu-plugin for an always-on guard.

### 3. Name, slug and prefix

- Slug: lowercase with hyphens, unique and descriptive, for example `example-site-core`. The folder, main file and text domain use the slug.
- Prefix every global: functions, options, hooks, transients and handles, for example `exsc_`. Prefer a PHP namespace such as `Example\SiteCore` for classes and functions, and still prefix option names and hook names.
- For a private plugin, set an `Update URI` header to a value that is not a WordPress.org plugin URL (your own URI, or `false`), so a directory plugin with the same slug cannot overwrite it. The header has existed since WordPress 5.8.

### 4. Scaffold

Start from [references/plugin-skeleton.md](references/plugin-skeleton.md), which gives a minimal file listing, main file and `uninstall.php`. `wp scaffold plugin <plugin-slug>` is an alternative that also generates test scaffolding; offer it if the user wants automated tests.

Done when the plugin activates on a local site with `WP_DEBUG` on and no notices:

```bash
wp --path=<site-root> plugin activate <plugin-slug>
wp --path=<site-root> plugin list --name=<plugin-slug>
```

### 5. Lifecycle: activation, upgrade, deactivation, uninstall

- **Activation:** register content types, then call `flush_rewrite_rules()` once. Store the plugin's schema version in an option.
- **Upgrade:** activation hooks do not run when files are replaced by a deploy or update. Compare the stored schema version with the plugin constant on `plugins_loaded` or `init` and run idempotent upgrade steps.
- **Deactivation:** flush rewrite rules and unschedule the plugin's cron events. Do not delete data here.
- **Uninstall:** use `uninstall.php` and check `WP_UNINSTALL_PLUGIN` at the top. Offer the user a data-retention choice:

| Retention option | Advantages | Disadvantages | Suits |
|---|---|---|---|
| **Keep all data** (default) | Nothing lost if deleted by mistake; reinstall restores everything | Leaves options and posts in the database | Content-bearing sites |
| **Remove settings only** | Cleans options and transients; content stays | Orphaned posts of a type no longer registered | Sites that may reuse content |
| **Remove everything**, behind an explicit setting | Clean database | Irreversible; deletes posts, meta, terms and custom tables | Integrations and test data only |

On multisite, decide whether uninstall touches every site; looping over many sites is slow, so batch it or document it.

### 6. Build the features

- **Post types and taxonomies:** register on `init` with translated labels, `show_in_rest => true` (needed for the block editor and the REST API), explicit `rewrite` slugs and the right `supports`. Register post meta with `register_post_meta()`, a type, a `sanitize_callback`, an `auth_callback` and `show_in_rest` when the editor needs it. Keep existing slugs and keys unchanged when moving code from a theme.
- **Shortcodes:** prefix the tag, return a string (never echo), escape every value and give attributes defaults with `shortcode_atts()`.
- **Blocks:** describe each block in `block.json` and register it with `register_block_type( __DIR__ . '/build/<block-name>' )`. As of WordPress 7.1, plugins with several blocks can register them in one call from a generated manifest with `wp_register_block_types_from_metadata_collection()` (added in 6.8). For block development detail, follow the Block Editor Handbook on developer.wordpress.org. Scaffold with `npx @wordpress/create-block`.
- **REST endpoints:** register on `rest_api_init` under a versioned namespace such as `example-site/v1`. Every route needs a `permission_callback`; since WordPress 5.5 a missing one triggers a notice. Use `__return_true` only for deliberately public, read-only data. Declare `args` with `type`, `validate_callback` and `sanitize_callback`.
- **Settings:** use the Settings API: `register_setting()` with `type`, `default` and `sanitize_callback`; sections and fields; a page under Settings guarded by `manage_options` (or a custom capability). Set large options to not autoload.
- **Integrations:** keep API keys out of code and out of the repository. Offer: a constant in `wp-config.php` (simple, server-only), an environment variable (suits container or host-managed secrets), or a settings field with masked display (editor-managed, but stored in the database). Call remote services with `wp_remote_get()` or `wp_remote_post()`, a timeout and error handling, and cache responses with transients.
- **Private data stores:** present the choice between a private custom post type (`public => false`), post meta, options, or a custom table created with `dbDelta()`. Custom tables suit high-volume or relational records but need their own upgrade, export and uninstall code. Register personal-data exporters and erasers (`wp_privacy_personal_data_exporters`, `wp_privacy_personal_data_erasers`) for anything personal.

### 7. Security baseline

- Block direct access: `defined( 'ABSPATH' ) || exit;` at the top of every PHP file.
- Check capabilities with `current_user_can()` before every privileged action, not just when showing a menu.
- Use nonces for forms and admin actions: `wp_nonce_field()` with `check_admin_referer()`, or `wp_verify_nonce()`; REST requests from logged-in screens use the `wp_rest` nonce.
- Sanitise on input (`sanitize_text_field()`, `absint()`, `sanitize_email()`, `wp_kses_post()`), escape on output (`esc_html()`, `esc_attr()`, `esc_url()`), and use `$wpdb->prepare()` for every query with variables.
- Reject non-scalar request values before type-specific sanitising.

### 8. Internationalisation

- Wrap every user-facing string with `__()`, `esc_html__()` and similar, using the literal text domain.
- Do not call translation functions before `init`; since WordPress 6.7 that triggers a "loaded too early" notice. Create translated labels inside `init` callbacks.
- As of WordPress 7.1, plugins that declare `Text Domain` and `Domain Path` headers get just-in-time translation loading (extended to non-directory plugins in 6.8), so `load_plugin_textdomain()` is only needed when supporting older versions.

### 9. Dependencies

- For hard dependencies on WordPress.org plugins, use the `Requires Plugins` header (since WordPress 6.5): a comma-separated list of directory slugs. WordPress then refuses to activate the plugin until those plugins are active.
- For premium or non-directory dependencies, or optional ones, check at runtime on `plugins_loaded` (`class_exists()`, `function_exists()`), skip the dependent feature and show an admin notice to users who can manage plugins.

### 10. Check, version and record

```bash
wp --path=<site-root> plugin install plugin-check --activate
wp --path=<site-root> plugin check <plugin-slug>
wp --path=<site-root> plugin check <plugin-slug> --format=json --ignore-warnings
```

Plugin Check runs static checks from WP-CLI by default; its runtime checks need extra setup, so read its documentation before relying on them. Installing Plugin Check on a production site needs approval; run it locally.

- Version with semantic versioning (`MAJOR.MINOR.PATCH`). Keep the `Version` header, the version constant and the changelog in step.
- Record user-visible changes and any data changes in `CHANGELOG.md` (or `readme.txt` for directory plugins).
- Test activation, deactivation, uninstall (with each retention option), a theme switch, and an upgrade from the previous version with real data.

Done when the [references/review-checklist.md](references/review-checklist.md) items all pass or have an accepted exception.

## Ask before acting

- Changing an existing post type slug, taxonomy slug, meta key, option name or REST namespace.
- Removing the old code from the live theme. Plan the switch so a feature is never loaded twice (duplicate function names cause fatal errors) or not at all (content types and shortcodes vanish).
- Choosing "remove everything" on uninstall, or running uninstall on any site with real data.
- Installing Plugin Check or any other tool on staging or production.
- Storing personal data or API secrets, and choosing where secrets live.
- Activating the plugin on production.

## Output

Hand back the plugin folder, a short note listing each feature and its home, the retention choice made, the commands run with results, the completed [references/review-checklist.md](references/review-checklist.md), and the changelog entry. Base the files on [references/plugin-skeleton.md](references/plugin-skeleton.md).
