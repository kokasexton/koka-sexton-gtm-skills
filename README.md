<p align="center"><img src=".claude-plugin/icon.png" width="96" alt=""></p>

<h1 align="center">Koka Sexton — GTM Skills</h1>

<p align="center"><b>A mini Koka you install into your code agent.</b><br>
B2B go-to-market skills that run on evidence: every benchmark is sourced and tested, every tool runs.</p>

<p align="center">
<a href="https://github.com/kokasexton/koka-sexton-gtm-skills/actions/workflows/ci.yml"><img src="https://github.com/kokasexton/koka-sexton-gtm-skills/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
<img src="https://img.shields.io/badge/skills-14-6366f1" alt="14 skills">
<img src="https://img.shields.io/badge/runnable%20tools-4-ec4899" alt="4 tools">
<img src="https://img.shields.io/badge/dependencies-0-38bdf8" alt="zero dependencies">
<img src="https://img.shields.io/badge/license-MIT-111827" alt="MIT">
</p>

---

Most GTM prompt libraries hand you opinions in a nice font. This one is different in four ways:

1. **Every number has a source, and a test enforces it.** Benchmarks come from the *LinkedIn Algorithm Report 2026* (2,279 posts, 246 creators, 3,780 engagers). If a skill restates a number that drifts from the canonical copy, CI fails.
2. **Skills that do the work, not just describe it.** Four zero-dependency Node tools ship inside the skills: a post linter, a warm-list engine, an AI-citation checker, and a prompt-panel scorer. Your agent runs them on your data.
3. **A system, not a folder.** A front-door `koka` skill sends each ask to one of four orchestrators, and each orchestrator calls focused sub-skills. They share one persona (`KOKA.md`) and one set of defaults (`KOKA-FIRST.md`).
4. **An honest funnel.** It's free and useful on its own. Where the work goes beyond a skill run, it says so plainly and points to Koka.

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

Clone the repo, then run the tools on the worked examples bundled with the skills (fictional companies, real benchmarks):

```bash
node master-skills/content-engineer/.claude/skills/content-evaluation/scripts/lint-post.mjs \
  master-skills/content-engineer/.claude/skills/content-evaluation/examples/before.md
```

```
Verdict: BLOCK  (4 fail, 4 warn)

✗ FAIL  [hashtags] 7 hashtags. 6+ drops median engagement to 33 (−63%). Use 1–2.
✗ FAIL  [link-in-body] Link in the post body. Links get buried — put it in the first comment or a document.
✗ FAIL  [engagement-bait] Engagement bait: "Comment "YES" below". Formulaic CTAs and pod tactics are penalised.
✗ FAIL  [slop] Slop phrases: "in today's fast-paced", "game-changer", "unlock the power". Cut them.
! WARN  [hot-take] Reads as a hot take. Hot takes underperform (median 54, −29%). Teach the shift, don't provoke.
```

```bash
node master-skills/engagement-intelligence/.claude/skills/warm-list/scripts/warm-list.mjs \
  master-skills/engagement-intelligence/.claude/skills/warm-list/examples/engagement.csv \
  --icp master-skills/engagement-intelligence/.claude/skills/warm-list/examples/icp.json --as-of 2026-10-31
```

```
- 10 unique engagers · 60% Director+ (report baseline: 33% — you are above)
- Director+ among commenters 100% vs non-commenters 33% (report: commenters skew 26% more senior)
- Tiers: P0 3 · P1 4 · P2 0 · P3 3

| P0 | Dana Okafor | vp · marketing | Northwind Analytics | 1 | 2 comments (2 substantive) · 3 posts · REGULAR · ACCOUNT CLUSTER | Regular-engager DM … |
| P0 | Tom Becker  | c-suite · marketing |               | 0.8 | 1 comment (1 substantive) · FRACTIONAL | Warm-signal DM … |
```

Note what it reads correctly: *"I help founders scale | Fractional CMO | Ex-VP Sales"* is classified as c-suite and flagged fractional, not VP. *"Executive Assistant to the CEO"* is not the CEO. *"Great post!"* from a founder is not a P0.

```bash
node master-skills/ai-search-visibility/.claude/skills/prompt-panel/scripts/panel-score.mjs \
  master-skills/ai-search-visibility/.claude/skills/prompt-panel/examples/panel.csv --brand Northwind
```

```
9 answers · mentioned in 56% · cited (linked) in 33%
| solution | 3 | 0% | 0% |        ← invisible exactly where buyers choose a category
Gaps — competitors appear, you don't:
- [solution] "best tools to turn linkedin engagement into pipeline" → Rivalscope, Signalbase
```

## The system

```
                              ┌──────────── koka (start here) ────────────┐
                              ▼                     ▼                     ▼
  content-engineer ──publishes──▶ posts & pages ──engagement──▶ engagement-intelligence
        ▲                              │                                  │
        │                     ai-search-visibility                 warm-list  (P0–P3)
        │                     (found & cited by AI)                       │
        └───────────── measurement: who engaged, who was cited ◀── signal-outbound
```

Content earns attention. Engagement shows who's in the room. Signals turn the right people into conversations. Measurement feeds back into what you publish next.

## Catalog

