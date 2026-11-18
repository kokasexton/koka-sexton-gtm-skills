# Benchmark lookup tables

Generated from `data/benchmarks.json` by `scripts/build-tables.mjs`. Do not edit by hand; edit the data and re-run.
Source: LinkedIn Algorithm Report 2026 (data by SignalScout) — 2,279 posts, 246 creators, 3,780 engagers, 49,501 reactions, 15,517 comments, May 2025–June 2026. Medians are engagements per post. Overall median: 58.

## Cadence (posts per week)

| Band | Median engagements | Read |
|---|---|---|
| 3-5 per week | 195 | Sweet spot, 2.4× the daily cohort |
| 7+ per week | 80 | Overload: each post competes with your last |

## Format

| Format | Median engagements | Share of comments |
|---|---|---|
| image | 70 | 22.5% |
| link or article | 25 | 12.6% |
| all posts | 58 | n/a |

Image beats link or article by 2.8×. Comment share by format:

| Format | Share of comments |
|---|---|
| image | 22.5% |
| document | 21.7% |
| text | 21.4% |
| video | 14.7% |
| article | 12.6% |

## Hashtags

| Count | Median engagements | Read |
|---|---|---|
| 1-2 | 91 | Best band |
| 6+ | 33 | 63% drop |
| 0 (top 1% of posts) | n/a | Viral posts typically carry 0 |

## Length and layout

| Trait | Median engagements | Compare |
|---|---|---|
| 1500+ characters | 74 | vs 40 for short posts (2×) |
| Line breaks | 62 | vs 36 for a wall of text (+72%) |
| Asks a question | 59 | |
| Leads with a number | 57 | |

## Timing

| Window | Value |
|---|---|
| Peak days | Mon, Tue, Wed |
| Peak window (UTC) | 12:00-16:00 |
| Worst slot | Fri afternoon |

## Topics

| Topic | Median engagements |
|---|---|
| ai automation | 76 |
| how to tactical | 69 |
| personal story | 64 |
| hot take contrarian | 54 |

Hot takes sit 29% below AI and automation. Teach the shift, don't provoke.

For a verdict on a specific draft, run the `linkedin_benchmark` tool instead of reading these tables.
