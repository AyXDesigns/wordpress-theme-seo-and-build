# Local stack options

Facts below were checked in October 2026. Tools in this space change quickly: before quoting a platform, version or price to the user, re-check the official source listed under each option.

## At a glance

| Option | Windows | macOS | Linux | Needs Docker | Database | Built-in WP-CLI | Email capture | Config shareable in repo | Cost |
|---|---|---|---|---|---|---|---|---|---|
| Keep existing / team stack | as is | as is | as is | depends | depends | depends | depends | depends | none extra |
| LocalWP | yes (10/11, 64-bit) | yes (12+) | yes (.deb, .rpm) | no | MySQL or MariaDB | yes (site shell) | yes (Mailpit) | no | free |
| WordPress Studio | yes (64-bit) | yes (13+) | yes (64-bit, Debian-based) | no | SQLite | yes (`studio wp`) | not documented | partly | free, open source |
| DDEV | yes (WSL2 recommended) | yes | yes | yes | MariaDB or MySQL | yes (`ddev wp`) | yes (Mailpit) | yes (`.ddev/`) | free, open source; Docker provider may cost |
| wp-env | yes (Docker with WSL2 backend) | yes | yes | yes by default | MySQL-compatible (Docker runtime), SQLite (other runtimes) | yes (`wp-env run cli wp`) | no | yes (`.wp-env.json`) | free, open source; Docker provider may cost |
| XAMPP | yes (current PHP 8.3, 8.4, 8.5 builds) | outdated builds only | outdated builds only | no | MariaDB | no (add the PHAR) | no | no | free, open source |

"Outdated" means the official Linux and macOS XAMPP downloads have not been updated since 2023, while Windows builds are current.

## Option details

### Keep the existing or team-approved stack

Covers anything the user or team already runs: XAMPP, MAMP, Lando, Laravel Herd, VVV, a custom Docker Compose file, or one of the options below.

- **Advantages:** no migration risk; team documentation and support already exist; matches the deployment assumptions the team made.
- **Disadvantages:** may carry old PHP or database versions; problems already in the stack stay.
- **Cost and effort:** lowest. Usually a repair or a version bump.
- **Suits:** anyone with a working site, and every team that has already agreed a stack.
- **Check:** look for `.ddev/`, `.wp-env.json`, `.lando.yml`, `docker-compose.yml` or a README section before suggesting anything else.

### LocalWP (Local)

A desktop app by WP Engine that runs each site with its own PHP, web server and database, without Docker.

- **Advantages:** easiest start for beginners; per-site choice of PHP version, Nginx or Apache, and MySQL or MariaDB; Mailpit email capture, Adminer database access, one-click local HTTPS and a site shell with WP-CLI built in; Live Links shares a temporary preview.
- **Disadvantages:** configuration lives in the app, not the repository, so teams cannot share it as code; a separate environment download is needed for some PHP versions; Live Links and some add-ons need a free Local account; less suited to CI.
- **Cost and effort:** free of charge. Low effort; about 4 GB RAM and 1.5 GB disk minimum.
- **Suits:** freelancers, designers and beginners on any OS; quick client sites; anyone who prefers a GUI.
- **Platforms (as of October 2026):** Windows 10 or 11 (64-bit), macOS 12 or later, Linux `.deb` (tested on Ubuntu and Pop!_OS) and `.rpm` builds.
- **Source:** <https://localwp.com/help-docs/getting-started/installing-local/>, <https://localwp.com/help-docs/local-features/mailpit/>

### WordPress Studio

A free, open-source desktop app and CLI from Automattic.

- **Advantages:** very quick to create a site; no Docker; Studio CLI with `studio wp` for WP-CLI; preview sites with a public URL; two-way sync with WordPress.com and Pressable.
- **Disadvantages:** sites use SQLite rather than MySQL, so plugins with raw MySQL queries can behave differently from production; preview and sync features need a WordPress.com account; the runtime changed during 2026 (all sites moved to native PHP in 1.24.0 and the Playground "sandbox" runtime was removed), so older guides may be wrong; less control over web server and database parity.
- **Cost and effort:** free. Very low effort.
- **Suits:** beginners; block theme and content work; anyone hosting on WordPress.com or Pressable.
- **Platforms (as of October 2026):** macOS 13 or later, 64-bit Windows, 64-bit Debian-based Linux (desktop app added in 2026, Ubuntu first). Version 2.0.0 shipped on 19 October 2026.
- **Source:** <https://developer.wordpress.com/docs/developer-tools/studio/>, <https://developer.wordpress.com/docs/developer-tools/studio/changelog/>

### DDEV

An open-source, Docker-based local environment tool for PHP projects with a `wordpress` project type.

