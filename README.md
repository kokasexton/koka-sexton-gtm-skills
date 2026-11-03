<p align="center"><img src=".claude-plugin/icon.png" width="104" alt=""></p>

<h1 align="center">Koka Sexton — GTM Skills</h1>

<p align="center"><b>The whole B2B go-to-market stack, installed into your AI agent.</b><br>
Strategy, LinkedIn content and ads, buying signals, list building, cold email, personalization, SDR work, and AI search,<br>
built on real data, enforced by tests, and backed by tools your agent can run.</p>

<p align="center">
<a href="https://github.com/kokasexton/koka-sexton-gtm-skills/actions/workflows/ci.yml"><img src="https://github.com/kokasexton/koka-sexton-gtm-skills/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
<img src="https://img.shields.io/badge/skills-72-6366f1" alt="72 skills">
<img src="https://img.shields.io/badge/runnable%20tools-8-ec4899" alt="8 tools">
<img src="https://img.shields.io/badge/dependencies-0-38bdf8" alt="zero dependencies">
<img src="https://img.shields.io/badge/API%20keys%20required-0-22c55e" alt="no API keys">
<img src="https://img.shields.io/badge/license-MIT-111827" alt="MIT">
</p>

<p align="center">
<a href="#install">Install</a> ·
<a href="#ask-it-anything">Ask it anything</a> ·
<a href="#the-tools">The tools</a> ·
<a href="#the-system">The system</a> ·
<a href="#why-its-different">Why it's different</a> ·
<a href="#catalog">Full catalog</a> ·
<a href="#faq">FAQ</a>
</p>

---

## A mini Koka for your agent

Install it, and your agent stops giving generic marketing advice. It starts working the way Koka Sexton works:

> **Signal over vanity.** Who engaged, how senior, from which account. Not impressions.
> **Evidence over opinion.** Every number has a source. If there's no data, it says so.
> **Systems over hacks.** One good post is luck. A system that produces them is the job.
> **Comments are the CRM.** Commenters are 26% more senior than likers. Work the thread.

It's **72 skills** in one system. A front-door `koka` skill routes every ask to one of **13 orchestrators**, each with focused sub-skills, and **8 zero-dependency tools** do the work on your data: lint the draft, clean the list, score the accounts, plan the pipeline.

## Install

**As a Claude Code plugin** (recommended):

```
/plugin marketplace add kokasexton/koka-sexton-gtm-skills
/plugin install koka-gtm@koka-sexton
```

**Into any agent that reads skill folders** (Claude Code, or any harness that loads `SKILL.md` folders):

```bash
git clone https://github.com/kokasexton/koka-sexton-gtm-skills
node koka-sexton-gtm-skills/scripts/install.mjs                  # → ~/.claude/skills (every project)
node koka-sexton-gtm-skills/scripts/install.mjs --project        # → ./.claude/skills (this project)
node koka-sexton-gtm-skills/scripts/install.mjs --target <dir>   # → anywhere
```

You need Node 18 or newer. There's no `npm install`, no account, and no API key. Then start a session and say:

> *"Use the koka skill. Where should we start?"*

## Ask it anything

Talk to your agent the way you'd talk to a GTM lead. The right skill picks up the request, and where there's a tool, it runs it on your file.

| You say… | What happens |
|---|---|
| *"Our pipeline from content is flat. Where do we start?"* | `gtm-strategy` runs the diagnostic (ICP → signal → room → warm audience → one change) and names the earliest broken link |
| *"Is this LinkedIn post ready?"* (paste it) | `content-evaluation` runs **`lint-post.mjs`**: SHIP / SHIP WITH EDITS / BLOCK, every rule citing the report |
| *"Rewrite the hook. It's not landing."* | `post-hooks`: eight patterns, and the data on which openers win (numbers 57, questions 59, hot takes −29%) |
| *"Here's our engager export. Who do we talk to first?"* | `warm-list` runs **`warm-list.mjs`**: P0–P3 with evidence, regulars, account clusters, and Director+ vs. the report baseline |
| *"Which accounts are in-market this week?"* (signals sheet) | `multi-signal` runs **`signal-score.mjs`**: ACT NOW / WARM UP / WATCH, signals decayed and stacked, with the play for each |
| *"We merged three exports. Clean it before we sequence."* | `list-building` runs **`list-clean.mjs`**: dedupe across email, LinkedIn URL, and name + domain; role, free-mail, and stale-job flags |
| *"Write the first email to this new VP Marketing."* | `job-changes` → `atl-messaging` → `first-touch`, then **`lint-email.mjs`** before you send |
| *"Personalize 400 emails, but don't make anything up."* | `personalization-at-scale`: constrained prompts that only use supplied facts and output `NO_LINE` otherwise, then `personalization-qa` |
| *"Set up LinkedIn ads for our tier-1 accounts."* | `linkedin-ads`: a 3-layer funnel, audiences, structure, Thought Leader Ads, and honest measurement |
| *"How many SDRs do we need to hit $900k pipeline?"* | `outbound-metrics` runs **`pipeline-math.mjs`** on *your* rates: sends, people, reps, and the most sensitive lever |
| *"Give me a cold-call opener for Dana."* | `cold-call-scripts`: a permission opener built on the signal, objections, voicemail, and the no-show script |
| *"Does ChatGPT recommend us over competitors?"* | `prompt-panel` runs **`panel-score.mjs`** (share of answer, gaps, and cited sources), then `citation-check` fixes the pages |

## A week with Koka

| Day | The agent helps you… | Skills |
|---|---|---|
| **Mon** | Pick 3–5 post ideas from real signal, then write, lint, and publish the strongest | `linkedin-content`, `post-hooks`, `content-evaluation` |
| **Tue** | Score the week's signals and research the ACT NOW accounts | `signal-sourcer`, `multi-signal`, `find-contacts` |
| **Wed** | Write signal-led emails and DMs, lint them, and a human sends | `cold-email`, `personalization`, `linkedin-outreach-campaign` |
| **Thu** | Promote the best organic post as a Thought Leader Ad to tier-1 accounts | `linkedin-ads`, `ads-creative`, `ads-audiences` |
| **Fri** | Turn the week's engagers into a warm list, check the numbers, and change one thing | `warm-list`, `outbound-metrics`, `gtm-principles` |

