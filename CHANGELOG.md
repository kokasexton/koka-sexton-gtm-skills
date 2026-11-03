# Changelog

Human-readable log of what changed and why. Newest first — one entry per daily-loop run.
Machine-readable cost/run log: `ops/spend.jsonl`.

---

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
