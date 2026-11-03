---
name: source-companies
description: Source the account universe that matches the ICP — from B2B databases, LinkedIn Sales Navigator, maps and directories, review sites, job boards, communities, and your own CRM — and know which source fits which ICP. Use when you need the list of companies to consider. Do not use to find individual contacts.
when_to_use: "Use when building or expanding the set of target companies."
not_for: "Finding people inside the companies — use skills/find-contacts."
---

<!-- koka-first -->
Defaults come from `KOKA-FIRST.md`. Tools are named as examples of a category, with no endorsement. Use whatever your team is licensed for, within each source's terms.

# Source Companies

The best source is the one where your ICP is **visible by the thing that makes them a fit**.

## Source by ICP shape

| ICP looks like… | Best sources | Why |
|---|---|---|
| Standard B2B by size, industry, region | B2B databases (e.g. Apollo, ZoomInfo), LinkedIn Sales Navigator account search | Firmographic filters |
| Local or SMB, physical businesses | Maps and directory listings, industry associations | They aren't well covered in B2B databases |
| Defined by tech stack | Technographic lookups (e.g. BuiltWith-style tools), integration partner directories | The stack is the fit |
| Defined by a situation (hiring, funding) | Job boards, funding databases, news | The situation is the fit; see `skills/signal-sourcer` |
| Defined by a category | Review sites (G2-style category pages), "alternatives to X" lists, conference sponsor lists | Buyers already sorted |
| Community-led | Slack groups, forums, event attendee lists you're entitled to use | Where practitioners talk |
| **Your own data** | CRM: closed-lost, churned, old inbound, product sign-ups | Often the warmest and most ignored |

## Process

1. **Start with your own CRM.** Who already knows you?
2. **Pull from 2–3 sources** that match the ICP shape, not ten.
3. **Normalise the company domain** as the join key (see `skills/deduplicate`).
4. **Score and tier** right away (see `skills/qualify-accounts`), so you don't enrich accounts you'll never work.

## Don't

- Scrape against a site's terms.
- Buy a "100,000 contacts in your industry" list. It's someone else's stale export.

## Routing

- Tier them → `skills/qualify-accounts`
- Find people → `skills/find-contacts`
