# Staging protection, indexing and minimal data moves

All values are placeholders. Back up any server file before editing it, and get approval before changing a server you do not control day to day.

## Why layers

| Layer | Stops | Does not stop |
|---|---|---|
| Password protection (host tool or HTTP basic auth) | People and crawlers reading the site | Nothing important, if applied to every path |
| `X-Robots-Tag: noindex` header | Indexing of any response it is sent with, including PDFs and images | Visitors reading the site |
| WordPress **Search engine visibility** (`blog_public = 0`) | Indexing of WordPress pages (adds a `noindex` robots meta tag) | Indexing of files, and crawlers that ignore the request |
| robots.txt `Disallow` | Crawling | Indexing of linked URLs; it also hides your `noindex` from crawlers, so do not use it alone |

Search engines treat `noindex` and the WordPress setting as requests. Only password protection keeps staging content private. (Sources, checked October 2026: <https://developers.google.com/search/docs/crawling-indexing/block-indexing>, <https://developers.google.com/search/docs/crawling-indexing/control-what-you-share>, <https://wordpress.org/documentation/article/settings-reading-screen/>.)

## 1. Password protection

Prefer the host's own "password protect" or "staging lock" feature: it survives redeploys and is easy to remove at launch.

Otherwise, HTTP basic auth. Create the password file outside the web root (the command prompts for the password, so it never appears in history):

```bash
htpasswd -c <path-outside-webroot>/.htpasswd <staging-user>
```

Apache (`.htaccess` or the virtual host):

```apache
AuthType Basic
AuthName "Staging"
AuthUserFile <path-outside-webroot>/.htpasswd
Require valid-user
Header always set X-Robots-Tag "noindex, nofollow"
```

Nginx (inside the staging `server` block):

```nginx
auth_basic "Staging";
auth_basic_user_file <path-outside-webroot>/.htpasswd;
add_header X-Robots-Tag "noindex, nofollow" always;
```

Side effects to plan for:

- WordPress loopback requests (Site Health, WP-Cron, some page builders) and payment or form webhooks can fail behind basic auth. Use a real cron job (`wp cron event run --due-now` on a schedule) or allow the server's own IP.
- Let's Encrypt HTTP validation needs `/.well-known/acme-challenge/` reachable without a password. Exclude that path or use DNS validation.

## 2. noindex in WordPress

```bash
wp option update blog_public 0 --path=<site-dir>
wp config set WP_ENVIRONMENT_TYPE staging --type=constant --path=<site-dir>
```

If the server cannot send headers, a must-use plugin can send `X-Robots-Tag` for every non-production environment and stops automatically once `WP_ENVIRONMENT_TYPE` is `production`. It covers WordPress pages only, not files in `uploads`:

```php
<?php
// wp-content/mu-plugins/non-production-noindex.php
add_action( 'send_headers', static function () {
	if ( 'production' !== wp_get_environment_type() ) {
		header( 'X-Robots-Tag: noindex, nofollow', true );
	}
} );
```

## 3. Stop real side effects on staging

- Email: route to a capture tool or an SMTP sandbox, or disable sending. Never email real customers from staging.
- Payments: test mode keys only.
- Integrations: pause CRM syncs, newsletter sign-ups, scheduled exports and outgoing webhooks, or point them at test endpoints.
- Analytics: exclude staging, or use a separate property.

## 4. Verify

```bash
curl -sI https://staging.example.com/ | grep -iE '^(HTTP|www-authenticate)'
curl -sI -u <staging-user> https://staging.example.com/ | grep -i x-robots-tag
curl -s -u <staging-user> https://staging.example.com/ | grep -i '<meta name=.robots'
```

On Windows PowerShell use `curl.exe` with the same arguments (`curl` alone is an alias for a different command in Windows PowerShell 5.1). `-u <staging-user>` prompts for the password.

Expect `401` without credentials, and both the header and the `noindex` meta tag with them.

## 5. At launch, reverse it on production only

Remove password protection and the server header, then:

```bash
wp option update blog_public 1 --path=<site-dir>
wp config set WP_ENVIRONMENT_TYPE production --type=constant --path=<site-dir>
curl -sI https://example.com/ | grep -i x-robots-tag
```

The last command should print nothing. Leave staging protected.

## Minimal data move fallback

Use this only when `wp-site-migration` is not installed and the user has approved the move. It suits a single site, not multisite. Run on the target unless noted; WP-CLI can also reach a remote site with `--ssh=<user>@<host>/<site-dir>` if the host allows SSH.

1. Back up both sides.

   ```bash
   wp db export <backup-dir>/<env>-before-<YYYYMMDD>.sql --path=<site-dir>
   ```

   Also archive `wp-content` (or take a host snapshot). Confirm the backup files exist and are not empty.

2. Export the source database.

   ```bash
   wp db export <backup-dir>/source-<YYYYMMDD>.sql --path=<source-dir>
   ```

3. Import on the target (this replaces the target database).

   ```bash
   wp db import <backup-dir>/source-<YYYYMMDD>.sql --path=<site-dir>
   ```

4. Replace URLs, dry run first, leaving the `guid` column alone.

   ```bash
   wp search-replace 'https://example.test' 'https://staging.example.com' --all-tables-with-prefix --skip-columns=guid --report-changed-only --dry-run --path=<site-dir>
   wp search-replace 'https://example.test' 'https://staging.example.com' --all-tables-with-prefix --skip-columns=guid --report-changed-only --path=<site-dir>
   ```

   WP-CLI handles serialised data; a text editor on the SQL file does not.

5. Copy uploads.

   ```bash
   rsync -av --dry-run <source-dir>/wp-content/uploads/ <user>@<host>:<site-dir>/wp-content/uploads/
   rsync -av <source-dir>/wp-content/uploads/ <user>@<host>:<site-dir>/wp-content/uploads/
   ```

   On Windows, use the host's file manager, an SFTP client, or `scp -r` (OpenSSH is built into Windows 10 and 11).

6. Tidy and check.

   ```bash
   wp rewrite flush --path=<site-dir>
   wp cache flush --path=<site-dir>
   wp db search 'example.test' --path=<site-dir>
   ```

   Re-apply step 2 (`blog_public 0`) if the import overwrote it on staging.
