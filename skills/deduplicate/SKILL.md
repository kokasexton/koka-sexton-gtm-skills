---
name: deduplicate
description: De-duplicate and merge contacts from multiple sources — normalise join keys (email, LinkedIn URL, name + company domain), pick a survivor, and merge fields without losing data — so nobody gets the same email twice. Use whenever data comes from more than one source. Do not use to merge companies by name alone.
when_to_use: "Use when combining exports from several tools, importing into a CRM or sequencer, or cleaning an old database."
not_for: "Verifying emails (skills/clean-validate)."
---

<!-- koka-first -->
Defaults come from `KOKA-FIRST.md`. `list-clean.mjs` in `skills/list-building` implements this.

# Deduplicate

Two records for one person means two emails to one person. That's the fastest way to look like a robot.

## Match keys, strongest first

1. **Email** (normalised: lower-case, trimmed)
2. **LinkedIn profile URL** (normalised: `linkedin.com/in/<slug>`, no query string, no trailing slash, lower-case)
3. **Full name + company domain** (normalised: lower-case, punctuation and accents stripped, domain without `www.`)

Never match on **name alone** (common names collide) or **company name alone** ("Acme Inc" vs "Acme, Inc." vs "ACME"). Use the domain.

## Survivor and merge rules

- The **survivor** is the record with the most filled fields, with the most recent source winning ties.
- **Merge**: fill empty fields from the duplicates; never overwrite a filled field with a blank.
- **Keep provenance**: record which sources the person appeared in. Appearing in three sources often means they're real and current.

## Companies

De-dupe accounts on **normalised domain**. Watch subsidiaries and regional domains (`acme.com` vs `acme.de`): decide whether they're one account or several, and record the decision.

## After

Import to the CRM with the key fields set as unique, so the next import doesn't recreate duplicates.

## Routing

- The tool → `skills/list-building` (`list-clean.mjs`)
- Validate → `skills/clean-validate`
