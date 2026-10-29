# Code review checklist

Use this for each theme, plugin or `mu-plugins` folder in scope. Mark each line **OK**, **Finding** (add the finding ID), **N/A** or **Not checked**. Record file and line for every finding.

- **Code reviewed**: <theme-slug / plugin-slug> at version or commit <ref>
- **Reviewer**: <name or agent>
- **Date**: <yyyy-mm-dd>

## 1. Entry points

| Check | Result | Notes |
| --- | --- | --- |
| Every use of `$_GET`, `$_POST`, `$_REQUEST`, `$_COOKIE`, `$_SERVER`, `$_FILES` and `php://input` is listed | | |
| Every `wp_ajax_*` and `wp_ajax_nopriv_*` handler is listed with who can call it | | |
| Every `register_rest_route()` is listed with its methods and `permission_callback` | | |
| `admin_post_*`, `admin_post_nopriv_*`, shortcodes, block render callbacks and cron hooks are listed | | |
| `$_REQUEST` is not used where the method is known (prefer `$_GET` or `$_POST`) | | |

## 2. Input handling

| Check | Result | Notes |
| --- | --- | --- |
| Superglobals are read with `isset()` and `wp_unslash()` before use | | |
| Values are validated against the expected shape (allow-list, type, range, length) before sanitising | | |
| The right sanitiser is used: `sanitize_text_field()`, `sanitize_textarea_field()`, `sanitize_email()`, `sanitize_key()`, `absint()`, `esc_url_raw()`, `sanitize_file_name()` | | |
| Arrays are sanitised element by element, not cast to string | | |
| Settings registered with `register_setting()` have a `sanitize_callback` | | |
| JSON from requests is decoded and validated, not trusted | | |

## 3. Output escaping

| Check | Result | Notes |
| --- | --- | --- |
| Every dynamic value is escaped at output, late, not only at input | | |
| HTML text: `esc_html()`; attributes: `esc_attr()`; URLs: `esc_url()`; textarea: `esc_textarea()` | | |
| Allowed HTML uses `wp_kses_post()` or `wp_kses()` with a narrow allow-list | | |
| Translated strings with variables use `esc_html__()`, `esc_attr__()` or `printf()` with escaped arguments | | |
| Data passed to JavaScript uses `wp_add_inline_script()` with `wp_json_encode()`, or `wp_localize_script()` | | |
| Escaping matches the context (no `esc_html()` inside an `href`) | | |
| Every `phpcs:ignore` near output has a valid, written reason | | |

## 4. Intent and permission

| Check | Result | Notes |
| --- | --- | --- |
| Every state-changing request checks a nonce (`check_admin_referer()`, `check_ajax_referer()`, `wp_verify_nonce()`) | | |
| The nonce result is actually acted on (the check does not continue on failure) | | |
| Every state-changing request also checks `current_user_can()` with the narrowest suitable capability | | |
| Object-level checks use meta capabilities (`edit_post`, `delete_post`, `edit_user`) with the object ID | | |
| `is_admin()` and `is_user_logged_in()` are not used as permission checks | | |
| `wp_ajax_nopriv_*` handlers do nothing a logged-out visitor should not be able to do | | |

## 5. REST API

| Check | Result | Notes |
| --- | --- | --- |
| Every route has a `permission_callback` | | |
| `__return_true` appears only on public, read-only routes, with a comment saying why | | |
| `args` define `type`, `validate_callback` and `sanitize_callback` for each parameter | | |
| Responses do not expose private fields (emails, internal IDs, tokens, unpublished content) | | |

## 6. Database

| Check | Result | Notes |
| --- | --- | --- |
| Every query with variable data uses `$wpdb->prepare()` | | |
| Placeholders are used correctly: `%s`, `%d`, `%f`, `%i` for identifiers (WordPress 6.2+); no quotes around placeholders | | |
| `LIKE` values use `$wpdb->esc_like()` before `prepare()` | | |
| `ORDER BY` and column names come from an allow-list | | |
| WordPress APIs (WP_Query, `get_posts()`, metadata functions) are used where they fit | | |
| `$wpdb->insert()`, `update()` and `delete()` pass format arrays | | |

## 7. Files, uploads and remote requests

| Check | Result | Notes |
| --- | --- | --- |
| Uploads use `wp_handle_upload()` or `media_handle_upload()` | | |
| File type is checked with `wp_check_filetype_and_ext()` against an allow-list; browser MIME type is not trusted | | |
| Size limits, capability and nonce checks apply to uploads | | |
| Uploaded files cannot be executed (no `.php` allowed; private files stored outside public paths or protected) | | |
| File paths built from input are validated (no `../`, use `validate_file()` or a fixed base directory) | | |
| `include` and `require` never use user-controlled paths | | |
| Remote requests use the HTTP API (`wp_remote_get()`, `wp_safe_remote_get()` for user-supplied URLs) | | |
| Redirects use `wp_safe_redirect()` followed by `exit` | | |

## 8. Direct access, secrets and dangerous code

| Check | Result | Notes |
| --- | --- | --- |
| Non-entry PHP files start with `defined( 'ABSPATH' ) \|\| exit;` | | |
| No API keys, tokens, passwords or private keys in source or git history | | |
| No `.env`, backup (`.bak`, `.old`, `.zip`, `.sql`) or log files shipped in the package | | |
| No `eval()`, `assert()` with strings, `create_function()`, `extract()` on input, or shell functions | | |
| No `unserialize()` on user-influenced data (use JSON) | | |
| No obfuscated code (`base64_decode()` feeding `eval()`, long encoded strings) | | |
| Third-party libraries bundled in the package are current and from a known source | | |

## 9. Privacy and data

| Check | Result | Notes |
| --- | --- | --- |
| Only data needed for the purpose is stored | | |
| Personal data in custom tables or post types is excluded from public queries, REST and search unless intended | | |
| Personal data is covered by the WordPress privacy export and erase tools where relevant | | |
| Logs and error messages do not record passwords, tokens or full personal records | | |

## 10. Automated results

| Tool and version | Command | Findings confirmed | False positives (reason) |
| --- | --- | --- | --- |
| PHPCS + WPCS <version> | | | |
| Plugin Check <version> | | | |
