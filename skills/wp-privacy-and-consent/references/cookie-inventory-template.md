# Cookie and storage inventory: <site name>

Operational record, not legal advice. Re-scan after any new plugin, tag, embed or theme release.

## Test conditions

| Item | Value |
|---|---|
| Site and environment | `https://example.test/` (local / staging / production) |
| Date of scan | <YYYY-MM-DD> |
| Browser and version | <browser> <version>, fresh profile, no extensions |
| Logged in? | No (repeat logged in if the site has accounts) |
| Pages tested | Home, contact form, page with embeds, shop or donation journey, <other> |
| Consent plugin and version | <plugin> <version> / none |
| Tester | <name or role> |

## States observed

For each state, list what appeared in Application storage and the third-party hosts in the Network panel.

| State | Cookies and storage present | Third-party hosts contacted | Pass? |
|---|---|---|---|
| Before any banner interaction | | | Only exempt items present |
| After "reject all" | | | Only exempt items present |
| After "accept all" | | | Matches the categories accepted |
| After withdrawing consent | | | No new non-exempt storage |

## Inventory

Categories: strictly necessary, communication, appearance (exception), statistical (exception), consent required.

| Name or key | Storage type | Host (first or third party) | Set by (plugin, theme, service) | Purpose in plain English | Duration | Seen before consent? | Category | Exception relied on and why | Data shared with | Processed outside UK? | Action |
|---|---|---|---|---|---|---|---|---|---|---|---|
| `wordpress_test_cookie` | Cookie | example.test (first) | WordPress core | Checks the browser accepts cookies at login | Session | Login page only | Strictly necessary | Needed for the login the user asked for | None | No | None |
| `wordpress_logged_in_<hash>` | Cookie | example.test (first) | WordPress core | Keeps a logged-in user signed in | Session or 14 days with "Remember me" | Logged-in users only | Strictly necessary | Needed for the account service | None | No | None |
| `wp-settings-<user-id>` | Cookie | example.test (first) | WordPress core | Remembers admin screen layout | 1 year | Logged-in users only | Appearance | Remembers the user's own display choices | None | No | Mention in policy |
| `comment_author_<hash>` | Cookie | example.test (first) | WordPress core | Remembers commenter details when the box is ticked | About 1 year | Only after opting in | Consent (opt-in box) | Visitor's explicit choice on the form | None | No | Keep the opt-in box enabled |
| `<consent-cookie-name>` | Cookie | example.test (first) | <consent plugin> | Remembers the visitor's consent choice | <duration> | Yes | Strictly necessary | Needed to respect the choice | <vendor, if cloud> | <yes/no> | None |
| `<analytics-cookie-or-key>` | Cookie / local storage | <host> | <analytics service> | <purpose> | <duration> | | | | | | |
| `<embed-storage-key>` | <type> | <host> | <video or map provider> | <purpose> | <duration> | | Consent required (default) | | | | Click-to-load placeholder |

## Third-party requests without storage

Requests that send the visitor's IP address to another host, even if no cookie is set.

| Host | Loaded by | What it serves | Needed? | Alternative | Action |
|---|---|---|---|---|---|
| `fonts.cdn.example` | Theme | Web fonts | Optional | Self-host the font files | |

## Processors and transfers

| Supplier | Role (processor or controller) | Data received | Processing location | Transfer mechanism | Listed in privacy notice? |
|---|---|---|---|---|---|
| <analytics provider> | | | | | yes / no |
| <consent platform> | | | | | |
| <hosting / CDN> | | | | | |

## Changes since last scan

| Date | Change | Reason | Approved by |
|---|---|---|---|
