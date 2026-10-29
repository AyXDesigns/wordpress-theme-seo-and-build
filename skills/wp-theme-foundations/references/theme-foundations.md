# Theme foundations

The cross-cutting contracts every theme needs, whatever its type. Type-specific detail lives in `block-themes.md` and `classic-and-hybrid.md`; security and accessibility live in `security-accessibility-baseline.md`.

Version facts here are stated as of WordPress 7.1 (October 2026). Re-check them against the sources at the end before relying on them for a later release.

## 1. Definition of ready

Before broad implementation, write down:

- canonical source, and every place a copy is deployed;
- lowest supported WordPress and PHP versions (these set which features you may rely on);
- theme type: block, classic, hybrid or child;
- pages, archives, search, 404, forms and special states in scope;
- who edits what, and in which editing surface;
- plugins the theme depends on, and what happens when each is missing;
- privacy, accessibility, SEO, performance, browser and support requirements;
- local, staging, production, rollback and approval boundaries.

Record assumptions. Keep unconfirmed assumptions out of anything hard to reverse, such as stored data or URLs.

## 2. Architecture rules for every theme type

- Prefix everything global: PHP functions, classes, constants, options, transients, meta keys, script and style handles, custom hooks, block and pattern namespaces.
- Keep `functions.php` small. Load focused include files deliberately and guard against double definitions.
- The theme is the presentation layer. Put durable features (post types, taxonomies, custom fields, block bindings sources, form storage, integrations) in a companion plugin so a theme switch does not remove them.
- Follow the existing repository structure unless a verified migration justifies a change.
- Check optional plugin functions and classes where they are used (`function_exists`, `class_exists`). A deactivated optional plugin must never cause a fatal error on the front end.

## 3. Content and editor ownership

Every visitor-facing value has exactly one source of truth.

| Content | Preferred home |
| --- | --- |
| Ordinary page and post copy | Post content (blocks) |
| Reusable layouts and starter sections | Theme patterns (unsynced) |
| A section that must stay identical everywhere | Synced pattern (a `wp_block` post: content, not theme code) |
| Same layout, different words per use | Synced pattern with pattern overrides |
| Menus | Navigation block (`wp_navigation` posts) or classic menus |
| Global presentation (colours, fonts, spacing) | `theme.json` presets, adjusted by users in Global Styles |
| Values that must be queried or reused (addresses, opening times, staff) | Post types, taxonomies or post meta in a companion plugin, shown through block bindings or blocks |
| Durable operational data and sensitive records | Companion plugin with its own storage and capabilities |

Rules:

- Do not hard-code copy that editors are expected to change.
- Do not add a page builder or field framework without a demonstrated need, an owner, a maintenance plan and a fallback.
- Site Editor changes are saved as database posts (`wp_template`, `wp_template_part`, `wp_global_styles`) that override theme files. Plan how they will be exported back to files or cleared, and by whom. Use `wp-theme-content-migrations` if installed.
- Seed content must be repeatable and must never overwrite content that editors have changed. Test seeds on a clean install and on an upgrade.

## 4. Template and state coverage

Inventory each relevant template and its states:

