# Changelog

Human-readable log of what changed and why. Newest first — one entry per daily-loop run.
Machine-readable cost/run log: `ops/spend.jsonl`.

---

## 2026-11-03

**Bootstrap (manual)** — repo created and structured.
- Restructured into a real skill *system*: `master-skills/<orchestrator>/.claude/skills/<sub>/SKILL.md` + `resources/`.
- Added `KOKA.md` — the persona layer every skill inherits.
- Security: `scripts/scan-secrets.mjs`, `SECURITY.md`, hardened `.gitignore`, wired into CI.
- Flipped public after a full PII + secret audit (working tree and history) came back clean.

**Loop run 1** — deepseek-v4.1-flash (manual test).
- Added `tests/` (dependency-free Node runner) covering frontmatter, internal links, and data-accuracy (LinkedIn Algorithm numbers must match the canonical skill file). Wired into CI.
