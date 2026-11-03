---
name: linkedin-engager-analytics
description: Analyze who engaged with a LinkedIn post — compute ICP match rate and surface the top buyer-fit profiles. Use for "who engaged with my post", "did any buyers see this", "ICP match rate". Do not use to rank a whole candidate pool.
when_to_use: "Use when a user shares a post (or asks about a recent one) and wants the engagers scored against their ICP."
not_for: "Ranking a full candidate pool — use linkedin-warm-list-builder."
---

<!-- koka-first -->
Defaults come from `KOKA-FIRST.md`.

# LinkedIn Engager Analytics

Turn reactions and comments into buyer intelligence: what share of engagers match the ICP, and which ten are most worth warming.

## Steps

1. **Capture engagers** — reactors and commenters (public data only).
2. **Classify** each engager off their own headline: seniority, function, company, industry, region (never a self-reported label).
3. **Score** against the ICP → match rate plus tiers.
4. **Rank** the top profiles by fit × engagement depth.
5. **Report** the match rate, the seniority mix, and the top 10 with the evidence for each.

## What the data teaches

- **Commenters skew more senior than likers** — weight a comment far above a like.
- **Engagement clusters by company** — that's account-level intent, visible publicly.
- **Most engagers appear once.** The repeating few are the warmest audience in B2B.

## Output

A ranked engager list with per-person evidence — not just a match percentage.

## Routing
- Rank them into a weekly plan → `linkedin-warm-list-builder`
- Research a top target → `linkedin-signal-stack`
