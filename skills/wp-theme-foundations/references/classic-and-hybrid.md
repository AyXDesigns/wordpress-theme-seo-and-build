# Classic, hybrid and child themes

Baseline for PHP-template themes, classic themes that adopt block features, and child themes. Facts are as of WordPress 7.1 (October 2026); re-check against developer.wordpress.org before relying on them for a later release.

## 1. Classic theme minimum

```text
<theme-slug>/
  style.css        header: Theme Name, Version, Requires at least, Tested up to, Requires PHP, Text Domain, License
  index.php        required fallback template
  functions.php    bootstrap: includes, theme supports, menus, assets
  inc/             focused include files (setup, assets, template tags)
  template-parts/  reusable fragments loaded with get_template_part()
  screenshot.png
```

Add `header.php`, `footer.php`, `single.php`, `page.php`, `archive.php`, `search.php` and `404.php` as the design needs them. Follow the template hierarchy instead of routing every request through one custom template.

## 2. Theme supports and setup

Register supports on `after_setup_theme`. A typical baseline:

```php
function prefix_setup() {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script', 'navigation-widgets' ) );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'editor-styles' );
	add_editor_style( 'assets/css/editor.css' );
	register_nav_menus( array( 'primary' => __( 'Primary menu', 'text-domain' ) ) );
}
add_action( 'after_setup_theme', 'prefix_setup' );
```

Replace `prefix_` and `text-domain` with the project's own. Add `custom-logo`, `align-wide` or `wp-block-styles` only when the design uses them.

## 3. Assets

- Enqueue on `wp_enqueue_scripts`; never print `<link>` or `<script>` tags by hand.
- Version assets with the theme version or a build hash so caches refresh on release.
- Load scripts in the footer or with `defer` (the `strategy` argument), and only on templates that need them.
- Styles that must reach the editor content go through `add_editor_style()`. As of WordPress 7.1 the post editor is always iframed, so editor scripts that touch content must use an element's `ownerDocument`, not the global `document`.

## 4. theme.json in a classic theme

A classic theme can ship `theme.json` to control editor presets (palette, font sizes, spacing, layout widths) and turn off unwanted controls, while keeping PHP templates. This is the usual first step towards a hybrid theme. Use schema version 3 (see `block-themes.md`). Classic themes do not get the Site Editor's template editing.

## 5. Hybrid themes

A hybrid theme is a classic theme that adopts block features in steps:

| Step | How | What it gives |
| --- | --- | --- |
| Editor presets | Add `theme.json` | Consistent tokens in editor and front end |
| Theme patterns | Add `patterns/*.php` | Reusable starter sections |
| Block template parts | `add_theme_support( 'block-template-parts' )` plus `parts/*.html` | Editors edit header or footer in the Site Editor |
| Full block theme | Add `templates/index.html` and HTML templates | Becomes a block theme; HTML templates take over from PHP templates, so test every route |

Document which system owns each template, style and setting. Two sources for the same header is the most common hybrid fault.

## 6. Child themes

- The child's `style.css` header must include `Template: <parent-slug>`, matching the parent's folder name exactly.
- Override only what must differ. A template file with the same name in the child replaces the parent's.
- Classic parents: check whether the parent enqueues its own stylesheet with `get_template_directory_uri()` or `get_stylesheet_uri()`. If it uses the latter, the child must enqueue the parent stylesheet itself.
- Block parents: the child's `theme.json` is merged over the parent's, and child templates and parts replace those with matching names.
- Use `get_template_directory()` for parent files and `get_stylesheet_directory()` for child files.
- Record the parent version tested. Read the parent's changelog before every parent update.

## 7. Moving a classic theme towards blocks

Do it in the steps of section 5, testing each on a local copy. Before the final step, inventory every PHP template, Customizer setting (`wp theme mod list --path=<wp-path>`) and widget area, and decide where its content will live. Moving content out of theme mods and widgets is a data migration; use `wp-theme-content-migrations` if installed.

## Sources

Checked October 2026:

- Theme handbook: <https://developer.wordpress.org/themes/>
- Template hierarchy: <https://developer.wordpress.org/themes/basics/template-hierarchy/>
- Child themes: <https://developer.wordpress.org/themes/advanced-topics/child-themes/>
- Iframed editor in 7.1: <https://make.wordpress.org/core/2026/08/03/iframed-editor-changes-in-wordpress-7-1/>
