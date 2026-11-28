# Changelog

Human-readable log of what changed and why. Newest first — one entry per daily-loop run.
Machine-readable cost/run log: `ops/spend.jsonl`.

## 2026-11-28 (doctor knows which pack you have, and if it is stale)

`scripts/doctor.mjs` now reads the install manifest and says which pack a skills folder holds (founder, sdr, investor, the full library, or a custom set), which skills are behind this checkout, which you edited locally (an update leaves those alone), and which are missing, with the exact update command. New read-only MCP tool `check_install` gives an agent the same answer for any folder, so it can tell a user "your sdr pack is two skills behind" and offer the fix. It never writes. Tests build real installs and cover current, locally edited, outdated and deleted cases, plus the MCP tool; README and `llms.txt` list the tool. No statistics. Model: openrouter/anthropic/claude-sonnet-5.5 (single voice; plumbing and tests, no new claims).

## 2026-11-28 (one-command onboarding)

New `scripts/setup.mjs` (also `install.mjs --guided`, `npm run setup`, or `npx github:kokasexton/koka-sexton-gtm-skills`): asks the user's role and MCP client, installs that pack, writes the MCP config with this checkout's real path (existing configs are merged and backed up, never replaced), runs a health check, and prints the role's starter prompts. New `scripts/doctor.mjs` checks Node, the checkout, installed skills, that the MCP server answers `tools/list`, and that any client config points at a server that exists, with one fix per failure. `package.json` gains `bin` entries so `npx` works; it stays `private`, so publishing to npm is a separate decision. The `koka` router now has a "First run" section that asks the user's role and offers the starter prompts, so plugin users get them without a pack install. `install.mjs` ends with the role's prompts and accepts `--update`. README leads with a Quick start and a per-client config table; `llms.txt` and the README now list every MCP tool, and a test fails if either drifts from what the server serves. No statistics. Model: openrouter/anthropic/claude-sonnet-5.5 (plumbing, docs and tests; no new claims).

## 2026-11-27 (first prompts where users see them)

The four starter prompts per role pack now appear in each pack walkthrough (new "Say this first" section) and in the note a pack install appends to the `koka` router, so an agent that loads the installed router can offer them without reading anything else. Tests fail if a guide or the installed note omits a prompt. No statistics. Model: openrouter/anthropic/claude-sonnet-5.5 (single voice; wording already shipped yesterday, plumbing plus tests).

## 2026-11-26 (first prompts per pack)

Each role pack now carries `first_prompts`: four plain sentences to say right after install (for example, "Rank my engagement export and tell me who to message first"), each tied to the pack skill that handles it. `get_pack` returns them, so an agent can tell a new user what to ask. Tests fail if a pack has fewer than three, a prompt contains a figure, or it points at a skill outside the pack. No statistics. Model: openrouter/anthropic/claude-sonnet-5.5 (single voice; config plus tests, no new claims).

## 2026-11-25 (pack guides reachable by agents)

Each role pack in `packs.json` now names its walkthrough (`guide`). The MCP tools `list_packs` and `get_pack` return it, and `get_pack` includes the full guide text, so an agent can install a pack and read how to use it without leaving the server. Tests now fail if a pack has no guide, the guide file is missing, or the guide never shows that pack's install command. No new statistics. Model: openrouter/anthropic/claude-sonnet-5.5 (single voice; plumbing plus tests).

## 2026-11-24 (investor pack walkthrough)

New `docs/investor-pack.md` walks an investor through the pack: `--pack investor` (20 skills installed), writing the thesis as a rubric, ranking with `signal-model` (2 Urgent, 2 Warming, 3 held by the fit gate on the example), adding account-level signals with `multi-signal`, and turning it into a shortlist. It links to the VCO guide for depth instead of repeating it. Every figure is output from the shipped fictional examples; the new `tests/investor-walkthrough.test.mjs` re-runs the engines so the doc fails CI if it drifts. All three role packs now have a walkthrough. No new external statistics. Model: openrouter/anthropic/claude-sonnet-5.5 (single voice; docs plus test, no new claims).

## 2026-11-23 (founder pack walkthrough)

New `docs/founder-pack.md` walks a founder through the pack: `--pack founder` (24 skills), the foundations, planning a month with `content-calendar` (18 posts, 4 a week), gating drafts with `content-evaluation` (BLOCK on the bad example, SHIP on the rewrite), and checking a batch with `month-of-posts`. Every figure is output from the shipped fictional examples, and the new `tests/founder-walkthrough.test.mjs` re-runs the engines so the doc fails CI if it drifts. README links it. No new external statistics. Model: openrouter/anthropic/claude-sonnet-5.5 (single voice; docs plus test, no new claims).

## 2026-11-22 (SDR pack walkthrough)

