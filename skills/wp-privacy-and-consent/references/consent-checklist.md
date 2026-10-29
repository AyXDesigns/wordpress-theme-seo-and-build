# Consent and privacy checklist

Operational checklist based on ICO guidance as checked in October 2026. It is not legal advice. Re-check the ICO's storage and access technologies guidance before each use: <https://ico.org.uk/for-organisations/direct-marketing-and-privacy-and-electronic-communications/guidance-on-the-use-of-storage-and-access-technologies/>.

- Site: `https://example.test/`
- Date checked: <YYYY-MM-DD>
- Checked by: <name or role>

Record evidence (screenshot name, network export, note) for every item marked with an asterisk.

## 1. Before consent

- [ ] \* With a fresh profile, no non-exempt cookie, local storage key, pixel or third-party tracking request appears before the visitor chooses.
- [ ] \* Google tags (if used) load with consent defaults set to denied for the UK, before any tag fires.
- [ ] Embeds (video, maps, social) show a placeholder and do not load until the visitor chooses them or consents.
- [ ] Fonts and scripts that can be self-hosted are self-hosted, or listed in the inventory with a reason.

## 2. The banner

- [ ] "Accept all" and "Reject all" are on the first layer, with equal size, colour weight and position.
- [ ] There is a clear route to granular choices by category.
- [ ] Non-exempt categories are off by default in the granular view.
- [ ] Scrolling, clicking elsewhere or closing the banner is not treated as consent.
- [ ] The banner names the purposes and the third parties, or links to a second layer that does.
- [ ] The banner is keyboard-accessible, has a visible focus state, is announced to screen readers and does not trap focus.
- [ ] The banner does not hide essential content or block access to the privacy notice.

## 3. After the visitor chooses

- [ ] \* After "Reject all", only exempt storage is present and no non-exempt third-party requests are made, including on later page views.
- [ ] \* After "Accept all", only the accepted categories load.
- [ ] \* Granular choices are respected (for example statistics on, marketing off).
- [ ] The choice is remembered, and the visitor is not asked again on every page.
- [ ] Visitors who refused are not asked again for about six months unless the purposes change.

## 4. Withdrawal and objection

- [ ] A persistent "Cookie settings" link (for example in the footer) reopens the choices on every page.
- [ ] \* Withdrawing consent stops new non-exempt storage; existing cookies are removed where technically possible.
- [ ] Where analytics or appearance storage relies on an exception, the visitor is told about it and can object easily and free of charge, and an objection is honoured.

## 5. Exceptions relied on

For each exception, record why every condition is met.

| Exception | Items covered | Conditions confirmed | Evidence |
|---|---|---|---|
| Strictly necessary | | Essential to a service the visitor asked for | |
| Statistical purposes | | Only to improve own service; clear information; free objection; processor only; aggregated; no profiling or advertising | |
| Appearance | | Only the visitor's own preferences; clear information; free objection | |

## 6. Analytics and tags

- [ ] The chosen analytics option and the reasons are recorded.
- [ ] Analytics settings match the category it is placed in (for example data sharing and advertising features off if relying on the statistical exception).
- [ ] Tag Manager containers contain no tags that bypass consent triggers.
- [ ] Consent Mode (if used): mode (basic or advanced) chosen deliberately and the decision recorded.

## 7. WordPress privacy tools

- [ ] A privacy policy page is set under Settings > Privacy and linked in the footer and at every point of data collection.
- [ ] Plugin-suggested policy text has been reviewed and adapted, not pasted unedited.
- [ ] \* A test export (Tools > Export Personal Data) for a test email address returns data from every store that holds it, including form entries and custom tables.
- [ ] \* A test erasure (Tools > Erase Personal Data) for test data removes or anonymises it in every store.
- [ ] The comments cookie opt-in checkbox is enabled.

## 8. Forms

- [ ] Each field has a stated purpose; unused optional fields are removed.
- [ ] No special category data is collected without a documented lawful basis and condition.
- [ ] Marketing consent is separate, unticked and specific to the channel.
- [ ] Stored entries have a retention period and a working purge method.
- [ ] Notification emails do not carry more personal data than needed.

## 9. Transfers and suppliers

- [ ] Every supplier receiving personal data is listed with its role, location and transfer mechanism.
- [ ] The privacy notice names the categories of recipients and explains transfers outside the UK.

## 10. Notices and records

- [ ] The privacy notice and cookie policy match the current inventory.
- [ ] The scan date and re-scan triggers are recorded.
- [ ] Open risks are passed to the organisation's data protection lead, with the ICO named as the authority for questions of interpretation.

## Result

| Area | Pass / fail / not applicable | Notes and owner |
|---|---|---|
| Before consent | | |
| Banner | | |
| After choice | | |
| Withdrawal and objection | | |
| Exceptions | | |
| Analytics and tags | | |
| WordPress tools | | |
| Forms | | |
| Transfers | | |
| Notices | | |
