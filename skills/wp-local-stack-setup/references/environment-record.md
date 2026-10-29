# Local environment record template

Copy this into the project (for example `docs/local-environment.md`) and fill it in. It must contain no passwords, keys, tokens or personal file paths; use `<project-dir>` style placeholders where a path is user-specific.

```markdown
# Local environment: <site-slug>

Recorded: <YYYY-MM-DD> by <name or agent>

## Choice

- Stack: <LocalWP | WordPress Studio | DDEV | wp-env | XAMPP | existing: name>
- Options offered: <A, B, C>
- Why this one: <one or two sentences tied to the user's answers>

## Machine

- OS and architecture: <e.g. Windows 11 x64 with WSL2 Ubuntu | macOS 15 Apple silicon | Ubuntu 24.04 x64>
- Docker provider (if any): <name and version>

## Versions

| Part | Version | Matches target? |
|---|---|---|
| WordPress | <x.y.z> | <yes/no: target> |
| PHP (site) | <x.y.z> | <yes/no: target> |
| PHP (WP-CLI) | <x.y.z> | <same as site?> |
| Database | <MySQL x.y / MariaDB x.y / SQLite> | <yes/no: target> |
| Web server | <Apache / Nginx / PHP built-in> | |
| WP-CLI | <x.y.z> | |
| Stack tool | <e.g. DDEV vX.Y.Z> | |

## Site

- Local URL: <https://example.test or stack default>
- Site folder: <project-dir>/<site-slug>
- Database name and table prefix: <wp_example> / <wp_>
- WP_ENVIRONMENT_TYPE: local
- Ports in use: <80, 443, 3306, ...>
- Email capture: <Mailpit URL or "not set up">
- How to start / stop: <commands or app steps>
- How to run WP-CLI: <e.g. ddev wp ..., npx wp-env run cli wp ...>

## Changes made to the machine

| Change | Where | Approved | How to undo |
|---|---|---|---|
| <installed DDEV vX.Y.Z> | <system> | <yes, date> | <uninstall steps> |

## Verification

| Check | Result |
|---|---|
| Home page and login respond | <pass/fail> |
| WP-CLI uses site PHP | <pass/fail> |
| Database version | <pass/fail> |
| WordPress version and URL | <pass/fail> |
| Debug display off | <pass/fail> |
| Email capture | <pass/fail/not requested> |
| Site Health (by user) | <notes> |

## Open issues and next steps needing approval

- <issue or next step>
```
