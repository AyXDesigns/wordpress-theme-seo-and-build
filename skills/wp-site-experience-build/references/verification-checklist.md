# Verification checklist

Run on a local or staging copy. For each line record **pass**, **fail** or **not applicable**, with evidence: the page, width, command or screenshot reference. Re-run affected lines after every fix.

## 1. Code and logs

- [ ] PHP syntax clean on every changed file.

  ```bash
  find <theme-dir> -name "*.php" -not -path "*/vendor/*" -not -path "*/node_modules/*" -exec php -l {} \;
  ```

  ```powershell
  Get-ChildItem <theme-dir> -Recurse -Filter *.php | Where-Object { $_.FullName -notmatch '\\(vendor|node_modules)\\' } | ForEach-Object { php -l $_.FullName }
  ```

- [ ] `theme.json` parses and uses `"version": 3` with a `$schema` matching the target WordPress version.
- [ ] Project linters and tests pass (only those the project already defines).
- [ ] With `WP_DEBUG_LOG` on, the debug log gains no new lines while you visit every page in the inventory.
- [ ] Browser console shows no errors and the network panel no failed requests on representative pages, in the front end and the editor.

## 2. Database state

- [ ] No unexpected Site Editor overrides hide your file changes:

  ```bash
  wp post list --post_type=wp_template,wp_template_part,wp_global_styles --post_status=any --fields=ID,post_type,post_name,post_modified --path=<wp-path>
  ```

- [ ] Any pages, menus or options created during the build are listed in the hand-over.

## 3. Pages and states

- [ ] Every page in the inventory renders with realistic content.
- [ ] Each state ticked in the inventory has been seen: empty, long content, validation error, success, failure, dependency missing, no JavaScript, restricted.
- [ ] Optional plugins switched off on a local copy: no fatal error, a sensible fallback shows.

## 4. Responsive layout

- [ ] Checked at 320px, 480px, 782px, 1280px and a wide screen (adjust 480 and 782 if `settings.viewport` changes the breakpoints).
- [ ] No sideways scrolling, clipped text or overlapping controls at any width.
- [ ] Responsive styles (WordPress 7.1) behave the same in the editor's device previews and on the front end.
- [ ] Images have dimensions set, crop sensibly, and the largest above-the-fold image is not lazy-loaded.

## 5. Accessibility (WCAG 2.2 AA)

- [ ] Keyboard only: every link, button, menu, tab and form field reachable and usable; focus always visible; skip link works.
- [ ] One `h1` per page and a logical heading order; landmarks present.
- [ ] Text contrast at least 4.5:1, large text and controls at least 3:1, on every background used.
- [ ] 200% and 400% zoom: content reflows without loss.
- [ ] Form labels, errors and success messages are announced and tied to their fields.
- [ ] Reduced-motion setting turns off non-essential motion.
- [ ] An automated accessibility scan shows no unexplained failures (it does not replace the checks above).

## 6. Editing experience

- [ ] An editor can change every piece of visitor-facing copy listed in the inventory without touching code.
- [ ] Patterns open in content-only mode and their text, links and images remain editable (WordPress 7.0 and later).
- [ ] Synced patterns with overrides change per page without changing the original.
- [ ] Editor view matches the front end closely enough to trust layout decisions, in the always-iframed editor (7.1).
- [ ] Global Styles changes (colour, font) flow through the whole site.

## 7. Performance and privacy

- [ ] Fonts are self-hosted WOFF2 files; no unexpected third-party requests on page load.
- [ ] Scripts load only on the pages that need them.
- [ ] Page weight and a lab performance run recorded for the home page and one inner page, with device profile and cache state.

## 8. SEO hand-off

- [ ] Exactly one source outputs title, description, canonical and structured data (view the page source).
- [ ] The staging or preview site is not indexable.
- [ ] Every page in the inventory is reachable through ordinary links.

## Result

```markdown
Checked on: <environment>, WordPress <x.y.z>, PHP <x.y>, browsers <list>
Passed: <n>  Failed: <n>  Not applicable: <n>
Failures and fixes: <list>
Known gaps accepted by the user: <list>
```
