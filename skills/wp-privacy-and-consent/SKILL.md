---
name: wp-privacy-and-consent
description: Operational UK GDPR, Data Protection Act 2018 and PECR guidance for WordPress sites, covering cookie and storage inventories, consent banners, analytics choices, consent plugins, WordPress privacy tools, form data minimisation and retention, embeds and international transfers. Not legal advice. Use when the user mentions cookies, cookie banner, consent, GDPR, PECR, ICO, privacy policy, Google Analytics, GA4, Consent Mode, Tag Manager, Complianz, CookieYes, Cookiebot, tracking pixels, YouTube or Google Maps embeds, or export and erase requests. For Contact Form 7 and Flamingo storage use `wp-cf7-form-assurance`; for analytics reporting use `seo-measure-and-monitor`.
license: MIT
metadata:
  author: AyXDesigns
  version: "0.2.0"
---

# WordPress privacy and consent (UK)

Use this skill to find out what a WordPress site stores on or reads from visitors' devices, decide what needs consent, put a compliant consent mechanism in place, and use WordPress's own privacy tools. It applies UK GDPR, the Data Protection Act 2018 and the Privacy and Electronic Communications Regulations (PECR) as amended by the Data (Use and Access) Act 2025.

**This is operational guidance, not legal advice.** The Information Commissioner's Office (ICO, <https://ico.org.uk/>) is the UK regulator and the authority on interpretation. Tell the user to take legal advice for high-risk processing, special category data or anything this skill marks as uncertain.

## Before you start

Confirm, or ask the user:

- Who the controller is (the organisation that decides why and how data is used), and who owns privacy decisions.
- Where visitors are. Sites aimed at EU visitors must also consider EU GDPR and the ePrivacy rules of the relevant countries; this skill covers the UK only.
- What the site does: contact forms, donations or payments, shop, newsletter, membership or logins, comments, events, job applications.
- What is installed: consent plugin, analytics, Tag Manager, advertising pixels, embeds (video, maps, social), fonts or scripts from third-party hosts, CDN, form and CRM integrations.
- Whether the organisation has a privacy notice, a record of processing, data protection fee status with the ICO, and any DPIA for high-risk processing.
- Which environment you are working on. Test on local or staging first.

## The rules in brief, as of October 2026

Checked against ICO and legislation.gov.uk sources on 29 October 2026. Re-check before advising.

- **Storage and access (PECR regulation 6).** Storing or reading information on a device (cookies, local storage, pixels, fingerprinting) needs prior consent unless an exception applies.
- **New exceptions.** Section 112 of the Data (Use and Access) Act 2025, in force since 5 February 2026 (SI 2026/82), added exceptions for:
  - **statistical purposes**: analytics used only to improve your own service;
  - **appearance**: remembering a visitor's display or function preferences;
  - **emergency assistance**: locating a device to send help.

  These sit alongside the existing exceptions for transmitting a communication and for strictly necessary storage.
- **Conditions for the statistical exception** (ICO guidance): give clear information and a simple, free way to object; use the data only to improve your own service; share it only with a provider acting on your behalf (a processor, not a joint controller) who does not link it with other data; aggregate it; and do no tracking, profiling or advertising. If a visitor objects, you must stop. You cannot rely on browser settings alone.
- **Advertising is never exempt.** Ad pixels, remarketing and cross-site tracking always need consent.
- **Consent standard** (ICO guidance):
  - non-exempt storage is set only after consent;
  - rejecting is as easy as accepting, with an equally prominent "reject all" on the first layer;
  - non-exempt toggles are off by default;
  - scrolling or ignoring the banner is not consent;
  - withdrawing is as easy as giving consent;
  - third parties are named.

  The ICO suggests about six months before asking again someone who refused.
- **Guidance and penalties.** The ICO published its final storage and access technologies guidance on 29 April 2026. PECR fines now go up to £17.5 million or 4% of global turnover.
- **UK GDPR still applies** to the personal data collected (IP addresses, form fields, identifiers), whether or not PECR does.

Sources: <https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/what-are-the-exceptions/>, <https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/how-do-we-manage-consent-in-practice/>, <https://www.legislation.gov.uk/uksi/2026/82/regulation/2/made>.

## Workflow

### 1. Inventory storage and third-party requests

Use a fresh browser profile with no extensions, logged out, and record what happens **before** any banner interaction, after **reject**, and after **accept**. Check developer tools: Application (cookies, local storage, session storage, IndexedDB) and Network (every third-party host contacted). Repeat on the home page, a form page, a page with embeds and the shop or donation journey.

Server-side checks catch only cookies set in HTTP headers and scripts named in the HTML. Use them to support, not replace, the browser check.

```bash
# Cookies set by the server on first response
curl -sI https://example.test/ | grep -i '^set-cookie'

# Third-party hosts referenced in the HTML
curl -sL https://example.test/ | grep -oE '(src|href)="https?://[^/"]+' | sed -E 's#.*://##' | sort -u

# Trackers and storage in theme and plugin code
grep -rnE "gtag\(|googletagmanager|fbq\(|document\.cookie|localStorage|setcookie\(" wp-content/themes/<theme-slug> wp-content/plugins/<plugin-slug>

wp plugin list --status=active --fields=name,version --path=<wp-path>
```

