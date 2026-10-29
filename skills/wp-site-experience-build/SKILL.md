---
name: wp-site-experience-build
description: Plans, designs, builds and verifies a whole WordPress site or major redesign - brief, page and state inventory, a visual direction chosen by the user, design tokens in theme.json, templates, patterns and editable content, then evidence-based checks. Use when the user asks to build a new website, redesign a homepage or whole site, turn a mock-up or brief into a block theme, create a design system or landing pages, or says "new look", "make it look modern" or "rebuild our charity site". For baseline architecture decisions alone, use `wp-theme-foundations`; for an inherited theme nobody understands yet, use `wp-theme-triage` first.
license: MIT
metadata:
  author: AyXDesigns
  version: "0.2.0"
---

# WordPress site experience build

Take a site or redesign from brief to verified, editable pages. `wp-theme-foundations` sets the baseline contracts (theme type, content ownership, security, accessibility, SEO owner); this skill designs and builds the experience on top of them. For a small change to one template, use a narrower workflow.

## Before you start

Ask the user, briefly, about anything not already known:

- the organisation, its audiences and the top three things visitors must be able to do;
- existing brand assets (logo, colours, fonts and their licences, photography) and sites they like or dislike, described in words;
- pages in scope, who writes the copy, and whether real content exists yet;
- who will edit the site and how confident they are with the block editor;
- target WordPress and PHP versions, existing theme, required plugins, hosting limits;
- accessibility target (normally WCAG 2.2 AA), deadline and budget for paid assets.

**Foundations.** Use `wp-theme-foundations` if installed to settle the architecture and baseline. If it is not installed, agree these five points before building:

1. Theme type: block theme for new builds unless the user's code or plugins need classic PHP templates.
2. One source of truth for every visitor-facing value; no hard-coded copy editors must change.
3. Durable data (post types, custom fields, form records) lives in a companion plugin, and optional plugin calls are guarded with `function_exists` or `class_exists`.
4. Escape output, sanitise input, use nonces and capability checks, and meet WCAG 2.2 AA.
5. Exactly one owner (usually the SEO plugin) for titles, descriptions, canonicals, sitemaps and structured data.

If an existing theme has not been inspected, use `wp-theme-triage` if installed. Otherwise at least read the `style.css` header and check for database template overrides:

```bash
wp post list --post_type=wp_template,wp_template_part,wp_global_styles --post_status=any --fields=ID,post_type,post_name --path=<wp-path>
```

## Workflow

### 1. Write the brief

One paragraph: who the site serves, the top three visitor tasks, the tone, and how success will be judged. Done when the user confirms it.

### 2. Inventory pages and states

Fill in [references/page-state-inventory.md](references/page-state-inventory.md): every page or template, its purpose, content owner, editing surface and the states it must handle (empty, long content, error, success, dependency missing, no JavaScript, each width). Done when no page is missing an owner or states.

### 3. Choose a design direction with the user

Offer **two or three** distinct directions, derived from the brief and brand, as a short question with choices. For each give:

- **Name and idea**: one line on the feeling and why it fits the audience.
- **Type**: heading and body families (self-hostable, with licences that allow web use).
- **Colour**: the roles (base, contrast, accent) and how bold the accent is.
- **Layout and imagery**: density, grid, photography or illustration, shapes.
- **Motion**: none, subtle, or expressive, always with a reduced-motion fallback.
- **Advantages**, **disadvantages**, **effort** and **who it suits**.

Example shape (placeholders, not a recommendation):

```text
A. Calm and editorial  - serif headings, generous white space, one muted accent.
   + Trustworthy, ages well, easy to keep accessible.  - Can feel quiet for a campaign.  Effort: low.
B. Bold and campaigning - heavy sans headings, strong accent bands (section styles), large photography.
   + Energetic, clear calls to action.  - Needs good photos; contrast must be watched.  Effort: medium.
C. Warm and community   - rounded sans, soft colour blocks, illustration.
   + Friendly, works without strong photography.  - Illustration costs time or money.  Effort: medium to high.
Recommended: <letter>, because <reason tied to the brief>.
```

