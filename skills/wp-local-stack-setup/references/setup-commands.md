# Setup commands per stack

Run these only after the user has chosen a stack and approved the setup plan. Download installers from the official source named in [stack-options.md](stack-options.md) only. Commands use placeholders: replace `<site-slug>`, `<project-dir>`, `<tools-dir>`, `<admin-user>` and `example.test` with the agreed values. Never type a password into a command; use the `--prompt=` options shown.

Version targets (as of October 2026, verify at source): latest stable WordPress (7.1), PHP 8.3 or later for new projects, MySQL 8.0+ or MariaDB 10.11+. For an existing site, use the live host's versions instead.

## LocalWP

All OSes: install the app from the official download page (Windows `.exe`, macOS `.dmg`, Linux `.deb` or `.rpm`). On Debian or Ubuntu:

```bash
sudo apt install ./<downloaded-local-package>.deb
```

Create the site in the app: **+** > **Create a new site** > name it `<site-slug>` > **Custom** environment > choose PHP (8.3 or the live version), web server (Nginx or Apache to match the host) and database (MySQL 8.0 or MariaDB to match the host). Let the app prompt for the admin password.

WP-CLI: right-click the site > **Open site shell**, then:

```bash
wp core version
wp option get home
```

Email: **Tools** tab > **Mailpit**. HTTPS: **SSL** > **Trust** (changes the certificate trust store, so ask first).

## WordPress Studio

Install the app from the official Studio page (macOS 13+, 64-bit Windows, 64-bit Debian-based Linux). Click **Add site**, name it `<site-slug>`, and start it.

Enable the CLI in the app's settings (**Studio CLI for terminal**), then from the site folder:

```bash
studio wp core version
studio wp option get home
```

Studio stores the database in SQLite. Tell the user before relying on it for a project whose plugins run raw MySQL queries.

## DDEV

Install a Docker provider and DDEV from the official DDEV install page:

- **macOS:** a Docker provider (OrbStack, Lima, Colima, Rancher Desktop or Docker Desktop), then `brew install ddev/ddev/ddev`.
- **Linux:** Docker CE from Docker's own repository, add the user to the `docker` group, then DDEV from its apt or yum repository.
- **Windows:** the DDEV Windows installer, which sets up WSL2 and Docker CE inside it. Open the WSL2 distribution (for example Ubuntu) and keep project files under the Linux home folder, not `/mnt/c`.

Trusted HTTPS needs a one-off `mkcert -install`, which changes the trust store. Ask first.

Create the site (bash, inside WSL2 on Windows):

```bash
mkdir <site-slug> && cd <site-slug>
ddev config --project-type=wordpress --php-version=8.3 --database=mariadb:10.11
ddev start
ddev wp core download
ddev wp core install --url='https://<site-slug>.ddev.site' --title='Example site' --admin_user=<admin-user> --admin_email=admin@example.test --prompt=admin_password
ddev wp config set WP_ENVIRONMENT_TYPE local --type=constant
ddev launch
```

Email: `ddev mailpit`. Database shell: `ddev mysql`. Stop: `ddev stop`. Commit the `.ddev/` folder so the team gets the same setup.

## wp-env

Requires Node.js (latest LTS, ideally through a version manager) and, for the default runtime, Docker. On Windows use Docker Desktop with the WSL2 backend.

Install per project rather than globally:

```bash
cd <project-dir>
npm install --save-dev @wordpress/env
```

Create `.wp-env.json` in the project root (`null` for `core` means latest stable WordPress):

```json
{
  "core": null,
  "phpVersion": "8.3",
  "themes": [ "." ]
}
```

Use `"plugins": [ "." ]` instead of `"themes"` for a plugin project. Then:

```bash
npx wp-env start
npx wp-env run cli wp option get home
npx wp-env stop
```

The site runs at `http://localhost:8888` and the test site at `http://localhost:8889`. `npx wp-env destroy` deletes the environment and its data: ask first. To try without Docker: `npx wp-env start --runtime=playground` (no `run` command) or `--runtime=php` (local PHP with `pdo_sqlite`).

## XAMPP (Windows)

Install the official Windows build whose PHP matches the target (8.3, 8.4 or 8.5 as of October 2026). Do not install a second copy over an existing XAMPP. Start Apache and MySQL from the XAMPP Control Panel.

Get WP-CLI without changing PATH: download the official `wp-cli.phar` to `<tools-dir>` and call it with XAMPP's PHP.

```powershell
$php = '<xampp-dir>\php\php.exe'
$wp  = '<tools-dir>\wp-cli.phar'
$site = '<xampp-dir>\htdocs\<site-slug>'
& $php $wp --info
& $php $wp core download --path=$site
& $php $wp config create --path=$site --dbname=wp_example --dbuser=<db-user> --dbhost=127.0.0.1 --prompt=dbpass
& $php $wp db create --path=$site
& $php $wp core install --path=$site --url='http://localhost/<site-slug>' --title='Example site' --admin_user=<admin-user> --admin_email=admin@example.test --prompt=admin_password
& $php $wp config set WP_ENVIRONMENT_TYPE local --type=constant --path=$site
```

- Use a dedicated database user rather than `root` where the user agrees. If `root` has no password, tell the user and offer to set one.
- A virtual host such as `http://example.test` needs edits to Apache's `httpd-vhosts.conf` and the Windows hosts file (admin rights). Back up both files and ask first.
- Email: XAMPP has no capture tool. Offer Mailpit as a separate download, or an SMTP plugin pointed at it, only if the user wants email testing.

## Existing or team-approved stack

Read the project's own setup notes and config files first (`.ddev/config.yaml`, `.wp-env.json`, `.lando.yml`, `docker-compose.yml`, README). Use the team's commands as written. Change versions only in the shared config file and only with the team's agreement.

## WP-CLI on its own

Official PHAR (bash, macOS or Linux):

```bash
curl -O https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar
php wp-cli.phar --info
```

Moving it to `/usr/local/bin/wp` needs `sudo` and is a global change: ask first. On macOS, `brew install wp-cli` is the alternative.

PowerShell (Windows):

```powershell
Invoke-WebRequest -Uri 'https://raw.githubusercontent.com/wp-cli/builds/gh-pages/phar/wp-cli.phar' -OutFile '<tools-dir>\wp-cli.phar'
php '<tools-dir>\wp-cli.phar' --info
```

The official Windows guide adds a `wp.bat` wrapper and a PATH entry. Offer that only with approval; otherwise call the PHAR with an explicit PHP path as in the XAMPP section.