```powershell
# Windows PowerShell: use curl.exe, because "curl" is an alias for Invoke-WebRequest
curl.exe -sI https://example.test/ | Select-String -Pattern '^set-cookie'

$html = (Invoke-WebRequest -UseBasicParsing -Uri 'https://example.test/').Content
[regex]::Matches($html, '(?:src|href)="https?://([^/"]+)') | ForEach-Object { $_.Groups[1].Value } | Sort-Object -Unique

Get-ChildItem -Recurse -Include *.php, *.js -Path 'wp-content\themes\<theme-slug>', 'wp-content\plugins\<plugin-slug>' |
  Select-String -Pattern 'gtag\(|googletagmanager|fbq\(|document\.cookie|localStorage|setcookie\('

wp plugin list --status=active --fields=name,version --path=<wp-path>
```

Record each item in [references/cookie-inventory-template.md](references/cookie-inventory-template.md). Done when every cookie, storage key and third-party request has an owner, purpose, duration and category.

### 2. Classify each item

| What it does | Category | Consent needed? |
|---|---|---|
| Login session, basket, security token, load balancing, remembering the consent choice itself | Strictly necessary or communication | No |
| Remembering a visitor's chosen text size, theme or language | Appearance exception | No, but give information and a free way to object |
| First-party or processor-run analytics used only to improve the site, aggregated, no profiling or ad use | Statistical exception | No, but give information and a free way to object. Confirm every condition |
| Analytics where the provider uses data for its own purposes, or links it to advertising | Consent | Yes |
| Advertising, remarketing, social pixels, A/B tools that profile individuals | Consent | Yes |
| Embedded video, maps or social posts that set storage | Consent, unless proven otherwise | Yes, by default |

If you are unsure whether an exception applies, treat the item as needing consent and flag it for the user.

### 3. Choose the analytics approach

Ask what decisions the data will support and who will look at it. Then present these options, recommend one, and wait for the user's choice.

| Option | Advantages | Disadvantages | Cost and effort | Suits |
|---|---|---|---|---|
| GA4 with Google Consent Mode v2 (`ad_storage`, `analytics_storage`, `ad_user_data`, `ad_personalization`) | Free; rich reports; links to Google Ads and Search Console | Needs a consent banner; data is lost for visitors who refuse; Google's own uses of the data make the statistical exception hard to rely on; transfers to the US | Free; medium setup | Organisations running Google Ads or needing detailed funnels |
| Privacy-focused analytics (for example Plausible, Fathom, or Matomo, cloud or self-hosted) | Simple reports; many can run without cookies; may meet the statistical exception when configured as a processor; often UK or EU hosting | Fewer features; paid plans, or hosting effort for self-hosted Matomo; "cookieless" still needs checking, because reading device information can count as access | Low to medium; subscription or hosting | Charities, small businesses and most brochure sites |
| Server logs or host statistics | No browser storage; no extra script; no banner needed for analytics | Basic numbers; bots inflate counts; logs are still personal data (IP addresses) with retention rules | Low | Very small sites and minimal-data organisations |
| No analytics | Nothing to consent to or maintain | No evidence for content or SEO decisions | None | Sites where nobody will use the data |

GA4 and Consent Mode facts as of October 2026 (re-check): Consent Mode has four parameters. You must set defaults yourself, and should scope them to the regions where you show a banner. "Basic" mode blocks Google tags until consent. "Advanced" mode loads tags with storage denied and sends cookieless pings. Ask the user to get advice on whether those pings are acceptable before choosing advanced mode. From 15 June 2026, Consent Mode became the single control for Google Ads cookies and identifiers in GA4. Google's EU user consent policy also covers UK visitors for advertising products. Sources: <https://developers.google.com/tag-platform/security/guides/consent>, <https://support.google.com/analytics/answer/17016975>.

### 4. Choose the consent mechanism

Ask about budget, how many sites, whether Google Ads is used, and who will maintain the cookie list. Then present the options. Check current pricing and features on each vendor's site, because tiers change.

| Option | Advantages | Disadvantages | Suits |
|---|---|---|---|
| Complianz (WordPress plugin, free and paid) | Built for WordPress; scans and blocks known scripts; supports the WP Consent API; UK region settings | The wizard needs careful answers; premium features cost extra | Single WordPress sites managed in-house |
| CookieYes (plugin with cloud account, free and paid tiers) | Quick setup; scanning; Consent Mode support | Needs a vendor account; usage limits on lower tiers; settings live outside WordPress | Small sites wanting a hosted dashboard |
| Cookiebot (cloud consent platform, paid tiers by size) | Strong scanner and reports; Consent Mode support; manages many domains | Priced by domain and site size; external dependency; the vendor processes consent records | Larger or multi-site organisations, Google Ads users |
| Minimal custom notice (no third-party platform) | No extra supplier; light | Only suitable when everything is exempt; you must still give information and a free objection route for statistical or appearance storage; you maintain it yourself | Sites with only strictly necessary and exception-based storage |

