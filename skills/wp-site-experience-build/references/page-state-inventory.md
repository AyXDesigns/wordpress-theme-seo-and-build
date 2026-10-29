# Page and state inventory template

Fill this in before building. Every row needs an owner and an editing surface; every page needs its states. Use placeholders for anything not yet decided and list it under "Open questions".

## How to fill it in

- **Template**: the file that renders the page (`templates/page.html`, `front-page.php`) or "custom template: <name>".
- **Content owner**: the role or team that keeps the words current.
- **Editing surface**: post content, theme pattern, synced pattern, template part, navigation, Global Styles, plugin screen, or custom fields.
- **Data source**: where structured values come from (post meta through block bindings, a form plugin, an events plugin, none).
- **States**: tick each state the page must handle, using the codes below.

| Code | State |
| --- | --- |
| P | Populated with typical content |
| E | Empty (no posts, no results, no image) |
| L | Long content (long titles, many items, long words, translated text) |
| V | Validation error (forms) |
| S | Success confirmation (forms, sign-ups) |
| F | Failure (service down, submission failed) |
| D | Dependency missing (plugin deactivated or misconfigured) |
| J | No JavaScript |
| R | Restricted (logged-out vs logged-in, member-only) |
| W | Widths: narrow (up to 480px), medium (481 to 782px), wide |

## Page inventory

```markdown
| # | Page or route | Purpose (one line) | Template | Content owner | Editing surface | Data source | States | Priority |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | Home (/) | Explain who we help and route to top tasks | templates/front-page.html | Comms lead | Post content + patterns | None | P E L J W | Must |
| 2 | About (/about/) | Build trust | templates/page.html | Comms lead | Post content | None | P L W | Must |
| 3 | News archive (/news/) | List updates | templates/home.html | Editors | Query Loop in template | Posts | P E L W | Should |
| 4 | Contact (/contact/) | Let visitors get in touch | templates/page.html | Office manager | Post content + form plugin | <form-plugin> | P V S F D J W | Must |
| 5 | Search results | Find content | templates/search.html | n/a | Template | Search | P E L W | Must |
| 6 | 404 | Recover from a dead link | templates/404.html | n/a | Template + pattern | None | P W | Must |
| 7 | <page> | <purpose> | <template> | <role> | <surface> | <source> | <codes> | <Must/Should/Could> |
```

## Shared parts

```markdown
| Part | Contents | Editing surface | States | Notes |
| --- | --- | --- | --- | --- |
| Header | Logo, primary navigation, call to action | Template part + Navigation block | W J (menu works without JS) | |
| Footer | Contact details, secondary links, legal links | Template part + pattern | L W | Contact details from one source only |
| Cookie or consent notice | <if needed> | <plugin> | D J | Owned by <plugin> |
```

## Reusable sections (patterns)

```markdown
| Pattern | Used on | Synced? | Overrides? | Section style | Notes |
| --- | --- | --- | --- | --- | --- |
| Hero | Home, landing pages | No | n/a | <style name> | Largest image must not lazy-load |
| Call to action band | Most pages | Yes | Heading, text, button | <style name> | |
```

## Open questions

- <question, who can answer it, and by when>