- **Advantages:** configuration in `.ddev/config.yaml` is committed and shared; exact PHP and database versions per project; Apache or Nginx; built-in WP-CLI (`ddev wp`), Mailpit (`ddev mailpit`), database clients, Composer, Node and Xdebug support; trusted local HTTPS on `https://<project>.ddev.site`; same behaviour on all three OSes.
- **Disadvantages:** needs a Docker provider and some terminal comfort; on Windows it runs inside WSL2, so project files should live in the Linux file system for speed; the first start downloads several images; uses more RAM than a desktop app.
- **Cost and effort:** DDEV is free. Docker provider: Docker CE (Linux, WSL2), Colima, Lima and Rancher Desktop are free; OrbStack and Docker Desktop can require paid licences for professional or larger-organisation use. Medium effort the first time, low after.
- **Suits:** developers and agencies; teams on mixed OSes; projects that must match production versions; anyone who wants the setup in the repository.
- **Requirements (as of October 2026):** macOS: OrbStack (recommended), Lima, Docker Desktop, Rancher Desktop or Colima. Windows: WSL2 with Ubuntu or another Debian-based distribution and Docker CE inside WSL2 (the DDEV Windows installer can set this up), or Docker Desktop or Rancher Desktop. Linux: Docker CE from Docker's own repository (user in the `docker` group, buildx 0.17.0 or later), Docker rootless or Podman rootless.
- **Source:** <https://docs.ddev.com/en/stable/> (pages: Docker installation, Quickstart for WordPress, Developer tools)

### wp-env (`@wordpress/env`)

The WordPress project's own Node.js tool for disposable development and test environments.

- **Advantages:** one small `.wp-env.json` file in the repository; maps the current theme or plugin straight into the site; separate development (port 8888) and test (port 8889) sites; matches the tooling used for WordPress core and Gutenberg; easy to pin WordPress (`"core"`) and PHP (`"phpVersion"`) versions.
- **Disadvantages:** needs Node.js (latest LTS) and, for the default runtime, Docker; aimed at development and testing rather than full-site work (no email capture, fixed ports, limited server tuning); `wp-env destroy` deletes the environment's data.
- **Docker-free runtimes (as of October 2026):** `--runtime=playground` runs WordPress in WebAssembly but has no `run` command; `--runtime=php` uses the local PHP with the `pdo_sqlite` extension and SQLite, and on Windows serves one request at a time. Treat both as quick-test options, not production parity.
- **Cost and effort:** free; Docker provider costs as for DDEV. Low to medium effort.
- **Suits:** block, theme and plugin developers; automated tests and CI; contributors to WordPress.
- **Source:** <https://developer.wordpress.org/block-editor/reference-guides/packages/packages-env/>

### XAMPP

A free Apache, MariaDB and PHP bundle from Apache Friends.

- **Advantages:** familiar to many Windows users; no Docker; current Windows builds offer PHP 8.3, 8.4 and 8.5 (as of October 2026); simple to inspect files and logs.
- **Disadvantages:** one global Apache, database and PHP for every site, so sites are not isolated and changing PHP affects all of them; manual virtual hosts, hosts-file edits and HTTPS; default database `root` account has no password; no built-in WP-CLI or email capture; Linux and macOS builds are stuck at 2023 versions (PHP 8.2 at most), so do not recommend it for new projects there; check the bundled MariaDB version against WordPress's 10.11+ recommendation.
- **Cost and effort:** free. Low effort to install, higher effort to run several sites well.
- **Suits:** Windows users with existing XAMPP projects; simple single-site learning on Windows.
- **Source:** <https://www.apachefriends.org/download.html>, <https://sourceforge.net/projects/xampp/files/>

### WP-CLI (with any option)

- Requires PHP 7.2.24 or later; install the official PHAR, Homebrew (`brew install wp-cli`) or use the stack's bundled copy.
- With XAMPP or a bare stack, call the PHAR with the stack's own PHP so WP-CLI and the site agree on the PHP version and extensions.
- On Windows, the official guide uses a `wp.bat` wrapper and a PATH change. Offer a project-local wrapper instead, and change PATH only with approval.
- **Source:** <https://make.wordpress.org/cli/handbook/guides/installing/>, <https://github.com/wp-cli/wp-cli/releases>

## Choice prompt template

Fill the brackets from the user's answers, keep 2 to 4 options, and wait for the answer.

```text
Based on what you told me (<OS>, <comfort level>, <existing sites>, <team/parity needs>), these are the realistic options:

1. <Option A> (recommended)
   + <advantage that matters to this user>
   + <second advantage>
   - <main disadvantage>
   Cost/effort: <free / licence note>, about <time> to set up. Suits: <who>.

2. <Option B>
   + ...
   - ...
   Cost/effort: ... Suits: ...

3. <Option C, or "Keep your current setup">
   + ...
   - ...

I recommend <Option A> because <reason tied to their answers>.
Which would you like? I will not install or change anything until you choose.
```
