# Block themes and theme.json

Baseline for block themes, and for hybrid themes that use `theme.json`. Facts are as of WordPress 7.1 (October 2026); each section names the version that introduced a feature so you can match it to the theme's `Requires at least` header. Re-check against developer.wordpress.org before relying on them for a later release.

## 1. Minimum files

```text
<theme-slug>/
  style.css            header only: Theme Name, Version, Requires at least, Tested up to, Requires PHP, Text Domain, License
  theme.json           settings and styles
  templates/index.html required: WordPress treats the theme as a block theme when this exists
  parts/header.html
  parts/footer.html
  functions.php        optional: keep small (pattern categories, block styles, editor assets)
  patterns/            optional: PHP files with a pattern header; registered automatically
  styles/              optional: style variations and section styles (JSON)
  assets/fonts/        optional: self-hosted WOFF2 files
  screenshot.png
```

Add further templates (`single.html`, `page.html`, `archive.html`, `search.html`, `404.html`, `front-page.html` if needed) only when they differ from `index.html`.

## 2. theme.json essentials

As of WordPress 7.1 the schema version is **3** (introduced in WordPress 6.6). Point `$schema` at the version you target so editors validate keys:

```json
{
  "$schema": "https://schemas.wp.org/wp/7.1/theme.json",
  "version": 3,
  "settings": {
    "appearanceTools": true,
    "useRootPaddingAwareAlignments": true,
    "layout": { "contentSize": "42rem", "wideSize": "72rem" },
    "color": {
      "defaultPalette": false,
      "palette": [
        { "slug": "base", "name": "Base", "color": "#ffffff" },
        { "slug": "contrast", "name": "Contrast", "color": "#1a1a1a" },
        { "slug": "accent", "name": "Accent", "color": "#0b5d4b" }
      ]
    },
    "typography": {
      "fluid": true,
      "fontFamilies": [
        {
          "slug": "body",
          "name": "Body",
          "fontFamily": "\"Example Sans\", system-ui, sans-serif",
          "fontFace": [
            {
              "fontFamily": "Example Sans",
              "fontWeight": "400 700",
              "fontStyle": "normal",
              "src": [ "file:./assets/fonts/example-sans-variable.woff2" ]
            }
          ]
        }
      ]
    },
    "viewport": { "mobile": "480px", "tablet": "782px" }
  },
  "styles": {
    "color": { "background": "var(--wp--preset--color--base)", "text": "var(--wp--preset--color--contrast)" },
    "typography": { "fontFamily": "var(--wp--preset--font-family--body)" }
  }
}
```

Treat this as a shape, not a design. Notes:

- `appearanceTools` switches on a group of design controls (borders, spacing, line height, sticky position and more). Turn it on, then remove controls the editors should not have.
- Name colours by role (`base`, `contrast`, `accent`), not by hue, so style variations can change them without breaking meaning.
- Moving a theme from version 2 to 3 changes some preset defaults. Read the version migration notes in the theme.json reference before bumping the number.
- Custom CSS belongs in `styles.css` (global or per block) only when no setting covers it; keep it short.

## 3. Responsive styles (WordPress 7.1)

As of 7.1, block styles can change by screen size without custom CSS.

- `settings.viewport` sets two global breakpoints, `mobile` and `tablet`. Defaults are 480px and 782px. Only `px`, `em` and `rem` values are accepted, and they cannot be set per block. The same breakpoints drive block visibility and the editor's device previews.
- In `styles.blocks`, add `@mobile` or `@tablet` beside a block's base properties. The base value applies everywhere; the keyed values override it inside that range. There is no `@desktop` key.
- Only core block-support properties respond: typography, colour, background, border, dimensions, spacing and layout.
- Pseudo-states nest inside the viewport key (for example `:hover` inside `@mobile`).
- Block style variations can use them too.
- Editors can set the same keys on individual blocks; they are stored in the block's `style` attribute.

```json
"styles": {
  "blocks": {
    "core/group": {
      "spacing": { "padding": { "top": "4rem", "bottom": "4rem" } },
      "@mobile": { "spacing": { "padding": { "top": "2rem", "bottom": "2rem" } } }
    }
  }
}
```

Older WordPress versions do not apply these keys. If the theme supports versions before 7.1, keep a CSS media-query fallback for anything layout-critical, or raise `Requires at least` to 7.1.

## 4. Style variations and section styles

