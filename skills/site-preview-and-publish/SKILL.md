---
name: site-preview-and-publish
description: Take a WordPress site from local or preview to staging and live production safely. Helps choose a host, keeps staging private and out of search results, runs a pre-publish checklist, hands over domain, DNS and SSL, purges caches and keeps a rollback ready. Use when the user asks to preview, share, deploy, publish, go live, launch, set up staging, connect a domain, point DNS or fix SSL, or mentions managed WordPress hosting, VPS, cPanel, Cloudflare, "Discourage search engines", noindex, X-Robots-Tag or a broken preview. For moving databases and uploads between environments, use wp-site-migration.
license: MIT
metadata:
  author: AyXDesigns
  version: "0.2.0"
---

# Site preview and publish

Covers getting a WordPress site seen (preview), tested privately (staging) and launched (production), plus recovering a broken preview. It keeps those environments distinct and never publishes without the user's say-so.

## Before you start

Know which environments exist or are planned, and use these meanings consistently:

| Environment | Purpose | Who sees it | Indexing |
|---|---|---|---|
| Local | Building and testing on a computer | Developer only | Not reachable |
| Preview | Temporary share link (LocalWP Live Links, Studio preview site, host preview URL, tunnel) | Named reviewers | Never indexed |
| Staging | Copy of production on the target host for final checks | Team and client, behind a login | Never indexed |
| Production | The live site on the real domain | Everyone | Indexed, unless the user decides otherwise |

Confirm, and ask the user for anything unknown:

- the production domain and whether a site already runs on it;
- who owns the registrar, DNS, hosting and email accounts (names or roles only, never credentials);
- whether a host is already chosen; if not, step 2 applies;
- where email for the domain is hosted (moving DNS can break it);
- launch date, any freeze window, and who signs off;
- whether the site takes payments, bookings, memberships or form submissions.

## Workflow

### 1. Map the current state (read-only)

Record each environment's URL, host, WordPress and PHP versions, environment type and indexing state:

```bash
wp option get home --path=<site-dir>
wp option get blog_public --path=<site-dir>
wp eval 'echo wp_get_environment_type();' --path=<site-dir>
curl -sI https://staging.example.com/ | grep -iE '^(HTTP|x-robots-tag|www-authenticate)'
dig +short example.com A
dig +short example.com MX
```

```powershell
curl.exe -sI https://staging.example.com/
Resolve-DnsName example.com -Type A
Resolve-DnsName example.com -Type MX
```

`blog_public` of `0` means "Discourage search engines" is ticked. Done when: you can say, for every environment, where it lives and whether it is private and indexable.

### 2. Choose the host (only if not decided)

Respect an existing host or an explicit choice. Otherwise ask first: expected traffic, budget, who will maintain the server, need for SSH, WP-CLI and Git deploys, built-in staging, email hosting, data location (UK or EU), and whether the site has forms, shop or members.

Then present 2 to 4 options from [references/hosting-options.md](references/hosting-options.md) as a short question with choices, each with **advantages**, **disadvantages**, cost and effort, and who it suits. Offer static export only for brochure sites without logins, shop, search or comments. Recommend one with the reason, and wait for the user's choice.

Done when: the user has named a host and plan.

### 3. Set up staging: private and not indexed

Use layers, because each one alone can fail. Details and server snippets are in [references/staging-protection.md](references/staging-protection.md).

