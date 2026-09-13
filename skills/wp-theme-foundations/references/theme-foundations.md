# Theme foundations

## 1. Definition of ready

Before broad implementation, identify:

- canonical source and deployment destination;
- target WordPress and PHP versions;
- theme type: classic, block, hybrid, or child;
- required pages, archives, search, 404, forms, and special states;
- content owners and editing surfaces;
- plugin responsibilities and required fallbacks;
- privacy, safeguarding, accessibility, SEO, performance, browser, and support requirements;
- local, staging, production, rollback, and approval boundaries.

Record unresolved assumptions. Keep critical assumptions out of irreversible implementation.

## 2. Architecture

Use WordPress conventions appropriate to the chosen theme type.

### Classic themes

Provide the required stylesheet header and template fallback. Organise reusable PHP through focused includes and template parts. Follow the template hierarchy rather than routing every request through one custom template.

### Block themes

Use valid theme metadata, `theme.json`, block templates, template parts, patterns, and style variations only where required. Keep the Site Editor experience aligned with the front end. Prefer core blocks unless a custom block supplies durable behaviour that core blocks cannot provide.

### Hybrid and child themes

Document which system owns templates, styles, settings, and editor behaviour. In child themes, override only what must differ and account for parent-theme updates.

### Shared rules

- Prefix globally visible PHP symbols, options, transients, meta keys, handles, hooks, and generated identifiers.
- Keep bootstrap code small. Load modules deliberately and prevent duplicate definitions.
- Avoid putting long-lived business data or sensitive workflow ownership in a replaceable presentation layer.
- Use a companion plugin for durable functionality when changing themes must not remove it.
- Follow the existing repository structure unless a verified migration justifies change.

## 3. Content and editor ownership

Every visitor-facing value needs one named source of truth:

- page/post blocks for ordinary editorial copy;
- patterns for reusable layouts and starter content;
- navigation interfaces for menus;
- site/editor settings for genuine global presentation values;
- taxonomies or structured records for content that must be queried;
- companion plugins for durable operational data and sensitive integrations.

Do not hard-code normal editorial copy into templates when editors are expected to change it. Do not introduce a page builder or field framework without a demonstrated need, owner, maintenance plan, and fallback.

Define seed and migration behaviour. Seeds must be repeatable and must not overwrite diverged user content. Stored-data changes need clean-install and upgrade testing.

## 4. Template and state coverage

Inventory relevant templates and their states:

- front page, standard page, post, archive, taxonomy, search, 404, and special templates;
- empty, populated, long-content, missing-media, validation, success, error, and dependency-unavailable states;
- signed-out, editor, administrator, and restricted-role behaviour where relevant;
- narrow, medium, and wide layouts;
- JavaScript unavailable and reduced-motion behaviour where progressive enhancement applies.

One screenshot of the ideal page is not state coverage.

## 5. Design system and frontend implementation

Define a visual rationale before styling. Use a compact token system for colour roles, typography, spacing, content widths, breakpoints, borders, radii, shadows, and motion. Tokens must express project needs rather than reproduce a generic theme aesthetic.

- Keep CSS organisation understandable and predictable.
- Load scripts and styles only where needed.
- Use responsive media with intrinsic dimensions.
- Avoid layout shifts, hidden overflow, unreadable line lengths, and controls that depend on hover alone.
- Match editor presentation closely enough that content decisions remain trustworthy.
- Respect reduced motion and avoid animation that blocks content or interaction.

## 6. Accessibility baseline

Target the project's agreed accessibility standard, normally WCAG 2.2 AA for public charity/service work.

- Use semantic landmarks and a logical heading outline.
- Provide a visible skip link and reliable keyboard focus.
- Keep navigation, dialogs, disclosures, tabs, and forms operable by keyboard.
- Associate labels, instructions, errors, and status messages programmatically.
- Keep focus visible against every background and restore it after overlays close.
- Ensure sufficient contrast, zoom/reflow support, touch-target usability, and meaningful alternative text.
- Do not place focusable controls inside hidden or accessibility-hidden containers.
- Prefer progressive enhancement so essential content and actions survive script failure.

