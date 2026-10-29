# Accessibility audit: <site-name>

- **Standard**: WCAG 2.2 level AA (unless agreed otherwise: <standard>)
- **Environment tested**: local / staging / production
- **Dates tested**: <yyyy-mm-dd> to <yyyy-mm-dd>
- **Prepared by**: <name or agent>
- **WordPress version / theme**: <x.y.z> / <theme-slug>
- **Key plugins in scope**: <form plugin, cookie banner, slider, etc.>

> This report records findings for the pages and journeys listed below on the dates tested. It is not a statement of legal compliance and does not cover pages that were not tested.

## 1. Summary

- **Overall**: <one or two sentences: can disabled visitors complete the key journeys?>
- **Blockers**: <count> | **High**: <count> | **Medium**: <count> | **Low**: <count>
- **Most important fixes**: <the three changes that would help most>

## 2. Scope and sample

| # | URL | Template | Why included |
| --- | --- | --- | --- |
| 1 | `https://example.com/` | Front page | Main entry point |
| 2 | `https://example.com/<path>/` | | |

### Journeys

| Journey | Start URL | Keyboard result | Screen reader result |
| --- | --- | --- | --- |
| <e.g. Submit contact form> | | Pass / Fail / With difficulty | Pass / Fail / Not tested |

## 3. Methods and tools

| Method | Tool and version | Browser / OS | Notes |
| --- | --- | --- | --- |
| Automated scan | <axe DevTools x.y / WAVE / Lighthouse> | | Starting point only; every result checked by hand |
| Keyboard | — | | |
| Screen reader | <NVDA x.y / VoiceOver> | | Spot checks, not a full screen reader audit |
| Zoom and reflow | Browser zoom 200% and 400%, 320 px viewport | | |
| Reduced motion | OS setting | | |
| Contrast | <contrast tool> | | |

### Not tested

List anything out of scope or not possible: <e.g. logged-in member area, PDFs, iOS VoiceOver, third-party payment page>.

## 4. Findings

| ID | Severity | WCAG SC (level) | URL / journey | Issue | Steps to reproduce | Expected | Owner | Suggested fix |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A11Y-01 | Blocker | 2.1.2 (A) | | | | | Theme / Plugin / Content | |
| A11Y-02 | High | | | | | | | |

Severity: **Blocker** stops a key journey; **High** serious difficulty or level A failure on a key page; **Medium** AA failure with a workaround; **Low** minor, best practice or AAA.

Owner: **Theme** (templates, patterns, CSS, `theme.json`), **Plugin** (name it; may need the vendor), **Content** (editors), **Site settings**.

## 5. Editor and content guidance

- Gaps found in the editing experience:
- Suggested guidance for content authors (alt text, headings, link text, tables, documents):

## 6. Positive findings

What already works well and should be kept.

## 7. Next steps

| Priority | Action | Owner | Needs approval |
| --- | --- | --- | --- |
| 1 | | | |

Re-test fixed items with the same journey checklist and record the date and result.

## 8. Appendices

- Completed journey checklists (one per journey)
- Automated scan exports
