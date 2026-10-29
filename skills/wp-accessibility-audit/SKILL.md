---
name: wp-accessibility-audit
description: Audits a WordPress site or theme against WCAG 2.2 AA by testing real visitor journeys with keyboard, screen reader spot checks (NVDA, VoiceOver), 200% and 400% zoom, reduced motion and contrast, using automated tools only as a starting point. Covers WordPress-specific checks such as skip links, Navigation block submenus, focus styles in theme.json, alt text, Contact Form 7 labels and errors, embeds and editor accessibility. Use when the user mentions accessibility, a11y, WCAG, axe, WAVE, Lighthouse accessibility, an accessibility statement or the Equality Act. For the general theme build baseline use `wp-theme-foundations`.
license: MIT
metadata:
  author: AyXDesigns
  version: "0.2.0"
---

# WordPress accessibility audit

Test whether disabled people can complete the journeys that matter on a WordPress site, record failures against WCAG 2.2 AA, and say who owns each fix: the theme, a plugin, or the content. The audit reports findings for the sample tested; it never certifies a whole site as "compliant".

## Before you start

Confirm, or ask the user:

- **Target standard**: WCAG 2.2 level AA unless the user names another. If a contract or regulation requires an older version, record it.
- **Scope**: which environment (local, staging, production), which templates, and which 3–6 journeys matter most (for example: find a service, read an article, make a donation, submit the contact form, search).
- **What is being audited**: the theme (templates, patterns, styles), the content (posts written by editors), plugins (forms, sliders, cookie banners), or all three. Ownership changes who fixes what.
- **Assistive technology available**: Windows with NVDA, macOS or iOS with VoiceOver, or neither. If neither, say screen reader checks were not done.
- **Users and context**: public sector body, charity, business. This affects which UK duties apply (see "UK context" below).

