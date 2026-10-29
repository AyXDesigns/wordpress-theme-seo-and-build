---
name: wp-local-stack-setup
description: Choose, set up and repair a local WordPress development environment on Windows, macOS or Linux, covering XAMPP, LocalWP, WordPress Studio, DDEV, Docker-based wp-env, a team-approved stack and WP-CLI. Asks about the user's situation first, then offers options with pros and cons before installing anything. Use when the user mentions local WordPress, localhost, XAMPP, Local by Flywheel, Studio, DDEV, wp-env, Docker, WSL2, WP-CLI, PHP version, "site won't load locally", port 80 in use or "error establishing a database connection". For moving a site between environments, use wp-site-migration.
license: MIT
metadata:
  author: AyXDesigns
  version: "0.2.0"
---

# Local WordPress environment setup

Helps a user end up with one working, isolated local WordPress site on Windows, macOS or Linux, using a stack that suits them. The agent asks first, inspects read-only, offers a choice, and installs only what the user picks.

## Before you start

- Treat the stack, PHP, the database server, WordPress files, WP-CLI and local credentials as separate parts. A problem in one does not justify replacing the others.
- An existing working local site is worth more than a newer tool. Do not migrate it just because another option exists.
- If the user only needs to review content or a design, say so: a stack may not be needed at all.
- Moving an existing site's database and uploads into the new stack is a separate job. Use `wp-site-migration` if installed; otherwise, stop after the empty site works and ask before importing anything.

### Version baseline (as of October 2026, verify at source)

- New projects: the latest stable WordPress (7.1 at the time of writing), not a beta, RC or nightly unless the user is testing pre-release compatibility.
- PHP: WordPress recommends 8.3 or later; WordPress 7.0 and 7.1 run on PHP 7.4 to 8.5. Database: MySQL 8.0+ or MariaDB 10.11+.
- Existing sites: match the production PHP and database versions first. Test an upgrade in a separate copy, never by silently upgrading the working one.
- Re-check before quoting: <https://wordpress.org/about/requirements/> and <https://make.wordpress.org/core/handbook/references/php-compatibility-and-wordpress-versions/>.

## Workflow

### 1. Ask about the situation first

Before recommending or installing anything, ask these questions in one short message. Skip any the user has already answered, and if you are running on the user's machine, confirm what step 2 can detect instead of asking it.

| Topic | Question |
|---|---|
| Machine | Which OS and version (Windows 10/11, macOS Intel or Apple silicon, which Linux distribution)? Do you have admin rights? Roughly how much RAM and free disk? |
| Comfort | Do you prefer a desktop app with buttons, or are you happy in a terminal? Have you used Docker before? |
| Existing setup | Do you already have local sites or a stack (XAMPP, LocalWP, MAMP, Docker)? Must they keep working untouched? |
| Project | Is this a new site, a copy of a live site, theme or plugin development, or contributing to WordPress itself? |
| Parity | Which PHP and database versions does the live host run? Do you need multisite, specific PHP extensions or a particular web server (Apache or Nginx)? |
| Team | Will other people (possibly on other OSes) or CI need the same setup from a file in the repository? |
| Docker | Is Docker allowed and already installed? Any licence or company policy limits (Docker Desktop needs a paid plan for larger organisations)? |
| Extras | Do you need email capture, local HTTPS, Xdebug, a shareable preview link, or push/pull with a host? |

Done when: you know the OS, comfort level, existing setups that must survive, the project type and the version targets, or the user has said "you choose".

### 2. Inspect read-only

Run the inventory in [references/verify-commands.md](references/verify-commands.md) (bash and PowerShell versions). It only reads: installed tools and versions, running services, listening ports (80, 443, 3306, 8888, 8889), WSL2 and Docker state, disk space, and any existing WordPress install (`wp core version`, `wp option get home`).

- Read `wp-config.php` only through `wp config get DB_NAME` style lookups for the constants you need. Never print `DB_PASSWORD`, keys or salts.
- Note conflicts: two stacks fighting for port 80 or 3306, a global PHP that WP-CLI picks up instead of the stack's PHP, an old Docker engine.

Done when: you can list what exists, what runs, and what would conflict.

### 3. Present the options and wait