Content earns attention. Engagement and signals show who's ready. Outreach is written to the signal. Measurement decides next week.

## The tools

Eight Node scripts ship inside the skills. They have no dependencies, run offline, and support `--json` for automation. Each one has a worked example (fictional companies, real benchmarks) and tests pinned to its output.

| Tool | Skill | In → out |
|---|---|---|
| `lint-post.mjs` | content-evaluation | LinkedIn draft → verdict + fixes, each rule citing the report |
| `lint-email.mjs` | cold-email | Cold email → DO NOT SEND / READY: merge fields, template openers, fake familiarity, asks, calendar links, spammy subjects |
| `warm-list.mjs` | warm-list | Engagement CSV + ICP → P0–P3 people with evidence, regulars, account clusters, a read of the room |
| `signal-score.mjs` | multi-signal | Signals CSV → accounts ranked ACT NOW / WARM UP / WATCH / IGNORE, decayed and stacked |
| `list-clean.mjs` | list-building | Messy multi-source contacts → one record per person, with a status |
| `pipeline-math.mjs` | outbound-metrics | Your counts → baseline rates; target + rates → sends, people, reps, best lever |
| `citation-check.mjs` | citation-check | Page (md/html) → AI-citation readiness score + fixes |
| `panel-score.mjs` | prompt-panel | AI answer log → mention and citation rate, share of voice, gaps, cited sources |

<details open>
<summary><b>See them run</b> (clone the repo, then paste any of these)</summary>

**Is this cold email ready to send?**

```bash
node master-skills/cold-email/scripts/lint-email.mjs master-skills/cold-email/examples/before.txt
```

```
Verdict: DO NOT SEND  (7 fail, 1 warn)

✗ FAIL  [merge-field] Unfilled merge field "{{first_name}}". This is the most common template tell.
✗ FAIL  [opener] Template opener: "I hope this email finds you well! My name is Alex…"
✗ FAIL  [fake-familiarity] "love what you" implies familiarity you may not have.
✗ FAIL  [asks] 4 questions. One email, one ask.
✗ FAIL  [calendar] Calendar link or 'book a time' in touch one. Earn the reply first.
```

The same offer, rebuilt on a real signal (`examples/after.txt`), comes back `READY`.

**Which accounts are in-market this week?**

```bash
node master-skills/signal-sourcer/.claude/skills/multi-signal/scripts/signal-score.mjs \
  master-skills/signal-sourcer/.claude/skills/multi-signal/examples/signals.csv --as-of 2026-10-31
```

```
| ACT NOW | Northwind Analytics | 85 | 83 ⧉ | website-pricing (2d); content-comment (3d); job-change (11d) |
| WARM UP | Bluepeak            | 72 | 41   | content-repeat (5d); hiring (16d)                          |
| WATCH   | Quillstack          | 80 | 5    | funding (91d); content-comment (108d)   ← old signals decay |
```

**Who in our engager export do we talk to first?**

```bash
node master-skills/engagement-intelligence/.claude/skills/warm-list/scripts/warm-list.mjs \
  master-skills/engagement-intelligence/.claude/skills/warm-list/examples/engagement.csv \
  --icp master-skills/engagement-intelligence/.claude/skills/warm-list/examples/icp.json --as-of 2026-10-31
```

```
- 10 unique engagers · 60% Director+ (report baseline: 33% — you are above)
| P0 | Tom Becker | c-suite · marketing | 0.8 | 1 comment (1 substantive) · FRACTIONAL | Warm-signal DM … |
```

It reads headlines the way a person would. *"I help founders scale | Fractional CMO | Ex-VP Sales"* is c-suite and flagged fractional, not VP. *"Executive Assistant to the CEO"* is not the CEO. *"Great post!"* from a founder is not a P0.

**Is our list safe to send?**

```bash
node master-skills/list-building/scripts/list-clean.mjs master-skills/list-building/examples/contacts.csv
```

```
12 rows in → 8 unique people (4 duplicate rows merged)
- Dana Okafor — rows 2, 3, 4 · sources: database, event-list, sales-nav
- José Núñez — rows 8, 9 · sources: database, event-list
ready 4 · hold free-mail 1 · review stale domain 1 · drop role 1 · drop invalid 1
```

**What will it take to hit the number, and what should we fix first?**

```bash
node master-skills/sdr-tools/.claude/skills/outbound-metrics/scripts/pipeline-math.mjs plan \
  master-skills/sdr-tools/.claude/skills/outbound-metrics/examples/plan.json
```

```
Plan: 30 opportunities → 7465 sends · 2489 people · 2.5 reps
Where one point matters most: delivered → replied (now 5.1%): 1224 fewer sends
```

Better signals beat more reps. The tool has no built-in "industry average" rates, so it won't plan until you give it yours.

**Is this LinkedIn post ready?** `lint-post.mjs` gives `before.md` a **BLOCK** (7 hashtags, a body link, "Comment YES" bait, slop) and `after.md` a **SHIP**.
**Will AI assistants quote this page?** `citation-check.mjs` scores `before.md` 2/10 and `after.md` 10/10.

</details>

## The system

Most GTM tooling covers one step and leaves you to stitch the rest together. This is one loop: **decide → earn attention → see who's ready → reach them well → measure → repeat**. Every skill knows where it sits in that loop and hands off to the next.

```
 ① DECIDE     gtm-strategy ─ the motion, the ICP, the plays
                   │
 ② ATTENTION  linkedin-content · linkedin-ads · content-engineer · ai-search-visibility
                   │                                                        │
 ③ WHO'S READY     └──▶ engagement-intelligence (who's in the room) ◀───────┘
                        signal-sourcer          (who's in-market now)
                                   │
 ④ REACH      list-building → personalization → cold-email · linkedin · sdr-tools
                        (signal-outbound runs this chain end to end)
                                   │
 ⑤ MEASURE    who engaged · who replied · what became pipeline ──▶ back to ①
```

`koka` is the front door. Describe the problem in plain words and it routes to the right orchestrator. Every skill inherits the same persona (`KOKA.md`) and defaults (`KOKA-FIRST.md`), so advice on Monday's post and Thursday's cold call comes from the same operator.

---

### ① Decide: strategy before tactics