<!-- catalog:start -->

| Skill | Type | What it does | Runnable tool |
|---|---|---|---|
| [**koka**](master-skills/koka/SKILL.md) | entry point | Start here — the mini Koka, the persona layer and front door to the whole GTM skill system. | — |
| [**content-engineer**](master-skills/content-engineer/SKILL.md) | orchestrator | Design and run the system that produces, evaluates, distributes, and improves content — the six-layer content loop. | — |
| ↳ [content-evaluation](master-skills/content-engineer/.claude/skills/content-evaluation/SKILL.md) | sub-skill | The evaluation gate in the content loop — lint a LinkedIn draft against the 2026 benchmark data and Koka's voice rules before it ships, then fix exactly what fails. | `lint-post.mjs` |
| ↳ [linkedin-algorithm](master-skills/content-engineer/.claude/skills/linkedin-algorithm/SKILL.md) | sub-skill | The 2026 LinkedIn algorithm data and playbook — cadence, formats, timing, hashtags, comment strategy, funnel metrics, and the 6-rule operating guide. | — |
| [**engagement-intelligence**](master-skills/engagement-intelligence/SKILL.md) | orchestrator | Capture a company's or executive's public LinkedIn network, classify every engager off their own headline, and read the room by ICP fit, seniority, industry, and geography. | — |
| ↳ [warm-list](master-skills/engagement-intelligence/.claude/skills/warm-list/SKILL.md) | sub-skill | Turn a raw export of post engagement into a ranked, tiered warm list. | `warm-list.mjs` |
| [**signal-outbound**](master-skills/signal-outbound/SKILL.md) | orchestrator | Score engagement and buying signals, pick the play, and build an outreach sequence from real behaviour instead of a cold list. | — |
| ↳ [buying-signals](master-skills/signal-outbound/.claude/skills/buying-signals/SKILL.md) | sub-skill | Which observable behaviours actually predict budget — engagement depth, seniority of engagement, hiring, funding, tech changes, and comment behaviour. | — |
| ↳ [cold-email](master-skills/signal-outbound/.claude/skills/cold-email/SKILL.md) | sub-skill | Write signal-led cold email that doesn't read like a template — one observation, one idea, one ask, no fake familiarity. | — |
| ↳ [gtm-plays](master-skills/signal-outbound/.claude/skills/gtm-plays/SKILL.md) | sub-skill | Repeatable go-to-market plays per channel — LinkedIn, cold email, content, and ABM — each with the signal it needs, the sequence, and the metric that proves it worked. | — |
| ↳ [personalization](master-skills/signal-outbound/.claude/skills/personalization/SKILL.md) | sub-skill | Personalisation that is real — built on an observed signal, not a mail-merge field. | — |
| [**ai-search-visibility**](master-skills/ai-search-visibility/SKILL.md) | orchestrator | Get a B2B brand found, named, and cited by answer engines (ChatGPT, Perplexity, Gemini, Google AI Overviews, Claude) — AEO/GEO as a measurable loop, not a vibe. | — |
| ↳ [citation-check](master-skills/ai-search-visibility/.claude/skills/citation-check/SKILL.md) | sub-skill | Check a page (markdown or HTML) for citation-readiness — the structure that makes it easy for answer engines to extract and quote — and get specific fixes. | `citation-check.mjs` |
| ↳ [prompt-panel](master-skills/ai-search-visibility/.claude/skills/prompt-panel/SKILL.md) | sub-skill | Measure AI-search visibility with a prompt panel — a fixed set of real buyer questions run across answer engines on a schedule — and score it for mention rate, citation rate, share of voice, gaps, and the sources engines cite. | `panel-score.mjs` |

_14 skills · 4 orchestrators + 1 entry point · 4 runnable tools · generated by `scripts/build-catalog.mjs`_

<!-- catalog:end -->

## Built on

- **The LinkedIn Algorithm Report 2026**: 2,279 posts, 246 creators, 3,780 engagers, 49,501 reactions, 15,517 comments, May 2025–June 2026 (data by SignalScout). The canonical numbers live in [`linkedin-algorithm`](master-skills/content-engineer/.claude/skills/linkedin-algorithm/SKILL.md), and every other skill must match them. Full report: [kokasexton.com/insights](https://kokasexton.com/insights).
- **The Content Engineering Stack**: a six-layer loop (source → knowledge → generation → evaluation → distribution → measurement).
- **Engagement intelligence**: classify every engager off their own headline, then read the room by ICP fit.

Where there's no data, the skills say so. The warm-list weights are labelled *Koka's defaults, not report data*. The AI-search skills quote no industry statistics, so you measure your own.

## Quality bar

`npm test` runs every gate CI runs:

| Gate | What it enforces |
|---|---|
| `scan-secrets` | No credential, key, token, or sensitive filename, ever |
| `validate-brand-safety` | Frontmatter, the `koka-first` block, and forbidden terms |
| `frontmatter` | `name`, `description`, `when_to_use`, `not_for`; name = directory |
| `internal-links` | No skill routes to a skill or file that doesn't exist |
| `data-accuracy` | Every restated benchmark, including the thresholds inside the tools, matches the canonical report |
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