1. Access control: password protection (host's built-in protection or HTTP basic auth). This is the layer that actually keeps content private.
2. `noindex`: tick **Settings** > **Reading** > **Search engine visibility** (`wp option update blog_public 0`) and send an `X-Robots-Tag: noindex, nofollow` header.
3. `WP_ENVIRONMENT_TYPE` set to `staging`.
4. Stop real side effects: route email to a capture tool or disable it, put payment gateways in test mode, pause scheduled exports and webhooks.

Do not rely on a robots.txt `Disallow` alone: it stops crawlers from seeing the `noindex`, and linked URLs can still appear in results.

Done when: an anonymous request gets `401` (or the host's login), and an authenticated one shows the `noindex` header and meta tag.

### 4. Move code and content

- Code (theme, custom plugins): use the project's deploy path (Git deploy, CI, host tool or SFTP). Deploy one exact, recorded package.
- Database and uploads: use `wp-site-migration` if installed. If it is not, use the "Minimal data move fallback" in [references/staging-protection.md](references/staging-protection.md): back up both sides, export, import, run `wp search-replace` with `--dry-run` first, then for real, and copy uploads. Never edit URLs in a SQL file by hand; serialised data breaks.

Done when: staging shows the expected content with no links to the local or preview URL (`wp db search 'example.test'` finds nothing that matters).

### 5. Run the pre-publish checklist

Work through [references/pre-publish-checklist.md](references/pre-publish-checklist.md) on staging. Hand SEO launch checks to `wp-seo-build-and-release` and form checks to `wp-cf7-form-assurance` if installed; otherwise use the short versions in the checklist. Agree the rollback plan (step 8) before go-live.

Done when: every item is ticked or consciously accepted by the user as a known issue.

### 6. Go live

With the user's approval of the date, the steps and the rollback plan:

1. Take a fresh backup of production (files and database) and, if replacing an old site, of the old site too.
2. Record every existing DNS record (A, AAAA, CNAME, MX, TXT including SPF, DKIM and DMARC) before changing anything. Lower the TTL a day ahead where possible.
3. Point the domain (A/AAAA or CNAME) at the new host. Keep MX and email TXT records unless email is moving too.
4. Issue the SSL certificate, then force HTTPS and choose one canonical host (`www` or not) with a 301 from the other.
5. Set `home` and `siteurl` to `https://example.com`; flush rewrites (`wp rewrite flush`).
6. Make production indexable: remove the password protection and the `X-Robots-Tag` header, set `blog_public` to `1`, set `WP_ENVIRONMENT_TYPE` to `production`.
7. Purge every cache layer: page cache plugin, server cache, object cache (`wp cache flush`) and CDN.
8. Put 301 redirects in place for any old URLs that change.

Done when: `https://example.com` serves the new site with a valid certificate to an anonymous visitor.

### 7. Verify after launch

Check as a logged-out visitor, on desktop and mobile: key routes, HTTP-to-HTTPS and host redirects, no mixed content, forms submit and arrive, transactional email arrives, robots.txt and sitemap load, no `noindex` on production, no console errors, caching headers present. Watch for 24 to 48 hours while DNS propagates. Submit the sitemap in Search Console only if the user owns that property.

### 8. Rollback

Before go-live, write down: what triggers a rollback, who decides, the steps (revert DNS to the recorded values, or restore the backup or host snapshot), and how long it takes. After a rollback, purge caches again and re-check email records.

## Preview recovery

When a preview or staging link breaks: check the process or host status, the URL and `home`/`siteurl`, SSL, password protection, recent deploys and logs, then apply the smallest reversible fix. Do not rebuild, switch host or tool, or re-import data unless the evidence calls for it and the user agrees.

## Ask before acting

Get explicit approval before you:

- publish anything for the first time, or replace an existing public site;
- create a public share link or tunnel to a local site;
- change DNS, nameservers, the registrar or email records;
- import a database, overwrite files or run `wp search-replace` without `--dry-run`;
- remove staging protection or turn indexing on;
- purge a CDN for a busy site, or delete old environments, backups or files;
- send site data to a new provider, or start a paid plan. The user enters payment and account details themselves.

## Output

Hand back the completed [references/handover-template.md](references/handover-template.md): environments and their states, host and plan, DNS records before and after, SSL status, indexing and protection per environment, checks passed and failed, the rollback plan, open items and who owns each account. No credentials in the handover.