#### `gtm-strategy` · 4 sub-skills
Decide what *not* to do. Most teams run every motion at half strength. This sets the ICP, the motion mix, and the plays, then diagnoses weak pipeline by finding the earliest broken link.

**You get:** a GTM plan your team can argue with and agree on, and a diagnostic that tells you which one thing to fix first.

- **`gtm-principles`**: the ten Koka operating rules (signal over vanity, evidence over opinion, one change at a time…), each turned into a decision rule for settling debates
- **`outreach-motions`**: inbound vs. warm vs. triggered vs. cold, what each needs, and why most teams leave the warm motion unworked
- **`sales-triggers`**: a library of true, checkable "why now" reasons, grouped by source, each with an opening-line pattern
- **`gtm-plays`**: 8 repeatable plays, each with its input signal, its sequence, and the metric that proves it worked

---

### ② Attention: earn it, don't buy it blindly

#### `linkedin-content` · 7 sub-skills + the canonical data
Write, publish, and work LinkedIn posts the way the data says wins. It owns **`linkedin-algorithm`**, the single source of truth for every benchmark in the repo.

**You get:** posts built on numbers, not hunches. Image formats beat link posts 2.8×, 3–5 posts a week beat daily, and 1,500+ characters with whitespace beats short. Plus a gate that blocks a bad post before it costs you reach.

- **`post-hooks`**: eight patterns for the line before "…see more", and the openers the data says lose (hot takes −29%)
- **`post-storytelling`**: one lesson per post, three proven structures, long-form with whitespace (+72%)
- **`post-formats`**: image, document, text, video, or link, chosen by median engagement and comment share
- **`post-scheduling`**: cadence and timing (Mon–Wed, 12:00–16:00 UTC) and the first-hours routine
- **`post-engagement`**: run the comment section like a CRM, since commenters are 26% more senior than likers
- **`post-cta`**: questions that earn substantive comments instead of penalised "comment YES" bait
- **`repurposing`**: turn one proven idea into a carousel, image, video, newsletter, ad, and citable page

🛠 `lint-post.mjs` checks every draft against the report: SHIP / SHIP WITH EDITS / BLOCK.

#### `linkedin-ads` · 8 sub-skills
Run LinkedIn Ads as part of an account-based motion: narrow audiences, a three-layer funnel, creative that teaches, and engagement handed to sales as a signal.

**You get:** ad spend aimed at the buying committee of your actual target accounts, measured by pipeline rather than clicks, and turned into conversations.

- **`ads-audiences`**: account lists, buying-committee targeting, exclusions, retargeting pools, and expansion settings that don't dilute ABM
- **`ads-campaign-setup`**: campaign groups by funnel layer and tier, one objective each, a naming convention, and a pre-launch checklist
- **`ads-creative`**: Thought Leader Ads, document ads, and promoting organic winners, plus spotting creative fatigue early
- **`ads-copy`**: copy written from a voice-of-customer bank, one idea and one offer per ad
- **`ads-bidding`**: automated vs. cost cap vs. manual bids, and budget across layers and tiers
- **`ads-measurement`**: Insight Tag + Conversions API, KPIs ranked from pipeline down to CTR, and attribution that admits what it can't see
- **`ads-outbound-sync`**: export engaged accounts weekly, score them with other signals, and route them to SDRs with the ad's story attached
- **`ads-optimization`**: a 7-step diagnostic ladder (tracking → delivery → audience → creative → offer → quality → bid)

#### `content-engineer` · 1 sub-skill
The six-layer content loop (source → knowledge → generation → evaluation → distribution → measurement) for teams building a content *system*, not one post.

**You get:** a map of where your content engine is broken, which is usually that the team has generation and nothing else.

- **`content-evaluation`**: the evaluation gate. Nothing ships un-gated.

#### `ai-search-visibility` · 2 sub-skills
Get found, named, and cited when buyers ask ChatGPT, Perplexity, Gemini, or Claude. AEO/GEO as a measured loop, not a vibe.

**You get:** a real number for "do AI assistants recommend us?", the exact prompts where competitors appear and you don't, and the pages and sources to fix.

- **`prompt-panel`**: a fixed panel of buyer questions run across engines and scored for mention rate, citation rate, share of voice, and gaps
- **`citation-check`**: a structural readiness check for pages you want quoted, with specific fixes

🛠 `panel-score.mjs` · `citation-check.mjs`

---

### ③ Who's ready: read the room, then read the market

#### `engagement-intelligence` · 1 sub-skill
Find out who actually engages with a person or company. Each engager is classified from their own headline, never from a label they picked.

**You get:** the buyers hiding in your audience, ranked, with the evidence for each, and an honest read on whether your content attracts buyers or peers.

- **`warm-list`**: seniority and function classification that handles the traps ("I help CEOs…" isn't a CEO, "Ex-VP" isn't a VP), scoring on depth × recency × ICP fit, P0–P3 tiers, regulars, and account clusters

🛠 `warm-list.mjs`

#### `signal-sourcer` · 9 sub-skills
Find the accounts in-market *right now* and know how fast to act. A list ages; a signal is current.

**You get:** a weekly ACT NOW / WARM UP / WATCH list, each account with its lead signal and the play to run. Your team works who's ready, not who's next on a spreadsheet.

- **`job-changes`**: new leaders in your function, champions who moved, and contacts who left, plus the timing window
- **`funding-signals`**: read the use of funds and reach the leader the money is for
- **`hiring-signals`**: job descriptions as signals: role, "first hire", named tools, team trajectory
- **`website-visitors`**: which pages carry intent, and outreach that never mentions the tracking
- **`company-events`**: M&A, expansion, launches, and IPO prep, and which events open a window and which freeze budgets
- **`tech-changes`**: adoptions, drops, migrations, and how to treat a competitor's new customer
- **`competitor-signals`**: comparison-stage buyers, public dissatisfaction, renewal windows, met with honesty rather than attack
- **`content-engagement`**: engagement ranked by depth, commenters and regulars first
- **`multi-signal`**: stacks every signal at account level, decays old ones, rewards three or more kinds, and combines with ICP fit

🛠 `signal-score.mjs`

---

### ④ Reach: the right people, the right words, a human hand

#### `list-building` · 6 sub-skills
Build a target list that deserves outreach: small, accurate, tiered, and clean.

