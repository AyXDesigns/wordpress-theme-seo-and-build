# Versioned migration runner: minimal pattern

A small, original pattern for running theme data migrations in order, once each, with a dry run by default. Replace the `exampletheme_` prefix, the keys and the post types with the theme's own. Adapt it; do not ship the example steps unchanged.

## What it guarantees

- Steps run in ascending version order, starting after the stored version.
- The stored version moves forward only after a step succeeds. A failed step stops the run and is retried next time.
- Each step checks whether its work is already done, so a second run changes nothing.
- Nothing is written unless `$dry_run` is false.
- Old keys are left in place for rollback.
- The report holds counts and IDs only, never content.

## `inc/migrations.php`

```php
<?php
/**
 * Versioned content migrations for the theme.
 */

defined( 'ABSPATH' ) || exit;

/**
 * Map of target version => callback. Add new steps at the end.
 *
 * @return array<int, callable>
 */
function exampletheme_migration_steps() {
	return array(
		2 => 'exampletheme_migrate_2_hero_mod_to_array',
		3 => 'exampletheme_migrate_3_copy_cta_meta',
	);
}

/**
 * Runs pending steps.
 *
 * @param bool $dry_run When true, report what would change and write nothing.
 * @return array Report with counts and IDs only.
 */
function exampletheme_run_migrations( $dry_run = true ) {
	$steps   = exampletheme_migration_steps();
	$current = absint( get_option( 'exampletheme_content_version', 1 ) );
	$target  = max( array_keys( $steps ) );
	$report  = array(
		'from_version'   => $current,
		'target_version' => $target,
		'dry_run'        => (bool) $dry_run,
		'steps'          => array(),
	);

	if ( $current >= $target ) {
		$report['status'] = 'up-to-date';
		return $report;
	}

	// Best-effort lock so two requests do not run the same step together.
	if ( ! $dry_run ) {
		$locked_at = absint( get_option( 'exampletheme_migration_lock', 0 ) );
		if ( $locked_at && ( time() - $locked_at ) < 10 * MINUTE_IN_SECONDS ) {
			$report['status'] = 'locked';
			return $report;
		}
		update_option( 'exampletheme_migration_lock', time(), false );
	}

	ksort( $steps );
	foreach ( $steps as $version => $callback ) {
		if ( $version <= $current ) {
			continue;
		}

		$result = call_user_func( $callback, $dry_run );
		$report['steps'][ $version ] = is_wp_error( $result )
			? array( 'error' => $result->get_error_code() )
			: $result;

		if ( is_wp_error( $result ) ) {
			$report['status'] = 'stopped';
			break;
		}

		if ( ! $dry_run ) {
			update_option( 'exampletheme_content_version', $version, true );
			$current = $version;
		}
	}

	if ( ! $dry_run ) {
		delete_option( 'exampletheme_migration_lock' );
		delete_transient( 'exampletheme_home_sections' ); // Only the caches this release affects.
	}

	if ( empty( $report['status'] ) ) {
		$report['status'] = $dry_run ? 'dry-run' : 'applied';
	}

	return $report;
}

/**
 * Step 2: the hero text theme mod (a string) becomes an array.
 * The user's edited text is kept as the heading.
 */
function exampletheme_migrate_2_hero_mod_to_array( $dry_run ) {
	if ( is_array( get_theme_mod( 'hero', null ) ) ) {
		return array( 'changed' => 0, 'skipped' => 1, 'reason' => 'already-migrated' );
	}

	$old = get_theme_mod( 'hero_text', null );
	if ( null === $old ) {
		return array( 'changed' => 0, 'skipped' => 1, 'reason' => 'no-legacy-value' );
	}
	if ( ! is_scalar( $old ) ) {
		return new WP_Error( 'exampletheme_hero_text_malformed' );
	}

	if ( ! $dry_run ) {
		set_theme_mod(
			'hero',
			array(
				'heading'    => sanitize_text_field( (string) $old ),
				'subheading' => '',
			)
		);
		// Keep 'hero_text' until a later release removes it.
	}

	return array( 'changed' => 1, 'skipped' => 0 );
}

/**
 * Step 3: copy '_exampletheme_cta' post meta to '_exampletheme_cta_url'.
 * Posts that already have the new key are left alone.
 */
function exampletheme_migrate_3_copy_cta_meta( $dry_run ) {
	$ids = get_posts(
		array(
			'post_type'      => array( 'page', 'post' ), // List the types explicitly.
			'post_status'    => 'any',
			'fields'         => 'ids',
			'posts_per_page' => -1,
			'no_found_rows'  => true,
			'orderby'        => 'ID',
			'order'          => 'ASC',
			'meta_query'     => array(
				'relation' => 'AND',
				array(
					'key'     => '_exampletheme_cta',
					'compare' => 'EXISTS',
				),
				array(
					'key'     => '_exampletheme_cta_url',
					'compare' => 'NOT EXISTS',
				),
			),
		)
	);

	$changed = 0;
	$manual  = array();

	foreach ( array_chunk( $ids, 100 ) as $batch ) {
		foreach ( $batch as $post_id ) {
			$raw = get_post_meta( $post_id, '_exampletheme_cta', true );
			$url = is_string( $raw ) ? esc_url_raw( trim( $raw ) ) : '';

			if ( '' === $url ) {
				$manual[] = (int) $post_id; // Needs a human decision; do not guess.
				continue;
			}

			if ( ! $dry_run ) {
				update_post_meta( $post_id, '_exampletheme_cta_url', wp_slash( $url ) );
			}
			++$changed;
		}
	}

	return array(
		'changed' => $changed,
		'skipped' => 0,
		'manual'  => $manual,
	);
}

// Option A: run small migrations automatically for administrators.
add_action(
	'admin_init',
	static function () {
		if ( wp_doing_ajax() || ! current_user_can( 'manage_options' ) ) {
			return;
		}
		exampletheme_run_migrations( false );
	}
);
```