If the site uses Google advertising products, check that the chosen platform is on Google's current list of certified consent management platforms.

**WP Consent API.** A separate plugin, version 2.1.0 and tested up to WordPress 7.1 as of October 2026, not part of core. It gives consent plugins and other plugins a shared way to read consent. Its categories are `functional`, `preferences`, `statistics`, `statistics-anonymous` and `marketing`. Prefer a consent plugin and analytics or embed plugins that support it, so scripts are blocked consistently. In theme code, gate optional scripts with `function_exists( 'wp_has_consent' ) && wp_has_consent( 'marketing' )`, and fall back to "no consent" when the API is missing. Source: <https://wordpress.org/plugins/wp-consent-api/>.

### 5. Implement and test prior blocking

- Load non-exempt scripts only after consent: use the consent plugin's blocking, Tag Manager consent triggers, or `wp_has_consent()` checks.
- Put "accept all" and "reject all" side by side on the first layer, with equal prominence, and add a link to granular settings.
- Add a persistent link (for example "Cookie settings" in the footer) to change or withdraw consent.
- Describe each category and name third parties, in the banner's second layer or the cookie policy.

Repeat the browser checks from step 1 for the three states. Done when no non-exempt storage or third-party request happens before consent or after rejection, and withdrawing consent stops new storage.

### 6. Embeds, fonts and third-party assets

- **YouTube**: privacy-enhanced mode (`youtube-nocookie.com`) reduces tracking but does not guarantee no storage. Check in developer tools. Prefer a click-to-load placeholder (thumbnail plus play button) that loads the player only after the visitor chooses it or consents.
- **Maps**: use a static map image with a "Open in maps" link, or a click-to-load embed.
- **Social posts and share buttons**: use plain links instead of vendor widgets.
- **Fonts and scripts from third-party hosts**: self-host where licences allow. A third-party request sends the visitor's IP address, which is a data protection matter even when no cookie is set.

### 7. WordPress privacy tools

- **Settings > Privacy**: choose the privacy policy page. WordPress links it on the login and registration screens. Check it with `wp option get wp_page_for_privacy_policy --path=<wp-path>`.
- **Policy text from plugins**: plugins can suggest wording with `wp_add_privacy_policy_content()`. Review the guide on the Privacy screen; never publish suggestions unedited.
- **Tools > Export Personal Data and Tools > Erase Personal Data**: handle access and erasure requests by email address, with confirmation by email. Custom data stores (custom tables, custom post types holding personal data, form-entry plugins) must register handlers through the `wp_privacy_personal_data_exporters` and `wp_privacy_personal_data_erasers` filters, or the tools will miss them.
- **Comments**: core's "Save my name, email and website" checkbox controls comment cookies. Keep it enabled.
- **Logs**: use `wp_privacy_anonymize_data()` where custom code writes visitor data to logs.

### 8. Forms, minimisation and retention

- Collect only the fields needed for the stated purpose. Remove optional fields nobody uses, and do not ask for special category data (health, religion, ethnicity) unless the purpose needs it and the lawful basis and condition are documented.
- Show a short privacy notice at the point of collection, linking to the full notice.
- Keep newsletter consent separate, unticked and specific. Charities may use the soft opt-in for supporters under PECR regulation 22 as amended by section 114 of the Data (Use and Access) Act 2025. Check the ICO's current guidance before relying on it.
- Set a retention period for stored entries (Flamingo, form-entry plugins, CRM) and a way to purge them. Make sure the export and erase tools reach them.
- For Contact Form 7, Flamingo and form delivery, use `wp-cf7-form-assurance` if installed. If it is not installed, record the storage location, retention and purge method in the checklist.

### 9. International transfers

List every processor that receives personal data (analytics, consent platform, CDN, email delivery, form and CRM services, hosting) and where it processes data. For transfers outside the UK, record the mechanism the supplier relies on: UK adequacy regulations, the UK Extension to the EU–US Data Privacy Framework for certified US recipients, or the International Data Transfer Agreement or Addendum. Check the current position on the ICO's international transfers guidance. Add the suppliers to the privacy notice.

### 10. Document and hand over

Update the privacy notice and cookie policy from the inventory. Note the date the scan was done, and add a re-scan trigger: any new plugin, embed, tag or theme release.

## Ask before acting

Get explicit approval before you:

- install, activate, configure or remove a consent, analytics or tag plugin, or create an account with any vendor;
- add, remove or change tracking, analytics or advertising tags, or Consent Mode defaults;
- change the privacy policy page, cookie policy or published legal text;
- run an export or erasure request, or change retention or purge settings;
- delete stored form entries or other personal data.

## Output

Return:

1. A completed [references/cookie-inventory-template.md](references/cookie-inventory-template.md).
2. A completed [references/consent-checklist.md](references/consent-checklist.md) with evidence for the before, reject and accept states.
3. The chosen analytics and consent options, with the reasons.
4. Open risks for the user's legal or data protection lead.
5. The sources checked, with dates.
