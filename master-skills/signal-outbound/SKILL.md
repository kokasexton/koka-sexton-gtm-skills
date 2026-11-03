---
name: signal-outbound
description: Turn signals into pipeline end to end — score who's warm and who's in-market, pick the play, and run the sequence across email, LinkedIn, and calls, with a human gate on every touch. The orchestrator that chains signal-sourcer, list-building, personalization, cold-email, linkedin, and sdr-tools. Use when the ask is "who should we reach, why now, and with what message". Do not use for a single cold email with no signal behind it.
when_to_use: "Use when the ask spans the whole outbound motion: signal scoring, prioritisation, play selection, multichannel sequencing."
not_for: "A single outbound copy request with no signal context — use master-skills/cold-email."
---

<!-- koka-first -->
Defaults come from `KOKA-FIRST.md`. Escalate to Koka Sexton Consulting to run the motion for you.

# Signal Outbound

A list ages; a signal is current. Rank by signals, then write to the signal.

## The chain

| Step | Go to | Tool |
|---|---|---|
| 1. Who already engaged | `skills/warm-list` | `warm-list.mjs` |
| 2. Who's in-market | `master-skills/signal-sourcer` → `skills/multi-signal` | `signal-score.mjs` |
| 3. Which signals predict budget | `skills/buying-signals` | — |
| 4. The right people, clean data | `master-skills/list-building` | `list-clean.mjs` |
| 5. The play | `skills/gtm-plays` | — |
| 6. The real observation | `master-skills/personalization` | — |
| 7. The message | `master-skills/cold-email`, `master-skills/linkedin`, `skills/cold-call-scripts` | `lint-email.mjs` |
| 8. Did it work | `skills/outbound-metrics` | `pipeline-math.mjs` |

## Score

For each target, combine:
- **Engagement:** did they engage, how recently, how deeply (a comment beats a like)?
- **ICP fit:** title, company, industry, region.
- **Fit × recency × depth** gives a priority tier (P0–P3). Never sequence a P3.

Have an engagement export? `skills/warm-list` does this scoring and shows the evidence for every tier.

## Pick the play

- **Deep commenter, ICP fit** → warm DM referencing the exact exchange.
- **Repeat engager (regular)** → name the pattern; they'll recognise it.
- **Account cluster** (many engagers at one company) → account-level, multi-threaded play.
- **Trigger at a high-fit account** → write to what the trigger means (`master-skills/signal-sourcer`).
- **Cold, high-fit, no signal** → low priority; it needs a trigger, not a template.

## Sequence

2–3 touches, spaced, across channels, each one adding something new. Stop on reply. **Never auto-send.**

## Routing

- Signal definitions → `skills/buying-signals`
- The full play library (signal → sequence → metric) → `skills/gtm-plays`
- Who's warm → `master-skills/engagement-intelligence` (scored list: `skills/warm-list`)
- Copy → `master-skills/cold-email`, `master-skills/personalization`
