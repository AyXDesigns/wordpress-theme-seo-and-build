# Security review: <site-name or package-name>

- **Mode**: code review / site configuration review / both
- **Scope**: <theme-slug, plugin-slug, or site environment>
- **Version or commit reviewed**: <ref>
- **Environment**: local / staging / production (read-only)
- **Dates**: <yyyy-mm-dd>
- **Prepared by**: <name or agent>
- **Authority confirmed**: Yes, the user owns or manages this code and site

> Confidential. This report describes weaknesses in words only. It contains no secrets, passwords, real usernames or working exploit code. Share it only with people responsible for fixing the issues.

## 1. Summary

- **Overall**: <two sentences on the most serious risk and what to fix first>
- **Critical**: <count> | **High**: <count> | **Medium**: <count> | **Low**: <count> | **Info**: <count>
- **Fix first**: <IDs of the findings to fix before anything else>

## 2. What was reviewed

| Item | Method | Notes |
| --- | --- | --- |
| <theme-slug> | Manual review against the code review checklist | |
| <theme-slug> | PHPCS + WPCS <version>, security sniffs | |
| <plugin-slug> | Plugin Check <version> | |
| Site configuration | Read-only WP-CLI commands | |
| File integrity | `wp core verify-checksums`, `wp plugin verify-checksums --all` | |

### Not reviewed

<e.g. premium plugins without checksums, server configuration, hosting panel, third-party services, JavaScript bundles>

## 3. Findings

Repeat this block for each finding, ordered by severity.

### SEC-01: <short title>

- **Severity**: Critical / High / Medium / Low / Info
- **Location**: `<relative/path/to/file.php>:<line>` (or the setting name)
- **Category**: Escaping / Input / Nonce / Capability / SQL / REST / Upload / Redirect / Direct access / Secret / Configuration / Integrity
- **Who can trigger it**: Unauthenticated visitor / Subscriber / Editor / Administrator only
- **What they could do**: <plain-language impact>
- **Evidence**: <what in the code or command output shows this; redact any secret>
- **Suggested fix**: <specific change, e.g. "Add `current_user_can( 'manage_options' )` before saving and return a 403 otherwise">
- **How to verify the fix**: <test or command that proves it is fixed>
- **Status**: Open / Fixed (date, commit) / Accepted risk (who accepted, why)

## 4. Site configuration results

| Check | Result | Expected | Finding ID |
| --- | --- | --- | --- |
| WordPress core version | <x.y.z> | Latest supported release | |
| Plugins with updates available | <count> | 0 | |
| Themes with updates available | <count> | 0 | |
| Inactive plugins and themes | <count> | Removed unless needed | |
| Administrator accounts | <count> | Few, named, needed | |
| `DISALLOW_FILE_EDIT` | <true / false / not defined> | `true` on production | |
| `WP_DEBUG_DISPLAY` | <true / false / not defined> | `false` on production | |
| XML-RPC | <enabled / disabled> | Decision recorded | |
| `wp core verify-checksums` | <pass / fail> | Pass | |
| `wp plugin verify-checksums --all` | <pass / fail / skipped plugins listed> | Pass | |
| Security plugin or WAF | <name or none> | One owner, decided with the user | |

## 5. Automated tool results

| Tool and version | Raw issues | Confirmed | False positives | Notes |
| --- | --- | --- | --- | --- |
| | | | | |

## 6. Recommended next steps

| Priority | Action | Finding IDs | Owner | Needs approval |
| --- | --- | --- | --- | --- |
| 1 | | | | |

## 7. Rotations required

List any secret found in source or git history that must be rotated with its provider. Name the provider and the file only, never the value.

| Secret type | Where found | Provider | Rotated (date) |
| --- | --- | --- | --- |
| | | | |
