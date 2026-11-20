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
- [x] (2026-11-20, tests/portable-refs.test.mjs) Flag skill references to files outside the skill layer; fixed the one dangling `lib/benchmark.mjs` pointer
- [ ] Next: per-pack worked walkthrough (`docs/`) showing an SDR install end to end; agent-native install check (`--pack` verified via MCP)
- [x] Worked examples for every skill that ships a tool (`examples/`), pinned by `tests/tools.test.mjs`
- [x] (2026-11-07, pinned by tests/messaging-examples.test.mjs) Worked examples for ATL/BTL messaging
- [x] (2026-11-08, tests/call-examples.test.mjs) Worked examples for cold-call-scripts
- [x] (2026-11-09, tests/outreach-examples.test.mjs) Worked examples for linkedin-outreach-campaign
- [x] (2026-11-10, tests/ads-examples.test.mjs) Worked examples for ads-copy; other ads-* skills remain
- [x] (2026-11-11, tests/creative-examples.test.mjs) Worked examples for ads-creative; ads-bidding, ads-campaign-setup, ads-measurement, ads-optimization remain
- [x] (2026-11-12, tests/audience-examples.test.mjs) Worked examples for ads-audiences; ads-bidding, ads-campaign-setup, ads-measurement, ads-optimization remain
- [x] (2026-11-13, tests/bidding-examples.test.mjs) Worked examples for ads-bidding; ads-campaign-setup, ads-measurement, ads-optimization remain
- [x] (2026-11-14, tests/setup-examples.test.mjs) Worked examples for ads-campaign-setup; ads-measurement, ads-optimization remain
- [x] (2026-11-15, tests/measurement-examples.test.mjs) Worked examples for ads-measurement; ads-optimization remains
- [x] (2026-11-16, tests/optimization-examples.test.mjs) Worked examples for ads-optimization — all ads-* skills now covered
- [x] (2026-11-17, tests/outbound-sync-examples.test.mjs) Worked example for ads-outbound-sync — every ads-* skill covered
- [x] (2026-11-18, tests/benchmark-tables.test.mjs) Benchmark tables (cadence / format / hashtag lookups) generated from the dataset
- [x] Expand `engagement-intelligence` with a classification rubric (seniority/function taxonomy) — done 2026-11-03
- [x] `content-evaluation`, `ai-search-visibility` (`prompt-panel`, `citation-check`), signal scoring (`multi-signal`, `warm-list`)
- [x] v2 full stack: 13 orchestrators, 8 tools, `system.json`, `no-unsourced-stats` gate
- [x] Expose the 8 tools through the MCP server (so MCP clients can run them, not just read the skills)
- [x] Make `lint-post.mjs` read thresholds from `skills/linkedin-algorithm/data/benchmarks.json`
- [x] Benchmark tables: see above
- [x] (2026-11-19, tests/packs.test.mjs) Per-role packs (SDR, founder, investor) via `install.mjs --pack`
- [ ] Next: expose packs through the MCP server and the Claude Code plugin; add a pack-specific "start here" note per role
- [x] Install paths: MCP server, Claude Code plugin + marketplace, `scripts/install.mjs`
- [x] (2026-11-05, pinned by tests/threshold-source.test.mjs) `lint_post` / `linkedin_benchmark` share one threshold source (benchmarks.json)
- [x] (2026-11-06) `lint-email` thresholds + slop list in `skills/cold-email/data/thresholds.json`, pinned by tests/email-threshold.test.mjs; `warm-list` already reads `taxonomy.json`
- [ ] Accuracy pass: re-verify every stat against the canonical source

## The three-part skill loop

A tighter loop for improving one skill at a time. Run it on any skill; the log below records each run.

| Part | Question | Output |
|---|---|---|
| **1. Audit** | Where does this skill fall short of the repo's own bar? Compare it with the skills that ship examples, tools or checks, and with the newest sourced facts. | A short gap list: missing example, missing quality check, stale or unsourced claims, thin routing |
| **2. Improve** | What is the smallest change that closes the biggest gap? One skill, one change. | Edited `SKILL.md` (rubric, rules, sourced references) and a fictional worked example in `examples/` |
| **3. Prove** | Does a test fail if the improvement is undone? | A pinned `tests/<name>-examples.test.mjs`, a passing `npm test`, a changelog entry and a log line here |

Rules: never fabricate a number or a source, keep first sentences of descriptions stable so the catalog doesn't churn, and fictional names only in examples.

### Loop log

- **2026-11-18, `linkedin-comment-warmer`.** Audit: smallest skill in the library (about 2 KB), no worked example, no quality check, no list of failure patterns. Improve: added a five-question quality check, a "what to avoid" list, a rule to draft nothing when there is no honest angle, the sourced reason comments matter, and a fictional before/after example. Prove: `tests/comment-examples.test.mjs` pins the example and the skill's checks. Next candidates by size: `linkedin-engager-analytics`, `post-formats`, `tech-changes`.

## Guardrails

- Never fabricate a statistic or a source.
- Human gate on anything that changes positioning or the funnel's public claims.
- One change at a time so the effect is legible.
- Publishing stays reversible (private repo; public only on explicit approval).
