# Companion plugin skeleton

A minimal, original starting point for a site-specific plugin. Replace every placeholder: `example-site-core` (slug and text domain), `Example\SiteCore` (namespace), `exsc_` (prefix), `exsc_project` (post type) and `<author-name>`. Keep it small; split into `includes/` files once a feature grows beyond a screen or two.

Version notes, as of WordPress 7.1: `Requires Plugins` needs WordPress 6.5+, `Update URI` 5.8+, and just-in-time translation loading for non-directory plugins with `Text Domain` and `Domain Path` headers 6.8+. Re-check against the Plugin Handbook before relying on them.

## File listing

```text
example-site-core/
  example-site-core.php   main file: header, constants, hooks, features
  uninstall.php           removes data according to the retention setting
  includes/               optional: one file per feature as the plugin grows
  src/<block-name>/       optional: block source with block.json
  build/<block-name>/     optional: compiled block, registered from PHP
  languages/              translation files
  CHANGELOG.md            user-visible and data changes per version
  readme.txt              only if the plugin is distributed
```

## `example-site-core.php`

```php
<?php
/**
 * Plugin Name:       Example Site Core
 * Description:       Site-specific content types, settings and integrations.
 * Version:           0.1.0
 * Requires at least: 6.8
 * Requires PHP:      7.4
 * Author:            <author-name>
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       example-site-core
 * Domain Path:       /languages
 * Update URI:        false
 *
 * Add "Requires Plugins: <directory-slug>" above only for hard
 * dependencies on WordPress.org plugins.
 */

namespace Example\SiteCore;

defined( 'ABSPATH' ) || exit;

const VERSION        = '0.1.0';
const SCHEMA_VERSION = 1;
const OPTION         = 'exsc_options';
const SCHEMA_OPTION  = 'exsc_schema_version';
const CRON_HOOK      = 'exsc_daily_sync';

/**
 * Default settings. "uninstall_mode" records the user's retention choice:
 * keep | settings | everything.
 */
function defaults() {
	return array(
		'uninstall_mode' => 'keep',
		'listing_limit'  => 10,
	);
}

function plugin_settings() {
	return wp_parse_args( (array) get_option( OPTION, array() ), defaults() );
}

/* ----------------------------------------------------------------------
 * Content model
 * ------------------------------------------------------------------- */

function register_content() {
	register_post_type(
		'exsc_project',
		array(
			'labels'       => array(
				'name'          => __( 'Projects', 'example-site-core' ),
				'singular_name' => __( 'Project', 'example-site-core' ),
				'add_new_item'  => __( 'Add project', 'example-site-core' ),
				'edit_item'     => __( 'Edit project', 'example-site-core' ),
			),
			'public'       => true,
			'has_archive'  => true,
			'show_in_rest' => true, // Block editor and REST API.
			'menu_icon'    => 'dashicons-portfolio',
			'supports'     => array( 'title', 'editor', 'excerpt', 'thumbnail', 'custom-fields' ),
			'rewrite'      => array( 'slug' => 'projects', 'with_front' => false ),
		)
	);

	register_taxonomy(
		'exsc_project_type',
		'exsc_project',
		array(
			'labels'            => array(
				'name'          => __( 'Project types', 'example-site-core' ),
				'singular_name' => __( 'Project type', 'example-site-core' ),
			),
			'hierarchical'      => true,
			'show_in_rest'      => true,
			'show_admin_column' => true,
			'rewrite'           => array( 'slug' => 'project-type', 'with_front' => false ),
		)
	);

	register_post_meta(
		'exsc_project',
		'exsc_client_sector',
		array(
			'type'              => 'string',
			'single'            => true,
			'show_in_rest'      => true,
			'sanitize_callback' => 'sanitize_text_field',
			'auth_callback'     => static function () {
				return current_user_can( 'edit_posts' );
			},
		)
	);
}
add_action( 'init', __NAMESPACE__ . '\register_content' );

/* ----------------------------------------------------------------------
 * Lifecycle
 * ------------------------------------------------------------------- */

function activate() {
	register_content();
	flush_rewrite_rules();
	add_option( OPTION, defaults(), '', false ); // Not autoloaded.
	update_option( SCHEMA_OPTION, SCHEMA_VERSION, false );
	if ( ! wp_next_scheduled( CRON_HOOK ) ) {
		wp_schedule_event( time() + HOUR_IN_SECONDS, 'daily', CRON_HOOK );
	}
}
register_activation_hook( __FILE__, __NAMESPACE__ . '\activate' );

function deactivate() {
	wp_clear_scheduled_hook( CRON_HOOK );
	flush_rewrite_rules();
	// Never delete data on deactivation.
}
register_deactivation_hook( __FILE__, __NAMESPACE__ . '\deactivate' );

/**
 * Activation hooks do not run when files are replaced by a deploy,
 * so compare the stored schema version on every load.
 */
function maybe_upgrade() {
	$stored = (int) get_option( SCHEMA_OPTION, 0 );
	if ( $stored >= SCHEMA_VERSION ) {
		return;
	}
	// Add idempotent, numbered upgrade steps here, for example:
	// if ( $stored < 2 ) { upgrade_to_2(); }
	update_option( SCHEMA_OPTION, SCHEMA_VERSION, false );
}
add_action( 'init', __NAMESPACE__ . '\maybe_upgrade', 5 );

/* ----------------------------------------------------------------------
 * Settings
 * ------------------------------------------------------------------- */

function sanitize_settings( $input ) {
	$input = is_array( $input ) ? $input : array();
	$clean = defaults();

	$modes = array( 'keep', 'settings', 'everything' );
	if ( isset( $input['uninstall_mode'] ) && is_scalar( $input['uninstall_mode'] )
		&& in_array( $input['uninstall_mode'], $modes, true ) ) {
		$clean['uninstall_mode'] = $input['uninstall_mode'];
	}

	if ( isset( $input['listing_limit'] ) && is_scalar( $input['listing_limit'] ) ) {
		$clean['listing_limit'] = min( 50, max( 1, absint( $input['listing_limit'] ) ) );
	}

	return $clean;
}

function register_settings() {
	register_setting(
		'exsc_settings',
		OPTION,
		array(
			'type'              => 'array',
			'default'           => defaults(),
			'sanitize_callback' => __NAMESPACE__ . '\sanitize_settings',
		)
	);
}
add_action( 'admin_init', __NAMESPACE__ . '\register_settings' );

function add_settings_page() {
	add_options_page(
		__( 'Site core settings', 'example-site-core' ),
		__( 'Site core', 'example-site-core' ),
		'manage_options',
		'exsc-settings',
		__NAMESPACE__ . '\render_settings_page'
	);
}
add_action( 'admin_menu', __NAMESPACE__ . '\add_settings_page' );

function render_settings_page() {
	if ( ! current_user_can( 'manage_options' ) ) {
		return;
	}
	$settings = plugin_settings();
	$modes    = array(
		'keep'       => __( 'Keep all data when the plugin is deleted', 'example-site-core' ),
		'settings'   => __( 'Remove settings only', 'example-site-core' ),
		'everything' => __( 'Remove settings, projects and project types (cannot be undone)', 'example-site-core' ),
	);
	?>
	<div class="wrap">
		<h1><?php echo esc_html( get_admin_page_title() ); ?></h1>
		<form method="post" action="options.php">
			<?php settings_fields( 'exsc_settings' ); // Prints the nonce. ?>
			<table class="form-table" role="presentation">
				<tr>
					<th scope="row">
						<label for="exsc-listing-limit"><?php esc_html_e( 'Projects per listing', 'example-site-core' ); ?></label>
					</th>
					<td>
						<input type="number" min="1" max="50" id="exsc-listing-limit"
							name="<?php echo esc_attr( OPTION ); ?>[listing_limit]"
							value="<?php echo esc_attr( $settings['listing_limit'] ); ?>">
					</td>
				</tr>
				<tr>
					<th scope="row"><?php esc_html_e( 'On delete', 'example-site-core' ); ?></th>
					<td>
						<?php foreach ( $modes as $value => $label ) : ?>
							<label>
								<input type="radio" name="<?php echo esc_attr( OPTION ); ?>[uninstall_mode]"
									value="<?php echo esc_attr( $value ); ?>"
									<?php checked( $settings['uninstall_mode'], $value ); ?>>
								<?php echo esc_html( $label ); ?>
							</label><br>
						<?php endforeach; ?>
					</td>
				</tr>
			</table>
			<?php submit_button(); ?>
		</form>
	</div>
	<?php
}

/* ----------------------------------------------------------------------
 * REST endpoint (read-only, editors only)
 * ------------------------------------------------------------------- */

function register_routes() {
	register_rest_route(
		'example-site/v1',
		'/projects/summary',
		array(
			'methods'             => \WP_REST_Server::READABLE,
			'permission_callback' => static function () {
				return current_user_can( 'edit_posts' );
			},
			'args'                => array(
				'type' => array(
					'type'              => 'string',
					'required'          => false,
					'sanitize_callback' => 'sanitize_key',
				),
			),
			'callback'            => __NAMESPACE__ . '\rest_summary',
		)
	);
}
add_action( 'rest_api_init', __NAMESPACE__ . '\register_routes' );

function rest_summary( \WP_REST_Request $request ) {
	$query_args = array(
		'post_type'      => 'exsc_project',
		'post_status'    => 'publish',
		'fields'         => 'ids',
		'posts_per_page' => plugin_settings()['listing_limit'],
		'no_found_rows'  => true,
	);
	$type = $request->get_param( 'type' );
	if ( $type ) {
		$query_args['tax_query'] = array(
			array(
				'taxonomy' => 'exsc_project_type',
				'field'    => 'slug',
				'terms'    => $type,
			),
		);
	}
	$ids = get_posts( $query_args );

	return rest_ensure_response(
		array_map(
			static function ( $id ) {
				return array(
					'id'    => $id,
					'title' => get_the_title( $id ),
					'link'  => get_permalink( $id ),
				);
			},
			$ids
		)
	);
}

/* ----------------------------------------------------------------------
 * Blocks (optional): register every compiled block from build/.
 * ------------------------------------------------------------------- */

function register_blocks() {
	$manifest = __DIR__ . '/build/blocks-manifest.php';
	if ( file_exists( $manifest ) && function_exists( 'wp_register_block_types_from_metadata_collection' ) ) {
		wp_register_block_types_from_metadata_collection( __DIR__ . '/build', $manifest );
	}
}
add_action( 'init', __NAMESPACE__ . '\register_blocks' );

/* ----------------------------------------------------------------------
 * Scheduled job placeholder
 * ------------------------------------------------------------------- */

add_action(
	CRON_HOOK,
	static function () {
		// Call the external service here with wp_remote_get(), a timeout,
		// error handling and a transient cache. Read keys from a constant
		// defined in wp-config.php, never from this file.
	}
);
```

