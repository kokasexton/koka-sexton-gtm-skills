---
name: multi-signal
description: Stack and score account-level buying signals into one action list — each signal weighted by type, decayed by age, bonus for three or more kinds, combined with ICP fit into ACT NOW / WARM UP / WATCH / IGNORE with the play for the lead signal. Runs a zero-dependency scorer (scripts/signal-score.mjs). Use weekly to decide which accounts get worked. Do not use to rank individual post engagers — that's skills/warm-list.
when_to_use: "Use when you have signals from several sources and need one prioritised account list with a reason and a play for each."
not_for: "Ranking people who engaged with your posts (skills/warm-list) or defining the ICP (skills/define-icp)."
---

<!-- koka-first -->
Defaults come from `KOKA-FIRST.md`. Weights, half-life, and thresholds are **Koka's defaults, not benchmark data**. Re-weight them from which signals actually became meetings.

# Multi-Signal

One signal is a hint. Two signals at a good-fit account is a reason. Three is a priority.

## Run it

```bash
node <this-skill-dir>/scripts/signal-score.mjs signals.csv --as-of 2026-10-31
node <this-skill-dir>/scripts/signal-score.mjs signals.csv --weights my-weights.json --json
```

`<this-skill-dir>` is the directory this `SKILL.md` was loaded from. Use one row per signal: `account, signal, date, detail, fit`.

## The model (defaults)

| Signal type | Points | Signal type | Points |
|---|---|---|---|
| `content-repeat` | 30 | `tech-change` | 20 |
| `job-change` | 25 | `company-event` | 15 |
| `website-pricing` | 25 | `event-attended` | 15 |
| `competitor` | 25 | `ad-engagement` | 10 |
| `content-comment` | 25 | `website-visit` | 8 |
| `funding` | 20 | `content-reaction` | 6 |
| `hiring` | 20 | | |

- **Decay:** each signal loses half its points every 30 days.
- **Repeats:** the strongest instance of a type counts in full; each repeat adds half.
- **Stacking:** 3+ different kinds of signal → ×1.25. Timing is capped at 100.
- **Fit:** 0–100 from `skills/define-icp` (assumed 50 if missing, and flagged).

| Action | Rule | Do |
|---|---|---|
| **ACT NOW** | timing ≥ 50 and fit ≥ 60 | Find the person, write to the lead signal this week |
| **WARM UP** | timing ≥ 20 and fit ≥ 40 | Content and ads to the account; one light touch |
| **WATCH** | any signal and fit ≥ 40 | Monitor; wait for a second signal |
| **IGNORE** | otherwise | Don't spend effort |

Content signals rank high because they're the only ones with data behind them: commenters are 26% more senior than likers (see `skills/linkedin-algorithm`).

## Worked example

`examples/signals.csv` (fictional) gives 6 accounts as of 2026-10-31. **Northwind** is ACT NOW: a new VP, her comment, and pricing visits stack to 83. **Bluepeak** and **Larkspur** are WARM UP. **Quillstack** had strong signals, but they're 3–4 months old, so it decays to WATCH. Old signals aren't current ones. **Kestrel** is IGNORE: the CRM migration is real, but fit is 30.

## Routing

- Each signal → `skills/job-changes`, `skills/funding-signals`, `skills/hiring-signals`, `skills/website-visitors`, `skills/company-events`, `skills/tech-changes`, `skills/competitor-signals`, `skills/content-engagement`
- Person-level ranking → `skills/warm-list`
- Tiering → `skills/qualify-accounts`
