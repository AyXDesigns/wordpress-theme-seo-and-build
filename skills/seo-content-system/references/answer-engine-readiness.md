# Answer-engine readiness

"AI search" covers Google's AI Overviews and AI Mode, chat assistants that search the web, and other answer engines. Much of what is sold as "AI optimisation" is unproven. This checklist sticks to practice that is either documented by a search engine or is plainly good for readers anyway.

## What Google documents (checked October 2026)

- There are no extra requirements and no special optimisation needed to appear in AI Overviews or AI Mode. A page must be indexed and eligible to show with a snippet. No new machine-readable files, AI text files or special schema are needed.
- The usual fundamentals apply: crawlable (robots.txt and CDN or firewall not blocking Googlebot), internal links, good page experience, important content in text, helpful images and video, structured data that matches visible text, current Business Profile and Merchant Center data where relevant.
- AI Overviews and AI Mode traffic is counted in Search Console's Performance report (Web search type). Separate generative AI performance reports were announced in June 2026 and reported as available to all sites from 31 August 2026.
- Controls: `nosnippet`, `data-nosnippet`, `max-snippet` and `noindex` limit what Search can show, including in AI features. `Google-Extended` in robots.txt controls use for training and grounding in other Google AI systems; it does not affect Search.
- Helpful content guidance: write for people first; make authorship clear; explain how content was made, including automation or AI where readers would expect to know; E-E-A-T is not a direct ranking factor, but trust matters most, especially on topics affecting health, money or safety.
- Spam policies: scaled content abuse covers generating many pages mainly to manipulate rankings with little value, however they are produced, including with generative AI, scraping and stitching.

Sources (re-check before quoting):

- <https://developers.google.com/search/docs/appearance/ai-features> (last updated 10 December 2025)
- <https://developers.google.com/search/docs/fundamentals/creating-helpful-content> (last updated 5 October 2026)
- <https://developers.google.com/search/docs/essentials/spam-policies> (last updated 28 August 2026)
- <https://developers.google.com/search/blog/2026/06/gen-ai-performance-reports>

## Checklist

| # | Check | How to verify | Why |
| --- | --- | --- | --- |
| 1 | Page is indexable and snippet-eligible | 200 status; no `noindex`, `nosnippet` or restrictive `max-snippet` unless intended; not blocked in robots.txt (use `wp-seo-build-and-release` checks if installed) | Documented eligibility requirement |
| 2 | The main question is answered plainly near the top | Read the first paragraph alone | Readers and any summariser find the answer quickly |
| 3 | Claims are specific and attributable | Numbers have units, dates and sources; first-hand claims say who did what | Vague claims cannot be verified or cited |
| 4 | Authorship and review are visible | Byline, author page, reviewer for high-risk topics | Helpful content guidance on "who" |
| 5 | Facts are consistent across the site | Name, prices, opening hours, service list match on every page and in structured data | Conflicting facts undermine trust; local details via `seo-local` if installed |
| 6 | Important content is in HTML text | Tables and key facts are not only in images, PDFs or scripts | Documented best practice |
| 7 | Headings describe the content below | Headings read as a sensible outline | Navigation for readers and parsers |
| 8 | Structured data matches visible content | Use `seo-structured-data` if installed | Documented; mismatch can lose eligibility |
| 9 | Dates are honest | "Updated" dates change only with real changes | Changing dates to seem fresh is a warning sign in Google's guidance |
| 10 | Original value exists | Data, examples, photos or experience not found in the top results | Summaries of summaries add nothing |
| 11 | AI crawler access is a deliberate decision | robots.txt rules for AI crawlers reflect the organisation's choice about training versus search visibility; check each provider's current crawler documentation, because names and purposes differ | Blocking a provider's search crawler can remove you from its answers |
| 12 | Bing is covered | Site verified in Bing Webmaster Tools; IndexNow considered for fast-changing sites (`seo-measure-and-monitor` if installed) | Several assistants draw on web search indexes beyond Google |

## llms.txt: optional and unproven

llms.txt is a proposal (September 2024, llmstxt.org) for a Markdown file at the site root that lists a site's most useful content for language models. It is not a formal standard. Google's documentation says no AI text files are needed for its AI features, and there is no public evidence that it affects visibility in any major answer engine.

If the user asks for it:

- Say clearly that it is optional and that benefits are unproven.
- Offer it only as a low-cost extra, after the checklist above is in good shape.
- Keep it accurate and short; it must not contradict the site.
- Ask before adding it, and record who maintains it.

Never promise that llms.txt, FAQ blocks, schema or any wording pattern will get a page cited by an AI system.

## Avoid

- Hidden text or separate content served only to bots (cloaking).
- Mass-produced question-and-answer pages created to catch AI queries (scaled content abuse).
- Invented authors, credentials, statistics or reviews.
- Tool scores ("AI visibility score") presented as measurements; they are vendor estimates.

## Measuring

Use Search Console's Performance and generative AI reports through `seo-measure-and-monitor` if installed. Referral traffic from assistants can be seen in analytics as referrals from their domains, but much is untracked; report it as indicative, not complete.