- **Style variations** (whole-site looks) are JSON files in `styles/`. Each can change settings and styles; users choose one in Global Styles. Offer them only when the project wants alternative looks.
- **Colour or typography-only variations** (WordPress 6.6) let users mix palettes and type sets independently. Keep each file limited to its one concern.
- **Section styles** (WordPress 6.6) are block style variations that also style the blocks and elements nested inside, defined as JSON partials in `styles/` (any sub-folder) with a `blockTypes` array such as `[ "core/group" ]` and `"version": 3`. Use them for recurring treatments such as a dark band or a highlighted call to action, so editors pick a named style instead of setting colours by hand.

## 5. Fonts

- Bundle fonts the theme needs through `fontFace` with `file:./` paths, as above. Self-hosting avoids sending visitor data to a font service.
- The Font Library (WordPress 6.5) lets users install extra fonts. Uploaded fonts are stored in `wp-content/fonts` by default, and the `font_dir` filter can move them. To stop users adding fonts while keeping theme fonts, set `fontLibraryEnabled` to `false` through the `block_editor_settings_all` filter. Decide with the user whether editors should be able to add fonts.
- Check each font's licence permits web embedding and redistribution in a theme.

## 6. Patterns, synced patterns and overrides

- **Theme patterns** in `patterns/*.php` register automatically from their file header (title, slug, categories, optional block types and template types). Use translation functions for any interface text in them, and keep starter copy clearly replaceable.
- **Synced patterns** are stored as `wp_block` posts. They are content created in the editor, not theme code; a theme cannot ship one as a file.
- **Pattern overrides** (WordPress 6.6) let one synced pattern keep its layout while each use changes chosen text, links or images. They are built on block bindings, so the supported blocks match the bindings list in section 8. Blocks must be named in the pattern for overrides to apply.
- As of **WordPress 7.0**, custom blocks can join pattern overrides by adding attributes through the `block_bindings_supported_attributes` filter. Static blocks with unusual attribute sources may also need a render callback.

## 7. Content-only editing (WordPress 7.0)

As of 7.0, inserted unsynced patterns and template parts open in content-only mode by default: editors change text and media, and must choose to edit the pattern before changing structure or design.

- In custom blocks, mark the attributes that hold editable content with `"role": "content"` in `block.json`. Blocks without a content attribute are hidden from List View and cannot be selected inside a content-only area.
- Review patterns that use Buttons, List, Social Icons or Navigation; their behaviour in this mode changed in 7.0.
- Sites can opt out for unsynced patterns with the `disableContentOnlyForUnsyncedPatterns` editor setting. Agree this with the user; it removes a safety rail for editors.

## 8. Block bindings

Block bindings (WordPress 6.5) connect block attributes to data. As of 7.1:

- Core sources: `core/post-meta`, `core/pattern-overrides`, and since 6.9 `core/post-data` (dates, permalink) and `core/term-data`.
- Supported core attributes include Paragraph and Heading content, Button text and link, Image URL, alt, title and caption, Navigation link URLs and Post Date.
- Post meta used with bindings must be registered with `show_in_rest` and must not start with an underscore.
- Register custom sources with `register_block_bindings_source()` on `init`. Put sources in a companion plugin when the data must outlive the theme.

## 9. Block hooks

Block hooks (WordPress 6.4) insert a block before, after, or as the first or last child of another block, in templates, template parts, patterns and navigation. They are declared with `blockHooks` in `block.json` or the `hooked_block_types` filter, and editors can move or remove the inserted block. Mostly a plugin feature: themes should expect hooked blocks to appear in their templates and lay out gracefully when they do.

## 10. Interactivity API

The Interactivity API (WordPress 6.5) is the core way to add front-end behaviour to blocks.

- Declare `"supports": { "interactivity": true }` and load the script with `viewScriptModule` in `block.json`.
- Mark the interactive region with `data-wp-interactive` and keep state in a store from `@wordpress/interactivity`.
- Render the initial state on the server so the content works and reads correctly before or without JavaScript.
- WordPress 7.0 added `watch()` and the `data-wp-watch` directive, and server-populated `state.url`.

Prefer core blocks (including the Tabs block added in 7.1) before writing an interactive block.

## 11. The always-iframed editor (WordPress 7.1)

As of 7.1 the post editor always loads content in an iframe, as the Site Editor already did.

