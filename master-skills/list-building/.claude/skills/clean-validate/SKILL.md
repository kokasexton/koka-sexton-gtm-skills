---
name: clean-validate
description: Clean and verify contact data before it touches a sending domain — normalise fields, flag invalid syntax, role and free-mail addresses, verify mailboxes, handle catch-alls, and keep a hygiene schedule so bounces stay low. Use before any sequence launches and on a schedule after. Do not skip because a vendor said the data is verified.
when_to_use: "Use before importing a list into a sequencer, when bounce rates rise, or on a regular hygiene schedule."
not_for: "Finding new contacts — use skills/find-contacts."
---

<!-- koka-first -->
Defaults come from `KOKA-FIRST.md`. The `list-clean.mjs` tool in `master-skills/list-building` does the syntax and pattern checks; mailbox verification needs a verification service.

# Clean and Validate

Bounces damage your sending reputation, and that's slow and painful to repair. Clean data protects every future email.

## Pipeline

1. **Normalise.** Lower-case emails, strip whitespace, normalise domains (no `www.`, no protocol), trim names, and canonicalise LinkedIn URLs.
2. **Pattern checks** (`list-clean.mjs`):
   - invalid syntax → drop
   - **role addresses** (info@, sales@, support@) → drop for cold outreach
   - **free-mail** (gmail.com and similar) for B2B → hold
   - **email domain ≠ company domain** → review (it may be a stale job)
3. **Mailbox verification** with a verification service: valid / invalid / catch-all / unknown.
4. **Catch-all domains:** send only to the highest-fit contacts, in small volumes, and watch bounces.
5. **Suppression:** remove opt-outs, customers, open opportunities, and anyone who asked not to be contacted, across every tool.

## Hygiene schedule (defaults)

- **Before every launch:** verify anything not verified in the last month or so.
- **Monthly:** re-verify active sequences; remove hard bounces immediately.
- **Quarterly:** re-check job titles and companies; people move (see `skills/job-changes`).

## Watch

Track the bounce rate per send (`skills/outbound-metrics`). If it rises, **stop sending** and re-verify before the next batch.

## Routing

- De-dupe → `skills/deduplicate`
- The cleaner → `master-skills/list-building`
