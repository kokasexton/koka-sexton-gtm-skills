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
- `tests/` content checks pass:
  - every `SKILL.md` has valid frontmatter (`name`, `description`, `when_to_use`, `not_for`)
  - every `SKILL.md` carries the `<!-- koka-first -->` block
  - no skill links to a missing file or a dead internal path
  - **data-accuracy check** — numbers quoted from the LinkedIn Algorithm Report match `skills/linkedin-algorithm/SKILL.md` (the canonical copy)
  - no fabricated statistics (any number must trace to a source cited in the skill)

## Backlog

- [x] Content tests (frontmatter, koka-first, data-accuracy) wired into CI — `tests/run.mjs` (frontmatter + internal links + data accuracy), run by `brand-safety.yml`
- [ ] Extend internal-link test to flag references to files outside the skill layer (README/landing copy)
- [x] Worked examples for every skill that ships a tool (`examples/`), pinned by `tests/tools.test.mjs`
- [x] (2026-11-07, pinned by tests/messaging-examples.test.mjs) Worked examples for ATL/BTL messaging
- [x] (2026-11-08, tests/call-examples.test.mjs) Worked examples for cold-call-scripts
- [x] (2026-11-09, tests/outreach-examples.test.mjs) Worked examples for linkedin-outreach-campaign
- [x] (2026-11-10, tests/ads-examples.test.mjs) Worked examples for ads-copy; other ads-* skills remain
- [x] (2026-11-11, tests/creative-examples.test.mjs) Worked examples for ads-creative; ads-bidding, ads-campaign-setup, ads-measurement, ads-optimization remain
- [x] (2026-11-12, tests/audience-examples.test.mjs) Worked examples for ads-audiences; ads-bidding, ads-campaign-setup, ads-measurement, ads-optimization remain
- [x] (2026-11-13, tests/bidding-examples.test.mjs) Worked examples for ads-bidding; ads-campaign-setup, ads-measurement, ads-optimization remain
- [x] (2026-11-14, tests/setup-examples.test.mjs) Worked examples for ads-campaign-setup; ads-measurement, ads-optimization remain
- [x] Expand `engagement-intelligence` with a classification rubric (seniority/function taxonomy) — done 2026-11-03
- [x] `content-evaluation`, `ai-search-visibility` (`prompt-panel`, `citation-check`), signal scoring (`multi-signal`, `warm-list`)
- [x] v2 full stack: 13 orchestrators, 8 tools, `system.json`, `no-unsourced-stats` gate
- [x] Expose the 8 tools through the MCP server (so MCP clients can run them, not just read the skills)
- [x] Make `lint-post.mjs` read thresholds from `skills/linkedin-algorithm/data/benchmarks.json`
- [ ] Benchmark tables: cadence / format / hashtag lookups as reusable references
- [x] Install paths: MCP server, Claude Code plugin + marketplace, `scripts/install.mjs`
- [x] (2026-11-05, pinned by tests/threshold-source.test.mjs) `lint_post` / `linkedin_benchmark` share one threshold source (benchmarks.json)
- [x] (2026-11-06) `lint-email` thresholds + slop list in `skills/cold-email/data/thresholds.json`, pinned by tests/email-threshold.test.mjs; `warm-list` already reads `taxonomy.json`
- [ ] Accuracy pass: re-verify every stat against the canonical source

## Guardrails

- Never fabricate a statistic or a source.
- Human gate on anything that changes positioning or the funnel's public claims.
- One change at a time so the effect is legible.
- Publishing stays reversible (private repo; public only on explicit approval).
