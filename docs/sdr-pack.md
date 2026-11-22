# The SDR pack, end to end

Install one bundle, point it at one export, and get a ranked list and a send plan. Every number below comes from the fictional example files shipped with the skills. Run the commands and you will see the same output. Your own data will differ.

## 1. Install

```bash
node scripts/install.mjs --pack sdr --target ./skills
```

Output: `installed 25 new, updated 0, 0 already up to date`. That is the 17 skills listed under `sdr` in [`packs.json`](../packs.json), plus `koka` and the orchestrators those skills route through, so routing never points at a missing skill. The installed `koka` skill lists exactly what is present and will tell you when an ask needs a skill outside the pack.

Then start a new agent session and say: *use the koka skill. Where should we start?*

## 2. Rank who is warm (`warm-list`)

You need an export of engagement on your own posts: one row per event with `name`, `headline`, `type`, `post`, `date`. Use an export you are licensed to hold. These skills never scrape LinkedIn and never send anything.

```bash
node skills/warm-list/scripts/warm-list.mjs skills/warm-list/examples/engagement.csv --icp skills/warm-list/examples/icp.json
```

On the example file the report says: 10 unique engagers, 60% Director+ (the report baseline is 33%, so this room is above it), one account cluster (Northwind Analytics, 3 people), and tiers P0 x3, P1 x4, P2 x0, P3 x3.

What to take from it:

- **P0 gets a warm DM** that names the exact exchange. Dana Okafor (2 substantive comments, regular, inside the cluster) is the first message you write.
- **A cluster is a multi-thread play.** Raj Patel and Mia Chen are P1 only because Northwind Analytics has three engagers. Talk to the account, not three strangers.
- **Evidence beats the tier.** Grace Kim is a c-suite comment from 106 days ago. The engine keeps her at P1 and says to reply once more in public first.
- **Headlines lie by omission, and the engine knows it.** The fractional CMO is flagged FRACTIONAL, not hidden. The assistant to a CEO is unclassified, not the CEO.

The weights are Koka's defaults, not report data. Re-weight them from what became meetings.

## 3. Write the touch

For each P0 and P1, work through the pack in order:

| Step | Skill | What it does |
|---|---|---|
| Hook | `personalization-hooks` | Turns their exact comment into an opening line |
| Email 1 | `first-touch` | Signal, then idea, then ask, short, no calendar link |
| Subject | `subject-lines` | Specific and lowercase-friendly. Test one variable at a time |
| Check | `personalization-qa` | True, specific, connected, fresh. Catches broken merge fields |
| Touch 2 and 3 | `follow-up` | Each one adds something new |
| DM | `dm-scripts` | Warm opener plus the reply path for yes, not now, no |
| Phone | `cold-call-scripts` | Opens with the reason for the call |
| Quiet leads | `re-engagement` | Revives with a reason that is new |

`sdr-prompts` holds the agent prompts for research, drafting from a signal and reply triage. `sdr-writing-rules` is the one-page team standard. `linkedin-comment-warmer` and `linkedin-safety` cover warming a target in public without risking the account.

A human reads every message before it goes out.

## 4. Plan the volume (`outbound-metrics`)

Measure your own funnel first, then plan backwards from a pipeline target.

```bash
node skills/outbound-metrics/scripts/pipeline-math.mjs rates skills/outbound-metrics/examples/counts.json
node skills/outbound-metrics/scripts/pipeline-math.mjs plan skills/outbound-metrics/examples/plan.json
```

On the example counts the end-to-end rate is 0.4%, about 250 sends per opportunity. The plan for a $900,000 pipeline at a $30,000 average opportunity (30 opportunities) needs 7,465 sends and 2,489 people at 3 touches each. The biggest lever is delivered to replied: one more point there saves 1,224 sends. Fix signal and message quality before adding volume or reps.

Those rates are the example's, not a benchmark. Compare to your own history, and re-measure monthly.

## Wrong pack?

Founders building a LinkedIn presence want `--pack founder`. Investors ranking founders against a thesis want `--pack investor` and the [VCO pack guide](vco-pack.md). An agent can list and fetch packs through the MCP tools `list_packs` and `get_pack`.
