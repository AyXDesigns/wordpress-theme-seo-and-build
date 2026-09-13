---
name: site-preview-and-publish
description: Prepare and recover website previews, choose an appropriate hosting path, and publish only after explicit destination and visibility approval.
---

# Site preview and publish

Use after a site build when the user asks to preview, host, publish, deploy, connect a domain, or recover a failed managed preview.

## Choose the delivery path

Confirm whether the target is a local WordPress preview, staging site, managed website preview, downloadable package, or public production host. Respect the project's existing host and an explicit provider choice. Do not move a WordPress project into an unrelated managed-site product merely because that tool is available.

Before an external change, state:

- destination, audience, and expected visibility;
- files/data that will be uploaded or replaced;
- credentials or provider connection required;
- cost or plan dependency when known;
- rollback method and post-publish checks.

Obtain explicit approval before first publication, replacement of an existing public site, DNS/domain changes, destructive cleanup, or sending data to a new provider.

## Preview recovery

When a supervised preview fails, inspect the existing project, build output, process status, ports, logs, and last successful state. Apply the smallest reversible recovery. Do not rebuild the project, replace dependencies, or switch hosting products unless evidence requires it and the user approves the changed scope.

## Handover

Verify the delivered URL or preview, primary routes, assets, forms where authorised, mobile rendering, metadata/indexing policy, and rollback path. Report local-only, preview, staging, and production states distinctly.
