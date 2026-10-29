# Diagnose and verify commands

Part A is the read-only inventory for step 2. Part B is the verification chain for step 7. None of these commands change the machine. Missing tools simply print nothing or an error; that is a finding, not a failure.

## Part A: read-only inventory

### Operating system, memory and disk

```bash
# macOS
sw_vers; uname -m; sysctl -n hw.memsize; df -h .
# Linux
cat /etc/os-release; uname -m; free -h; df -h .
```

```powershell
Get-CimInstance Win32_OperatingSystem | Select-Object Caption, Version, OSArchitecture
[math]::Round((Get-CimInstance Win32_ComputerSystem).TotalPhysicalMemory / 1GB, 1)
Get-PSDrive -PSProvider FileSystem | Select-Object Name, @{n='FreeGB';e={[math]::Round($_.Free/1GB,1)}}
```

### Installed tools and versions

```bash
for t in php mysql mariadb docker ddev wp node npm studio brew; do printf '%s: ' "$t"; command -v "$t" || echo 'not found'; done
php -v
php -m | grep -Ei 'curl|gd|imagick|intl|mbstring|mysqli|pdo_mysql|pdo_sqlite|sodium|xml|zip'
docker version --format '{{.Server.Version}}'
ddev version
node -v
```

```powershell
foreach ($t in 'php','mysql','docker','ddev','wp','node','npm','studio','wsl') {
  $c = Get-Command $t -ErrorAction SilentlyContinue
  if ($c) { "{0}: {1}" -f $t, $c.Source } else { "{0}: not found" -f $t }
}
php -v
docker version --format '{{.Server.Version}}'
wsl --status
wsl -l -v
Test-Path '<xampp-dir>'
```

Also look for desktop apps the user may have: LocalWP and WordPress Studio in the Applications folder (macOS), Start menu (Windows) or app launcher (Linux). Ask rather than search private folders.

### Running services and port conflicts

Ports to check: 80, 443 (web), 3306 (database), 8025 or 8026 (Mailpit), 8888 and 8889 (wp-env).

```bash
# macOS
lsof -nP -iTCP -sTCP:LISTEN | grep -E ':(80|443|3306|8025|8026|8888|8889) '
# Linux
ss -ltnp | grep -E ':(80|443|3306|8025|8026|8888|8889)\b'
docker ps --format '{{.Names}}\t{{.Ports}}'
ddev list
```

```powershell
Get-NetTCPConnection -State Listen -ErrorAction SilentlyContinue |
  Where-Object LocalPort -in 80,443,3306,8025,8026,8888,8889 |
  Select-Object LocalPort, OwningProcess, @{n='Process';e={(Get-Process -Id $_.OwningProcess).ProcessName}}
docker ps --format '{{.Names}}\t{{.Ports}}'
```

Common culprits on Windows: IIS (World Wide Web Publishing Service), Skype or another app on port 80, a second MySQL service on 3306. Report them; do not stop them without approval.

### Existing WordPress site

Run from the site folder or pass `--path=` (prefix with `ddev`, `npx wp-env run cli`, or `studio` as the stack needs):

```bash
wp core version --path=<site-dir>
wp option get home --path=<site-dir>
wp option get siteurl --path=<site-dir>
wp config get DB_NAME --path=<site-dir>
wp config get DB_HOST --path=<site-dir>
wp config get table_prefix --path=<site-dir>
wp eval 'echo wp_get_environment_type();' --path=<site-dir>
wp plugin list --status=active --fields=name,version --path=<site-dir>
```

Never run `wp config list` without filtering, and never print `DB_PASSWORD`, `AUTH_KEY` or any salt.

## Part B: verification chain

Stop at the first failure, fix it (with approval if it changes anything), then continue. Replace `<site-url>` with the local URL.

1. **URL responds.**

   ```bash
   curl -sI <site-url>/ | head -n 1
   curl -sI <site-url>/wp-login.php | head -n 1
   ```

   ```powershell
   curl.exe -sI <site-url>/
   curl.exe -sI <site-url>/wp-login.php
   ```

   Expect `200` (or a `301`/`302` to the same site). Add `-k` only for a local self-signed certificate.

2. **WP-CLI and the site use the same PHP.**

   ```bash
   wp --info
   wp eval 'echo PHP_VERSION . PHP_EOL;'
   ```

   Compare the PHP binary in `wp --info` with the stack's PHP, and the version with the agreed target.

3. **Database server reachable and at the expected version.**

   ```bash
   wp eval 'global $wpdb; echo $wpdb->db_server_info() . PHP_EOL;'
   ```

   SQLite-based sites (Studio, some wp-env runtimes) report differently; record that instead.

4. **WordPress installed, at the right version, with the right URL.**

   ```bash
   wp core is-installed && echo installed
   wp core version
   wp option get home
   wp eval 'echo wp_get_environment_type();'
   ```

5. **Debug output hidden.** `wp config get WP_DEBUG_DISPLAY` should be `false` or unset with `WP_DEBUG` off. The home page source should contain no PHP notices.

6. **Email capture (if requested).**

   ```bash
   wp eval 'var_dump( wp_mail( "test@example.test", "Local mail test", "Sent from the local site." ) );'
   ```

   Expect `bool(true)` and the message in Mailpit (`ddev mailpit`, or LocalWP **Tools** > **Mailpit**).

7. **Admin check by the user.** Ask the user to sign in and open **Tools** > **Site Health**. Record any critical items. Do not sign in for them.
