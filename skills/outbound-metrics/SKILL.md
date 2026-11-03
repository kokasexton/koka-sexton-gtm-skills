---
name: outbound-metrics
description: Measure outbound on your own numbers — the funnel from send to opportunity, health thresholds (bounces, positive-reply share, show rate), and a reverse-funnel planner (scripts/pipeline-math.mjs) that turns a pipeline target into sends, people, and reps, and shows which rate is the most sensitive lever. Use for baselines, targets, capacity planning, and diagnosing a weak funnel. Do not use internet benchmarks as targets.
when_to_use: "Use when setting outbound targets, planning SDR capacity, reporting on outbound, or deciding what to fix first."
not_for: "Ads measurement (skills/ads-measurement) or content metrics (skills/linkedin-algorithm)."
---

<!-- koka-first -->
Defaults come from `KOKA-FIRST.md`: **evidence over opinion.** This repo quotes no outbound benchmarks; published reply-rate "averages" vary too much to plan on. The tool has **no default rates**. You measure your own first. The health thresholds are Koka's defaults.

# Outbound Metrics

## The funnel

`sent → delivered → replied → positive reply → meeting booked → meeting held → opportunity → won`

Each arrow is a rate, and each rate has a different fix:

| Rate | Low means… | Fix in |
|---|---|---|
| Delivered | Bad data or a damaged domain | `skills/clean-validate` |
| Replied | No signal, weak first line, wrong people | `skills/signal-sourcer`, `skills/first-touch` |
| Positive share | Wrong targeting, or a message that annoys | `skills/define-icp`, `skills/sdr-writing-rules` |
| Booked | Ask too big, or slow follow-up | `skills/follow-up` |
| Held | No confirmation, weak reason | `skills/cold-call-scripts` (no-show script) |
| Opportunity | Unqualified meetings | `skills/qualify-accounts` |

## Measure your baseline

```bash
node <this-skill-dir>/scripts/pipeline-math.mjs rates counts.json
```

`<this-skill-dir>` is the directory this `SKILL.md` was loaded from. Give it counts for a period (sent, bounced, replied, positive, meetings booked and held, opportunities, and optionally won). You get every stage rate, the end-to-end rate, sends per opportunity, and health flags. The default thresholds are: bounces above 2% → stop and re-verify; under 30% of replies positive → targeting problem; under 75% of meetings held → confirmation problem.

## Plan against a target

```bash
node <this-skill-dir>/scripts/pipeline-math.mjs plan plan.json
```

Give it a target (opportunities, or pipeline ÷ average opportunity), **your** rates, touches per person, and optionally rep capacity. You get the activity required at each stage, the people to contact, the reps needed, and **where one percentage point matters most**.

## Worked example

`examples/counts.json` (a fictional quarter) gives 98.5% delivered, 5.1% reply, 40% positive, about 250 sends per opportunity. `examples/plan.json` targets $900k pipeline at $30k per opportunity, which means 30 opportunities, about 7,465 sends, 2,489 people, and 2.5 reps. Then the useful part: **+1 point of reply rate saves ~1,224 sends**, more than any other stage. Better signals beat more reps.

## Rules

- Compare to **your own history**, month over month.
- Report replies by **segment and signal**, not just in total. That's where the learning is.
- Change one thing at a time (`skills/subject-lines` shows how to test).

## Routing

- Ads metrics → `skills/ads-measurement`
- What to fix → the table above