Recommend one and wait for the choice. Offer quick static samples of a hero and one inner section only if the user wants them. Done when the chosen direction, and any changes the user asked for, are recorded.

### 4. Choose the build approach

| Option | Advantages | Disadvantages | Effort | Suits |
| --- | --- | --- | --- | --- |
| Restyle the existing block theme (new `theme.json` values, a style variation, section styles) | Fastest; keeps templates and content | Limited by existing templates and their quality | Low | Visual refresh of a sound block theme |
| Child theme of a maintained parent | Small codebase; parent updates continue | Tied to parent decisions | Low to medium | Parent already close to the direction |
| New block theme | Full control; clean tokens and patterns | Most work; content may need moving | Medium to high | New sites, or redesigns of weak themes |
| Extend a classic or hybrid theme | Keeps working PHP and plugin integrations | Fewer visual editing tools | Medium | Sites with heavy custom PHP |

Recommend one and wait for the user's choice.

### 5. Turn the direction into tokens

- Block and hybrid themes: put colour roles, font families (self-hosted `fontFace`), a fluid type scale, a spacing scale, content and wide widths, shadows and custom values in `theme.json` version 3.
- Screen-size changes: as of WordPress 7.1 use responsive styles (`settings.viewport`, `@mobile` and `@tablet` keys) when the theme requires 7.1; otherwise use CSS media queries.
- Recurring treatments (dark band, highlighted call to action): section styles, so editors pick a named style.
- Classic themes: CSS custom properties, mirrored as `theme.json` presets for the editor.

Done when every text and background pair passes contrast (4.5:1 body, 3:1 large text and controls) and the tokens are documented.

### 6. Build templates, parts and patterns

Build in this order: header, footer and navigation; `index`, `page` and `single`; front page; archive, search and 404; special templates. Then:

- Make each repeated section a pattern; keep it workable in content-only mode (WordPress 7.0 and later). Custom blocks mark editable attributes with `"role": "content"`.
- Prefer core blocks, including the Tabs and Playlist blocks added in 7.1, before writing custom ones. Add front-end behaviour with the Interactivity API.
- Use synced patterns with overrides for sections that keep one layout but change words.
- Put post types, custom fields and integrations in a companion plugin (use `wp-companion-plugin` if installed).
- Test editor scripts in the always-iframed editor (7.1): use `ownerDocument`, not the global `document`.

Done when every template in the inventory renders with realistic content and matches the editor view.

### 7. Make content editable and seed it

Ship starter content as patterns, not hard-coded text. Creating pages or menus in a database is a data change: do it on a local site only, after approval.

```bash
wp post create --post_type=page --post_status=draft --post_title="<page-title>" --path=<wp-path>
```

For moving existing content, settings or Site Editor changes into files, use `wp-theme-content-migrations` if installed; otherwise record every change and test it on a copy of real data.

### 8. Verify

Work through [references/verification-checklist.md](references/verification-checklist.md) and record the evidence. Fix failures and re-run the affected checks. For deeper audits, use `wp-accessibility-audit` and `wp-performance` if installed; when they are not, the checklist is the minimum standard. Done when every line is marked pass, fail with a fix, or not applicable, and the user has accepted any remaining gaps.

## Ask before acting

Get explicit approval before you:

- install plugins, fonts from third-party services, npm or Composer packages, or paid assets;
- generate or buy images, or use photos whose licence is unknown;
- activate a theme, or create, edit or delete pages, menus, templates or global styles in any shared database;
- clear Site Editor database overrides;
- deploy, publish or change a staging or production site. Use `site-preview-and-publish` if installed.

## Output

Hand back:

1. The confirmed brief and the chosen direction with the reasons.
2. A token summary (colour roles with contrast results, type scale, spacing, widths, breakpoints).
3. The completed page and state inventory.
4. Files created or changed, and anything stored in the database.
5. The completed verification checklist with evidence and known gaps.
6. Next step: usually `wp-theme-release-gate` and `wp-seo-build-and-release`, if installed.