## `uninstall.php`

```php
<?php
/**
 * Runs only when an administrator deletes the plugin.
 * Honours the retention choice saved in the plugin settings.
 */

defined( 'WP_UNINSTALL_PLUGIN' ) || exit;

function exsc_uninstall_site() {
	$settings = (array) get_option( 'exsc_options', array() );
	$mode     = isset( $settings['uninstall_mode'] ) ? $settings['uninstall_mode'] : 'keep';

	if ( 'keep' === $mode ) {
		return;
	}

	// "settings" and "everything" both remove options and caches.
	delete_option( 'exsc_options' );
	delete_option( 'exsc_schema_version' );
	delete_transient( 'exsc_remote_cache' );
	wp_clear_scheduled_hook( 'exsc_daily_sync' );

	if ( 'everything' !== $mode ) {
		return;
	}

	// The plugin is not loaded during uninstall, so register the taxonomy
	// briefly to let the term functions work.
	register_taxonomy( 'exsc_project_type', 'exsc_project' );
	$term_ids = get_terms(
		array(
			'taxonomy'   => 'exsc_project_type',
			'hide_empty' => false,
			'fields'     => 'ids',
		)
	);
	if ( ! is_wp_error( $term_ids ) ) {
		foreach ( $term_ids as $term_id ) {
			wp_delete_term( $term_id, 'exsc_project_type' );
		}
	}

	// Delete projects in batches to stay within memory limits.
	do {
		$ids = get_posts(
			array(
				'post_type'      => 'exsc_project',
				'post_status'    => array( 'publish', 'future', 'draft', 'pending', 'private', 'trash' ),
				'fields'         => 'ids',
				'posts_per_page' => 100,
				'no_found_rows'  => true,
			)
		);
		foreach ( $ids as $id ) {
			// Also removes the post's meta. Stop rather than loop forever on a failure.
			if ( ! wp_delete_post( $id, true ) ) {
				return;
			}
		}
	} while ( ! empty( $ids ) );
}

if ( is_multisite() ) {
	// For large networks, replace this loop with a batched background job.
	foreach ( get_sites( array( 'fields' => 'ids', 'number' => 0 ) ) as $site_id ) {
		switch_to_blog( $site_id );
		exsc_uninstall_site();
		restore_current_blog();
	}
} else {
	exsc_uninstall_site();
}
```

## Notes

- The uninstall query lists post statuses explicitly, because `'any'` skips trashed posts. Add any custom statuses the site registers.
- Test uninstall on a disposable copy with each retention mode before shipping. "everything" cannot be undone.
- If the plugin creates custom tables, drop them in `uninstall.php` only in "everything" mode, after the user has chosen it in the settings screen.
- Keep the `exsc_project` slug and `exsc_client_sector` meta key stable once content exists. Renaming them is a data migration; use `wp-theme-content-migrations` if installed, or write and dry-run an explicit upgrade step.
