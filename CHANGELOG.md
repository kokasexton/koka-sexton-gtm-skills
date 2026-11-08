# Changelog

Human-readable log of what changed and why. Newest first — one entry per daily-loop run.
Machine-readable cost/run log: `ops/spend.jsonl`.

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