**You get:** an ICP drawn from your won deals rather than your wishlist, accounts tiered by effort, and a list that won't bounce or email the same person twice.

- **`define-icp`**: three layers (firmographic, situational, behavioural) and a 100-point fit score
- **`source-companies`**: the right source for each ICP shape, starting with your own CRM
- **`find-contacts`**: buying-committee mapping, Boolean title search, people with signals first
- **`qualify-accounts`**: fit × timing into tier 1/2/3, with an effort budget for each
- **`clean-validate`**: normalise, flag, verify, suppress, and keep a hygiene schedule
- **`deduplicate`**: match on email, LinkedIn URL, and name + domain; merge without losing data; keep provenance

🛠 `list-clean.mjs`

#### `personalization` · 4 sub-skills
Personalisation built on a real observation, not a merge field. That includes doing it at scale with AI without inventing anything.

**You get:** opening lines that could only have been written to that person, and a pipeline that refuses to fake it when there's nothing real to say.

- **`personalization-sources`**: six buckets ranked by strength, how long each stays fresh, and what's off-limits
- **`personalization-hooks`**: strong vs. light hooks, when each fits, and the bridge to your reason for writing
- **`personalization-at-scale`**: prompts constrained to supplied facts that output `NO_LINE` when facts are missing
- **`personalization-qa`**: the review gate covering true, specific, connected, fresh, respectful, and clean, with a sampling plan for AI batches

#### `cold-email` · 7 sub-skills
Signal-led cold email from first touch to re-engagement: one observation, one idea, one ask.

**You get:** emails that read like a person wrote them to one person, sequences where every touch adds value, and a linter that stops template tells before they reach an inbox.

- **`atl-messaging`**: VPs, C-level, and founders. Lead with an outcome or a risk; ask for an opinion, not a meeting.
- **`btl-messaging`**: managers and practitioners. Lead with the task that hurts, give something useful, and arm the champion.
- **`first-touch`**: four frameworks matched to the signal you have, plus a pre-send checklist
- **`follow-up`**: a value-rotation plan, no guilt, stop on any reply
- **`email-personalization`**: where the personal line goes, how long it is, and merge-field hygiene
- **`re-engagement`**: revive closed-lost or ghosted deals only when something real has changed
- **`subject-lines`**: patterns that read as human, and A/B tests that measure replies rather than opens

🛠 `lint-email.mjs`

#### `linkedin` · 3 sub-skills
LinkedIn as a relationship channel: a profile that converts, outreach that continues a real exchange, and an account kept safe.

**You get:** connection requests that get accepted, DMs that get answered, and a LinkedIn account you never put at risk.

- **`linkedin-profile`**: the profile as a landing page, with a headline formula, Featured, and a five-second test
- **`linkedin-outreach-campaign`**: engage first, connect with a reason, a value-first DM, one follow-up
- **`linkedin-safety`**: what triggers restrictions, a conservative warm-up ramp, and why automation is out

#### `sdr-tools` · 4 sub-skills
The SDR's working kit, plus the math that sets targets and capacity.

**You get:** faster research, a consistent team voice, calls that open honestly, and targets built on your own conversion rates rather than someone's blog post.

- **`sdr-prompts`**: agent prompts for research briefs, signal-to-message drafts, reply triage, objections, and meeting prep, all constrained to supplied facts
- **`sdr-writing-rules`**: ten rules, a 30-second self-edit, and before/after rewrites
- **`cold-call-scripts`**: a permission opener built on the signal, discovery questions, objections, voicemail, and no-show recovery
- **`outbound-metrics`**: the funnel from send to opportunity, health thresholds, and which rate to fix first

🛠 `pipeline-math.mjs`

#### `signal-outbound` · 1 sub-skill
The conductor. It chains warm list → signals → list → play → personalisation → message → metrics into one outbound motion.

**You get:** end-to-end outbound in which every touch traces back to a real signal and a human approves every send.

- **`buying-signals`**: which behaviours predict budget, how to score depth × recency × fit, and the anti-signals that don't

---

### ⑤ Measure: then change one thing

Measurement is built into every stage, not a separate step:

| Stage | What's measured | Where |
|---|---|---|
| Content | Who engaged, how senior, from which accounts, vs. the report baseline | `warm-list`, `linkedin-algorithm` |
| Ads | Pipeline from target accounts and engaged accounts that took meetings, not CTR | `ads-measurement` |
| AI search | Mention and citation rate, share of voice, gaps over time | `prompt-panel` |
| Signals | Which signal types turned into meetings, so you can re-weight them | `multi-signal` |
| Outbound | Every stage rate from send to opportunity, and the most sensitive lever | `outbound-metrics` |

The rule everywhere: **compare to your own baseline, change one lever, measure again.**

## Why it's different

| | Typical GTM prompt library | This repo |
|---|---|---|
| **Numbers** | "Best practices" and stats with no source | From a real dataset: 2,279 posts, 246 creators, 3,780 engagers. **CI fails on any % or × figure that isn't sourced.** |
| **Where there's no data** | Invented benchmarks | Says so, and gives you a tool to measure your own |
| **Output** | Prose you have to apply yourself | 8 tools that run on your data and return a verdict |
| **Lock-in** | "Connect our API" / "requires a subscription" | **No API keys, no account, no dependencies.** Tools are named only as examples. |
| **Structure** | A flat folder of prompts | An entry point → 13 orchestrators → 58 sub-skills, with routing tested in CI |
| **Personalization** | "AI writes a personal line for every lead" | AI may only use supplied facts, and outputs `NO_LINE` when there are none |
| **Outbound** | Automate everything | A human approves everything before it sends. LinkedIn automation is ruled out. |
| **Voice** | Whatever the model defaults to | One persona (`KOKA.md`), enforced by linters that block slop and fake familiarity |

## Built on

