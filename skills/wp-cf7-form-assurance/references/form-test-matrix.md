# Contact Form 7 test matrix

Run each applicable row on the environment the user approved. Use test data only: "QA Test" as the name, an `example.test` address (or the test inbox the user named) and a unique marker `QA-<date>-<n>` in the message. Note every Flamingo record ID you create so you can delete exactly those.

## Run details

| Field | Value |
|---|---|
| Environment and URL | `http://example.test/<page>` |
| WordPress / PHP | `<version>` / `<version>` |
| CF7 / Flamingo | `<version>` / `<version>` or not used |
| Spam protection | Turnstile / reCAPTCHA v3 / Akismet / first-party only |
| Mail route | mail catcher / SMTP plugin + provider / host relay |
| Form ID and title | `<id>` / `<title>` |
| Tester and date | `<name>` / `<date>` |

## Submission cases

| # | Case | Steps | Expected result | Evidence to record | Result |
|---|---|---|---|---|---|
| 1 | Valid submission | Fill every required field correctly | Success message; one Flamingo record (status `publish`); one notification; autoresponder if configured | Flamingo ID, mail headers, time received | |
| 2 | Required field empty | Leave each required field blank in turn | Inline error on that field; focus moves to the error summary or field; nothing stored, no mail | Screenshot of error, Flamingo count unchanged | |
| 3 | Invalid email or phone | Enter a malformed value | Field-level error; nothing stored | Error text | |
| 4 | Over-long input | Paste text beyond any `maxlength` | Rejected or truncated as designed; no PHP warnings | Result, `debug.log` | |
| 5 | Markup in fields | Enter `<b>QA</b>` and a URL | Stored and mailed as plain text; nothing rendered as HTML | Mail body, Flamingo view | |
| 6 | Honeypot filled | Fill the hidden field via dev tools | Treated as spam; no notification | Flamingo status `flamingo-spam` if stored | |
| 7 | Spam service fails | Use the provider's test keys that always fail, or block its script | Submission refused as spam; visitor sees a helpful message | Spam log in the Flamingo record | |
| 8 | Spam service script blocked by consent tool | Refuse consent in the banner, then submit | Behaviour matches the agreed design (fallback or clear message) | Screenshot | |
| 9 | Mail failure | Point SMTP at a wrong port locally, or use the plugin's test failure mode | Visitor sees the mail-failed message; Flamingo still stores the record (status shows mail failed) | Flamingo ID, SMTP log | |
| 10 | Double submit | Click submit twice quickly | One record and one mail, or the duplicate is clearly handled | Flamingo count | |
| 11 | No JavaScript | Disable JavaScript and submit | Form still posts or shows a clear fallback | Result | |
| 12 | Keyboard only | Complete and submit with keyboard only | All fields, consent box and submit reachable; visible focus; errors announced | Notes | |
| 13 | Mobile width | Submit at about 360 px wide | No overflow; widget fits; keyboard types match fields | Screenshot | |

## Dependency cases

| # | Case | Expected result | Result |
|---|---|---|---|
| 14 | CF7 deactivated | Page shows the fallback contact details to visitors; no raw shortcode, no PHP error | |
| 15 | Form deleted or wrong ID | Same fallback; administrators see a clear notice | |
| 16 | Flamingo deactivated (if it is the system of record) | Agreed behaviour: block submission, or alert administrators | |
| 17 | Spam service keys removed | Agreed behaviour, documented | |

## Delivery checks

| Check | Command or place | Expected | Result |
|---|---|---|---|
| SPF | `dig +short TXT example.com` or `Resolve-DnsName -Type TXT example.com` | One `v=spf1` record including the sender | |
| DKIM | `dig +short TXT <selector>._domainkey.example.com` | Key published for the provider's selector | |
| DMARC | `dig +short TXT _dmarc.example.com` | `v=DMARC1` with a policy | |
| Received headers | "Show original" or message source in the test inbox | `spf=pass`, `dkim=pass`, `dmarc=pass` | |
| From / Reply-To | Mail headers | From on the site domain; Reply-To is the visitor | |
| Not in spam folder | Test inbox | Arrives in the inbox | |

## Clean-up

| Item | IDs or location | Removed |
|---|---|---|
| Flamingo inbound records | `<ids>` | yes / no |
| Flamingo contact records | `<ids>` | yes / no |
| Mail catcher or test inbox messages | `<where>` | yes / no |
| SMTP plugin log entries | `<where>` | yes / no |

## Decision

Pass / fail, with open risks and anything that needs the owner's decision.
