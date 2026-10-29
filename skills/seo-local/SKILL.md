---
name: seo-local
description: Plan, audit and improve local and service-area SEO for a WordPress site and its business listings, including Google Business Profile setup, verification, categories and service areas, NAP consistency, citations, ethical review requests, genuine location pages, LocalBusiness or NGO schema, and Bing Places or Apple Business listings. Use when the user mentions Google Business Profile, GBP, Google Maps, map pack, "near me", service area, NAP, citations, directory listings, reviews, branches, or a charity's local visibility. For market and competitor research use `seo-research-and-strategy`; for schema depth use `seo-structured-data`.
license: MIT
metadata:
  author: AyXDesigns
  version: "0.2.0"
---

# Local and service-area SEO

Use this skill to make a real organisation easy to find, and to trust, for people searching in a place: business profiles, consistent contact details, citations, reviews, location pages and local schema. It covers shops and offices, service-area businesses that travel to customers, hybrids of both, and charities or community organisations with premises or local services.

It does not cover keyword or competitor research (use `seo-research-and-strategy` if installed) or full pre-launch SEO checks (use `wp-seo-build-and-release` if installed). If those skills are not installed, note the gap in your output and keep to the local scope.

## Before you start

Confirm these facts. Ask the user for anything you cannot see for yourself:

- **Business model.** Storefront (customers visit), service-area (staff travel to customers), hybrid, or online-only. Online-only organisations are not eligible for a Google Business Profile; say so plainly rather than looking for a workaround.
- **Legal and trading names**, exactly as they appear on signage, stationery and any register (Companies House, a charity regulator).
- **Address** and whether customers are served there. Virtual offices, PO boxes and mailbox addresses are not eligible. A co-working desk qualifies only with signage, staff present and customers received during stated hours.
- **Phone number** that reaches this location and is under the organisation's control. Note any call-tracking numbers.
- **Opening hours**, seasonal or holiday hours, and appointment-only arrangements.
- **Service areas** (towns, postcode districts or regions) for service-area or hybrid businesses.
- **Existing listings** and who controls them: Google Business Profile, Bing Places, Apple, Facebook, sector directories. Who has owner or manager access?
- **Charity or nonprofit status**: regulator (Charity Commission for England and Wales, OSCR, Charity Commission for Northern Ireland), registered number, company number if incorporated.
- **Budget and appetite** for paid listing tools or directories.
- **Website facts**: active SEO plugin (Yoast, Rank Math, SEOPress or none), where contact details are stored (theme options, a block pattern, a widget, hard-coded template), and whether location pages exist.

Do not create, claim or edit any listing until the user has confirmed who owns it and authorised the change.

## Workflow

### 1. Agree one canonical business record

Write a single approved record of name, address, phone, website URL, hours, categories and service areas. Every listing, the website footer, the contact page and the schema must match it. Use the record section of [references/local-audit-template.md](references/local-audit-template.md).

Done when the user has approved the record, including the exact formatting of the address and phone number.

### 2. Audit what the website says now

Find every place the site shows contact details, so they all match the record. Start read-only.

```bash
# Phone-number-like strings on key pages (UK formats; adjust the pattern)
curl -sL https://example.com/contact/ | grep -oE '(\+44 ?|0)[0-9][0-9 ]{8,12}' | sort -u

# Search the database for an old number or address (read-only)
wp db search '<old-phone-or-postcode>' --path=<wp-path>
wp plugin list --status=active --fields=name,version --path=<wp-path>
```

```powershell
$html = (Invoke-WebRequest -UseBasicParsing -Uri 'https://example.com/contact/').Content
[regex]::Matches($html, '(\+44 ?|0)[0-9][0-9 ]{8,12}') | ForEach-Object { $_.Value.Trim() } | Sort-Object -Unique

wp db search '<old-phone-or-postcode>' --path=<wp-path>
wp plugin list --status=active --fields=name,version --path=<wp-path>
```