New `docs/sdr-pack.md` walks an SDR through the pack from install to send plan: `--pack sdr` (25 skills), ranking the example engagement export with `warm-list`, the skill-by-skill path from hook to follow-up, and planning volume with `outbound-metrics`. Every figure in it is output from the shipped fictional examples, and the new `tests/sdr-walkthrough.test.mjs` re-runs the engines so the doc fails CI if it drifts. No new external statistics. Model: openrouter/anthropic/claude-sonnet-5.5 (single voice; docs plus test, no new claims, so the cheap-model/second-voice split was not needed).

## 2026-11-21 (agent-native pack install)

The MCP server gained two tools, `list_packs` and `get_pack`, so an agent can discover the sdr / founder / investor bundles and get the exact skill set plus the install command without reading files (19 tools now). The skill set is computed the same way `install.mjs --pack` does it, and `tests/mcp.test.mjs` checks the two agree. Model: openrouter/anthropic/claude-sonnet-5.5 (single voice; code change, no new claims or figures).

## 2026-11-20 (installed skills stay self-contained)

New test `tests/portable-refs.test.mjs`: a skill may only point at files inside its own folder or at the shipped persona files (`KOKA.md`, `KOKA-FIRST.md`). Anything else breaks once the skill is installed on its own, which is exactly what role packs now do. It caught one real case: `linkedin-algorithm` named `lib/benchmark.mjs`, which isn't shipped with an install; it now points to the MCP tools instead. Model used: Claude Sonnet 5.5.

## 2026-11-19 (per-role packs)

