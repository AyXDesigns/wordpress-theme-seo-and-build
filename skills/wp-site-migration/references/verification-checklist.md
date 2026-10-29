# Post-migration verification checklist

Run every check on the destination. Record evidence (command output, status code, screenshot reference) next to each item. Mark an item "exception" only with a reason and the approver's role.

## Core and configuration

- [ ] `wp option get siteurl` and `wp option get home` return the new address, with the intended protocol and no trailing slash.
- [ ] `wp core verify-checksums` passes, or differences are explained.
- [ ] `wp config get WP_ENVIRONMENT_TYPE` matches the environment.
- [ ] Debug output is not displayed on production.
- [ ] Settings > General and Settings > Permalinks open without errors.

## Old address and mixed content

- [ ] `wp search-replace '<old-url>' '<new-url>' --skip-columns=guid --dry-run` reports zero (or only expected) matches.
- [ ] No `http://` asset requests on an HTTPS site: check the browser console on the home page, a post, a page with a form and an archive.
- [ ] `curl -sI https://example.com/` returns `200`; `curl -sI http://example.com/` returns a single `301` to HTTPS.
- [ ] For a domain change: a sample of old URLs returns `301` to the matching new URL, not to the home page.

## Content and media

- [ ] Post, page and media counts match the source (`wp post list --post_type=<type> --format=count`).
- [ ] Images load in posts, galleries, featured images and the media library.
- [ ] Menus, widgets and block template parts show the expected links.
- [ ] Theme and plugin settings that use serialised data (Customizer, SEO plugin, form plugin) still hold their values.
- [ ] Custom tables (forms, bookings, SEO) are present and the plugin screens read them.

## Functions

- [ ] Log in and out works; no redirect loop to the old domain.
- [ ] Search works and pretty permalinks resolve (a post, a page, a category, a custom post type).
- [ ] A test form submission is stored and, on production only, the notification arrives.
- [ ] Ecommerce, membership or booking flows run in the agreed mode (live on production, test on staging).
- [ ] `wp cron event list` shows expected events; due events run (`wp cron event run --due-now` on a non-production copy first).

## Environment safety

- [ ] Staging and local: `wp option get blog_public` returns `0`, and HTTP authentication or IP restriction is on.
- [ ] Staging and local: outgoing email is caught or blocked; payment, webhook and sync integrations are in test mode or off.
- [ ] Production: `wp option get blog_public` returns `1`, and `robots.txt` does not block the whole site.
- [ ] Production: the XML sitemap loads and lists new-address URLs.

## Performance and caching

- [ ] Page cache, object cache and CDN were purged after the replace.
- [ ] A cold and a warm page load return the new HTML (check a recently edited page).
- [ ] No PHP warnings or fatal errors in the destination error log since the move.

## DNS and cut-over (production)

- [ ] Public DNS returns the new target from more than one resolver.
- [ ] Certificate is valid for every hostname served (apex and `www`).
- [ ] The old host stays available until the previous TTL plus margin has passed.
- [ ] TTL raised again after the switch is stable.

## Hand-off

- [ ] Backups and rollback steps are still valid and stored outside the web root.
- [ ] Runbook updated with actual results and replacement counts.
- [ ] For a domain change: the site owner knows to use Search Console's change-of-address process and to monitor coverage (use `seo-measure-and-monitor` if installed).
