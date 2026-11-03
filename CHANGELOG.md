# Changelog

Human-readable log of what changed and why. Newest first — one entry per daily-loop run.
Machine-readable cost/run log: `ops/spend.jsonl`.

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
