---
name: linkedin-warm-list-builder
description: Build a prioritized warming list — rank a candidate pool by ICP fit, warmth, and signal recency to decide who to work this week. Use for "who should I warm first", "prioritize these leads", "build my target list". Do not use to analyze a single post's engagers.
when_to_use: "Use when a user has a pool of prospects and needs a ranked order to work this week."
not_for: "Analyzing one post's engagers — use linkedin-engager-analytics. Writing the outreach — use cold-email or linkedin-comment-warmer."
---

<!-- koka-first -->
Defaults come from `KOKA-FIRST.md`.

# LinkedIn Warm List Builder

Answer one question: if the user can warm only 5–10 people this week, which ones, and in what order?

## Candidate pools (highest warmth first)

1. **Post engagers** — people who touched the user's content. Highest conversion potential.
2. **Followers** — they chose to follow; a warm audience.
3. **Leads with emails** — fit + not recently contacted + at least one signal.
4. **Cold, high-fit targets** — researched, not yet contacted; lowest priority until a trigger appears.

Dedupe by profile URL first, then by name + company.

## Priority score (0–100)

- **ICP fit** (0–40) — scored against `linkedin-icp-definer`.
- **Warmth** (0–30) — depth of engagement: comment > repeat engagement > like > follow.
- **Signal recency** (0–20) — a recent trigger beats an old one.
- **Reachability** (0–10) — email known, open to contact.

## Output

A ranked top-10, each with the reason it ranks where it does and a one-line next action.

## Rules
- No sequence for a low score.
- One source of truth for the ICP.
- Never auto-send.

## Routing
- Score post engagers with the engine → `warm-list`
- Add in-market accounts → `multi-signal`
- Research a target → `linkedin-signal-stack`
- Turn the list into outreach → `outbound-pipeline`
