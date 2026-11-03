---
name: ads-optimization
description: Diagnose and fix an underperforming LinkedIn campaign in the right order — tracking, audience, creative, offer, then bid — changing one lever at a time and judging against your own baseline. Use when a campaign isn't delivering, costs too much, or produces the wrong leads. Do not use before the campaign has had time to deliver.
when_to_use: "Use when results are below your baseline: no delivery, high cost per result, low engagement, or leads that sales rejects."
not_for: "Campaigns live only a few days — give them enough delivery to judge."
---

<!-- koka-first -->
Defaults come from `KOKA-FIRST.md`. **One change at a time** so you know what worked.

# Ads Optimization

Diagnose in order. Most "bidding problems" are audience or creative problems.

## The diagnostic ladder

| Step | Symptom | Check | Usual fix |
|---|---|---|---|
| 1. Tracking | Conversions at zero but sales sees leads | Insight Tag, CAPI, form sync | Fix tracking before judging anything |
| 2. Delivery | Not spending | Audience size, bid competitiveness, approval status | Add accounts, raise the bid one step |
| 3. Audience | Spending, wrong people engaging | Demographics report vs. targeting | Tighten functions and seniorities; turn off expansion |
| 4. Creative | Right people, low engagement | Engagement rate, frequency trend | New angle; promote an organic winner as a Thought Leader Ad |
| 5. Offer | Engagement fine, no conversions | Landing page or form; the ask itself | Smaller, more specific offer (teardown > demo) |
| 6. Quality | Conversions, but sales rejects them | Lead-form fields, persona, offer | Raise the bar: fewer fields filled ≠ better; target better |
| 7. Bid | Everything else fine, cost too high | Bid strategy vs. baseline | See `skills/ads-bidding` |

## Rules

- Write down the hypothesis, the one change, and the date. Judge after enough delivery, not after a day.
- Compare to **your** baseline, not internet benchmarks.
- Kill losers quickly and scale winners slowly.

## Routing

- Measurement → `skills/ads-measurement`
- Audience → `skills/ads-audiences`
- Creative → `skills/ads-creative`
