---
name: wp-site-experience-build
description: Map, design, build, and verify a distinctive editable WordPress site while preserving project architecture, content ownership, accessibility, and local-versus-production boundaries.
---

# WordPress site experience build

Use for a new WordPress theme, a substantial redesign, or a coherent set of new templates/components. Use a narrower patch workflow for small changes.

Apply the shared contracts in `../wp-theme-foundations/references/theme-foundations.md` when this skill is installed as part of the complete pack. If that reference is unavailable, establish equivalent project-specific architecture, editing, security, accessibility, SEO, performance, and release contracts before implementation.

## Understand before building

Identify the canonical source, theme type, template hierarchy, content stores, plugin boundaries, dependencies, supported WordPress/PHP versions, build tools, and deployment constraints. Use direct inspection first. Create a code/document relationship map only when the repository is large enough that relationships remain unclear.

Record the page and state inventory before implementation. Include populated, empty, long-content, validation, error, success, dependency-missing, no-JavaScript, and responsive states where relevant.

## Design the experience

Define a clear visual argument tied to the organisation and visitor task. Establish typography, colour roles, spacing, layout widths, borders, depth, imagery, motion, and interaction states. Avoid generic component-library styling and decorative effects without purpose.

Check contrast, keyboard focus, zoom behaviour, reduced motion, touch targets, content reflow, readable line length, and error communication while designing, not as a final cosmetic pass.

## Build within WordPress

- Keep public copy editable through the agreed WordPress-native surface.
- Prefer core blocks, patterns, templates, and theme settings where they meet the need.
- Put durable functionality, sensitive storage, and cross-theme data ownership in an approved companion plugin when appropriate.
- Keep design tokens and component states consistent across front end and editor.
- Preserve existing project structure unless a migration and verification plan justifies a change.
- Add dependencies only when their operational owner, privacy impact, cost, renewal risk, and fallback are understood.

## Verify

Prove representative pages in the editor and rendered front end. Check responsive widths, keyboard/no-JavaScript behaviour, dependency failures, browser console/network errors, PHP logs, performance-sensitive assets, and content editability. Do not publish or deploy unless separately requested and authorised.
