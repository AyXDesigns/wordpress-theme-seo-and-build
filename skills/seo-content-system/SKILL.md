---
name: seo-content-system
description: Plan and assess search content that is genuinely useful. Produces content briefs, topic cluster maps, comparison page plans and quality reviews, gates scaled page families against thin or duplicate output, and checks readiness for AI Overviews and answer engines using verifiable practice rather than hype. Use when someone needs a content brief, topic cluster, pillar page, content audit, "rewrite for SEO", E-E-A-T, helpful content, comparison or "vs" pages or programmatic pages, or has AI search, ChatGPT or llms.txt questions. Keyword research is `seo-research-and-strategy`; site structure is `wp-seo-discovery-brief`.
license: MIT
metadata:
  author: AyXDesigns
  version: "0.2.0"
---

# SEO content system

Decide what a page must contain to deserve its place in search, and keep a set of pages coherent as it grows. Quality is judged by whether a visitor's question is answered accurately and completely, by someone credible, not by keyword counts or tool scores.

## Before you start

Confirm, and ask when unknown:

- The visitor's question or task, and what they should be able to do after reading.
- Where the topic came from: a strategy from `seo-research-and-strategy` (use its intent labels and SERP notes), Search Console data, or the user's own idea.
- Who has the knowledge: named role, qualifications, first-hand experience. Health, money, legal, safety and safeguarding topics need a qualified reviewer.
- Evidence available: data, case studies, photos, prices, sources.
- Who edits and approves content, and the WordPress surface they use.
- Whether AI tools will draft text, and who checks it.

## Workflow

### 1. Pick the mode

| Request | Mode | Template |
| --- | --- | --- |
| "Is this page any good?", content audit, "why doesn't it rank" | Assess an existing page | Checklist in step 3 |
| New page or rewrite | Content brief | `references/content-brief-template.md` |
| Several related pages, pillar and cluster, blog plan | Topic cluster | `references/cluster-map-template.md` |
| "`<A>` vs `<B>`", alternatives, best-of | Comparison page | Brief plus rules in step 5 |
| Many pages from one template (locations, products, directory) | Scaled page family | Gate in step 6 |
| AI Overviews, ChatGPT, answer engines, llms.txt | Answer-engine readiness | `references/answer-engine-readiness.md` |

### 2. Check intent before writing

Use the SERP notes from `seo-research-and-strategy` if available. If not, look at the results page for the main query (private window, target country) and note the dominant page type. If the planned page is a different type from everything that ranks (a sales page where every result is a guide), fix the plan first: intent mismatch is the most common reason good writing does not rank.

Done when the brief or assessment states the intent and the page type, with the evidence.

### 3. Assess quality

Use these questions, adapted from Google's guidance on creating helpful, reliable, people-first content (checked October 2026; re-check the page, listed in `references/answer-engine-readiness.md`, before quoting it):

- Would someone who arrived directly, not from search, find this worth reading?
- Does it show first-hand experience or real expertise: who wrote it, how they know, what they did?
- Does it add something beyond what already ranks: original data, examples, a clearer method, a decision?
- Are claims specific, sourced and current? Are dates honest (not refreshed without real changes)?
- Is authorship clear, with a byline linking to information about the author? Is it clear how the content was made, including any AI use where readers would reasonably wonder?
- Does the reader leave able to act, with a clear next step?
- For high-risk topics: has a qualified reviewer checked it, and is that stated?

Rate each Yes / Partly / No with a line of evidence. Avoid keyword density targets, word count targets and AI-detector scores; they are not quality evidence.

### 4. Write the brief

Fill `references/content-brief-template.md`: purpose, audience, intent, the questions to answer in order, evidence to include, outline, internal links in and out, media, title and description direction, author and reviewer, and acceptance criteria someone else can check. Briefs set direction and facts; they do not dictate exact keyword placements.

### 5. Comparison and alternatives pages

- State the criteria and why they matter to the reader, before the verdict.
- Use verifiable facts with the date checked; link sources.
- Disclose the relationship (your own product, affiliate links, partners).
- Include where your option is not the best fit. A comparison that always wins is an advert.
- Plan a review date: prices and features go stale fast.

### 6. Gate a scaled page family

Before approving many pages from one template, every answer must be yes:

1. Is there a trustworthy data source for each page's unique content?
2. Would each page still be useful if its name or town were removed (is there real, page-specific substance)?
3. Is there demand for the individual pages, not just the pattern?
4. Is there an owner who keeps each page's data current?
5. Is there an index plan: thin or empty entries noindexed or not generated?
6. Has a sample of 5–10 pages passed the quality questions in step 3?
7. Is there a stop rule: if more than `<n>`% of generated pages fail QA, the family is paused?

If any answer is no, recommend fewer, stronger pages. Google's spam policies treat generating many low-value pages mainly to rank, however they are produced (including with AI), as scaled content abuse. Location pages: use `seo-local` if installed.

### 7. Build or update a cluster

Fill `references/cluster-map-template.md`: one hub page per broad intent, supporting pages for distinct sub-questions, and the links between them. Merge any two pages that answer the same question. Check that new pages fit the URL plan from `wp-seo-discovery-brief` if one exists.

### 8. Answer-engine readiness

Follow `references/answer-engine-readiness.md`. In short: Google states there is no special optimisation, file or markup needed for AI Overviews or AI Mode beyond normal SEO; a page must be indexed and eligible for a snippet. Make important facts clear, specific, in text, and attributable. Treat llms.txt as an optional, unproven idea.

### 9. Hand off

- Schema for articles, FAQs, products, reviews: `seo-structured-data` if installed; otherwise note the intended type in the brief and leave implementation to whoever builds.
- Publishing and SEO output checks: `wp-seo-build-and-release` if installed.
- Measuring the result: `seo-measure-and-monitor` if installed; otherwise state the measure and the date to check in the brief.

## Ask before acting

- Publishing, unpublishing, merging or redirecting any page.
- Rewriting content that has a named author or legal, medical or financial sign-off.
- Generating a batch of pages or drafts at scale.
- Adding llms.txt or changing robots.txt rules for AI crawlers.

## Output

- Assessment: the step 3 questions with ratings, evidence and the top three fixes.
- Brief: a filled `references/content-brief-template.md`.
- Cluster: a filled `references/cluster-map-template.md`.
- Scaled family: the step 6 gate answers and a go, reduce or stop recommendation.
- Readiness: the checklist from `references/answer-engine-readiness.md` with findings.

Never invent expertise, statistics, quotes, reviews, case studies, credentials or customer outcomes. Mark anything that needs a fact from the user as `<needs source>`.