Also check the footer, header, contact page, embedded map, any `LocalBusiness` or `Organization` JSON-LD, and the SEO plugin's organisation settings. Record mismatches in the audit template.

Done when each place that shows contact details is listed with its source (option, pattern, widget or template) and whether it matches.

### 3. Google Business Profile

Facts below are from Google's guidelines as of October 2026. Re-check <https://support.google.com/business/answer/3038177> and <https://support.google.com/business/answer/9157481> before advising.

- **Name**: the real-world name only. Adding keywords, locations or taglines breaks the guidelines and risks suspension.
- **Categories**: choose the most specific primary category that completes "This organisation is a…". Use as few additional categories as possible, and never categories for services alone.
- **Service-area businesses**: one profile for the base, with the address hidden if customers do not visit. Up to 20 service areas, and the overall area should not usually go beyond about two hours' drive from the base.
- **Hybrid businesses** show the address and also set service areas.
- **Verification**: Google chooses which methods are offered (video recording and live video call are common). Help the user prepare: signage, proof of management, and for service-area businesses, vehicles or equipment. Do not attempt verification on their behalf.
- **Phone and website**: a local number controlled by the organisation; a website URL for this location, not a social profile or a redirect.
- **Departments and practitioners**: separate profiles only where Google's rules allow them. Do not create profiles for each service.

Done when the profile matches the canonical record and the user has completed or scheduled verification themselves.

### 4. Other map and listing platforms

Present these as a short choice with advantages and disadvantages. Recommend based on the audience; never sign the user up yourself.

| Option | Advantages | Disadvantages | Cost and effort | Suits |
|---|---|---|---|---|
| Bing Places for Business (now under bing.com/forbusiness, as of October 2026) | Free; can import from a verified Google profile; shows in Bing search and Bing Maps | Smaller UK share than Google; an import still needs checking | Free, about 30 minutes | Most organisations once Google is correct |
| Apple Business (Maps place cards; previously branded Apple Business Connect, now reached from business.apple.com) | Reaches iPhone Maps and Siri users; logo, photos and actions on the place card | Separate Apple account and verification; features vary by region | Free listing; optional paid Maps ads | Storefront and hybrid businesses with walk-in visitors |
| Sector or regulator directories (trade bodies, professional registers, local council or voluntary-sector directories) | Strong relevance and trust; often required for credibility | Manual updates; some charge membership | Varies | Regulated professions, charities, community services |
| Paid listing-management service | One dashboard pushes data to many directories | Recurring cost; listings may revert if you cancel; adds a supplier | Monthly fee | Multi-location organisations with frequent changes |

Done when the user has chosen which platforms to manage and who will own each login.

### 5. Citations and NAP consistency

A citation is any mention of the name, address and phone number elsewhere online. Consistency matters more than volume.

- Start with listings that already exist: search for the name, old addresses and old phone numbers, and correct or close duplicates.
- Add only relevant, well-maintained directories. Examples for the UK: a general directory such as Yell, the chamber of commerce, the relevant trade or professional body, the local authority's community directory, and for charities the local council for voluntary service (CVS) directory.
- Offer paid directories or aggregators only as a choice with cost, benefit and the free alternative (section 4).
- Never create listings for addresses the organisation does not operate from.

Done when the citations table in the audit template lists each listing, its status and the action needed.

### 6. Reviews: ethical acquisition only

Check Google's current policy before advising: <https://support.google.com/contributionpolicy/answer/7400114>. As of October 2026 it prohibits:

- offering money, discounts, gifts or free services in exchange for a review, or for changing or removing one;
- review gating: asking only happy customers, or discouraging negative reviews;
- reviews by staff, owners or others with a conflict of interest, and staff quotas for reviews.

In the UK, the Digital Markets, Competition and Consumers Act 2024 has banned fake reviews and concealed incentivised reviews since 6 April 2025. The CMA's guidance (CMA208) expects organisations that publish reviews to take reasonable steps to prevent and remove them.

