# Security, privacy and accessibility baseline

Minimum rules for any theme or companion plugin. Facts are as of WordPress 7.1 (October 2026).

## 1. Request handling

| Stage | Rule | Typical functions |
| --- | --- | --- |
| Input | Check the shape you expect, then sanitise for storage | `absint()`, `sanitize_text_field()`, `sanitize_email()`, `sanitize_key()`, `wp_kses_post()` |
| Intent | Nonce on every state-changing form or request | `wp_nonce_field()`, `check_admin_referer()`, `wp_verify_nonce()` |
| Permission | Capability check; a nonce never grants permission | `current_user_can()` |
| Output | Escape late, for the exact context | `esc_html()`, `esc_attr()`, `esc_url()`, `wp_kses_post()`, `wp_json_encode()` |
| Database | Use WordPress APIs; prepare raw queries | `$wpdb->prepare()` |
| Redirects | Only to allowed hosts | `wp_safe_redirect()` then `exit` |
| REST routes | Always set a real `permission_callback` | never `__return_true` for private data |

Translated strings are output too: use `esc_html__()` and `esc_attr__()`.

## 2. Secrets and data

- No API keys, passwords or tokens in theme source, patterns, `theme.json` or logs. Keep them in environment configuration or `wp-config.php` constants, read only the constant needed, and never print it.
- Keep private records out of public queries, REST responses and search unless explicitly required.
- Store only data with an agreed purpose; define who can see it, how long it is kept and how it is exported or deleted.
- Never store payment card data or highly sensitive narratives in theme settings or generic form storage.
- Restrict uploads by type, size and who can upload.
- Self-host fonts and avoid third-party requests that send visitor data without a stated reason.

## 3. Headers and policies

Add security headers only after checking whether the host, a security plugin or a CDN already sets them. As of WordPress 7.1, client-side media processing needs `blob:` allowed in `worker-src` if a Content Security Policy is used; otherwise image processing falls back to the server. Test the editor after any policy change.

## 4. Accessibility target

Aim for WCAG 2.2 level AA unless the project agrees otherwise.

- Semantic landmarks (`header`, `nav`, `main`, `footer`) and one logical heading outline per page.
- A visible skip link to the main content.
- Every control usable by keyboard, with a visible focus indicator on every background; focus returns to a sensible place when an overlay closes.
- Labels, instructions, errors and status messages tied to their fields in code, not only by position or colour.
- Text contrast at least 4.5:1 (3:1 for large text and for interface components); check every token pairing.
- Content reflows at 320 CSS pixels wide and at 400% zoom without loss or sideways scrolling.
- Touch targets at least 24 by 24 CSS pixels.
- Meaningful alternative text, and empty `alt` for decorative images.
- No focusable control inside a hidden or `aria-hidden` container.
- Motion respects `prefers-reduced-motion`; nothing essential depends on animation or hover.
- Essential content and actions work without JavaScript. With the Interactivity API, render initial state on the server.
- When using 7.1 block visibility or responsive styles, do not hide content on small screens that visitors need.

## 5. How to check

- Keyboard: tab through each representative page; every action reachable, focus always visible.
- Zoom and reflow: 200% and 400% zoom, and a 320px wide viewport.
- Reduced motion: switch the operating system setting on and reload.
- No JavaScript: disable it in the browser; core content and forms still usable.
- Automated scan: an accessibility checker in the browser's developer tools or a command-line checker. Present the tool options to the user if none is installed; automated results never replace the manual checks above.
- Editor: the same content is readable and operable in the editor, which is always iframed as of 7.1.

## Sources

Checked October 2026:

- WCAG 2.2: <https://www.w3.org/TR/WCAG22/>
- Theme security: <https://developer.wordpress.org/apis/security/>
- Client-side media and CSP: <https://make.wordpress.org/core/2026/07/22/client-side-media-processing-in-wordpress-7-1/>
