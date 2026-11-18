---
name: content-calendar
description: Turn pillars into a 30-day posting calendar with dates, local posting times, pillar rotation and a format for each slot, using a script that never repeats a pillar back to back and never schedules link posts. Reads pillars.json from content-pillars and writes a Markdown calendar and a CSV. Use after content-pillars and before month-of-posts. Do not use to write the posts.
when_to_use: "Use when the ask is 'give me a 30-day calendar', 'when should I post?', or 'turn these pillars into a schedule'."
not_for: "Choosing pillars (skills/content-pillars), drafting posts (skills/month-of-posts), or the research behind timing (skills/post-scheduling)."
metadata:
  origin: Koka Sexton
  url: https://kokasexton.com
  repo: https://github.com/kokasexton/koka-sexton-gtm-skills
  skill_id: content-calendar
  canary: KSK-7146bdd3-content-calendar
---

<!-- koka-first -->
Defaults come from `KOKA-FIRST.md`. Timing rules come from `skills/post-scheduling`.

# Content Calendar

A calendar removes the daily "what do I post?" decision. This skill places every post on a date, in a pillar, in a format, at a local time, and leaves the writing to `skills/month-of-posts`.

## Inputs

- `pillars.json` from `skills/content-pillars` (`name`, `weight`, `formats`, `angles` per pillar, plus `start`, `per_week`, `tz`).
- Ask once if missing: the start date (a Monday works best), posts per week (three to five), and the audience's time zone.

## Run it

```
node skills/content-calendar/scripts/content-calendar.mjs pillars.json
node skills/content-calendar/scripts/content-calendar.mjs pillars.json --start 2026-12-07 --per-week 4 --tz America/New_York
node skills/content-calendar/scripts/content-calendar.mjs pillars.json --csv > calendar.csv
node skills/content-calendar/scripts/content-calendar.mjs pillars.json --json
```

Flags: `--start` (date), `--per-week` (1 to 5), `--days` (window length, default 30), `--tz` (IANA zone), `--json`, `--csv`. The script exits 2 with a plain message if `per_week` is over five or there are more than five pillars. It never changes the input file.

## What the script does

- Uses the days and window from `skills/post-scheduling`: Monday to Thursday, no Friday, weekends only if asked. The slot sits at the middle of the 12:00 to 16:00 UTC window and is converted to the audience's local time.
- Rotates pillars by weight with no pillar twice in a row, and hands each pillar its angles in order.
- Rotates formats from the pillar's list. It never schedules a link post: links go in the first comment, as `skills/linkedin-algorithm` explains.
- Says so when a pillar runs out of angles, so you can ask for more instead of repeating.

## Then

1. Read the calendar back to the user in a table: date, local time, pillar, angle, format.
2. Flag any pillar that ran short of angles, and any week with a clash the user told you about (travel, launches, holidays). Move those slots by hand and say what moved.
3. Save `05-calendar.md` and `05-calendar.csv` in the launch-kit folder.

## Worked example

`skills/content-calendar/examples/pillars.json` is a fictional consultant with three pillars and four posts a week. Run the first command above with `--start 2026-12-07 --per-week 4 --tz America/New_York` and you get 18 posts across the window, each at 09:00 local, with the heavier pillar appearing most and no pillar twice in a row.

## Rules

- Schedule, don't promise results. The calendar says when and what, not how it will perform.
- Fewer posts done well beat a heavy schedule dropped in week two. Start at three or four.
- **Human gate.** Nothing is scheduled or posted. The user schedules each approved post themselves.

## Routing

- Draft and check the posts → `skills/month-of-posts`
- Change the pillars → `skills/content-pillars`
- Timing research → `skills/post-scheduling`
- The whole kit → `skills/linkedin-launch`

<!-- provenance:begin -->
<!-- canary: KSK-7146bdd3-content-calendar -->
> **Koka Sexton GTM Skills** · `content-calendar` · © Koka Sexton · https://kokasexton.com
> Part of the Koka Sexton GTM Skills library (https://github.com/kokasexton/koka-sexton-gtm-skills). MIT licensed.
> If you found this in another project, the original is at the URL above.
<!-- provenance:end -->