Shortlist 2 to 4 options with the table below, then present them as a short question with choices, using the prompt template and per-stack facts in [references/stack-options.md](references/stack-options.md). For each option give **advantages**, **disadvantages**, cost and effort, and who it suits. Recommend one and say why, using the user's own answers.

| Situation | Usually shortlist |
|---|---|
| Existing local site or team stack that works | Keep it (repair, do not replace); add one alternative only if it is broken beyond repair |
| Beginner, wants a desktop app, any OS | LocalWP, WordPress Studio |
| Team project, config in the repo, mixed OSes | DDEV, wp-env |
| Block, theme or plugin development, tests or CI | wp-env, DDEV |
| Must match a live host's PHP, database and web server closely | DDEV, LocalWP (custom environment) |
| Windows only, legacy project already built around XAMPP | Keep XAMPP; offer DDEV or LocalWP for new projects |
| Docker not allowed or machine is low on RAM | LocalWP, WordPress Studio, XAMPP (Windows) |
| Site will be hosted on WordPress.com or Pressable | WordPress Studio |
| Content or design review only | No stack; use the existing preview |

Stop here until the user picks. Silence is not consent.

Done when: the user has named one option.

### 4. Agree the setup plan

Before any download or change, tell the user, for the chosen option:

- download source (official site only) and version;
- disk and memory impact, and whether a restart or sign-out is needed;
- every path, service, port, hosts-file entry, certificate store or PATH change it will make;
- which existing sites could be affected, and how to undo it.

Done when: the user approves this plan.

### 5. Install and create one isolated site

Follow the OS-specific steps for the chosen stack in [references/setup-commands.md](references/setup-commands.md).

- One site per folder, one database per site, its own table prefix and its own local URL (for example `example.test` or the stack's default domain).
- Prefer project-local tools (`npx wp-env`, `ddev wp`, the app's site shell) over global installs and PATH edits.
- Set `WP_ENVIRONMENT_TYPE` to `local` and keep `WP_DEBUG_DISPLAY` off; log to `wp-content/debug.log` only while diagnosing.
- Create admin credentials with prompts (`--prompt=admin_password`) so they never appear in command history or output.

Done when: the site's home page and `/wp-login.php` load in the browser.

### 6. Make WP-CLI work against this site

Use the stack's built-in WP-CLI where it has one (`ddev wp`, `npx wp-env run cli wp`, LocalWP site shell, `studio wp`). For XAMPP or a bare stack, run the official PHAR with the stack's own PHP and an explicit `--path=`. Check that `wp --info` reports the same PHP the site uses.

Done when: a read-only command such as `wp option get home` returns the local URL.

### 7. Verify and record

Run the verification chain in [references/verify-commands.md](references/verify-commands.md): URL responds, PHP version and extensions, database server version, WordPress version, WP-CLI targeting, login page, and email capture if requested. Then fill in [references/environment-record.md](references/environment-record.md) and save it with the project (no credentials).

Done when: every check passes or each failure is listed with its cause.

## Repair mode

When an existing local site is broken, skip step 3 unless the stack itself is beyond repair. Diagnose in this order and fix the smallest thing: service not running, port conflict, wrong PHP picked up, database not reachable, wrong `home`/`siteurl`, file permissions, then plugins or theme (disable with `wp plugin deactivate --all --skip-plugins` only with approval and a note of what was active).

## Ask before acting

Get explicit approval before you:

- download or install anything, including Docker, WSL2, Homebrew packages, the PHP runtime or WP-CLI;
- change PATH, the hosts file, a certificate trust store (`mkcert -install`), firewall rules or system services;
- stop, reconfigure or change the port of a service another site uses;
- create, drop or import a database, or overwrite `wp-config.php`, `.htaccess` or server config (back them up first);
- run `wp-env destroy`, `ddev delete` or delete a LocalWP or Studio site;
- enable a public share link (LocalWP Live Links, Studio preview sites, tunnels), because it exposes the local site;
- sign in to a third-party account on the user's behalf. The user signs in themselves.

## Output

Hand back the completed [references/environment-record.md](references/environment-record.md): the stack and why it was chosen, versions, local URL, paths, ports, what changed on the machine, checks passed, unresolved issues, how to undo the setup, and the next steps that need approval. Do not seed content, install plugins, import data or deploy unless separately asked.
