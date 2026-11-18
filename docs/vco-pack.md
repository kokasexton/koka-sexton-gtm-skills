# The VCO pack: who is warming up, how hot, and what to do about it

Four skills, one engine. Use it to find **founders worth a first call** (investors) or **the right people inside a target account** (sellers). Same method, same tool. Only the definition of "fit" changes.

| Skill | Job | Runs a tool? |
|---|---|---|
| [`thesis-fit`](../skills/thesis-fit/SKILL.md) | Turn an investment thesis into a rankable fit rubric (the investor's ICP) | No |
| [`signal-model`](../skills/signal-model/SKILL.md) | Score people by compound signal and tier them Cold, Warming, Hot, Urgent | Yes, `signal-model.mjs` |
| [`founder-shortlist`](../skills/founder-shortlist/SKILL.md) | Turn the tiered list into five to ten names a partner can act on | No |
| [`committee-map`](../skills/committee-map/SKILL.md) | Map the buying committee inside one account | No |

If you sell, define fit with [`define-icp`](../skills/define-icp/SKILL.md) or [`linkedin-icp-definer`](../skills/linkedin-icp-definer/SKILL.md) instead of `thesis-fit`.

## The idea in one minute

One like is noise. Someone who follows two of your people, reacts three different ways, comments, and has a colleague doing the same is a conversation waiting to start.

- **Signal says when.** Follows, reaction depth, recency, how many of your people they engage, how many people from their company engage.
- **Fit says whether.** A strong signal from the wrong person is held out of outreach.
- **Two gates keep you honest.** Nobody climbs above Warming without a comment, repost or other second signal. Nobody below the fit line gets outreach.

The weights, tiers and gates are **Koka's defaults, not benchmark data**. Re-weight them from what actually became meetings.

## What you need

- Node 18 or newer, and this repo installed (see [Install](../README.md#install)).
- **Engagement events you are entitled to hold**: your own exports, your CRM, or a tool you're licensed to use. These skills never scrape LinkedIn and never send anything.
- A one-paragraph definition of fit: a thesis (investors) or an ICP (sellers).

## The input file

One row per event. Save as CSV with a header row.

| Column | Required | What it holds |
|---|---|---|
| `name` | yes | The person |
| `company` | yes | Their company. Leave blank if unknown (density then counts them alone) |
| `type` | yes | `like`, `insight`, `love`, `celebrate`, `support`, `funny`, `comment`, `repost` or `follow` |
| `owner` | yes | Whose content or profile it was: one of **your** people. For a follow of the company page, use `company` |
| `date` | yes | `YYYY-MM-DD` |
| `title` | no | Their headline. Used to read seniority. "Ex-VP" and "Assistant to the CEO" are not counted as senior |
| `fit` | no | 0 to 100 from `thesis-fit` or `define-icp`. Without it, the fit gate is off |
| `second_signal` | no | `yes` if you know of a reply, DM, form fill or profile-view cluster outside this export |
| `profile_url` | no | Used to merge the same person across rows |

Where the data comes from: the reactions and comments on your or your partners' posts, follower lists, and your CRM. Export from whatever you are licensed to use. If a column is missing, leave it out. The tool ranks on what exists and says so.

## Path 1: Investors. "Which founders should we call this week?"

**1. Write the thesis as a rubric.** Say to your agent:

> *"Use thesis-fit. We invest pre-seed and seed in payments infrastructure, devtools and vertical SaaS, US first. Write it up as a rubric."*

Worked example: [`thesis-fit/examples/thesis-fit.md`](../skills/thesis-fit/examples/thesis-fit.md).

**2. Score fit for each person** from public headlines against that rubric. Put the numbers in the `fit` column.

**3. Run the model:**

```bash
node skills/signal-model/scripts/signal-model.mjs \
  skills/founder-shortlist/examples/events.csv --as-of 2026-10-31
```

```
7 people. URGENT 2, HOT 0, WARMING 2, COLD 0. Held by the fit gate: 3 (not counted in a tier).

| 1 | Maya Lindgren  | Stealth      | URGENT  | 21.5 | 90 | commented        | 2026-10-30 | - |
| 2 | Theo Marchetti | Loomlight    | URGENT  | 14.5 | 80 | commented        | 2026-10-28 | - |
| 3 | Nadia Rahman   | Halden Cloud | WARMING | 15   | 75 | Insight reaction | 2026-10-30 | capped: no second signal |
| 4 | Kofi Mensah    | Pebblework   | WARMING | 11   | 70 | reacted          | 2026-10-30 | capped: no second signal |
| 5 | Sofia Petrov   | Quillfield   | HOLD    | 15   | 30 | commented        | 2026-10-30 | fit 30 < 40 |
```

(Rows trimmed for space.) Read it like this. Nadia scores 15, higher than Theo, but never commented, so she stays at Warming. Sofia has a strong signal and the wrong stage and sector, so she is held. That is the model doing its job.

**4. Turn it into a shortlist.** Say:

> *"Use founder-shortlist on this ranked list and our thesis. Five names maximum."*

Worked example: [`founder-shortlist/examples/shortlist.md`](../skills/founder-shortlist/examples/shortlist.md). Each entry has why now, thesis match, warmest angle, who should reach out, and the one open question.

## Path 2: Sellers and reps. "Who matters at this account, and who do I warm first?"

**1. Define fit** with `define-icp` or `linkedin-icp-definer`, and put a 0 to 100 score in the `fit` column.

**2. Run the model on the engagement you have from that account's people:**

```bash
node skills/signal-model/scripts/signal-model.mjs \
  skills/signal-model/examples/events.csv --as-of 2026-10-31
```

```
7 people. URGENT 1, HOT 0, WARMING 3, COLD 1. Held by the fit gate: 2 (not counted in a tier).

| 1 | Dana Okafor  | Northwind Analytics | URGENT  | 25.5 | 85 | commented | 2026-10-29 | - |
| 2 | Omar Haddad  | Bluepeak            | WARMING | 17   | 75 | Insight reaction | 2026-10-30 | capped: no second signal |
| 3 | Raj Patel    | Northwind Analytics | WARMING | 11   | 80 | reacted   | 2026-10-27 | capped: no second signal |
| 5 | Grace Kim    | Quillstack          | COLD    | 2    | 90 | commented | 2026-09-01 | - |
| 6 | Lena Vogel   | Fernway             | HOLD    | 15   | 35 | Insight reaction | 2026-10-29 | capped...; fit 35 < 40 |
```

(Rows trimmed for space.) Three people from Northwind engaged in one week, one of them VP-level. That is account-level interest.

**3. Map the room.** Say:

> *"Use committee-map for Northwind Analytics, using this ranked list. Who do I warm first?"*

Worked example: [`committee-map/examples/northwind-map.md`](../skills/committee-map/examples/northwind-map.md). It returns a committee table, who to warm first, the gaps in the room, and a no-ask first touch for each person.

**4. Write the first touch** with [`first-touch`](../skills/first-touch/SKILL.md) or [`linkedin-comment-warmer`](../skills/linkedin-comment-warmer/SKILL.md). A person reads it and sends it.

## Path 3: Founders and executives. "Who is already paying attention to me?"

Run the same model on the engagement your own posts earn, with your ICP as the fit score. The Urgent and Hot list is who to reply to publicly and then talk to. The Warming list is who to keep engaging with. Pair it with [`warm-list`](../skills/warm-list/SKILL.md) for the read on how senior your audience is.

## Which skill when

| You have | You want | Use |
|---|---|---|
| An engagement export (reactions, comments, reposts) | Who to talk to first, by depth, recency and ICP fit | [`warm-list`](../skills/warm-list/SKILL.md) |
| Follow and reaction events across several of your people | Who is warming up and how hot, with gates | [`signal-model`](../skills/signal-model/SKILL.md) |
| Signals at the account level (funding, hiring, job changes) | Which accounts to work this week | [`multi-signal`](../skills/multi-signal/SKILL.md) |
| A pool of leads, followers and engagers | Who to warm this week, across pools | [`linkedin-warm-list-builder`](../skills/linkedin-warm-list-builder/SKILL.md) |
| One account | The key people and who to warm first | [`committee-map`](../skills/committee-map/SKILL.md) |
| A tiered list and a thesis | Names a partner can act on | [`founder-shortlist`](../skills/founder-shortlist/SKILL.md) |

Starting out? Use `warm-list` for the first run (it needs less data), then add `signal-model` once you have follow data and several of your people posting.

## Run it over MCP

If your agent connects through the MCP server, `signal_model` takes the CSV as text:

```json
{ "name": "signal_model", "arguments": { "csv": "name,company,type,owner,date,title,fit\n...", "as_of": "2026-10-31" } }
```

## Troubleshooting

| Problem | Fix |
|---|---|
| Nobody gets above Warming | Nobody has a comment or repost yet. That is the second-signal gate working. Add `second_signal=yes` for a reply or DM you know about, or give it time |
| Everyone is held | The `fit` scores are under 40. Check the rubric, or run without a `fit` column to see signal alone |
| Same person appears twice | Add `profile_url` so rows merge. Without it, people merge on name plus company |
| Density looks wrong | Density counts people from the same `company` string. Make company names consistent ("Acme" vs "Acme Inc") |
| "Senior" is wrong for someone | Seniority is read from the headline. A blank or odd headline reads as unclassified. Fix the `title` |
| The skill never fires | Say the name: "Use signal-model on this file." Check the skill is installed with the installer or plugin |
| It tells me to message someone | It never sends. Every message is a draft for you to read, edit and send |

## What this does not do

- It does not scrape LinkedIn or any site, and it does not send messages.
- It does not predict who will invest or buy. It ranks who is paying attention and fits, and says why.
- It does not know private information. Roles in a committee map are inferred from public headlines and labelled that way.
- The weights have not been fitted to your conversion data. Treat the first run as a v1, then adjust.

Need it run for you, or installed into your team's agent and data? That is [Koka Sexton Consulting](https://kokasexton.com).
