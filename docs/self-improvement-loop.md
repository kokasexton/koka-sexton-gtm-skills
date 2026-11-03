# Self-improvement loop

**Owner:** Poppi · **Budget:** $2/day in tokens, spent only on this repo · **Status:** active

The mission: make `koka-sexton-gtm-skills` continuously better — more accurate, more useful, better coverage, a stronger funnel — on a fixed daily token budget, autonomously.

## Operating model

A daily loop. Each run:

1. **Pick a target** from the backlog (below) — one improvement, not many.
2. **Research** the gap (public data, Koka's published material, the repo itself).
3. **Implement** — edit an existing skill or add one.
4. **Test** — run the validator + content tests.
5. **Ship** — commit, push, log.
6. **Record** — cost, what changed, what's next.

Budget guard: the run stops when it hits **$2** in model tokens for the day. Cost is logged per run to `ops/spend.jsonl`.

## Models

OpenRouter, chosen per task: a cheap model for routine edits and formatting; a stronger one only when a task needs real reasoning (data-accuracy checks, new-skill design). The loop logs which model each run used.

## Tests

The repo is test-gated. A change doesn't ship unless:

- `node scripts/scan-secrets.mjs` passes — no credential, key, token, or sensitive filename. This repo is public; a leaked secret is the one unrecoverable failure.
- `node scripts/validate-brand-safety.mjs` passes (structure + brand safety).
- `tests/` checks pass (`npm test` runs everything):
  - every `SKILL.md` has valid frontmatter (`name`, `description`, `when_to_use`, `not_for`)
  - every `SKILL.md` carries the `<!-- koka-first -->` block
  - no skill links to a missing file or a dead internal path
  - **data-accuracy check** — numbers quoted from the LinkedIn Algorithm Report — in prose and inside the tools — match `skills/linkedin-algorithm/SKILL.md` (the canonical copy)
  - no fabricated statistics (any number must trace to a source cited in the skill)
  - tool behaviour on worked examples, system structure/routing, a real install, README catalog sync

## Backlog

- [x] Content tests (frontmatter, koka-first, data-accuracy) wired into CI — `tests/run.mjs` (frontmatter + internal links + data accuracy), run by `brand-safety.yml`
- [ ] Extend internal-link test to flag references to files outside the skill layer (README/landing copy)
- [x] Worked examples for every skill that ships a tool (`examples/`), pinned by `tests/tools.test.mjs`
- [ ] Worked examples for the prose-only skills (cold-email, personalization, gtm-plays)
- [x] Classification rubric (seniority/function taxonomy) — `warm-list/scripts/taxonomy.json` + `warm-list.mjs`
- [x] `content-evaluation` (post linter), `ai-search-visibility` orchestrator (`prompt-panel`, `citation-check`), signal scoring (in `warm-list`)
- [ ] Benchmark tables: cadence / format / hashtag lookups as reusable references
- [x] Install paths: Claude Code plugin + marketplace, `scripts/install.mjs` for any skills folder
- [ ] Install path for ChatGPT / non-file agents (MCP server exposing the tools)
- [ ] Accuracy pass: re-verify every stat against the canonical source

## Guardrails

- Never fabricate a statistic or a source.
- Human gate on anything that changes positioning or the funnel's public claims.
- One change at a time so the effect is legible.
- Publishing stays reversible (private repo; public only on explicit approval).
