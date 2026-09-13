---
name: wp-cf7-form-assurance
description: Build or audit Contact Form 7 journeys with approved data storage, dependency fallbacks, bot controls, reliable notifications, and persisted-record verification.
---

# Contact Form 7 assurance

Use only when Contact Form 7 is part of the approved site architecture. Confirm the accepted data fields, retention/access model, notification recipient, and whether Flamingo or a private custom store is the system of record before implementation.

## Form contract

- Form IDs must be install-specific and seeded idempotently. Never hard-code an ID expected to survive another installation.
- Render a helpful administrator-visible and visitor-safe state if CF7, a required form, Flamingo, Turnstile, or another dependency is unavailable.
- Keep honeypots inaccessible to keyboard users. Validate timing, rate limits, server-side bot checks, and empty submissions without exposing internal detail to visitors.
- Read submitted values through a scalar-safe boundary. Normalise select and checkbox values deliberately.
- Store approved data before attempting notification mail. Keep notification time bounded and report mechanical failure safely after the visitor response completes.
- Never place sensitive referral narratives, payment-card data, or unapproved special-category information in ordinary WordPress form storage.

## Verification

Test valid submission, missing/invalid required values, honeypot, timing, rate-limit, bot-check failure, CF7 missing, required-storage missing, and mail failure. A thank-you response is insufficient: inspect the intended stored record. Delete the exact QA record afterwards.

Do not send real messages, alter retention settings, or submit real personal data without explicit authorisation.