Remove the `admin_init` hook if you chose to run migrations only through WP-CLI.

## `inc/migrate-cli.php`

```php
<?php
/**
 * Usage (dry run):  wp eval-file <theme-dir>/inc/migrate-cli.php --path=<wp-path>
 * Usage (write):    wp eval-file <theme-dir>/inc/migrate-cli.php apply --path=<wp-path>
 *
 * WP-CLI places positional arguments after the file name in $args.
 */

defined( 'ABSPATH' ) || exit;

if ( ! function_exists( 'exampletheme_run_migrations' ) ) {
	require_once __DIR__ . '/migrations.php'; // Theme not active on this site.
}

$dry_run = ! in_array( 'apply', (array) $args, true );
define( 'DRY_RUN', $dry_run );

$report = exampletheme_run_migrations( DRY_RUN );

WP_CLI::log( wp_json_encode( $report, JSON_PRETTY_PRINT ) );

if ( 'stopped' === $report['status'] ) {
	WP_CLI::error( 'Migration stopped. Nothing after the failed step was run.' );
}

WP_CLI::success( DRY_RUN ? 'Dry run complete. Nothing was written.' : 'Migrations applied.' );
```

## Notes

- `post_status => 'any'` skips trashed posts and auto-drafts. Add them explicitly if they matter.
- `update_post_meta()` unslashes its value, hence `wp_slash()`. Theme mods and options do not need it.
- For very large sites, fetch IDs once (as above) and process them in batches across several runs, recording progress in an option.
- If a step must query the database directly, use `$wpdb->prepare()` with placeholders. Do not join strings into SQL.
- A failed step on the `admin_init` path is retried on every admin page load. Log the error code (not content) somewhere the maintainer will see it, or use WP-CLI.
- The `admin_init` lock is best effort. Use WP-CLI for anything that must never run twice at once.