- Editor scripts that reach into the canvas must use the element's `ownerDocument` and its `defaultView`, not the global `document` or `window`. Global queries now find the outer admin page, not the content.
- Content styles must load inside the iframe: use `add_editor_style()` or `block.json` style fields, or `enqueue_block_assets` for assets that must reach the canvas. Do not rely on `enqueue_block_editor_assets` for content styling.
- Test every custom block and editor extension in the post editor after upgrading.

## 12. Client-side media processing (WordPress 7.1)

As of 7.1, supported browsers resize, compress and convert images before upload, falling back to the server automatically when a requirement is not met.

- Supported formats include JPEG, PNG, GIF, WebP and AVIF; AVIF works even when the server cannot process it. HEIC photos are converted to JPEG in browsers that can decode them.
- Theme impact is small: `add_image_size()` sizes and `big_image_size_threshold` still apply.
- Server-only image hooks do not fire in this path, and `wp_generate_attachment_metadata` can run twice, so any handler must be safe to repeat.
- A Content Security Policy must allow `blob:` in `worker-src`, or processing falls back to the server.
- It can be switched off with the `wp_client_side_media_processing_enabled` filter.

## 13. Create Block Theme plugin

The Create Block Theme plugin (published by WordPress.org) can save Site Editor changes back into theme files, export the theme as a zip, create child themes, blank themes and style variations, and save installed fonts into the theme.

- Use it on a local copy only, as a development tool, and deactivate it before release.
- At the time of writing its directory listing showed "tested up to" a 6.9 release, so test it against 7.1 before relying on it.
- After saving to files, confirm no database copies still override them (`wp post list --post_type=wp_template,wp_template_part,wp_global_styles --post_status=any --path=<wp-path>`). Clearing those copies changes the live site, so it needs approval; use `wp-theme-content-migrations` if installed.

## 14. Feature decision table

| Feature | Use when | Avoid when | Minimum WordPress |
| --- | --- | --- | --- |
| Responsive styles | Layout or type must change by screen size and editors should see it | The theme must support versions before 7.1 without a fallback | 7.1 |
| Section styles | The design has recurring coloured or styled bands | One-off sections | 6.6 |
| Style variations | The client wants alternative looks | One fixed brand | 6.0; partials 6.6 |
| Pattern overrides | Same layout reused with different words or images | Content is fully unique each time | 6.6; custom blocks 7.0 |
| Block bindings | Showing structured data (meta, terms) in core blocks | Plain editorial copy | 6.5 |
| Interactivity API | A block needs front-end behaviour | A core block already does it | 6.5 |
| Font Library open to editors | Editors are trusted to manage type | Strict brand control | 6.5 |

## Sources

Checked October 2026:

- theme.json living reference: <https://developer.wordpress.org/block-editor/reference-guides/theme-json-reference/theme-json-living/>
- Schema (version constant 3): <https://schemas.wp.org/wp/7.1/theme.json>
- Responsive styles: <https://make.wordpress.org/core/2026/08/05/responsive-block-styles-and-configurable-viewports-in-wordpress-7-1/>
- Iframed editor: <https://make.wordpress.org/core/2026/08/03/iframed-editor-changes-in-wordpress-7-1/>
- Client-side media: <https://make.wordpress.org/core/2026/07/22/client-side-media-processing-in-wordpress-7-1/>
- Content-only pattern editing: <https://make.wordpress.org/core/2026/03/15/pattern-editing-in-wordpress-7-0/>
- Pattern overrides for custom blocks: <https://make.wordpress.org/core/2026/03/16/pattern-overrides-in-wp-7-0-support-for-custom-blocks/>
- Interactivity API 7.0 changes: <https://make.wordpress.org/core/2026/02/23/changes-to-the-interactivity-api-in-wordpress-7-0/>
- Section styles: <https://make.wordpress.org/core/2024/06/24/section-styles/>
- Block bindings: <https://developer.wordpress.org/block-editor/reference-guides/block-api/block-bindings/>
- Font Library: <https://make.wordpress.org/core/2024/03/14/new-feature-font-library/>
- Interactivity API: <https://developer.wordpress.org/block-editor/reference-guides/interactivity-api/>
- Block metadata (`blockHooks`): <https://developer.wordpress.org/block-editor/reference-guides/block-api/block-metadata/>
- Create Block Theme: <https://wordpress.org/plugins/create-block-theme/>
