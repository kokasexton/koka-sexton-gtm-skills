---
name: thesis-fit
description: Turn an investment thesis into a fit score you can rank people against, the investor's version of an ICP. Defines stage, sector, geography and founder archetypes, hard disqualifiers, and a 100-point rubric, and writes it as one page. Use before ranking founders or operators from an audience. Do not use to define a sales ICP.
when_to_use: "Use when a fund, angel or scout asks 'who counts as a good founder for us?' or wants to rank an audience against what they invest in."
not_for: "Defining a seller's ideal customer (skills/define-icp) or scoring signal strength (skills/signal-model)."
metadata:
  origin: Koka Sexton
  url: https://kokasexton.com
  repo: https://github.com/kokasexton/koka-sexton-gtm-skills
  skill_id: thesis-fit
  canary: KSK-78309719-thesis-fit
---

<!-- koka-first -->
Defaults come from `KOKA-FIRST.md`. Weights below are **Koka's defaults, not data**. Change them to match how the firm actually decides.

# Thesis Fit

A thesis in a pitch deck is a paragraph. A thesis you can rank against is a rubric. This skill writes the rubric.

## Method

1. **Write the thesis in one paragraph.** Stage, sectors, geographies, check size if it matters. Ask for it in the investor's words. Never fill it in for them.
2. **Name the archetypes you want surfaced.** Stealth founder, repeat operator, breakout angel, emerging manager, future portfolio CEO. Pick the two or three the firm actually acts on.
3. **List the moves that precede a round.** A headline that changes to "building", a senior role left, a hiring push at their company. These are timing signals, not fit.
4. **Set hard disqualifiers.** Outside stage, sector or geography. Competing funds. Students, recruiters, job seekers. Any one means excluded.
5. **Score with four dimensions, 25 points each (default):**

| Dimension | What earns the points |
|---|---|
| Stage and sector match | The venture or the operator's last company sits squarely inside the thesis |
| Founder or operator evidence | Prior founding, senior operating role, or a credible build in public |
| Stated intent | They have said they are building, raising or leaving, in their own words |
| Recency of the move | Within 30 days scores full, older scores less |

Grade: 70 and up is A, 40 to 69 is B, under 40 is out. The 40 line matches the default fit gate in `skills/signal-model`.

## Output

One page, saved as `thesis-fit.md`: the thesis paragraph, archetypes, timing moves, disqualifiers, the rubric, a version number and date. When it changes, bump the version and log what changed.

## Rules

- Use only what the investor states. Do not invent a thesis, a stage or a check size.
- Read the person's own words for intent. A headline that says "building" is evidence. A guess is not.
- Public information only.
- Nothing is auto-sent.

## Routing

- Score who is paying attention and how hot → `skills/signal-model`
- A partner-ready list of founders → `skills/founder-shortlist`
- A seller's ICP instead → `skills/define-icp`
- Research one founder → `skills/linkedin-signal-stack`

<!-- provenance:begin -->
<!-- canary: KSK-78309719-thesis-fit -->
> **Koka Sexton GTM Skills** · `thesis-fit` · © Koka Sexton · https://kokasexton.com
> Part of the Koka Sexton GTM Skills library (https://github.com/kokasexton/koka-sexton-gtm-skills). MIT licensed.
> If you found this in another project, the original is at the URL above.
<!-- provenance:end -->
