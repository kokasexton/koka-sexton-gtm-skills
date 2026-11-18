---
name: signal-model
description: Score people by compound social signal, not by one like. Combines follows, reaction depth, recency, coverage across your people, and account density into a score, tiers it Cold, Warming, Hot or Urgent, and gates outreach on a second signal and on fit. Runs a zero-dependency tool (scripts/signal-model.mjs). Use when you have events (reactions, comments, follows) and need to know who to act on, and when. Do not use for account-level signals.
when_to_use: "Use when the ask is 'who is actually warming up to us, how hot, and what do I do about each person?', and you have follow and reaction events, not just a list of names."
not_for: "Ranking by depth and ICP fit alone (skills/warm-list), stacking account-level signals like funding or hiring (skills/multi-signal), or writing the message (skills/first-touch, skills/linkedin-comment-warmer)."
metadata:
  origin: Koka Sexton
  url: https://kokasexton.com
  repo: https://github.com/kokasexton/koka-sexton-gtm-skills
  skill_id: signal-model
  canary: KSK-016dc1b4-signal-model
---

<!-- koka-first -->
Defaults come from `KOKA-FIRST.md`. The weights, tier cut-offs and both gates are **Koka's defaults, not benchmark data**. Re-weight them from which signals became meetings.

# Signal Model

One like is noise. A person who follows two of your people, reacts three different ways, and comments is a conversation waiting to start. This skill scores that difference.

## Run it

```bash
node <this-skill-dir>/scripts/signal-model.mjs events.csv --as-of 2026-10-31
node <this-skill-dir>/scripts/signal-model.mjs events.csv --min-fit 40 --json
node <this-skill-dir>/scripts/signal-model.mjs events.csv --csv > ranked.csv
```

`<this-skill-dir>` is the directory this `SKILL.md` was loaded from. One row per event: `name, company, type, owner, date`, plus optional `title, fit, second_signal, profile_url`.

- `type`: like, insight, love, celebrate, support, funny, comment, repost, follow.
- `owner`: whose content or profile it was. A follow whose owner is `company` counts as a company-page follow (change it with `--company-page`).
- `fit`: 0 to 100, from `skills/thesis-fit` (investors) or `skills/define-icp` (sellers).
- `second_signal`: set to `yes` for a reply, DM, form fill or profile-view cluster you know about outside the export.

Data comes from your own exports or a tool you're licensed to use. Public data only. This skill never scrapes.

## The score

```
score = follow x 1.5 + reaction diversity x 2 + recency + coverage + density
```

| Part | 0 | 1 | 3 | 5 |
|---|---|---|---|---|
| Follow | none | follows one of your people | follows two or more | follows your people and the company page |
| Reaction diversity | none | one reaction type | two or more types | an Insight reaction is present |
| Coverage | none | engaged one person's content | engaged two or more people's | n/a |
| Density (people from one company in the data) | n/a | one person | two or more | three or more, including a VP-level or above |

Recency is scored on the person's latest event: within 7 days is 3, within 14 is 2, within 30 is 1, older is 0.

Seniority is read from the person's own headline by `skills/warm-list`'s classifier, so "Ex-VP" and "Assistant to the CEO" are not counted as senior.

## Tiers and plays

| Score | Tier | Play |
|---|---|---|
| 0 to 3 | COLD | Track only. No outreach. |
| 4 to 7 | WARMING | Engage with their content. Do not pitch. |
| 8 to 12 | HOT | Reach out within 72 hours, referencing the specific engagement. |
| 13 and up | URGENT | Same day. Several people from one account means organizational intent. |

## Two gates (this is where it earns its keep)

1. **Second-signal gate.** Without a comment, a repost, or a `second_signal` flag, nobody climbs above WARMING. A follow never earns an email. A like alone is not a signal.
2. **Fit gate.** If `fit` is present and below `--min-fit` (default 40), the person is held out of outreach however strong the signal. Signal tells you when. Fit tells you whether.

Don't jump tiers. A person who scores 3 today may score 10 in three weeks. Pitching early burns the relationship before it builds.

## Worked example

`examples/events.csv` (fictional people and companies) with `--as-of 2026-10-31` returns seven people: 1 URGENT, 5 WARMING, 1 COLD, and 2 held by the fit gate.

- Dana Okafor scores 25.5 and is URGENT. She follows two of your people, reacted with an Insight, commented, and two colleagues at her company engaged.
- Omar Haddad scores 17, which would be URGENT, but he never commented, so he is capped at WARMING.
- Lena Vogel is a founder with an Insight reaction and a score of 15, but her fit is 35, so she is held.
- Grace Kim commented six weeks ago and has decayed to COLD despite a strong fit.

## Output rules

- Show the breakdown, not just the number. A tier with no evidence is a guess.
- Read the actual comment before anyone writes to the person.
- **Human gate.** Nothing is auto-sent.

## Routing

- Depth, recency and ICP fit without follows or reaction types → `skills/warm-list`
- Account-level signals like funding and hiring → `skills/multi-signal`
- A thesis fit score for investors → `skills/thesis-fit`
- Turn a tiered list into a brief → `skills/founder-shortlist` or `skills/committee-map`
- Research one person before a touch → `skills/linkedin-signal-stack`

<!-- provenance:begin -->
<!-- canary: KSK-016dc1b4-signal-model -->
> **Koka Sexton GTM Skills** · `signal-model` · © Koka Sexton · https://kokasexton.com
> Part of the Koka Sexton GTM Skills library (https://github.com/kokasexton/koka-sexton-gtm-skills). MIT licensed.
> If you found this in another project, the original is at the URL above.
<!-- provenance:end -->
