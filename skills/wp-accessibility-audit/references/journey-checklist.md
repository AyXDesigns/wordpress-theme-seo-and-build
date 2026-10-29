# Journey checklist

Copy this file once per journey. Mark each line **Pass**, **Fail** (add a finding ID), **N/A** or **Not tested**. Note the browser, assistive technology and versions used.

- **Journey**: <e.g. "Submit the contact form">
- **Start URL**: `https://example.com/<path>/`
- **Steps a visitor takes**: <1. ... 2. ... 3. ...>
- **Environment**: local / staging / production
- **Tested with**: <browser + version>, <NVDA / VoiceOver + version or "none">, <OS>

## 1. Keyboard only (mouse unplugged or untouched)

| Check | WCAG | Result | Notes |
| --- | --- | --- | --- |
| First Tab shows a visible skip link that moves focus to main content | 2.4.1 | | |
| Every link, button, field and custom control is reachable with Tab | 2.1.1 | | |
| Focus order follows the visual and reading order | 2.4.3 | | |
| Focus indicator is visible on every focusable element, on every background | 2.4.7 | | |
| Focused element is not hidden by a sticky header, footer, cookie banner or chat widget | 2.4.11 | | |
| No keyboard trap; Escape closes menus, dialogs and overlays | 2.1.2 | | |
| Focus returns to the trigger after a menu or dialog closes | 2.4.3 | | |
| Mobile navigation overlay opens, works and closes by keyboard | 2.1.1 | | |
| Submenus open on Enter or Space, not only on hover; `aria-expanded` updates | 4.1.2 | | |
| Tabs, accordions and sliders work with the expected keys | 2.1.1 | | |
| Anything that can be dragged also works with a single click or tap | 2.5.7 | | |
| The journey can be completed end to end | — | | |

## 2. Screen reader spot checks

Windows: NVDA with Firefox or Chrome. macOS or iOS: VoiceOver with Safari.

| Check | WCAG | Result | Notes |
| --- | --- | --- | --- |
| Page title is unique and describes the page | 2.4.2 | | |
| Headings list makes sense: one `h1`, no skipped levels used for styling | 1.3.1 | | |
| Landmarks present: header, navigation, main, footer; navigation regions have distinct names | 1.3.1 | | |
| Links list makes sense out of context (no bare "read more" or "click here") | 2.4.4 | | |
| Images: informative images have useful alt; decorative images are silent | 1.1.1 | | |
| Icon-only buttons (search, menu, close, social) have a spoken name | 4.1.2 | | |
| Form fields announce their label, required state and any hint | 3.3.2, 1.3.1 | | |
| Errors are announced and linked to their fields | 3.3.1, 4.1.3 | | |
| Success message after submit is announced | 4.1.3 | | |
| Expanded and collapsed states are announced for menus and accordions | 4.1.2 | | |
| `<html lang>` is correct, so the voice uses the right language | 3.1.1 | | |

## 3. Zoom, reflow and text spacing

| Check | WCAG | Result | Notes |
| --- | --- | --- | --- |
| At 200% browser zoom, all text is readable and nothing is cut off | 1.4.4 | | |
| At 320 CSS pixels wide (400% zoom at 1280 px), no horizontal scrolling for text content | 1.4.10 | | |
| At 400%, menus, forms, tables and dialogs are still usable | 1.4.10 | | |
| With text spacing overrides applied, text is not clipped or overlapping | 1.4.12 | | |
| Content does not depend on one orientation | 1.3.4 | | |

## 4. Motion and time

| Check | WCAG | Result | Notes |
| --- | --- | --- | --- |
| Carousels and anything moving for more than 5 seconds can be paused | 2.2.2 | | |
| With "reduce motion" on in the operating system, parallax and scroll animations stop or reduce | 2.3.3 (AAA) | | |
| Nothing flashes more than three times a second | 2.3.1 | | |
| Video and audio do not autoplay with sound | 1.4.2 | | |
| Session or form timeouts warn the user and allow more time | 2.2.1 | | |

## 5. Colour and contrast

| Check | WCAG | Result | Notes |
| --- | --- | --- | --- |
| Body text at least 4.5:1; large text at least 3:1 | 1.4.3 | | |
| Text over images or gradients meets contrast at every breakpoint | 1.4.3 | | |
| Buttons, field borders, icons and focus indicators at least 3:1 against adjacent colours | 1.4.11 | | |
| Hover, focus, visited and disabled states checked | 1.4.3, 1.4.11 | | |
| Information is not shown by colour alone (links in body text, errors, charts) | 1.4.1 | | |

## 6. Forms and help

| Check | WCAG | Result | Notes |
| --- | --- | --- | --- |
| Every field has a visible label (placeholder is not a label) | 3.3.2 | | |
| Inputs that collect personal data use the right `autocomplete` values | 1.3.5 | | |
| Error messages say what is wrong and how to fix it | 3.3.1, 3.3.3 | | |
| Information already given in this journey is not asked for again, or is pre-filled | 3.3.7 | | |
| Login or form verification does not rely on a puzzle or memory test without an alternative | 3.3.8 | | |
| Help or contact links appear in the same relative place on every page | 3.2.6 | | |
| Controls are at least 24 by 24 CSS pixels, or spaced enough | 2.5.8 | | |

## 7. Media and embeds

| Check | WCAG | Result | Notes |
| --- | --- | --- | --- |
| Pre-recorded video has accurate captions | 1.2.2 | | |
| Audio-only content has a transcript | 1.2.1 | | |
| Embedded iframes (video, maps, forms) have a meaningful `title` | 4.1.2 | | |
| Map content has a text alternative (address, directions) | 1.1.1 | | |
| Linked PDFs needed for the journey are accessible or have an accessible alternative | — | | |

## Journey result

- **Can a keyboard user complete it?** Yes / No / With difficulty
- **Can a screen reader user complete it?** Yes / No / With difficulty / Not tested
- **Finding IDs raised**: <A11Y-01, A11Y-02, ...>