Version-sensitive facts (as of October 2026, re-check at <https://www.w3.org/TR/WCAG22/>):

- WCAG 2.2 added nine success criteria; six are at level A or AA: 2.4.11 Focus Not Obscured (Minimum, AA), 2.5.7 Dragging Movements (AA), 2.5.8 Target Size (Minimum, AA), 3.2.6 Consistent Help (A), 3.3.7 Redundant Entry (A) and 3.3.8 Accessible Authentication (Minimum, AA).
- 4.1.1 Parsing is obsolete and removed in WCAG 2.2.
- Reduced motion for interaction-triggered animation is 2.3.3 Animation from Interactions, which is level AAA. Auto-moving content such as carousels falls under 2.2.2 Pause, Stop, Hide (A).

## Workflow

### 1. Agree the sample

List the URLs and journeys in the report before testing. Include at least: home, one standard page, one post, an archive or search results page, the 404 page, every form, and any page with a carousel, tabs, accordion, map or video. Test the mobile menu as well as the desktop one.

**Done when** the user has agreed the sample, or you have recorded your assumptions.

### 2. Run an automated scan as a starting point

Automated tools catch only a minority of WCAG failures, mostly machine-checkable ones (missing alt, contrast, missing labels, ARIA errors). They cannot judge whether alt text is meaningful, whether focus order makes sense, or whether a journey can be finished. Present the options as a short question with choices:

| Tool | Advantages | Disadvantages | Cost and effort | Suits |
| --- | --- | --- | --- | --- |
| axe DevTools browser extension | Low false positives; clear WCAG mapping; widely trusted rules (axe-core) | Free tier tests one page at a time; guided tests are paid | Free core, paid Pro | Developers and most audits |
| WAVE browser extension | Visual overlay shows issues in place; good for structure and headings | More noise; overlay can confuse beginners | Free | Content teams, quick visual review |
| Lighthouse accessibility (Chrome DevTools) | Built in; nothing to install | Runs a subset of axe rules; a 100 score does not mean accessible | Free | Quick check when nothing else is allowed |
| An accessibility checker plugin in WordPress | Checks content inside the editor; helps editors fix their own posts | Adds a plugin to the site; varying quality; can slow the editor | Free and paid tiers; install on staging first | Sites with many editors |

Recommend one (usually axe DevTools plus WAVE for headings) and wait for the user's choice before installing anything. Optional command-line scanning with `npx @axe-core/cli https://example.com/` downloads a package, so ask first. Record tool name and version in the report.

**Done when** each sample URL has an automated result saved, and every automated finding has been checked by hand before it goes in the report.

### 3. Test the journeys by hand

Work through [references/journey-checklist.md](references/journey-checklist.md) for each journey. In summary:

- **Keyboard only**: Tab, Shift+Tab, Enter, Space, Escape and arrow keys. Every control reachable, focus always visible and not hidden behind sticky headers or cookie banners (2.4.11), logical order, no traps.
- **Screen reader spot checks**: NVDA with Firefox or Chrome on Windows; VoiceOver with Safari on macOS or iOS. Check headings list, landmarks, links list, form labels, error announcements, and the names of icon buttons.
- **Zoom and reflow**: 200% browser zoom (1.4.4 Resize Text) and a 320 CSS pixel wide viewport, equal to 400% zoom at 1280 pixels (1.4.10 Reflow). No horizontal scrolling for text content, nothing cut off or overlapping.
- **Text spacing**: apply the 1.4.12 Text Spacing overrides with a bookmarklet or user stylesheet; text must not be clipped.
- **Reduced motion**: turn on the operating system setting and check that parallax, auto-playing carousels, scroll animations and video backgrounds stop or reduce.
- **Contrast**: text 4.5:1 (3:1 for large text) under 1.4.3; interface components and focus indicators 3:1 under 1.4.11. Check hover, focus and disabled states and text over images.
- **Target size**: controls at least 24 by 24 CSS pixels or with enough spacing (2.5.8).

**Done when** every journey has a pass, fail or "not tested" result for each check, with notes.

### 4. Check WordPress-specific areas

| Area | What to check | Usual owner |
| --- | --- | --- |
| Skip link | First Tab shows a visible "Skip to content" link that moves focus to the main content. Block themes get one from core when the template has a `<main>` element; classic themes must provide their own. | Theme |
| Navigation block | Mobile overlay opens and closes by keyboard, Escape closes it, focus returns to the toggle; submenus have `aria-expanded` and work on click (check the "Open on click" setting) rather than hover only. | Theme, site settings |
| Focus styles | Visible focus on links, buttons and form fields. Look for `outline: none` in theme CSS. In `theme.json`, `styles.elements.link` and `styles.elements.button` accept `:focus` (and `:focus-visible` in recent versions; check the theme.json reference for the installed WordPress version). | Theme |
| Headings | One `h1` per page from the template title; editors not adding a second `h1` or skipping levels for styling. | Theme and content |
| Alt text | Meaningful alt for informative images, empty alt for decorative ones. The Image block stores its own alt in the post content, so changing alt in the Media Library does not update images already placed. Featured images use the library alt. | Content |
| Link text | No "click here" or "read more" without context; "read more" links on archives need the post title in their accessible name. | Theme and content |
| Forms (Contact Form 7 and others) | Every field has a visible label, not only a placeholder; required fields are indicated in text; errors are announced (check the rendered markup for `aria-invalid`, `aria-describedby` and a live region for the response message); focus moves sensibly after submit. CAPTCHA does not block 3.3.8. | Form plugin and content |
| Embeds and media | Iframes have a meaningful `title`; video has captions, and transcripts where needed; nothing autoplays with sound. | Content, embed provider |
| Interactive blocks | Tabs (WordPress 7.1), Accordion, sliders and dialogs: keyboard support, correct roles and states, focus handling. Test plugin blocks the same way. | Core, theme or plugin |
| Colour palette | `theme.json` palette pairs meet contrast, so editors cannot easily pick failing combinations. | Theme |
| Language | `<html lang>` matches the site language; parts in another language are marked. | Site settings, content |
| Cookie or consent banner | Reachable by keyboard, does not trap focus, does not hide focused content. | Plugin |

### 5. Check the editing experience

Content authors cause and fix many issues, and some authors are disabled themselves. Check:

- Does the theme's editor styling keep contrast and focus visible in the post editor (always iframed in WordPress 7.1)?
- Do custom blocks and patterns expose alt text, heading level and link text controls, and keep content-only editing usable by keyboard?
- Is there short guidance for editors on alt text, headings, link text, tables and PDFs? If not, list it as a recommendation.

### 6. Rate and assign findings

For each finding record: WCAG success criterion and level, journey and URL, steps to reproduce, what happened, expected result, severity, owner, and a suggested fix.

| Severity | Meaning |
| --- | --- |
| Blocker | A user cannot complete a key journey (for example keyboard trap, unlabelled submit, form errors not announced) |
| High | Serious difficulty or a level A failure on a key page |
| Medium | AA failure that causes real friction but has a workaround |
| Low | Minor issue, best practice, or AAA item noted for information |

**Done when** every failure has a severity, owner and fix, and nothing in the report is claimed beyond what was tested.

## UK context

This is general information, not legal advice; the user should take advice for their situation. As of October 2026, from <https://www.gov.uk/guidance/accessibility-requirements-for-public-sector-websites-and-apps>:

- The Public Sector Bodies (Websites and Mobile Applications) (No. 2) Accessibility Regulations 2018 apply to public sector bodies and to some non-government organisations, such as charities that are mostly publicly funded or provide essential public services. Other charities and businesses are generally exempt. GOV.UK guidance points those in scope to WCAG 2.2 AA and requires an accessibility statement.
- More broadly, the Equality Act 2010 (the Disability Discrimination Act 1995 in Northern Ireland) means UK service providers must make reasonable adjustments for disabled people, whether or not the regulations apply.

Do not tell the user whether they are legally compliant. Report findings and point them to the guidance.

## Ask before acting

- Installing any browser extension, command-line tool or WordPress plugin.
- Changing theme files, `theme.json`, plugin settings or content to fix issues (the audit is read-only by default).
- Running automated scans against a production site with heavy crawl settings, or against any site the user does not own or manage.
- Publishing or updating an accessibility statement.

## Output

Hand back a report using [references/audit-report-template.md](references/audit-report-template.md): scope and sample, methods and tools with versions, journey results, findings by severity with owner and fix, what was not tested, and suggested next steps. Attach the completed [references/journey-checklist.md](references/journey-checklist.md) as evidence.
