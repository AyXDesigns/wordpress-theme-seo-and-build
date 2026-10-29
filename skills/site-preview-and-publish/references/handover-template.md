# Publish handover template

Fill this in after a preview, staging set-up or launch. Keep it free of passwords, keys, tokens, personal email addresses and real file paths; refer to accounts by role ("client marketing lead") rather than credentials.

```markdown
# Publish handover: <site name>

Date: <YYYY-MM-DD>  Prepared by: <name or agent>  Approved by: <name>

## Environments

| Environment | URL | Host / tool | WordPress | PHP | Protected | Indexable | Notes |
|---|---|---|---|---|---|---|---|
| Local | https://example.test | <stack> | <x.y.z> | <x.y> | n/a | no | |
| Preview | <share URL or "none"> | <tool> | | | <yes/no> | no | expires <date> |
| Staging | https://staging.example.com | <host> | | | yes (<method>) | no (header + setting) | |
| Production | https://example.com | <host, plan> | | | no | yes | |

## Hosting decision

- Chosen: <host and plan>
- Options offered: <A, B, C>
- Reason: <one or two sentences>

## Accounts and owners (no credentials)

| Account | Owner (role) | Who has access |
|---|---|---|
| Registrar | | |
| DNS | | |
| Hosting | | |
| Email | | |
| CDN | | |
| Search Console / analytics | | |

## What was deployed

- Code: <theme/plugin package name and version or commit>
- Database and uploads: <moved with wp-site-migration | fallback steps | not moved>
- URL replacement: <from> to <to>, dry run reviewed: <yes/no>

## DNS changes

| Record | Name | Before | After | Changed at (time, zone) |
|---|---|---|---|---|
| A | example.com | <old> | <new> | |
| CNAME | www | | | |
| MX | example.com | <unchanged> | <unchanged> | |

## SSL and redirects

- Certificate issuer and expiry: <...>; auto-renewal: <yes/no>
- HTTPS forced: <yes/no>; canonical host: <https://example.com>
- Old-URL redirects in place: <count / "none needed">

## Caches purged

- Page cache: <yes/no>  Object cache: <yes/no>  Server cache: <yes/no>  CDN: <yes/no>

## Checks

| Check | Result | Evidence |
|---|---|---|
| Pre-publish checklist | <x of y passed> | <link or notes> |
| Anonymous visit to production | | |
| Production has no noindex | | |
| Staging still protected and noindex | | |
| Forms and email | | |
| Mobile rendering | | |

## Rollback plan

- Trigger: <e.g. checkout fails, site down for 15 minutes>
- Decision owner: <role>
- Steps: <revert DNS to recorded values | restore backup <name> | host snapshot <name>>
- Backups taken before launch: <names and locations, no credentials>
- Expected time to roll back: <minutes>

## Open items

| Item | Owner | Due |
|---|---|---|
| | | |
```
