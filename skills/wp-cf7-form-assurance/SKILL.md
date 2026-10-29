---
name: wp-cf7-form-assurance
description: Build, audit and test Contact Form 7 forms end to end, including Flamingo storage, spam protection (Turnstile, reCAPTCHA, Akismet), mail delivery and QA clean-up. Use when a CF7 form is added or changed, when "contact form emails not arriving", "form goes to spam", "form shows an error", when choosing a CAPTCHA, setting up SMTP, checking SPF, DKIM or DMARC, or reviewing form privacy under UK GDPR and PECR. Covers Contact Form 7 only; other form plugins such as Gravity Forms, WPForms or Fluent Forms are out of scope.
license: MIT
metadata:
  author: AyXDesigns
  version: "0.2.0"
---

# Contact Form 7 assurance

Make a Contact Form 7 (CF7) journey dependable and private: the right fields, the record stored where agreed, spam blocked, mail delivered, and every test record cleaned up afterwards.

## Before you start

Confirm, or ask the user:

- Environment (local, staging, production) and whether real mail can be sent from it. Locally, use a mail catcher such as Mailpit so no real mail leaves the machine.
- The fields the form needs and why each is collected. Drop anything without a purpose.
- The system of record: Flamingo, the notification email only, or a separate private store. Who may read it, and how long it is kept.
- The notification recipient (a role mailbox, not a personal address in source code).
- Whether a cookie banner or consent tool is in place, and the site's privacy notice owner.
- Versions. As of October 2026, CF7 6.2.4 requires WordPress 7.1 and PHP 8.3 or later (<https://wordpress.org/plugins/contact-form-7/>). Re-check before installing or updating.

## How CF7 stores things

| Item | Where | Notes |
|---|---|---|
| Forms | Post type `wpcf7_contact_form` | Settings in post meta: `_form`, `_mail`, `_mail_2`, `_messages`, `_additional_settings`, plus `_hash`. |
| Shortcode | `[contact-form-7 id="<hash-or-id>" title="<title>"]` | CF7 looks up the `id` as the form's hash first, then as a post ID, then falls back to the title. Both hash and ID differ between installs. |
| Submissions (Flamingo) | Post type `flamingo_inbound`; senders in `flamingo_contact` | Spam is stored with post status `flamingo-spam`. By default Flamingo records spam, mail-sent and mail-failed submissions, so a record exists even when mail fails. Validation failures are not stored. Channels are terms in `flamingo_inbound_channel`. |
| Spam checks | Filter `wpcf7_spam` | Turnstile and reCAPTCHA both hook here. |
| Mail | Actions `wpcf7_before_send_mail`, `wpcf7_mail_sent`, `wpcf7_mail_failed`; filter `wpcf7_skip_mail` | `wpcf7_submit` runs after every submission, with the result status. |

Checked against the CF7 and Flamingo source, October 2026. Re-check hook names in the current source or at <https://contactform7.com/docs/> before relying on them.

## Workflow

### 1. Inspect forms and storage (read-only)

```bash
wp plugin list --name=contact-form-7,flamingo --fields=name,status,version --path=<wp-path>
wp post list --post_type=wpcf7_contact_form --fields=ID,post_title,post_status --path=<wp-path>
wp post meta get <form-id> _form --path=<wp-path>
wp post meta get <form-id> _mail --format=json --path=<wp-path>
wp post list --post_type=flamingo_inbound --post_status=any --fields=ID,post_date,post_status --posts_per_page=5 --path=<wp-path>
wp term list flamingo_inbound_channel --fields=term_id,name,count --path=<wp-path>
```

PowerShell uses the same commands. Do not print Flamingo titles or field values from real submissions; they hold personal data. Find where the form is embedded with `wp post list --s="contact-form-7" --post_type=page,post --fields=ID,post_title`.

Done when you know each form's fields, mail settings (recipient, From, Reply-To), storage and the pages that use it.

### 2. Check the form contract

- Seed forms idempotently: look a form up by a stable marker (title or a meta key you own), never by a hard-coded ID or hash.
- If CF7, the form, Flamingo or the spam service is missing, the page must show a calm fallback for visitors (contact details) and a clear notice only to administrators. Test with each plugin deactivated.
- Required fields, labels and error messages are accessible. Any honeypot field is hidden from keyboard and screen-reader users.
- Select and checkbox values are mapped deliberately, not trusted as free text.
- Never collect payment details, health or other special-category data, or safeguarding narratives in an ordinary CF7 form.
- CF7's own configuration validator (on the form edit screen) shows no errors, especially "sender email address does not belong to the site domain".

### 3. Choose spam protection

Present the options as a short question with choices. Explain that each third-party service loads a script and sends visitor data to that provider. In CF7 the Turnstile and reCAPTCHA scripts load on every front-end page once the integration is active, not only on form pages.

| Option | Advantages | Disadvantages | Privacy (UK/EU) | Suits |
|---|---|---|---|---|
| Cloudflare Turnstile (CF7 built-in integration) | Usually invisible; free; CF7 adds the widget even without a `[turnstile]` tag | Third-party script on all pages; occasional visible challenge | Data goes to Cloudflare; name it in the privacy notice and decide with the owner whether consent is needed | Most small business sites |
| Google reCAPTCHA v3 (CF7 built-in) | Invisible, score-based; familiar | Google script on every page; score tuning; must show Google's notice if the badge is hidden | Data goes to Google; consent and transfer questions are harder | Sites already relying on Google services |
| Akismet (CF7 integration) | No visible challenge; checks content server-side | Commercial use needs a paid plan; sends message content to Automattic | Message content leaves the site; disclose it | Sites already using Akismet |
| First-party only: CF7 quiz tag, disallowed list, honeypot add-on | No third-party data transfer; no consent question | Weaker against targeted bots; quiz adds friction | Best | Low-traffic or privacy-sensitive sites |

Recommend one based on traffic, existing providers and the owner's consent approach. Run only one CAPTCHA service at a time. Whether a security script falls under a PECR consent exemption is the site owner's decision; record it. The Data (Use and Access) Act 2025 changed these exemptions and the ICO was revising its guidance in 2026, so check the current ICO page (<https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guide-to-pecr/cookies-and-similar-technologies/>) rather than relying on memory. For EU visitors, the ePrivacy rules of the relevant member state apply. Keys go in Contact > Integration and are never committed or printed.

### 4. Choose how mail is sent

Present the options:

| Option | Advantages | Disadvantages | Suits |
|---|---|---|---|
| Host's PHP mail | Nothing to set up | Often lands in spam or is silently dropped; hard to authenticate | Local testing only |
| SMTP plugin (for example WP Mail SMTP or FluentSMTP) with a transactional mail provider | Authenticated (SPF, DKIM), logs, good delivery | Account and DNS changes; some providers charge | Most live sites |
| SMTP plugin with the organisation's own mailbox (Microsoft 365, Google Workspace) | Uses an existing account | Sending limits; app passwords or OAuth setup | Very low volume |
| Host-provided SMTP relay | No third party | Delivery quality varies by host | When the host offers a good relay |

The From address must be on the site's domain (for example `noreply@example.com`). Put the visitor's address in Reply-To, never in From.

Check DNS (read-only):

```bash
dig +short TXT example.com
dig +short TXT _dmarc.example.com
dig +short TXT <selector>._domainkey.example.com
```

```powershell
Resolve-DnsName -Type TXT example.com
Resolve-DnsName -Type TXT _dmarc.example.com
Resolve-DnsName -Type TXT <selector>._domainkey.example.com
```

`nslookup -type=TXT example.com` works in both shells. Expect exactly one SPF record (`v=spf1 …`) that includes the sending service, a DKIM key for the provider's selector, and a DMARC record (`v=DMARC1; p=…`). DNS changes are the domain owner's call.

### 5. Run the test matrix

Use [references/form-test-matrix.md](references/form-test-matrix.md). Use only test data: names such as "QA Test", addresses at `example.test` (or a test inbox the user names), and a unique marker such as `QA-<date>-<n>` in the message. A thank-you message is not proof: check the Flamingo record, the mail log or catcher, and the received mail headers (SPF, DKIM and DMARC should say `pass`).

### 6. Clean up QA records

Record the exact IDs of every QA record as you create it, then remove only those:

```bash
wp post list --post_type=flamingo_inbound --post_status=any --s="QA-<date>" --fields=ID,post_date --path=<wp-path>
wp post list --post_type=flamingo_contact --post_status=any --s="example.test" --fields=ID --path=<wp-path>
wp post delete <id> [<id>...] --force --path=<wp-path>
```

Also clear QA mail from the catcher or test inbox and any SMTP-plugin log entries.

## Ask before acting

- Submitting a form on staging or production, or sending any real mail.
- Changing integration keys, mail settings, SMTP plugins or DNS records.
- Installing or activating CF7, Flamingo, an SMTP plugin or an anti-spam add-on.
- Deleting any record, including QA records (`--force` is permanent).
- Changing retention, privacy notice text or consent settings.

## Output

Return: forms inspected, the spam and mail choices made (with reasons), DNS results, the completed test matrix from [references/form-test-matrix.md](references/form-test-matrix.md), IDs of QA records deleted, and any open risks.
