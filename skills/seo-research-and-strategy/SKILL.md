---
name: seo-research-and-strategy
description: Research search opportunities and competitors, then turn the evidence into a prioritised SEO strategy. Covers keyword and topic demand, search intent, SERP review, People Also Ask, competitor and content-gap analysis, backlinks, ecommerce and international markets, with free sources (Search Console, Google Trends, Keyword Planner) or paid tools (Ahrefs, Semrush) offered as a costed choice. Use when someone asks for keyword research, "what should we rank for", competitor analysis, an SEO strategy, market research or a link building plan. Page architecture is `wp-seo-discovery-brief`; briefs are `seo-content-system`.
license: MIT
metadata:
  author: AyXDesigns
  version: "0.2.0"
---

# SEO research and strategy

Find where search demand meets what the organisation can genuinely offer, check who already serves that demand, and decide what to do first. The output is a strategy with its evidence, not a list of keywords.

## Before you start

Confirm, and ask the user when unknown:

- What the organisation offers, to whom, where, and which actions matter (enquiries, donations, sales, sign-ups).
- Business model: service, local, charity, publisher, ecommerce, software. It changes which modes apply.
- Markets and languages.
- Known competitors (business rivals), and whether the user wants search competitors (whoever ranks) identified too.
- Data already available: Search Console access, analytics, previous research, paid tool accounts.
- Budget for tools and the decision horizon (next quarter, next year).
- Who will act on the strategy: in-house editors, an agency, a developer.

## Workflow

### 1. Choose the research modes

Pick only those that change decisions:

| Mode | Use when |
| --- | --- |
| Opportunity and intent | Almost always: what people search for and what they expect to find |
| Competitor and content gap | The user names rivals, or results are crowded |
| Backlinks | Authority looks like the barrier: strong pages that still rank below weaker content |
| Ecommerce | Products and categories: category demand, product data quality, marketplace competition |
| International | More than one country or language |
| Local | Physical premises or a service area: use `seo-local` if installed; if not, record local queries and map-pack presence in the SERP review and flag local work as a gap |

### 2. Choose data sources

Ask about budget, existing accounts and how precise the numbers need to be, then present the options as a short question with choices, using `references/data-sources.md`:

| Option | Advantages | Disadvantages | Cost (October 2026; confirm) | Suits |
| --- | --- | --- | --- | --- |
| Free only: Search Console, Google Trends, Keyword Planner, manual SERP review, People Also Ask, autocomplete | First-party and Google-sourced; no third party sees your plans | No competitor keyword lists; Keyword Planner often shows ranges; slower | Free (Keyword Planner needs a Google Ads account) | Small sites, charities, early-stage plans |
| One paid suite for a research sprint (Ahrefs, Semrush or similar), cancelled after | Competitor keywords, backlinks, difficulty estimates fast | Modelled estimates; subscription terms and auto-renewal; account data held by vendor | Entry plans roughly US$130–140 per month billed monthly | One-off strategy for a competitive market |
| Ongoing paid suite | Trends over time, rank tracking, alerts | Recurring cost; easy to chase tool scores instead of users | As above, every month | Agencies and larger sites |
| Pay-per-use keyword or SERP APIs | Pay only for what you query; scriptable | Setup effort; credits can run away; still estimates | Usage-based | Technical teams with large keyword sets |

Recommend one with a reason, and wait. Never start a trial, enter payment details or spend credits yourself.

### 3. Build the seed list

Start from the organisation, not from a tool:

- Offerings, in the words customers use (ask for enquiry emails or sales call notes, with personal data removed).
- Search Console queries and landing pages, if available (Performance report, last 16 months, filter out branded queries). Only read what the strategy needs; recording baselines belongs to `seo-measure-and-monitor`.
- Autocomplete, People Also Ask and related searches for each offering.
- Google Trends for seasonality and relative interest between phrasings (Trends shows relative interest, not volumes).

Group the seeds into topics by shared intent: if the same pages rank for two phrases, they are probably one topic.

### 4. Review the search results

For each priority topic, look at the actual results page, using `references/serp-review-worksheet.md`. Use a private window, set the target country, and record the date: results vary by location, device and time.

Record: dominant page type (guide, service page, product list, tool, local pack, video, forum), intent (learn, compare, buy, find nearby, go to a known site), features (AI Overview, People Also Ask, local pack, shopping, video), who ranks (big brands, specialists, forums, government), and what a better page would need.

Done when each priority topic has a worksheet row and an intent label.

### 5. Analyse competitors and gaps

- Separate business competitors from search competitors; the latter are whoever ranks.
- For 3–5 search competitors, compare the page types they have that the site lacks, depth and evidence on shared topics, and unique assets (tools, data, case studies).
- A gap is worth filling only if the organisation can create something accurate and more useful, and the topic leads to its goals.

### 6. Backlinks (only if selected)

Free: Search Console Links report and Bing Webmaster Tools inbound links. Paid: the suite chosen in step 2. Look at referring domains (not raw link counts), topical relevance and pages that attract links. Plan realistic acquisition: partnerships, suppliers and members, local organisations, original data or resources people cite, digital PR. Never recommend buying links, link schemes or private networks; these are spam under Google's policies.

### 7. Prioritise and write the strategy

Score each opportunity on value to the organisation, evidence strength, effort and risk, then place it in Now, Next or Later. Keep observed facts, first-party data, tool estimates and assumptions in separate columns: never present a tool's search volume as a measured fact.

Write the strategy with `references/strategy-template.md`. Include a "Not doing" list with reasons: rejected ideas are as useful as chosen ones.

### 8. Hand off

- Page architecture and URLs: `wp-seo-discovery-brief` if installed.
- Briefs, clusters, comparison pages: `seo-content-system` if installed.
- Success measures and baselines: `seo-measure-and-monitor` if installed.
- Local visibility and Google Business Profile: `seo-local` if installed.
- Rich results and schema: `seo-structured-data` if installed.

If one is not installed, turn that strand into a to-do list inside the strategy.

## Ask before acting

- Signing in to, or authorising access to, any account (Search Console, analytics, Google Ads, paid tools).
- Starting a trial or subscription, buying credits, or running paid API queries.
- Entering the organisation's private data (customer lists, analytics exports) into a third-party tool.
- Contacting anyone for links or partnerships.

## Output

A strategy document from `references/strategy-template.md`, with the SERP worksheet attached. Every opportunity names its evidence source and date, confidence, expected value, effort, owner and success measure.