- **The LinkedIn Algorithm Report 2026**: 2,279 posts, 246 creators, 3,780 engagers, 49,501 reactions, 15,517 comments, May 2025–June 2026 (data by SignalScout). The canonical numbers live in [`linkedin-algorithm`](master-skills/linkedin-content/.claude/skills/linkedin-algorithm/SKILL.md), and every other skill must match them. Full report: [kokasexton.com/insights](https://kokasexton.com/insights).
- **The Content Engineering Stack**: a six-layer loop (source → knowledge → generation → evaluation → distribution → measurement).
- **Engagement intelligence**: classify every engager off their own headline, then read the room by ICP fit.

Where there's no data, the skills say so. Scoring weights, timing windows, and thresholds are labelled *Koka's defaults, not report data*. The ads, outbound, and AI-search skills quote no industry statistics: you measure your own, and the tools do the math.

## Catalog

<details>
<summary><b>All 72 skills</b>, generated from the skill files themselves, so this list can't drift</summary>

<!-- catalog:start -->

| Skill | Type | What it does | Runnable tool |
|---|---|---|---|
| [**koka**](master-skills/koka/SKILL.md) | entry point | Start here — the mini Koka, the persona layer and front door to the whole GTM skill system. | — |
| [**gtm-strategy**](master-skills/gtm-strategy/SKILL.md) | orchestrator | Set the go-to-market strategy before the tactics — the operating principles, which outreach motion fits (inbound, warm, triggered, cold), the trigger library that says why now, and the repeatable plays with a signal, a sequence, and a metric each. | — |
| ↳ [gtm-plays](master-skills/gtm-strategy/.claude/skills/gtm-plays/SKILL.md) | sub-skill | Repeatable go-to-market plays per channel — LinkedIn, cold email, content, and ABM — each with the signal it needs, the sequence, and the metric that proves it worked. | — |
| ↳ [gtm-principles](master-skills/gtm-strategy/.claude/skills/gtm-principles/SKILL.md) | sub-skill | The operating principles behind every skill in this library — signal over vanity, evidence over opinion, systems over hacks, fewer and better, comments are the CRM, behaviour over labels, human gate on outbound — and how each one turns into a decision rule. | — |
| ↳ [outreach-motions](master-skills/gtm-strategy/.claude/skills/outreach-motions/SKILL.md) | sub-skill | Choose the mix of four outreach motions — inbound (they came to you), warm (they engaged with you), triggered (something changed for them), and cold (fit only, no signal) — with what each needs, what it's good for, and how to move people from cold to warm. | — |
| ↳ [sales-triggers](master-skills/gtm-strategy/.claude/skills/sales-triggers/SKILL.md) | sub-skill | A library of reasons to reach out now, organised by where the trigger comes from — their engagement with you, your shared history, their in-market behaviour, visible symptoms of the problem, firmographic changes, and pure fit — with an opening line pattern for each. | — |
| [**content-engineer**](master-skills/content-engineer/SKILL.md) | orchestrator | Design and run the system that produces, evaluates, distributes, and improves content — the six-layer content loop. | — |
| ↳ [content-evaluation](master-skills/content-engineer/.claude/skills/content-evaluation/SKILL.md) | sub-skill | The evaluation gate in the content loop — lint a LinkedIn draft against the 2026 benchmark data and Koka's voice rules before it ships, then fix exactly what fails. | `lint-post.mjs` |
| [**linkedin-content**](master-skills/linkedin-content/SKILL.md) | orchestrator | Write, publish, and work LinkedIn posts the way the 2026 data says wins — hooks that earn the first cohort, bodies that teach, formats that keep people on-platform, 3–5 posts a week, and a comment section run like a CRM. | — |
| ↳ [linkedin-algorithm](master-skills/linkedin-content/.claude/skills/linkedin-algorithm/SKILL.md) | sub-skill | The 2026 LinkedIn algorithm data and playbook — cadence, formats, timing, hashtags, comment strategy, funnel metrics, and the 6-rule operating guide. | — |
| ↳ [post-cta](master-skills/linkedin-content/.claude/skills/post-cta/SKILL.md) | sub-skill | Close a LinkedIn post with a call to action that earns substantive comments — a specific question the ICP can answer from experience — and make the profile do the converting, instead of formulaic "comment YES" bait the algorithm penalises. | — |
| ↳ [post-engagement](master-skills/linkedin-content/.claude/skills/post-engagement/SKILL.md) | sub-skill | Run the comment section like a CRM — reply to every comment with substance, comment on ICP posts, and move warm commenters to DMs at the right moment without pitching. | — |
| ↳ [post-formats](master-skills/linkedin-content/.claude/skills/post-formats/SKILL.md) | sub-skill | Choose the right LinkedIn post format — image, document/carousel, text, video, or link — using the 2026 medians and comment shares, and keep links out of the post body. | — |
| ↳ [post-hooks](master-skills/linkedin-content/.claude/skills/post-hooks/SKILL.md) | sub-skill | Write the first line of a LinkedIn post — the part that has to work before "…see more" and earn the small-cohort test — with eight hook patterns, the data on which openers win, and the openers to avoid. | — |
| ↳ [post-scheduling](master-skills/linkedin-content/.claude/skills/post-scheduling/SKILL.md) | sub-skill | Decide how often and when to post on LinkedIn using the 2026 data — 3–5 posts a week, Monday to Wednesday, late morning to early afternoon UTC — plus the first-hours routine that gives each post its best start. | — |
| ↳ [post-storytelling](master-skills/linkedin-content/.claude/skills/post-storytelling/SKILL.md) | sub-skill | Structure the body of a LinkedIn post so people keep reading — one lesson, three proven structures (Problem→Agitate→Solve, Before→After→Bridge, Attention→Interest→Desire→Action), long-form with whitespace, and a close that invites a real reply. | — |
| ↳ [repurposing](master-skills/linkedin-content/.claude/skills/repurposing/SKILL.md) | sub-skill | Turn one proven idea into several native assets — a winning post into a document carousel, a short video, a newsletter section, an ad, and an AI-citable page — without copy-pasting or posting links. | — |
| [**linkedin-ads**](master-skills/linkedin-ads/SKILL.md) | orchestrator | Run LinkedIn Ads as part of an account-based GTM motion — tight audiences, a 3-layer funnel, Thought Leader and document creative, honest measurement, and ad engagement handed to sales as a signal. | — |
| ↳ [ads-audiences](master-skills/linkedin-ads/.claude/skills/ads-audiences/SKILL.md) | sub-skill | Build LinkedIn ad audiences that match the ICP — company-list (ABM) targeting, buying-committee job functions and seniorities, exclusions, and retargeting pools — and keep audience expansion from quietly diluting them. | — |
| ↳ [ads-bidding](master-skills/linkedin-ads/.claude/skills/ads-bidding/SKILL.md) | sub-skill | Set LinkedIn ad budgets and bids sensibly — choose between automated delivery, cost cap, and manual bids by campaign goal, allocate budget across funnel layers and account tiers, and avoid starving campaigns before they learn. | — |
| ↳ [ads-campaign-setup](master-skills/linkedin-ads/.claude/skills/ads-campaign-setup/SKILL.md) | sub-skill | Structure LinkedIn campaigns so results are readable — campaign groups by funnel layer and account tier, one objective per campaign, retargeting segments wired between layers, naming conventions, and a pre-launch checklist. | — |
| ↳ [ads-copy](master-skills/linkedin-ads/.claude/skills/ads-copy/SKILL.md) | sub-skill | Write LinkedIn ad copy from the voice of the customer — mined from sales calls, reviews, and comments — that leads with their problem in their words, earns attention in the first line, and makes one offer. | — |
| ↳ [ads-creative](master-skills/linkedin-ads/.claude/skills/ads-creative/SKILL.md) | sub-skill | Choose and refresh LinkedIn ad creative — Thought Leader Ads from real people, document ads that teach, single-image and short video — and spot creative fatigue before it burns budget. | — |
| ↳ [ads-measurement](master-skills/linkedin-ads/.claude/skills/ads-measurement/SKILL.md) | sub-skill | Measure LinkedIn Ads honestly — Insight Tag and Conversions API setup, conversion definitions that mean pipeline, account-level engagement over click-through, and attribution that admits what it can't see. | — |
| ↳ [ads-optimization](master-skills/linkedin-ads/.claude/skills/ads-optimization/SKILL.md) | sub-skill | Diagnose and fix an underperforming LinkedIn campaign in the right order — tracking, audience, creative, offer, then bid — changing one lever at a time and judging against your own baseline. | — |
| ↳ [ads-outbound-sync](master-skills/linkedin-ads/.claude/skills/ads-outbound-sync/SKILL.md) | sub-skill | Turn LinkedIn ad engagement into sales action — export engaged accounts and people, score them alongside other signals, route them to SDRs with context, and coordinate the message so the ad and the outreach tell one story. | — |
| [**linkedin**](master-skills/linkedin/SKILL.md) | orchestrator | Use LinkedIn as a relationship channel, not a spam channel — a profile that converts, connection and DM campaigns built on real engagement, and a safe pace that protects the account. | — |
| ↳ [linkedin-outreach-campaign](master-skills/linkedin/.claude/skills/linkedin-outreach-campaign/SKILL.md) | sub-skill | Run a LinkedIn outreach campaign the warm way — target list from signals, engage first, connection request with a real reason, a value-first first DM, and a short follow-up — with message templates and the metrics to watch. | — |
| ↳ [linkedin-profile](master-skills/linkedin/.claude/skills/linkedin-profile/SKILL.md) | sub-skill | Turn a LinkedIn profile into a landing page for the people your content attracts — a headline that says who you help and how, a banner and About that prove it, a Featured section with one clear next step, and activity that matches the claim. | — |
| ↳ [linkedin-safety](master-skills/linkedin/.claude/skills/linkedin-safety/SKILL.md) | sub-skill | Keep a LinkedIn account safe while doing outreach — why LinkedIn limits activity, a conservative warm-up ramp for new or quiet accounts, the behaviours that trigger restrictions, why automation tools risk the account, and what to do if restricted. | — |
| [**engagement-intelligence**](master-skills/engagement-intelligence/SKILL.md) | orchestrator | Capture a company's or executive's public LinkedIn network, classify every engager off their own headline, and read the room by ICP fit, seniority, industry, and geography. | — |
| ↳ [warm-list](master-skills/engagement-intelligence/.claude/skills/warm-list/SKILL.md) | sub-skill | Turn a raw export of post engagement into a ranked, tiered warm list. | `warm-list.mjs` |
| [**signal-sourcer**](master-skills/signal-sourcer/SKILL.md) | orchestrator | Find the accounts and people who are in-market right now — job changes, funding, hiring, website visits, company events, tech changes, competitor signals, and content engagement — then stack and score them so the team works who's ready, not who's on a list. | — |
| ↳ [company-events](master-skills/signal-sourcer/.claude/skills/company-events/SKILL.md) | sub-skill | Read company events as signals — mergers and acquisitions, expansion into new regions or segments, new product lines, IPO preparation, restructures, and leadership changes — and know which ones open a buying window and which ones freeze budgets. | — |
| ↳ [competitor-signals](master-skills/signal-sourcer/.claude/skills/competitor-signals/SKILL.md) | sub-skill | Use competitor-related signals — accounts comparing vendors on review sites, negative reviews or public complaints about a competitor, competitor customers nearing renewal, and people engaging with competitor content — and respond with help, not attack ads. | — |
| ↳ [content-engagement](master-skills/signal-sourcer/.claude/skills/content-engagement/SKILL.md) | sub-skill | Treat engagement with content — comments, repeat engagement, document reads, webinar attendance, engagement with posts about the problem you solve — as buying signals, ranked by depth, with commenters first. | — |
| ↳ [funding-signals](master-skills/signal-sourcer/.claude/skills/funding-signals/SKILL.md) | sub-skill | Use funding rounds as signals — read what the round means (stage, amount, stated use of funds), reach the right leader while plans are forming, and lead with their growth plan rather than "congrats on the raise". | — |
| ↳ [hiring-signals](master-skills/signal-sourcer/.claude/skills/hiring-signals/SKILL.md) | sub-skill | Read hiring as a signal — open roles in your function, the tools named in job descriptions, growth or contraction trajectory, and key people leaving — and write to the problem the hire is meant to solve. | — |
| ↳ [job-changes](master-skills/signal-sourcer/.claude/skills/job-changes/SKILL.md) | sub-skill | Use job changes as signals — a new leader in your function at an ICP account, a champion who moved to a new company, or a contact who left — with the timing window, the play for each, and messages that congratulate without pitching. | — |
| ↳ [multi-signal](master-skills/signal-sourcer/.claude/skills/multi-signal/SKILL.md) | sub-skill | Stack and score account-level buying signals into one action list — each signal weighted by type, decayed by age, bonus for three or more kinds, combined with ICP fit into ACT NOW / WARM UP / WATCH / IGNORE with the play for the lead signal. | `signal-score.mjs` |
| ↳ [tech-changes](master-skills/signal-sourcer/.claude/skills/tech-changes/SKILL.md) | sub-skill | Use technology changes as signals — adopting a tool that pairs with yours, dropping a tool you replace, a stack migration, or a contract coming up — and monitor the stack of ICP accounts. | — |
| ↳ [website-visitors](master-skills/signal-sourcer/.claude/skills/website-visitors/SKILL.md) | sub-skill | Use website visits as signals responsibly — company-level identification, which pages carry intent (pricing, comparisons, integrations, case studies), visit depth and recency, and outreach that never mentions the tracking. | — |
| [**list-building**](master-skills/list-building/SKILL.md) | orchestrator | Build a target list that deserves outreach — define the ICP, source companies, find the right people, qualify and tier accounts, then clean, verify, and de-duplicate before anything sends. | `list-clean.mjs` |
| ↳ [clean-validate](master-skills/list-building/.claude/skills/clean-validate/SKILL.md) | sub-skill | Clean and verify contact data before it touches a sending domain — normalise fields, flag invalid syntax, role and free-mail addresses, verify mailboxes, handle catch-alls, and keep a hygiene schedule so bounces stay low. | — |
| ↳ [deduplicate](master-skills/list-building/.claude/skills/deduplicate/SKILL.md) | sub-skill | De-duplicate and merge contacts from multiple sources — normalise join keys (email, LinkedIn URL, name + company domain), pick a survivor, and merge fields without losing data — so nobody gets the same email twice. | — |
| ↳ [define-icp](master-skills/list-building/.claude/skills/define-icp/SKILL.md) | sub-skill | Define the ideal customer profile in three layers — firmographic fit (who they are), situational fit (what's true right now), and behavioural fit (what they do) — with a 100-point scoring model built from your best customers, not your wishlist. | — |
| ↳ [find-contacts](master-skills/list-building/.claude/skills/find-contacts/SKILL.md) | sub-skill | Find the right people inside target accounts — map the buying committee, search by function and seniority with Boolean title logic, prefer people who show signals, and get contact data from compliant sources. | — |
| ↳ [qualify-accounts](master-skills/list-building/.claude/skills/qualify-accounts/SKILL.md) | sub-skill | Score and tier target accounts — ICP fit plus live signals — into Tier 1 (1:1), Tier 2 (1:few), and Tier 3 (1:many) with a play and an effort budget for each. | — |
| ↳ [source-companies](master-skills/list-building/.claude/skills/source-companies/SKILL.md) | sub-skill | Source the account universe that matches the ICP — from B2B databases, LinkedIn Sales Navigator, maps and directories, review sites, job boards, communities, and your own CRM — and know which source fits which ICP. | — |
| [**cold-email**](master-skills/cold-email/SKILL.md) | orchestrator | Write and run signal-led cold email — one observation, one idea, one ask — from first touch to follow-up to re-engagement, with persona-specific messaging and a linter (scripts/lint-email.mjs) that catches the template tells before anything sends. | `lint-email.mjs` |
| ↳ [atl-messaging](master-skills/cold-email/.claude/skills/atl-messaging/SKILL.md) | sub-skill | Cold email for above-the-line buyers — VP, C-level, Director, Founder — who own budget and outcomes, not tasks. | — |
| ↳ [btl-messaging](master-skills/cold-email/.claude/skills/btl-messaging/SKILL.md) | sub-skill | Cold email for below-the-line buyers — managers and individual contributors who feel the daily pain, run the workflow, and champion a purchase upward. | — |
| ↳ [email-personalization](master-skills/cold-email/.claude/skills/email-personalization/SKILL.md) | sub-skill | Apply real personalisation to an email — where the observation goes, how long it should be, how to connect it to the idea, and how to keep merge fields from breaking. | — |
| ↳ [first-touch](master-skills/cold-email/.claude/skills/first-touch/SKILL.md) | sub-skill | The first cold email — built on one real signal, written in the observation → idea → ask shape, under ~120 words, with no calendar link. | — |
| ↳ [follow-up](master-skills/cold-email/.claude/skills/follow-up/SKILL.md) | sub-skill | Touches 2 and 3 of a cold sequence — each adds something new (a data point, a teardown, a different angle) instead of "bumping this to the top of your inbox". | — |
| ↳ [re-engagement](master-skills/cold-email/.claude/skills/re-engagement/SKILL.md) | sub-skill | Revive cold, stalled, or closed-lost leads with a reason that's new — a new signal, a new person, or a changed situation — instead of "circling back". | — |
| ↳ [subject-lines](master-skills/cold-email/.claude/skills/subject-lines/SKILL.md) | sub-skill | Subject lines that read like a colleague wrote them — short, specific, lowercase-friendly, about the recipient — plus a clean A/B testing method that tests one variable at a time against reply rate, not opens. | — |
| [**personalization**](master-skills/personalization/SKILL.md) | orchestrator | Personalisation that is real — built on an observed signal, not a mail-merge field. | — |
| ↳ [personalization-at-scale](master-skills/personalization/.claude/skills/personalization-at-scale/SKILL.md) | sub-skill | Personalise hundreds of messages with AI without fabricating — research inputs first, constrained prompts that may only use supplied facts, a "no observation → no line" rule, and a human review sample before anything sends. | — |
| ↳ [personalization-hooks](master-skills/personalization/.claude/skills/personalization-hooks/SKILL.md) | sub-skill | Turn an observation into an opening line — strong hooks (their words or actions, tied to your reason for writing) vs. light hooks (segment- or company-level, honest about being so) — and know when each is appropriate. | — |
| ↳ [personalization-qa](master-skills/personalization/.claude/skills/personalization-qa/SKILL.md) | sub-skill | The review gate for personalised outreach — check each line is true, specific, connected, and fresh; catch fake familiarity, hallucinated facts, broken merge fields, and creepy over-reach; and set a sampling plan for AI-generated batches. | — |
| ↳ [personalization-sources](master-skills/personalization/.claude/skills/personalization-sources/SKILL.md) | sub-skill | Where real personalisation comes from, in six buckets ranked by strength — their own words, their engagement with you, a change at their company, their team's public work, a shared context, and their company's public story — with where to find each and how long it stays fresh. | — |
| [**signal-outbound**](master-skills/signal-outbound/SKILL.md) | orchestrator | Turn signals into pipeline end to end — score who's warm and who's in-market, pick the play, and run the sequence across email, LinkedIn, and calls, with a human gate on every touch. | — |
| ↳ [buying-signals](master-skills/signal-outbound/.claude/skills/buying-signals/SKILL.md) | sub-skill | Which observable behaviours actually predict budget — engagement depth, seniority of engagement, hiring, funding, tech changes, and comment behaviour. | — |
| [**sdr-tools**](master-skills/sdr-tools/SKILL.md) | orchestrator | The SDR's working kit — agent prompts for research and drafting, team-wide writing rules, cold-call and no-show scripts, and the outbound metrics with a reverse-funnel calculator (outbound-metrics/scripts/pipeline-math.mjs). | — |
| ↳ [cold-call-scripts](master-skills/sdr-tools/.claude/skills/cold-call-scripts/SKILL.md) | sub-skill | Cold-call scripts that open with the reason for the call — a permission-based opener built on a signal, a 30-second reason, discovery questions, objection handling, a voicemail that pairs with an email, and a no-show recovery script. | — |
| ↳ [outbound-metrics](master-skills/sdr-tools/.claude/skills/outbound-metrics/SKILL.md) | sub-skill | Measure outbound on your own numbers — the funnel from send to opportunity, health thresholds (bounces, positive-reply share, show rate), and a reverse-funnel planner (scripts/pipeline-math.mjs) that turns a pipeline target into sends, people, and reps, and shows which rate is the most sensitive lever. | `pipeline-math.mjs` |
| ↳ [sdr-prompts](master-skills/sdr-tools/.claude/skills/sdr-prompts/SKILL.md) | sub-skill | Ready-to-use agent prompts for SDR work — account research brief, signal-to-message draft, reply triage and response, objection response, and meeting prep — each constrained to supplied facts so the agent never invents. | — |
| ↳ [sdr-writing-rules](master-skills/sdr-tools/.claude/skills/sdr-writing-rules/SKILL.md) | sub-skill | One page of writing rules for the whole SDR team — every message built on a signal, observation → idea → ask, short, plain, no slop, no fake familiarity, no auto-send — plus a self-edit checklist and before/after rewrites. | — |
| [**ai-search-visibility**](master-skills/ai-search-visibility/SKILL.md) | orchestrator | Get a B2B brand found, named, and cited by answer engines (ChatGPT, Perplexity, Gemini, Google AI Overviews, Claude) — AEO/GEO as a measurable loop, not a vibe. | — |
| ↳ [citation-check](master-skills/ai-search-visibility/.claude/skills/citation-check/SKILL.md) | sub-skill | Check a page (markdown or HTML) for citation-readiness — the structure that makes it easy for answer engines to extract and quote — and get specific fixes. | `citation-check.mjs` |
| ↳ [prompt-panel](master-skills/ai-search-visibility/.claude/skills/prompt-panel/SKILL.md) | sub-skill | Measure AI-search visibility with a prompt panel — a fixed set of real buyer questions run across answer engines on a schedule — and score it for mention rate, citation rate, share of voice, gaps, and the sources engines cite. | `panel-score.mjs` |

_72 skills · 13 orchestrators + 1 entry point · 8 runnable tools · generated by `scripts/build-catalog.mjs`_

<!-- catalog:end -->

</details>

## Quality bar

`npm test` runs every gate CI runs, on Node 18, 20, and 22:

| Gate | What it enforces |
|---|---|
| `scan-secrets` | No credential, key, token, or sensitive filename, ever |
| `validate-brand-safety` | Frontmatter, the `koka-first` block, and forbidden terms |
| `frontmatter` | `name`, `description`, `when_to_use`, `not_for`; name = directory |
| `internal-links` | No skill routes to a skill or file that doesn't exist |
| `data-accuracy` | Every restated benchmark, including the thresholds inside the tools, matches the canonical report |
| `no-unsourced-stats` | Every % and × figure in every skill and tool is in the canonical report, or registered with a reason |
| `tools` | Each tool's behaviour on its worked examples, including the classification and dedupe traps |
| `structure` | Every sub-skill is routed from its parent and from `koka`, every tool has a worked example, and the plugin manifest covers every skill |
| `install` | A real install into a temp dir: every skill is flattened and discoverable, and the persona travels |
| `catalog` | This README's catalog and badge counts match the skills that ship |

## FAQ

**Do I need an API key or a paid tool?**
No. The skills and tools run on files you already have: an engagement export, a contacts CSV, a signals sheet. Vendors are mentioned only as examples of a category.

**Does it scrape LinkedIn or send messages?**
No. It never scrapes, never automates LinkedIn, and never sends anything. It ranks, drafts, checks, and plans. A person reads and sends.

**Where do the numbers come from?**
From the LinkedIn Algorithm Report 2026 and nowhere else. A test fails the build on any % or × figure that isn't in the report, unless it's registered with a reason. Where the report has no data (ads, reply rates, AI search), the skills tell you to measure your own.

**Can I change the scoring?**
Yes. The headline rubric is a JSON file (`warm-list/scripts/taxonomy.json`), signal weights take `--weights`, and the ICP is a JSON file. Everything labelled a default is meant to be tuned to your won and lost deals.

**Does it work outside Claude Code?**
Every skill is a plain `SKILL.md` folder, and the installer can put them in any directory (`--target`). The tools are plain Node scripts that run anywhere.

**Can I contribute a skill?**
Yes. See [CONTRIBUTING.md](CONTRIBUTING.md) and the template in `templates/skill/`. One skill, one job. Cite the number or call it an estimate. Ship a worked example. `npm test` must pass.

## Want it run *for* you?

The skills are free. The work behind them is what you hire. Content engineering, audience and engagement audits, signal-led outbound design, and AEO/GEO teardowns: **[kokasexton.com](https://kokasexton.com)**.

## License

MIT. Use and adapt freely. See [LICENSE](LICENSE).
