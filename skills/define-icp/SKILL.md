---
name: define-icp
description: Define the ideal customer profile in three layers — firmographic fit (who they are), situational fit (what's true right now), and behavioural fit (what they do) — with a 100-point scoring model built from your best customers, not your wishlist. Use when starting outbound, ABM, or ads, or when "everyone" is the ICP. Do not use to describe personas' feelings.
when_to_use: "Use when the ICP is undefined, too broad, or based on opinion — before sourcing, scoring, or targeting."
not_for: "Persona messaging (skills/cold-email) or ranking engagers (skills/warm-list)."
---

<!-- koka-first -->
Defaults come from `KOKA-FIRST.md`. The point weights are Koka's defaults; re-weight them from your own won and lost deals.

# Define the ICP

Your ICP is the pattern in your best customers, not the companies you wish would buy.

## Start from evidence

Pull your **last 20–50 closed-won deals** (and a similar number of closed-lost). For each, note size, industry, region, stack, the trigger that started the deal, who championed it, who signed, sales-cycle length, and retention. The pattern is your ICP. The anti-pattern is your exclusion list.

## Three layers

| Layer | Question | Examples |
|---|---|---|
| **Firmographic** | Who are they? | Industry, employee range, revenue range, region, business model, stack |
| **Situational** | What's true right now? | Hiring in your function, new leader, recent funding, expansion, a tool switch |
| **Behavioural** | What do they do? | Engage with your content, visit pricing, attend webinars, compare competitors |

## A 100-point fit score (default weights)

| Criterion | Points |
|---|---|
| Industry in your top-converting set | 20 |
| Size in your best range | 20 |
| Region you can serve | 10 |
| Stack fit (uses the tools you integrate with or replace) | 15 |
| Function you serve exists and is staffed | 15 |
| Business model match (e.g. B2B, sales-led) | 10 |
| Exclusions (customer, competitor, wrong model) | → 0 |
| **Bonus**: any situational signal present | +10 |

Tier: **80+ = Tier 1**, 60–79 = Tier 2, 40–59 = Tier 3, below 40 = don't target.

## The buying committee

For each ICP account, name the roles: **economic buyer**, **champion**, **user**, **blocker** (security, procurement). Messaging differs by role (see `skills/atl-messaging`, `skills/btl-messaging`).

## Write it down

Lock the result in the single ICP document every skill scores against: `skills/linkedin-icp-definer` (offer, firmographics, persona, triggers, disqualifiers). This skill supplies the evidence and the score; that one is the source of truth. Revisit quarterly with fresh won/lost data.

## Routing

- Lock the ICP document → `skills/linkedin-icp-definer`
- Find companies → `skills/source-companies`
- Score and tier → `skills/qualify-accounts`
- ICP for the warm-list tool → `skills/warm-list` (`icp.json`)
