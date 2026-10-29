# Topic cluster map template

A cluster is one broad topic served by a hub page and supporting pages, each answering a distinct question, linked so readers and crawlers can move between them. Build it from evidence of shared intent (the same pages rank for the queries), not from a keyword list alone.

## Cluster summary

| Field | Value |
| --- | --- |
| Cluster name | `<topic>` |
| Broad intent | `<what people want overall>` |
| Business goal | `<enquiries for X / donations / product sales>` |
| Hub URL | `/<topic>/` |
| Cluster owner | `<role>` |
| Evidence | `<SERP review date, Search Console queries, strategy reference>` |
| Status | Planned / partly live / live |

## Pages

| URL | Role (hub / support) | Distinct question it answers | Intent | Page type | Status (live / planned / merge / retire) | Existing URL to merge or redirect | Owner | Review date |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| `/<topic>/` | Hub | "`<overview question>`" | Learn | Guide | Planned | | | |
| `/<topic>/<sub-question-slug>/` | Support | "`<specific question>`" | Learn | Guide | Live | | | |
| `/blog/<old-similar-post>/` | n/a | Same as above | | | Merge | into `/<topic>/<sub-question-slug>/` | | |

Rule: no two rows answer the same question. If they do, merge them and redirect the weaker URL (with approval).

## Links

| From | To | Anchor text idea | Placement (intro, body, related list, nav) |
| --- | --- | --- | --- |
| Hub | Each support page | | Body, where the subtopic is introduced |
| Each support page | Hub | | Intro or breadcrumb |
| Support A | Support B | | Body, where relevant |
| Cluster pages | Conversion page `/<service>/` | | Next-step section |

Checks:

- [ ] The hub links to every support page.
- [ ] Every support page links back to the hub.
- [ ] Each page is linked from at least one page outside the cluster (navigation or a related hub).
- [ ] Links use descriptive anchors, not "click here".
- [ ] Breadcrumbs reflect the hub and support relationship.

## Gaps and overlaps

| Type | Detail | Action |
| --- | --- | --- |
| Gap | People Also Ask question "`<...>`" not answered anywhere | Add section to `<page>` / new support page |
| Overlap | `<page A>` and `<page B>` both target "`<question>`" | Merge into A, redirect B |
| Off-topic | `<page>` does not serve this cluster's intent | Move to another cluster or retire |

## Measurement

Track the cluster as a group (all URLs under `/<topic>/`) as well as page by page. Baselines and checks: `seo-measure-and-monitor` if installed.

| Measure | Baseline | Check date |
| --- | --- | --- |
| Clicks to cluster pages | | |
| Conversions from cluster pages | | |