Recommend instead: ask every customer in the same way, at a natural point (after a completed job, on the receipt, in a follow-up email that also goes to unhappy customers), with a direct review link. Reply to reviews politely and promptly. For charities and sensitive services, never confirm in a reply that the reviewer is a service user, and keep safeguarding information out of public replies.

Do not mark up the organisation's own reviews of itself with `aggregateRating`. Google treats these as self-serving and they are not eligible for star results.

### 7. Location pages: only with genuine, unique content

Create a location page only where the organisation really serves people from that place and can say something specific about it.

| Situation | Action |
|---|---|
| A staffed branch, office or venue | One page per location, with address, hours, directions, staff or team, photos, local services and local evidence |
| A service area with real local work (case studies, projects, partners) | One area page with that evidence; link it from the service pages |
| A long list of towns with nothing unique to say | Do not create pages. List the areas served on one service-area page |
| Pages that differ only by the place name | Remove or consolidate them. These are doorway pages and risk a spam action |

For a family of pages, hand off to `seo-content-system` if installed. If it is not installed, apply the table above and cap the set at the locations with genuine content.

### 8. Local schema

Mark up the organisation once, on the home or contact page, and each real location on its own page, matching the canonical record and the visible content. Use a specific `LocalBusiness` subtype where one fits, or `Organization` (or `NGO`) where it does not. As of October 2026, Google requires `name` and `address` for `LocalBusiness`; a service-area business that hides its address may be better served by `Organization` with `areaServed`.

For type choice, plugin integration, code and validation, use `seo-structured-data` if installed. If it is not installed, extend the active SEO plugin's organisation settings rather than adding a second graph, and validate with the Rich Results Test and the Schema Markup Validator.

### 9. Charity and nonprofit specifics

- **Schema**: `NGO` is a schema.org subtype of `Organization`. schema.org also defines `nonprofitStatus` with UK values (`CharitableIncorporatedOrganization`, `LimitedByGuaranteeCharity`, `UKTrust`, `UnincorporatedAssociationCharity`). Use them only when they match the regulator's record. Google does not list them among its Organization properties, so present them as accurate description, not as a ranking or rich result tactic.
- **Charity number display** (operational guidance, not legal advice; confirm with the regulator):
  - Scotland: the Charities References in Documents (Scotland) Regulations 2007, as amended, require the charity's name, number and (where the name does not say so) charitable status on documents including the home page of its website, from 1 May 2012.
  - England and Wales: section 39 of the Charities Act 2011 requires a registered charity with gross income over £10,000 in its last financial year to state that it is registered on fundraising notices and advertisements and on certain financial documents. Showing the registered name and number in the site footer is a simple way to cover fundraising pages.
  - Northern Ireland: check the Charity Commission for Northern Ireland's current guidance.
- **Profiles**: choose the Google category that describes what the organisation is (for example a charity, community centre or food bank category, where one exists in the list), not the causes it supports.
- Do not claim "registered charity" status, accreditation or awards unless the user confirms them and they can be checked on the public register.

### 10. Measure

Agree a few measures before changing anything: profile views, calls, direction requests and website clicks from the profile; branded and local queries in Search Console; and conversions from location pages. Offer a choice on tagging the profile's website link with UTM parameters:

- **Tag it**: clearer attribution in analytics; adds parameters to the URL (keep the canonical tag clean).
- **Leave it untagged**: simpler and tidier URLs; profile traffic is harder to separate from other organic visits.

Use `seo-measure-and-monitor` if installed for baselines and ongoing checks.

## Ask before acting

Get explicit approval before you:

- create, claim, edit, verify or request ownership of any listing or profile;
- change the website's contact details, footer, schema or SEO plugin settings;
- create, merge, redirect or delete location pages;
- sign up for, or spend money on, any directory, listing tool or review platform;
- send review requests, or reply to reviews on the organisation's behalf.

## Output

Return a completed copy of [references/local-audit-template.md](references/local-audit-template.md): the canonical record, profile and platform status, citation actions, review practice, location-page decisions, schema status, charity notes, and a prioritised findings list. Each finding needs evidence, an owner, an acceptance test and a date checked.
