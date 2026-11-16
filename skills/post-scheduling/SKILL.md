---
name: post-scheduling
description: Decide how often and when to post on LinkedIn using the 2026 data — 3–5 posts a week, Monday to Wednesday, late morning to early afternoon UTC — plus the first-hours routine that gives each post its best start. Use for cadence, timing, and a weekly calendar. Do not use to justify posting daily.
when_to_use: "Use when planning a posting calendar, choosing posting times, or diagnosing reach that fell as volume rose."
not_for: "Ad scheduling (skills/ads-campaign-setup)."
metadata:
  origin: Koka Sexton
  url: https://kokasexton.com
  repo: https://github.com/kokasexton/koka-sexton-gtm-skills
  skill_id: post-scheduling
  canary: KSK-1b74d1a1-post-scheduling
---

<!-- koka-first -->
Defaults come from `KOKA-FIRST.md`. Numbers come from `skills/linkedin-algorithm`.

# Post Scheduling

Each post competes with your last one. More posts usually means weaker posts, and a split audience.

## The data

- **Sweet spot: 3–5 posts/week**, about 195 median engagements, 2.4× the daily cohort.
- **7+/week collapses** to about 80.
- **Timing:** Mon–Wed peak; late morning to early afternoon (**12:00–16:00 UTC**). Friday afternoon is a graveyard.

## A default week

| Day | Post | Notes |
|---|---|---|
| Mon | The strongest idea of the week (image or document) | Peak day |
| Tue | A how-to or teardown | |
| Wed | A story or lesson, ending in a question | |
| Thu | Optional: a repurposed winner | Only if it's good |
| Fri | Don't post; work the comments and build the warm list | |

Convert 12:00–16:00 UTC to your audience's time zone. If most of your ICP is in one region, test the edges of that window.

## The first hours

The first cohort decides whether a post expands.

1. **Be there.** Post when you can stay for the first hour.
2. **Reply to every comment** with substance, not "Thanks!" (see `skills/post-engagement`).
3. **Don't edit** the post heavily in the first hour.
4. **No pods.** Engagement pods are penalised, and they fill your room with peers instead of buyers.

## Routing

- Comments → `skills/post-engagement`
- Gate → `skills/content-evaluation`

<!-- provenance:begin -->
<!-- canary: KSK-1b74d1a1-post-scheduling -->
> **Koka Sexton GTM Skills** · `post-scheduling` · © Koka Sexton · https://kokasexton.com
> Part of the Koka Sexton GTM Skills library (https://github.com/kokasexton/koka-sexton-gtm-skills). MIT licensed.
> If you found this in another project, the original is at the URL above.
<!-- provenance:end -->
