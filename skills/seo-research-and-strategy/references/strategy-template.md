# SEO strategy template

Keep it short enough that the people acting on it will read it. Put detail in appendices.

## 1. Summary

`<Three to five sentences: the organisation's goal, the biggest search opportunity, what to do first, and what we decided not to do.>`

## 2. Context

| Field | Value |
| --- | --- |
| Organisation type and model | `<charity / local service / ecommerce / ...>` |
| Offerings in scope | |
| Audiences | |
| Markets and languages | |
| Goals and conversions | |
| Horizon | `<e.g. next two quarters>` |
| Data sources used | `<free / paid tool name / Search Console>` and dates |
| Prepared by, date | `<role>`, `<YYYY-MM-DD>` |

## 3. Where the site stands

Use first-party data where available; say "not available" otherwise.

- Current search visibility: `<summary from Search Console, or "no access">`
- Strongest pages and topics:
- Obvious technical blockers seen in passing (hand to `wp-seo-build-and-release` if installed):
- Authority: referring domains `<count, source, date>` against typical competitors `<range, source>`

## 4. Evidence register

| ID | Evidence | Type (observed / first-party / estimate / assumption) | Source | Date | Confidence |
| --- | --- | --- | --- | --- | --- |
| E1 | Comparison guides dominate "`<topic>` cost" results | Observed | SERP review, `<country>`, mobile | `<date>` | High |
| E2 | `<keyword>` about 1k–10k searches per month | Estimate | Keyword Planner range | `<date>` | Low |

## 5. Opportunities

| ID | Opportunity | Intent | Evidence IDs | Value to organisation (H/M/L) | Effort (H/M/L) | Risk | Prerequisites | Owner | Success measure | Priority (Now / Next / Later) |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| O1 | Create a "`<service>` costs" guide with real price ranges | Compare | E1, E2 | H | M | Prices change; needs quarterly review | Price list approved | `<role>` | Impressions and enquiries from the page after 3 months | Now |

## 6. Plan

### Now (next `<n>` weeks)
- O1 ...

### Next
-

### Later
-

## 7. Not doing, and why

| Idea | Reason rejected |
| --- | --- |
| A page per town in the region | No local evidence per town; would be thin, near-duplicate pages |
| Buying links | Against search engine spam policies; risk outweighs gain |

## 8. Risks and dependencies

| Risk | Likelihood | Mitigation | Owner |
| --- | --- | --- | --- |

## 9. Measurement

What success looks like and how it will be read. Baselines and monitoring: `seo-measure-and-monitor` if installed; otherwise list the measures and the date of the first check here.

| Measure | Baseline | Target or direction | Check date |
| --- | --- | --- | --- |

## 10. Handoffs

| Strand | Skill (if installed) or to-do |
| --- | --- |
| Page architecture | `wp-seo-discovery-brief` |
| Briefs and clusters | `seo-content-system` |
| Local visibility | `seo-local` |
| Structured data | `seo-structured-data` |
| Measurement | `seo-measure-and-monitor` |

## Appendices

- SERP review worksheet
- Competitor comparison
- Raw keyword list (labelled as estimates)