- front page, page, post, archive, taxonomy, author, search, 404 and any special templates;
- empty, populated, long content, missing media, validation error, success, failure and dependency-missing states;
- signed-out visitor, editor, administrator and restricted roles where behaviour differs;
- narrow, medium and wide layouts (as of 7.1 the block editor's default breakpoints are 480px and 782px; themes can change them);
- JavaScript unavailable and reduced motion.

One screenshot of the ideal page is not state coverage.

## 5. Design tokens

Define a small token set before styling: colour roles, font families, type scale, spacing scale, content and wide widths, borders, radii, shadows and motion. In block and hybrid themes these become `theme.json` presets so the editor and front end share them. In classic themes use CSS custom properties, and still declare presets in `theme.json` if the block editor is used for content.

Tokens express the project's needs, not a generic aesthetic. Check every text and background pairing for contrast when tokens are defined, not at the end.

## 6. Integrations and failure states

For each plugin or external service record:

- why it exists, who owns it and who pays for it;
- tested versions;
- data sent or stored, and where credentials live (never in theme source);
- behaviour when it is missing or misconfigured;
- the administrator warning and the visitor-safe fallback;
- how to test it and how to roll it back.

## 7. SEO ownership

Give exactly one owner to titles, meta descriptions, canonicals, robots directives, XML sitemaps, redirects, social metadata and structured data. When an SEO plugin owns them, the theme outputs none of them. Add `add_theme_support( 'title-tag' )` in classic themes and never print a `<title>` by hand.

- Use WordPress-generated URLs, never a hard-coded production domain.
- Make important pages reachable through ordinary links.
- Emit structured data only for content that is visible and qualifies.
- Keep preview and staging sites out of search indexes.
- Inspect rendered HTML for duplicate or conflicting tags.

Use `wp-seo-build-and-release` if installed for the detailed checks.

## 8. Performance baseline

Set budgets that suit the project and measure before optimising.

- Load scripts and styles only where they are needed. For blocks, rely on `block.json` asset fields so WordPress loads them only when the block is on the page.
- Prefer script modules (`viewScriptModule`) and the Interactivity API for front-end interactivity over large global bundles.
- Self-host fonts in WOFF2, limit families and weights, and declare them in `theme.json`.
- Give images intrinsic dimensions; do not lazy-load the largest above-the-fold image.
- As of WordPress 7.1, sizes registered with `add_image_size()` may be generated in the browser during upload (client-side media processing). Server-side image hooks such as `image_make_intermediate_size` do not fire in that path. See `block-themes.md`.
- Record device profile, cache state and measurement source with every result.

## 9. Internationalisation

Use one text domain that matches the theme slug, and translation functions for interface strings in PHP and patterns. Keep editable content in post content, not in translation calls. Support right-to-left layouts, locale formats and `hreflang` only when more than one locale is genuinely in scope.

## 10. Development and verification

Provide one repeatable, non-destructive check that covers PHP syntax, coding standards (WordPress Coding Standards through PHPCS if the project uses it), JavaScript linting and any theme tests.

Verify:

- clean activation and representative routes on a local site;
- an empty debug log for the journeys tested;
- dependency-missing states, on a local copy only;
- editor changes appearing correctly on the front end, in the always-iframed editor;
- request handling and escaping (see `security-accessibility-baseline.md`);
- clean-install and upgrade behaviour with realistic saved data;
- responsive, keyboard, no-JavaScript and form behaviour;
- rendered metadata and structured data ownership;
- the release zip matches the canonical source.

A form's success message does not prove a record was stored.

## 11. Documentation and release

Keep enough documentation to rebuild and support the release: purpose, architecture, content ownership, dependency inventory, setup steps without secrets, design and accessibility decisions, migrations and manual production steps, validation evidence, known limitations, rollback, and the exact WordPress, PHP, theme and plugin versions tested.

Build the release zip from the canonical source and compare its file list with the source tree. Use `wp-theme-release-gate` if installed. Publishing and production changes need explicit approval.

## 12. Decision record

Copy and fill this in at the end of step 7 of the workflow.

```markdown
# Theme foundations decision record: <theme-slug>

Date: <yyyy-mm-dd>
Lowest supported WordPress / PHP: <x.y> / <x.y>
Theme type chosen: <block / classic / hybrid / child of <parent-slug>>
Reason: <one or two sentences tied to what the user said>
Options rejected and why: <list>

## Modern features used
| Feature | Used? | Why / why not | Minimum WordPress |
| --- | --- | --- | --- |
| Responsive styles (`settings.viewport`) | | | 7.1 |
| Section styles | | | 6.6 |
| Pattern overrides | | | 6.6 (custom blocks 7.0) |
| Block bindings | | | 6.5 |
| Interactivity API | | | 6.5 |

## Content ownership
| Visitor-facing value | Source of truth | Editor |
| --- | --- | --- |

## Plugin boundaries
| Plugin | Purpose | Guarded? | Fallback |
| --- | --- | --- | --- |

## SEO owner
<plugin or theme, and what it outputs>

## Open questions
- <question>
```

## Sources

Checked October 2026. Re-check for later releases.

- WordPress requirements: <https://wordpress.org/about/requirements/>
- PHP compatibility table: <https://make.wordpress.org/core/handbook/references/php-compatibility-and-wordpress-versions/>
- WordPress 7.1 field guide: <https://make.wordpress.org/core/2026/08/05/wordpress-7-1-field-guide/>
- WordPress 7.0 field guide: <https://make.wordpress.org/core/2026/05/14/wordpress-7-0-field-guide/>
- Theme handbook: <https://developer.wordpress.org/themes/>