Verify representative journeys with keyboard, zoom, narrow viewport, reduced motion, and an accessibility inspection tool. Automated results do not replace interaction testing.

## 7. Security and privacy baseline

- Validate expected shape, then sanitise input for storage and escape output for its exact context.
- Use nonces for intent and capability checks for authorisation; a nonce does not grant permission.
- Use safe redirects and WordPress database APIs.
- Restrict uploads by necessity, type, size, access, retention, and malware-handling policy.
- Keep secrets outside theme source and public logs.
- Apply least privilege to private records and exclude them from public queries, REST exposure, and search unless explicitly required.
- Store only data required for an approved purpose. Define access, retention, export, and deletion ownership.
- Use additive security headers only after checking host/plugin ownership and caching behaviour.

Never store payment-card data or highly sensitive narratives in ordinary theme settings or generic form storage.

## 8. Integrations and failure states

For each plugin or service, define:

- why it exists and who owns it;
- version and compatibility expectations;
- data sent or stored;
- credentials and secret location;
- behaviour when unavailable or misconfigured;
- administrator warning and visitor-safe fallback;
- test and rollback method.

Do not call plugin classes or functions without checking availability at the point of use. A disabled optional plugin must not cause a public fatal error.

## 9. SEO ownership

Assign exactly one owner for titles, descriptions, canonicals, robots directives, XML sitemaps, redirects, social metadata, and structured data. Disable duplicate theme output when an approved plugin owns it.

- Use stable WordPress-generated URLs rather than hard-coded production domains.
- Keep indexation aligned with page purpose.
- Make important pages reachable through ordinary links.
- Emit structured data only for truthful, visible, qualifying content.
- Keep preview and staging environments out of public indexes; confirm production policy at launch.
- Inspect rendered output for duplicate or conflicting metadata.

## 10. Performance baseline

Set budgets appropriate to the project and measure before optimising.

- Avoid unnecessary dependencies, global assets, duplicate libraries, and blocking third-party requests.
- Use appropriately sized local or approved font/media assets.
- Protect the largest visible content from lazy loading mistakes.
- Account for cached and uncached behaviour, logged-in/editor differences, and form interactions.
- Diagnose PHP, database, cache, network, and frontend costs at their responsible layer.

Record test device/profile, environment, cache state, and measurement source. A score without reproducible conditions is weak evidence.

## 11. Internationalisation and language

Use a consistent text domain and translation-ready WordPress functions for interface strings. Keep editable content in WordPress content stores rather than translation calls. Support the project's directionality, locale formatting, language switcher, and hreflang requirements only when multiple locales are genuinely in scope.

## 12. Development and verification

Provide a repeatable non-destructive check covering applicable PHP syntax, coding standards, static checks, JavaScript, accessibility, and theme tests.

Verify:

- clean activation and representative routes;
- an empty debug log for tested journeys;
- missing-dependency states;
- editor changes appearing correctly on the front end;
- safe request handling and contextual escaping;
- clean-install and upgrade fixtures;
- responsive, keyboard, no-JavaScript, and form behaviour;
- rendered metadata and schema ownership;
- package integrity and correspondence with canonical source.

Use production-like historical data where saved state affects behaviour. Never treat a successful response message as proof that a form record was stored.

## 13. Documentation and release

Maintain enough documentation to reproduce and support the release:

- purpose, architecture, content ownership, and dependency inventory;
- install/configuration steps without secrets;
- design decisions and accessibility constraints;
- changes and their reasons;
- migrations and manual production actions;
- validation evidence, known limitations, and rollback procedure;
- exact theme/plugin versions and compatible platform versions.

Create a release archive from the intended source, validate the archive, and compare its contents with the canonical tree. Publishing and production changes require explicit authorisation.
