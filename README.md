<p align="center"><img src=".claude-plugin/icon.png" width="96" alt=""></p>

<h1 align="center">Koka Sexton — GTM Skills</h1>

<p align="center"><b>A mini Koka you install into your code agent.</b><br>
The full B2B go-to-market stack as agent skills: strategy, LinkedIn content and ads, signals, list building, cold email, personalization, SDR tools, and AI search. Every benchmark is sourced and tested, and every tool runs.</p>

<p align="center">
<a href="https://github.com/kokasexton/koka-sexton-gtm-skills/actions/workflows/ci.yml"><img src="https://github.com/kokasexton/koka-sexton-gtm-skills/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
<img src="https://img.shields.io/badge/skills-72-6366f1" alt="72 skills">
<img src="https://img.shields.io/badge/runnable%20tools-8-ec4899" alt="8 tools">
<img src="https://img.shields.io/badge/dependencies-0-38bdf8" alt="zero dependencies">
<img src="https://img.shields.io/badge/license-MIT-111827" alt="MIT">
</p>

---

Most GTM skill libraries hand you opinions in a nice font, then ask for an API key. This one is different in four ways:

1. **Every number has a source, and a test enforces it.** Benchmarks come from the *LinkedIn Algorithm Report 2026* (2,279 posts, 246 creators, 3,780 engagers). Any % or × figure in any skill that isn't in the canonical report fails CI, unless it's registered with a reason (a worked example's output, or a labelled Koka default). Where there's no data, such as ads or reply rates, the skills tell you to measure your own and give you the tool to do it.
2. **Skills that do the work.** Eight zero-dependency Node tools ship inside the skills: a post linter, an email linter, a warm-list engine, a multi-signal account scorer, a list cleaner and de-duplicator, a pipeline calculator, an AI-citation checker, and a prompt-panel scorer.
3. **A system, not a folder.** A front-door `koka` skill sends each ask to one of thirteen orchestrators, and each orchestrator calls focused sub-skills. They share one persona (`KOKA.md`) and one set of defaults (`KOKA-FIRST.md`).
4. **No vendor lock-in.** No paid API, no account, and no "upgrade to unlock". Tools are named only as examples of a category. Where the work goes beyond a skill run, it says so plainly and points to Koka.

## What's inside

| Area | Orchestrator | Sub-skills | Tool |
|---|---|---|---|
| **Cold Email** | `cold-email` | 7: ATL and BTL messaging, first touch, follow-up, email personalization, re-engagement, subject lines | `lint-email.mjs` |
| **LinkedIn Ads** | `linkedin-ads` | 8: audiences, campaign setup, creative, copy, bidding, measurement, ads→outbound sync, optimization | — |
| **LinkedIn Content** | `linkedin-content` | 7 + the canonical data: hooks, storytelling, formats, scheduling, engagement, CTA, repurposing, linkedin-algorithm | `lint-post.mjs` |
| **List Building** | `list-building` | 6: define ICP, source companies, find contacts, qualify accounts, clean & validate, deduplicate | `list-clean.mjs` |
| **Signal Sourcer** | `signal-sourcer` | 9: job changes, funding, hiring, website visitors, company events, tech changes, competitor signals, content engagement, multi-signal | `signal-score.mjs` |
| **GTM Strategy** | `gtm-strategy` | 4: principles, outreach motions, sales triggers, GTM plays | — |
| **Personalization** | `personalization` | 4: sources, hooks, at scale (AI, no fabrication), QA | — |
| **LinkedIn** | `linkedin` | 3: profile, outreach campaign, safety and limits | — |
| **SDR Tools** | `sdr-tools` | 4: agent prompts, writing rules, cold-call scripts, outbound metrics | `pipeline-math.mjs` |
| Engagement intelligence | `engagement-intelligence` | warm list | `warm-list.mjs` |
| Signal → pipeline | `signal-outbound` | buying signals | — |
| Content system | `content-engineer` | content evaluation | — |
| AI search (AEO/GEO) | `ai-search-visibility` | prompt panel, citation check | `panel-score.mjs`, `citation-check.mjs` |

## Install

**Claude Code plugin (recommended)**

```
/plugin marketplace add kokasexton/koka-sexton-gtm-skills
/plugin install koka-gtm@koka-sexton
```

**Any agent with a skills folder** (Claude Code, Cursor, Codex, or your own harness):

```bash
git clone https://github.com/kokasexton/koka-sexton-gtm-skills
node koka-sexton-gtm-skills/scripts/install.mjs                     # → ~/.claude/skills
node koka-sexton-gtm-skills/scripts/install.mjs --project           # → ./.claude/skills
node koka-sexton-gtm-skills/scripts/install.mjs --target <dir>      # → anywhere
```

The installer flattens the nested source layout so every skill is discoverable, and it copies the persona layer into `koka/`. Requires Node 18+. There's no `npm install`, because there are no dependencies.

Then ask your agent: *"Use the koka skill. Here's our engager export: who do we talk to first?"*

## Try the tools in 60 seconds

Clone the repo, then run the tools on the worked examples bundled with the skills (fictional companies, real benchmarks).

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

It reads headlines the way a person would: *"I help founders scale | Fractional CMO | Ex-VP Sales"* is c-suite and flagged fractional, not VP. *"Executive Assistant to the CEO"* is not the CEO.

**What will it take to hit the number, and what should we fix first?**

```bash
node master-skills/sdr-tools/.claude/skills/outbound-metrics/scripts/pipeline-math.mjs plan \
  master-skills/sdr-tools/.claude/skills/outbound-metrics/examples/plan.json
```

```
Plan: 30 opportunities → 7465 sends · 2489 people · 2.5 reps
Where one point matters most: delivered → replied (now 5.1%): 1224 fewer sends
```

It has no built-in "industry average" rates, so it won't plan until you give it your own numbers.

Also included: `lint-post.mjs` (LinkedIn drafts vs. the report), `list-clean.mjs` (merges the same person across email, LinkedIn URL, and name + domain, even with accents), `citation-check.mjs`, and `panel-score.mjs` (AI search).

## The system

```
 gtm-strategy ─ decides the motion, the ICP, the plays
      │
 linkedin-content · content-engineer · linkedin-ads · ai-search-visibility ──▶ attention
      │                                                                          │
      │                    engagement-intelligence + signal-sourcer ◀────────────┘
      │                    (who's in the room · who's in-market now)
      │                                  │
      │        list-building → personalization → cold-email · linkedin · sdr-tools
      │                                  │
      └───────────── measurement: who engaged, who replied, what became pipeline
```

Content earns attention. Engagement and signals show who's ready. Outreach is written to the signal. Measurement feeds back into what you publish and who you target. `koka` is the front door to all of it.

## Catalog

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

## Built on

- **The LinkedIn Algorithm Report 2026**: 2,279 posts, 246 creators, 3,780 engagers, 49,501 reactions, 15,517 comments, May 2025–June 2026 (data by SignalScout). The canonical numbers live in [`linkedin-algorithm`](master-skills/linkedin-content/.claude/skills/linkedin-algorithm/SKILL.md), and every other skill must match them. Full report: [kokasexton.com/insights](https://kokasexton.com/insights).
- **The Content Engineering Stack**: a six-layer loop (source → knowledge → generation → evaluation → distribution → measurement).
- **Engagement intelligence**: classify every engager off their own headline, then read the room by ICP fit.

Where there's no data, the skills say so. Scoring weights, timing windows, and thresholds are labelled *Koka's defaults, not report data*. The ads, outbound, and AI-search skills quote no industry statistics: you measure your own, and the tools do the math.

## Quality bar

`npm test` runs every gate CI runs:

| Gate | What it enforces |
|---|---|
| `scan-secrets` | No credential, key, token, or sensitive filename, ever |
| `validate-brand-safety` | Frontmatter, the `koka-first` block, and forbidden terms |
| `frontmatter` | `name`, `description`, `when_to_use`, `not_for`; name = directory |
| `internal-links` | No skill routes to a skill or file that doesn't exist |
| `data-accuracy` | Every restated benchmark, including the thresholds inside the tools, matches the canonical report |
| `no-unsourced-stats` | Every % and × figure in every skill and tool is in the canonical report, or registered with a reason |
| `tools` | Each tool's behaviour on its worked examples, including the classification traps |
| `structure` | Every sub-skill is routed from its parent, every tool has a worked example, and the plugin manifest covers every skill |
| `install` | A real install into a temp dir: every skill is flattened and discoverable, and the persona travels |
| `catalog` | This README's catalog matches the skills that ship |

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md). The short version: one skill, one job. Cite the number or call it an estimate. Ship a worked example. `npm test` must pass.

## Want it run *for* you?

The skills are free. The work behind them is what you hire. Content engineering, audience and engagement audits, and AEO/GEO teardowns: **[kokasexton.com](https://kokasexton.com)**.

## License

MIT. Use and adapt freely. See [LICENSE](LICENSE).
