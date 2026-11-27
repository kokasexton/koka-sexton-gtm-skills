# The investor pack, end to end

Install one bundle, write your thesis as a rubric, rank who is warming up, and get a shortlist a partner can act on. Every number below comes from the fictional example files shipped with the skills. Run the commands and you will see the same output. Your own data will differ.

The [VCO pack guide](vco-pack.md) explains the engine and the input columns in depth, and also covers sellers. This page is the investor's straight line through it: install to shortlist.

## 1. Install

```bash
node scripts/install.mjs --pack investor --target ./skills
```

Output: `installed 20 new, updated 0, 0 already up to date`. That is the 13 skills listed under `investor` in [`packs.json`](../packs.json), plus `koka` and the orchestrators those skills route through, so routing never points at a missing skill.

Then start a new agent session and say: *use the koka skill. Where should we start?*

## 2. Write the thesis as a rubric (`thesis-fit`)

Say: *"Use thesis-fit. We invest pre-seed and seed in payments infrastructure, devtools and vertical SaaS, US first. Write it up as a rubric."* You get stage, sector, geography, founder archetypes and hard disqualifiers. Score each person 0 to 100 from their public headline and put the number in a `fit` column.

## 3. Rank who is warming up (`signal-model`)

```bash
node skills/signal-model/scripts/signal-model.mjs skills/founder-shortlist/examples/events.csv --as-of 2026-10-31
```

On the example events: 7 people. URGENT 2, HOT 0, WARMING 2, COLD 0. Held by the fit gate: 3. Maya Lindgren (Stealth) ranks first at 21.5, then Theo Marchetti (Loomlight) at 14.5; both commented.

Two gates keep the list honest. Nadia Rahman scores 15, higher than Theo, but never commented or reposted, so she is capped at Warming. Sofia Petrov has a strong signal and a fit of 30, under the line of 40, so she is held out of outreach. The weights, tiers and gates are Koka defaults, not benchmark data. Re-weight them from which signals became meetings.

## 4. Add the account-level signals (`funding-signals`, `hiring-signals`, `job-changes`, `multi-signal`)

A person engaging is one kind of signal. A round, a hiring push or a leader moving is another, and `multi-signal` combines them per account.

```bash
node skills/multi-signal/scripts/signal-score.mjs skills/multi-signal/examples/signals.csv
```

On the example file the output is ACT NOW 1, WARM UP 2, WATCH 2, IGNORE 1. The example accounts are written from a seller's point of view, so for an investor read the funding and hiring rows as company-building signals, then use the three skills for the play: reach the leader the money is for, write to the problem a hire is meant to solve, and use the job-change window.

## 5. Turn the ranking into a shortlist (`founder-shortlist`)

Say: *"Use founder-shortlist on this ranked list and our thesis. Five names maximum."* Each entry has why now, thesis match, warmest angle, who should reach out and the one open question. A worked example is in [`founder-shortlist/examples/shortlist.md`](../skills/founder-shortlist/examples/shortlist.md).

For a company you are already looking at, `committee-map` shows who is in the room and who to warm first. `linkedin-signal-stack` builds five or more sourced signals on one person so the first message reads as researched.

## 6. Reach out without burning the account

`linkedin-comment-warmer` covers warming a founder in public with real comments. `linkedin-safety` covers what keeps your account out of trouble. `dm-scripts` covers the warm opener and the reply path once they engage. These skills never scrape LinkedIn and never send anything. Every message is a draft for you to read and send.

## Say this first

After install, these are the asks the pack is built for. The installed `koka` router lists them too, so an agent can offer them to you.

- "Turn my thesis into a rubric I can score founders against." (`thesis-fit`)
- "Rank these founders by who is warming up." (`signal-model`)
- "Build a shortlist from this list and say why each made it." (`founder-shortlist`)
- "Which of these companies show funding or hiring signals?" (`multi-signal`)

## Wrong pack?

Sellers working a list want `--pack sdr` and the [SDR pack guide](sdr-pack.md). Founders building their own attention want `--pack founder` and the [founder pack guide](founder-pack.md). An agent can list and fetch packs through the MCP tools `list_packs` and `get_pack`.
