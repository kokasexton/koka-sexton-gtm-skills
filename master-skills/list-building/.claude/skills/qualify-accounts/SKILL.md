---
name: qualify-accounts
description: Score and tier target accounts — ICP fit plus live signals — into Tier 1 (1:1), Tier 2 (1:few), and Tier 3 (1:many) with a play and an effort budget for each. Use after sourcing companies and before finding contacts. Do not use to rank individual engagers.
when_to_use: "Use when deciding which accounts get the most effort, ABM tiering, or a quarterly re-prioritisation."
not_for: "Ranking people who engaged — use skills/warm-list."
---

<!-- koka-first -->
Defaults come from `KOKA-FIRST.md`. The fit score comes from `skills/define-icp`; signal scoring comes from `skills/multi-signal`.

# Qualify Accounts

Effort is the scarce resource. Tiering decides where it goes.

## Two axes

- **Fit** (0–100, from `skills/define-icp`): would they be a great customer?
- **Timing** (from `skills/multi-signal`): is something happening that makes now likely?

|  | **Signal now** | **No signal** |
|---|---|---|
| **High fit** | **Tier 1**: work it this week, 1:1 | **Tier 2**: warm with content and ads; watch for signals |
| **Medium fit** | **Tier 2**: 1:few play | **Tier 3**: 1:many (content, ads) |
| **Low fit** | Only if the signal is exceptional | Don't target |

## Effort budget per tier (defaults)

| Tier | Accounts | Contacts | Play | Personalisation |
|---|---|---|---|---|
| 1 | A small number you can actually research | 3–5 | Multi-threaded 1:1, custom research | Account-level |
| 2 | Moderate | 1–3 | 1:few by segment or trigger | Segment + one personal line |
| 3 | Broad | 1 | Content, ads, light sequences | Segment-level |

## Re-tier

Weekly for signals (a Tier 2 account that just hired a new VP moves up), and quarterly for fit as the ICP evolves.

## Routing

- Signals → `master-skills/signal-sourcer`
- Ads for tiers 2–3 → `master-skills/linkedin-ads`
- Contacts → `skills/find-contacts`
