---
name: social-selling-routine
description: Run the full daily social-selling routine end to end — read who viewed your profile, who engaged your recent posts in the last 24h, who engaged your company page, new followers, and whether key-account people posted recently — then return one prioritized digest of who to connect with, comment on, and DM, with drafts ready. Use for "run my social selling routine", "run my daily LinkedIn routine", "what should I do on LinkedIn today". Do not use to scrape, bulk-message, or automate sending.
when_to_use: "Use when the user wants their whole daily social-selling pass run for them in one go, ending in a prioritized, draft-ready digest."
not_for: "Scraping LinkedIn at volume, mass connection requests, or automated messaging. This reads a small, ICP-filtered set of pages a human would look at anyway, and every outbound action stays human-gated."
---

<!-- koka-first -->
Defaults come from `KOKA-FIRST.md`. Benchmarks from `skills/linkedin-algorithm`. Safety limits from `skills/linkedin-safety`. Never auto-send; the human posts.

# Social Selling Routine

One command runs the whole pass a social seller does by hand every morning, in order, and returns **one digest** — the people worth a move today, ranked, with the move drafted.

The point is not volume. It is **an efficient, methodical pass** over the small set of surfaces that actually produce warm conversations: who looked at you, who engaged you, who just followed, and what your key accounts are talking about right now.

## Scope (read this before running)

This routine looks at **5–7 pages** and sees **roughly 80 profiles** in a run. The skill then keeps only the people who **fit the ICP** — usually a handful. That is the intent: not 5,000 people, not a scrape. A short list you can actually work.

Hard limits, enforced:
- **Read-only on LinkedIn.** Capture and classify. Never click Connect, never send, never accept on the user's behalf.
- **One pass per surface per run.** No paging deep, no repeat loops.
- **ICP filter is mandatory.** A person with no ICP fit is dropped, not queued.
- **Drafts only.** Connection notes, comments, and DMs are written for the user to post. The human gate is absolute (`skills/linkedin-safety`).

## The five surfaces (in order)

| # | Surface | What to capture | Skill / tool |
|---|---|---|---|
| 1 | **Who viewed your profile** (recent) | name, headline, company | `warm-list` classifier |
| 2 | **Your recent posts** — likes/comments, last 24h | name, headline, engagement type, comment text | `warm-list` |
| 3 | **Company page** — engagement on recent posts | name, headline, engagement type | `warm-list` |
| 4 | **New followers** since last run | name, headline, company | `warm-list` classifier |
| 5 | **Key-account members** — did they post recently? | their last post + topic | `linkedin-comment-warmer` |

Surfaces 1–4 feed one combined pool into the ranking engine. Surface 5 is a separate check that produces comment drafts, not a ranked list.

## How to run it

### Step 0 — Load the ICP and the baseline
Read the workspace ICP (one source of truth — `linkedin-icp-definer`). If none exists, stop and build it first: without the ICP the filter cannot run and the routine is just a list of names. Note the last-run date so "new followers" and "last 24h" have a boundary.

### Step 1–4 — Capture, then rank
Capture the people from surfaces 1–4 (the user is already logged in; this reads pages, it does not log in or scrape at volume). Write them to one CSV with the columns the engine expects:

```
name,headline,type,post,date,company,profile_url,comment
```

`type` is one of `comment`, `reaction`/`like`, `repost`/`share`, `profile_view`, `follow`. Then run the engine once on the combined pool:

```bash
node <warm-list-skill-dir>/scripts/warm-list.mjs pool.csv --icp icp.json --as-of <today>
```

The engine classifies every person **off their own headline** (seniority + function), scores depth × recency × ICP fit, flags regulars and account clusters, and reads the room against the 2026 report baseline. People with no ICP fit are dropped.

### Step 5 — Key-account post check
For each member of the user's key/target accounts (a short, named list — not a search), check whether they posted in the last ~72 hours. For anyone who did, run `linkedin-comment-warmer` to draft a comment that adds something. Do not comment on behalf of the user.

### Step 6 — Emit the digest
Return **one** digest (format below). Nothing else. No play-by-play, no per-surface recaps.

## Output — the routine digest

```markdown
# Social selling routine — <date>

## Read the room
<one line: who's in the room, how senior vs baseline, fit rate, any account cluster>

## Do these today (ranked)
| # | Person | Why (evidence) | Move | Draft |
|---|---|---|---|---|
| 1 | <name>, <title> @ <co> | <e.g. 2 substantive comments + repeat engager> | Comment on their post | <drafted comment> |
| 2 | <name>, <title> | <e.g. viewed profile, ICP fit, Director+> | Connect + note | <drafted note> |
| 3 | <name>, <title> | <e.g. new follower, VP Marketing> | Warm DM | <drafted DM> |

## Key-account watch
- <account> — <person> posted about <topic> 2d ago → comment drafted below / nothing to engage

## Signals worth noting
- <competitor/account observation, if any>

## Skipped (and why)
- <n> seen, <n> outside ICP, <n> too stale — one line, so the filter is visible
```

Every row carries the **evidence** behind it. If there is no evidence, the person is not on the list.

## Worked example

The engine ships a worked example (`examples/pool.csv` + `examples/icp.json`) — 25 people seen across the five surfaces, fictional companies, real benchmarks. Run it:

```bash
node skills/social-selling-routine/scripts/social-selling-routine.mjs \
  skills/social-selling-routine/examples/pool.csv \
  --icp skills/social-selling-routine/examples/icp.json --as-of 2026-11-15
```

25 seen in the pass → 15 make the list, 10 drop as outside ICP or too stale. It returns the room read, a ranked digest with the evidence and the draft for each, and the key-account watch:

```
## Read the room
- 21 in the room · 76% Director+ (report baseline 33% — you are above) · 0 regulars

| 1 | Dana Okafor, vp @ Northwind Analytics | P0 · 1 substantive comment · ACCOUNT CLUSTER | Reply / DM | <drafted reply> |

## Key-account watch
- Vertex Systems — Nina Patel posted about rebuilding outbound (2026-11-13) → comment drafted

## Skipped (and why)
- 25 seen across the pass · 10 outside ICP or too stale.
```

The point of the worked example: the filter is visible. A student, a recruiter, and an executive assistant were seen and dropped; the VPs, directors, and founders stayed.

## Rules

- **Human gate on everything outbound.** The digest drafts; the user sends. Never infer approval to send from a run completing.
- **Evidence or it doesn't ship.** Each recommendation traces to a real engagement, view, follow, or post.
- **One change at a time.** Do not overload the digest — a handful of real moves beats twenty shallow ones.
- **Respect the safety ramp.** Connection volume follows `skills/linkedin-safety`; people who engaged you first are the ones to connect with.
- **Never fabricate.** If a page can't be read, say so; do not invent a name or a headline.

## Scheduling

The routine is designed to run on a schedule (e.g. every weekday morning) or on demand ("run my social selling routine"). On a schedule, it should still produce **one digest** and stay read-only + draft-only. Scheduled runs do not send.

## Routing

- Rank the pool with the engine → `skills/warm-list`
- Who to warm first this week → `skills/linkedin-warm-list-builder`
- Draft the comment → `skills/linkedin-comment-warmer`
- Draft the DM / connection note → `skills/linkedin`
- ICP source of truth → `skills/linkedin-icp-definer`
- Add in-market accounts → `skills/multi-signal`
- Account safety → `skills/linkedin-safety`
