# Pre-publish checklist

Run on staging, as close to production as possible. Mark each item pass, fail or "accepted by <name>". Skip items that do not apply and say why. Version facts are as of October 2026; re-check at <https://wordpress.org/about/requirements/>.

## Platform

- [ ] Host runs PHP 8.3 or later (or the version the theme and plugins are tested on), and MySQL 8.0+ or MariaDB 10.11+.
- [ ] WordPress is the latest stable release (7.1.x at the time of writing), or the user has accepted an older version with a reason.
- [ ] Plugins and theme are up to date; unused plugins and themes are removed, not just deactivated.
- [ ] `WP_DEBUG_DISPLAY` is off; no PHP notices in page source.
- [ ] `WP_ENVIRONMENT_TYPE` will be `production` on the live site.
- [ ] Backups are scheduled on production, stored off the server, and one restore has been tested.

## Security

- [ ] Every admin account belongs to a named person; old and test accounts are removed or downgraded.
- [ ] Two-factor sign-in is on for admins (the user sets it up themselves).
- [ ] File editing in the dashboard is off (`DISALLOW_FILE_EDIT`).
- [ ] No staging passwords, API keys or test keys will be carried to production.
- [ ] `wp-config.php` and backups are not reachable from the web.

## Content and links

- [ ] No placeholder text, test posts or sample pages remain (`wp post list --post_status=any --fields=ID,post_title,post_type`).
- [ ] No links or media point at local, preview or staging URLs (`wp db search 'staging.example.com'`).
- [ ] Menus, footer, 404 page, search results page and favicon are in place.
- [ ] Images have useful alternative text and sensible file sizes.

## Forms, email and payments

- [ ] Every form submits, shows a clear confirmation, and the message arrives where it should (use `wp-cf7-form-assurance` if installed).
- [ ] The site sends email through an authenticated service, and the domain has SPF, DKIM and DMARC records.
- [ ] Payment gateways switch from test to live keys at launch, and one real low-value transaction is planned with the user.

## Search and analytics

- [ ] One canonical host (`https://example.com` or `https://www.example.com`), others 301 to it.
- [ ] Titles, descriptions, canonical tags, robots.txt and XML sitemap are correct for production (use `wp-seo-build-and-release` if installed).
- [ ] Redirects map every changed URL from the old site.
- [ ] Production will not send `noindex` (no header, `blog_public` = 1); staging still will.
- [ ] Analytics and consent banner are ready, and analytics only runs as consent allows (UK GDPR and PECR in the UK).
- [ ] The user has access to Search Console for the domain, or knows how to verify it.

## Accessibility and front end

- [ ] Key pages work with keyboard only and have visible focus.
- [ ] Text contrast and heading order are sensible.
- [ ] Key pages look right on a phone, a tablet and a desktop, in at least two browsers.
- [ ] No errors in the browser console on key pages.

## Performance and caching

- [ ] Page caching is on (plugin or host), and logged-in users, carts and forms are excluded where needed.
- [ ] Static assets have long cache lifetimes; a CDN is set up if agreed.
- [ ] Key pages have been measured on mobile and the results recorded.

## Domain, DNS and SSL

- [ ] The user can sign in to the registrar and DNS provider (or the owner is on hand at launch).
- [ ] Current DNS records are exported or written down, including MX and email TXT records.
- [ ] TTL lowered ahead of the change where possible.
- [ ] SSL certificate method agreed (host, Let's Encrypt or CDN), and auto-renewal confirmed.

## Legal

- [ ] Privacy policy, cookie information and any required business details are published.
- [ ] Form consent wording and data retention match the privacy policy.

## Launch readiness

- [ ] Rollback plan written: trigger, decision owner, steps, expected time.
- [ ] Launch time agreed outside peak traffic, with the owner of each account available.
- [ ] The user has given explicit approval to publish.
