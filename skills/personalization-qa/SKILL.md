---
name: personalization-qa
description: The review gate for personalised outreach — check each line is true, specific, connected, and fresh; catch fake familiarity, hallucinated facts, broken merge fields, and creepy over-reach; and set a sampling plan for AI-generated batches. Use before any personalised batch sends. Do not skip because the copy "looks fine".
when_to_use: "Use before launching a personalised sequence, after generating AI lines, or when reply quality drops."
not_for: "Writing the lines (skills/personalization-hooks, skills/personalization-at-scale)."
---

<!-- koka-first -->
Defaults come from `KOKA-FIRST.md`. The human gate is not optional.

# Personalization QA

A wrong personal line is worse than no personal line. It proves you didn't look.

## Check every line for

| Check | Fail example |
|---|---|
| **True:** the fact exists, from the source logged | Cites a post they never wrote |
| **Specific:** it couldn't be sent to anyone else | "Love what you're building" |
| **Connected:** the bridge to your reason works | A compliment on their hiking photo, then a pitch for RevOps software |
| **Fresh:** the fact is recent enough | Congratulating a "new" role from two years ago |
| **Respectful:** it doesn't feel like surveillance | References their kids, home town, or private accounts |
| **Clean:** no merge or format errors | `Hi {{first_name}}`, `[Company]`, double spaces, wrong name |

## Sampling plan (defaults)

- **Hand-written, tier 1:** review every message.
- **AI-generated batch:** review a random sample plus **every** row the automated filters flagged. If the sample has errors, fix the prompt and regenerate, rather than patching rows.
- **After launch:** read replies. "How did you find this?" or "That's not me" means stop the batch.

## Automated pre-checks

Run `lint-email.mjs` (in `skills/cold-email`). It catches fake familiarity, merge fields, and template openers. Humans catch the rest.

## Routing

- Fix the generator → `skills/personalization-at-scale`
- Linter → `skills/cold-email`
