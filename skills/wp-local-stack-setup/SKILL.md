---
name: wp-local-stack-setup
description: Inspect, recommend, and safely configure the right local WordPress environment on Windows, including existing XAMPP, Docker-based wp-env, and WP-CLI, with installation options before any system change.
---

# Local WordPress environment setup

Use for local WordPress environment setup, repair, or configuration on Windows. Start read-only. Treat XAMPP, Docker-based `wp-env`, PHP, MySQL/MariaDB, WordPress files, WP-CLI, and local database credentials as separate components.

## Choose the smallest suitable local stack

Recommend one option from the actual project context before proposing an install:

| Situation | Preferred option | Reason |
|---|---|---|
| Existing XAMPP site, legacy PHP requirement, or project already documented around XAMPP | Keep the isolated XAMPP site | Lowest migration risk and fastest path to parity. |
| WordPress core, block, or plugin development needing repeatable automated environments | Docker-based `wp-env` | Reproducible environment and closer alignment with official development tooling. |
| Team already has an approved local stack | Use the approved stack | Preserves team support, documentation, and deployment assumptions. |
| Simple content review, no code or data change | Do not install a stack by default | Avoids unnecessary software and configuration changes. |

Do not migrate an existing local site merely because another option is newer. Do not install Docker, XAMPP, WP-CLI, a database service, or a global PATH change without explicit approval.

## Version baseline

For every new local WordPress project:

- Recommend PHP 8.4 or later. Confirm the target theme, plugins, database driver, and chosen local stack support the selected PHP version before installation.
- Install the latest stable WordPress release, not a nightly, beta, or release candidate, unless the task explicitly requires pre-release compatibility testing.
- Record the exact PHP and WordPress versions used so the environment can be reproduced.

For an existing site, preserve the production-compatible PHP and WordPress versions first. Create a separate latest-WordPress compatibility fixture when an upgrade is being assessed; do not silently upgrade the working local copy.

## Diagnose before changing anything

Establish:

- whether XAMPP, Docker, `wp-env`, or another approved stack is installed and usable;
- where the selected stack stores PHP, database, WordPress, and project files, plus their versions;
- whether Apache and the database service are running, their configured ports, and any port conflicts;
- whether a WordPress site already exists, its document root, local URL, and database connection state;
- whether WP-CLI is available and which PHP executable it uses;
- available disk space, required permissions, backups, and existing sites that could be affected.

Never expose database passwords, API keys, or full configuration contents in output.

## Offer choices before installation or configuration

Before downloading, installing, changing ports, editing configuration, creating databases, or modifying WordPress files, present the relevant options with consequences. For example:

| Need | Options to offer |
|---|---|
| Local web stack | Keep existing XAMPP; use approved Docker-based `wp-env`; install XAMPP; use another approved local stack; stop if a managed environment is required. |
| PHP compatibility | Use PHP 8.4 or later for a new project; keep a compatible existing version for parity work; install an approved XAMPP version; use a project-specific PHP executable. |
| WordPress version | Install the latest stable WordPress release for a new project; retain the existing version for parity work; create a separate latest-version fixture for upgrade testing. |
| WP-CLI | Use existing executable; download the official PHAR; use a project-managed wrapper; stop if installation is not approved. |
| Database | Reuse an approved empty local database; create a new local database; import an authorised sanitized fixture. |
| Local URL | Use the existing project URL; use a localhost subdirectory; configure a local virtual host only with explicit approval. |

State expected download source, version, disk impact, changed paths, required restart, rollback method, and which existing sites might be affected. Wait for explicit approval before executing a choice.

## Safe configuration principles

- Keep each local site isolated by document root, database, table prefix, and URL.
- Prefer project-local paths and explicit PHP/WP-CLI commands over changing global PATH settings.
- Do not overwrite `wp-config.php`, database data, existing sites, or Apache configuration without a backup and explicit confirmation.
- Use a version of WP-CLI compatible with the installed PHP. Verify this before relying on it for migrations or evaluation commands.
- Keep debug display disabled when inspecting rendered pages. Use a local debug log during targeted diagnosis, then restore the prior configuration.
- Record non-default ports, paths, PHP version, WordPress version, database engine/version, WP-CLI version, and local URL in project documentation without credentials.

## Verification after approved changes

Verify the smallest useful chain:

1. Apache and database service state and reachable local URL.
2. PHP executable version and required extensions.
3. WordPress health and database connection.
4. WP-CLI version, `--path` targeting, and a read-only command.
5. Site front page and administrator login route.

Report what changed, checks passed, unresolved issues, rollback path, and any next action needing approval. Do not seed, activate, migrate, install plugins, import a database, or deploy a site unless separately requested.
