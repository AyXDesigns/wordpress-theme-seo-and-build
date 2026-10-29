# Hosting options

Use this only when the user has not already chosen a host. Prices and plan features change often, so give cost as a band and ask the user to check the provider's current pricing. Do not name or push a specific provider unless the user asks for examples.

Cost bands: £ = low monthly cost, ££ = moderate, £££ = higher, before domain and email costs.

## Questions to ask first

1. How many visitors do you expect, and are there traffic spikes (campaigns, seasonal sales)?
2. What is the monthly budget?
3. Who will keep WordPress, plugins and the server updated and fix problems: you, a developer, or the host?
4. Do you need SSH, WP-CLI, Git deploys or a built-in staging site?
5. Where is email for the domain hosted, and should that stay put?
6. Does the site take payments, run a shop, have member logins, or store form submissions?
7. Must data stay in the UK or EU?
8. Is there an existing host or reseller account you are happy with?

## Options

### Keep the existing host

- **Advantages:** no new contracts; known support; email and DNS often already set up.
- **Disadvantages:** may lack staging, current PHP or enough resources.
- **Cost and effort:** none extra; low effort.
- **Suits:** anyone whose host offers PHP 8.3+, MySQL 8.0+ or MariaDB 10.11+, HTTPS and backups (as of October 2026, verify at <https://wordpress.org/about/requirements/>).

### Managed WordPress hosting

The host runs and tunes the server for WordPress only.

- **Advantages:** one-click staging and push to live; automatic backups and core updates; server caching and often a CDN; WordPress-aware support; SSL handled.
- **Disadvantages:** higher price per site; some plugins disallowed; less server control; limits on visits or storage on lower plans; email hosting usually not included.
- **Cost and effort:** ££ to £££; low effort.
- **Suits:** businesses and charities without a server administrator; shops and membership sites where uptime matters.

### VPS or cloud server

A virtual server the user (or their developer) runs, with or without a control panel.

- **Advantages:** full control of PHP, web server, caching and security; good performance per pound; many sites on one server.
- **Disadvantages:** someone must patch the OS, PHP and database, configure backups, firewall and monitoring, and respond to outages; mistakes can expose the site.
- **Cost and effort:** £ to ££ for the server, plus admin time or a control-panel licence; high effort.
- **Suits:** developers and agencies with server skills, or with a managed control panel; sites with special requirements.

### Shared hosting (cPanel, Plesk or similar)

Many customers share one server.

- **Advantages:** cheapest; email, DNS and domain often in one place; one-click WordPress installers; familiar control panels.
- **Disadvantages:** limited resources and noisy neighbours; staging, SSH and current PHP not always available; support is general, not WordPress-specific; can be slow under load.
- **Cost and effort:** £; low to moderate effort.
- **Suits:** small brochure sites, personal sites and tight budgets.

### Static export (only where appropriate)

WordPress runs privately (locally or on a locked-down server); a plugin or build step exports HTML to a static host or CDN.

- **Advantages:** very fast; tiny attack surface for visitors; cheap or free static hosting; the admin is never public.
- **Disadvantages:** no dynamic features without extra services: forms, search, comments, logins, shop and scheduled posts all need workarounds; every content change needs a new export; some plugins and SEO features do not survive export.
- **Cost and effort:** £ (often free) hosting; moderate effort to set up and to run each publish.
- **Suits:** brochure or campaign sites that rarely change and have no logins or shop.
- **Do not offer** for shops, membership sites, sites with frequent editorial updates, or when the client will edit content without a developer.

## Choice prompt template

```text
From what you told me (<traffic>, <budget>, <who maintains it>, <features>), these are the realistic hosting options:

1. <Option A> (recommended)
   + <advantage that matters here>
   + <second advantage>
   - <main disadvantage>
   Cost/effort: <band>, <effort>. Suits: <who>.

2. <Option B>
   + ...
   - ...
   Cost/effort: ... Suits: ...

3. <Option C>
   ...

I recommend <Option A> because <reason tied to their answers>.
Which would you like? Nothing will be bought, moved or published until you decide.
```