New `packs.json` and `node scripts/install.mjs --pack <sdr|founder|investor>` install a role bundle instead of the whole library: 17, 20 and 13 hand-picked skills (plus `koka` and each skill's orchestrator, added automatically so routing never points at a missing skill). Who gets what is a Koka default, not data. New `tests/packs.test.mjs` checks every listed skill exists, each pack is a closed set, a real pack install lands exactly that set, and an unknown pack errors. Model: openrouter/anthropic/claude-sonnet-5.5 (single voice; deterministic code change, no new claims or figures).

---

## 2026-11-18 (benchmark lookup tables)

`linkedin-algorithm` now ships `references/benchmark-tables.md`: cadence, format, hashtag, length, timing and topic lookups. They are generated from `data/benchmarks.json` by `scripts/build-tables.mjs`, so they cannot drift from the report data. New `tests/benchmark-tables.test.mjs` fails if the committed tables go stale. Added a worked example and refreshed the README catalog. No new figures; everything comes from the existing dataset. Model: openrouter/anthropic/claude-sonnet-5.5 (single voice; mechanical, deterministic change).

---

## 2026-11-18 (three-part loop: linkedin-comment-warmer)

First run of the Audit, Improve, Prove loop (documented in `docs/self-improvement-loop.md`). Audit found `linkedin-comment-warmer` was the smallest skill in the library with no worked example or quality check. Improved: a five-question quality check, a failure-pattern list, a "draft nothing if there is no honest angle" rule, the sourced reason comments matter, and a fictional before/after example in `examples/`. Proved: new `tests/comment-examples.test.mjs` pins the example and the skill's checks, wired into `tests/run.mjs`. Uses only figures already in the canonical report. Illustrative fictional names.

---

## 2026-11-18 (Profile Relevance)

`linkedin-algorithm` gains a Profile Relevance section from LinkedIn Engineering's November 2026 post and Koka's write-up: the reader's profile is the query, posts are embedded from text, titles, transcripts and author metadata, and a post needs one reaction from outside the author's network before it is eligible. It carries LinkedIn's reported experiment results, five actions, a labelled external-research cadence note, and numbered sources. `linkedin-profile` now covers what LinkedIn reads (headline, summary, skills, role descriptions, education), adds a Skills row, a market in the headline example and a two-sentence position in the About, and says plainly that the sources don't show an author's own profile changing their posts' reach. The LinkedIn Engineering page itself could not be opened during this update, so its figures are taken as cited by Koka's article and Tutkit.

---

## 2026-11-17 (LinkedIn launch kit)

Eight skills added so a user can start one request and get a personalised LinkedIn launch kit. `linkedin-launch` orchestrates `profile-read` (reads the user's own profile in their signed-in browser, or from pasted text or a PDF, read-only), `positioning-statement`, `content-pillars`, `profile-rebuild`, `content-calendar`, `month-of-posts` and `dm-scripts`. Two zero-dependency tools: `content-calendar.mjs` (dates, local times, pillar rotation, no link posts, no Fridays) and `batch-lint.mjs` (per-post verdicts and unfilled placeholders, READY only if approved and clean). A full fictional example kit sits in `skills/linkedin-launch/examples/alex-rivera/`, and `docs/linkedin-launch.md` covers activation, the terms note for the browser step and troubleshooting. Nothing is posted, edited or sent for the user. Cadence and weights are labelled Koka defaults. No statistics.

---

## 2026-11-17 (VCO pack)

Four skills added from the Visibility Creates Opportunity method, built for investors and sellers on one engine. `signal-model` (with a zero-dependency tool, `scripts/signal-model.mjs`, and a worked example) scores people by follows, reaction depth, recency, coverage and account density, tiers them Cold to Urgent, and gates outreach on a second signal and on fit. `thesis-fit` writes an investor's thesis as a rankable fit rubric. `founder-shortlist` turns a tiered list into a partner-ready shortlist. `committee-map` maps the buying committee inside one target account. Weights and gates are labelled Koka defaults, not data. New behaviour pinned in `tests/tools.test.mjs`. Illustrative fictional data, no statistics.

---

## 2026-11-17

`ads-outbound-sync` now ships a worked example (`skills/ads-outbound-sync/examples/`): message-everyone-who-saw-the-ad next to real-signal filtering, a second scored signal, context for the SDR and a message about the topic, not the tracking. New test `outbound-sync-examples` pins the rules. Illustrative, no statistics. Model: anthropic/claude-sonnet-5.5 (single run, well under budget).

---

## 2026-11-16

`ads-optimization` now ships a worked example (`skills/ads-optimization/examples/`): a five-levers-at-once, judge-tomorrow report next to the diagnostic ladder in order, one logged change and an own-baseline comparison. New test `optimization-examples` pins the rules. Illustrative, no statistics. Model: anthropic/claude-sonnet-5.5 (single run, well under budget).

---

## 2026-11-15

`ads-measurement` now ships a worked example (`skills/ads-measurement/examples/`): a vanity-metric report next to full tracking setup, KPIs ordered outcome to input, both attribution views, a holdout and self-reported attribution. New test `measurement-examples` pins the rules. Illustrative, no statistics. Model: anthropic/claude-sonnet-5.5 (single run, well under budget).

## 2026-11-14

`ads-campaign-setup` now ships a worked example (`skills/ads-campaign-setup/examples/`): a tangle of mixed-objective campaigns on one audience next to a layered, tiered structure with one objective per campaign, wired retargeting, naming convention and pre-launch checklist. New test `setup-examples` pins the rules. Illustrative, no statistics. Model: anthropic/claude-sonnet-5.5 (single run, well under budget).

---

## 2026-11-13

`ads-bidding` now ships a worked example (`skills/ads-bidding/examples/`): an inflated manual bid, even budget split and bid-raise-on-spike setup next to one that picks strategy by situation, budgets by layer and tier, avoids thin spread and diagnoses before touching the bid. New test `bidding-examples` pins the rules. Illustrative, no statistics. Model: anthropic/claude-sonnet-5.5 (single run, well under budget).

---

## 2026-11-12

`ads-audiences` now ships a worked example (`skills/ads-audiences/examples/`): a title-list, expansion-on, single-campaign setup next to one that starts from a company list, layers function plus seniority, adds exclusions and retargeting pools, turns expansion off and checks the demographics report. New test `audience-examples` pins the rules. Illustrative, no statistics. Model: anthropic/claude-sonnet-5.5 (single run, well under budget).

---

## 2026-11-11

`ads-creative` now ships a worked example (`skills/ads-creative/examples/`): a stock-photo, single-version, never-refreshed plan next to one that sponsors an organic winner as a Thought Leader Ad, adds a teaching document ad, keeps message ads for warm audiences and sets a fatigue trigger. New test `creative-examples` pins the rules. Illustrative, no statistics. Model: anthropic/claude-sonnet-5.5 (single run, well under budget).

---

## 2026-11-10

`ads-copy` now ships a worked example (`skills/ads-copy/examples/`): a superlative-and-"Learn more" ad next to a rewrite that opens on a customer's own words, explains why in one sentence and makes one specific offer, plus two variants that change only the hook. New test `ads-examples` pins the rules. Illustrative quote, no statistics. Model: anthropic/claude-sonnet-5.5 (single run, well under budget).

---

## 2026-11-09

`linkedin-outreach-campaign` now ships a worked example (`skills/linkedin-outreach-campaign/examples/`): a pitch-in-the-first-message request next to a sub-200-character connection note with a real reason and a value-first first DM with no meeting ask. New test `outreach-examples` pins the rules. Illustrative names, no statistics. Model: anthropic/claude-sonnet-5.5 (single run, well under budget).

---

## 2026-11-08

`cold-call-scripts` now ships a worked example (`skills/cold-call-scripts/examples/`): a pitch-at-you opener next to a rewrite that says it's a cold call, asks for 30 seconds, leads with a signal and ends on a question, plus a sub-20-second voicemail. New test `call-examples` pins the rules. Illustrative names, no statistics. Model: anthropic/claude-sonnet-5.5 (single run).

---

## 2026-11-07

ATL and BTL messaging now ship worked before/after emails (`skills/atl-messaging/examples/`, `skills/btl-messaging/examples/`). Each "before" is the vendor-style email the linter blocks; each "after" follows the skill and lints READY. New test `messaging-examples` pins both, plus the word caps and the 26% figure's trace to the canonical algorithm skill. Names and posts are illustrative; no new statistics. Model: anthropic/claude-sonnet-5.5 (single run).

---

## 2026-11-06

`lint-email` no longer hides its rules in code. Word limits (first touch 120, follow-up 90), the fail multiplier, the subject-length cap and the slop-phrase list now live in `skills/cold-email/data/thresholds.json`, labelled as Koka house rules, not benchmark data. New test `email-threshold` pins the behaviour. `warm-list` already reads its `taxonomy.json`, so that backlog item is closed. Model: anthropic/claude-sonnet-5.5 (single run).

---

## 2026-11-05

`lint_post` now reads every threshold (hashtag band, overload point, long-form length, whitespace lift, hot-take and format medians) from `skills/linkedin-algorithm/data/benchmarks.json` instead of restating numbers in code. The linter and the benchmark engine share one source, so they can't disagree. New test `threshold-source` pins this; the old per-number restatement checks for lint-post were retired. Model: anthropic/claude-sonnet-5.5.

## 2026-11-04 — the tools now run over MCP

**Model: claude-sonnet-5.5 (single run, no bulk work needed).**
- The MCP server used to only *read* skills and score posts. It now also *runs* the 8 tools (9 MCP tools: post lint, email lint, citation check, pipeline rates and plan, list clean, signal score, warm list, panel score). Pass the draft or CSV as text; get the same result the CLI gives.
- Why: an agent-native install should let Cursor or Claude Desktop lint a draft or build a warm list directly, without shell access or file paths. Bad input returns a clean error rather than crashing the server.
- New `lib/tools.mjs` bridge, 11 new MCP tests fed from the shipped worked examples (15 tools total).

---

## 2026-11-03 — v2.0: the full GTM stack

**Manual build** (Claude Code session).
- **9 new orchestrators, 58 sub-skills, all original and written to `KOKA.md`:** `gtm-strategy` (4), `linkedin-content` (7 + owns `linkedin-algorithm`), `linkedin-ads` (8), `linkedin` (3 + `linkedin-comment-warmer`), `signal-sourcer` (9), `list-building` (6), `cold-email` (7), `personalization` (4), `sdr-tools` (4), plus `ai-search-visibility` (prompt panel, citation check) and the `koka` front door. Every skill from loop runs 1–2 is kept and wired in (`system.json`).
- **8 runnable, zero-dependency tools** with worked examples: `lint-post`, `lint-email`, `warm-list`, `signal-score`, `list-clean`, `pipeline-math`, `citation-check`, `panel-score`. Why: skills that *do* the work beat prose about it.
- **One classification rubric.** `warm-list.mjs` now implements the canonical rubric in `engagement-intelligence` (including `unclassified` instead of guessing).
- **New gate `no-unsourced-stats`:** every % or × figure in any skill or tool must be in the canonical report, or registered with a reason. Plus tests for tools, system structure (`system.json`), a real install, and README catalog sync. CI now runs on Node 18/20/22, plus the MCP test and the demo.
- `demo.mjs` groups skills by stage and shows the tools; README rebuilt around the system.

## 2026-11-03

**Loop run 2** — claude-sonnet-5.5 (single model, no bulk work needed; well under the $2 budget).
- `engagement-intelligence` now has a seniority/function classification rubric, a warm-list tiering rule (A/B/C/Out), and two worked examples. Why: the skill said "classify" without saying how, which made results inconsistent. Only figures already in the LinkedIn Algorithm Report (Marketing 21.6%, Sales 18.7%, Founders/CEOs 16.5%) are quoted.

**Bootstrap (manual)** — repo created and structured.
- Restructured into a real skill *system*: `master-skills/<orchestrator>/.claude/skills/<sub>/SKILL.md` + `resources/`.
- Added `KOKA.md` — the persona layer every skill inherits.
- Security: `scripts/scan-secrets.mjs`, `SECURITY.md`, hardened `.gitignore`, wired into CI.
- Flipped public after a full PII + secret audit (working tree and history) came back clean.

**Loop run 1** — deepseek-v4.1-flash (manual test).
- Added `tests/` (dependency-free Node runner) covering frontmatter, internal links, and data-accuracy (LinkedIn Algorithm numbers must match the canonical skill file). Wired into CI.
