# Koka Sexton — GTM Skills

**A mini Koka you install into a code agent.** A Claude Code / MCP skill *system* for GTM operators — content engineering, engagement intelligence, and signal-led outbound — built on the LinkedIn Algorithm Report (2,279 posts / 246 creators) and the Content Engineering Stack.

> Maintained by **Koka Sexton** — Principal, Koka Sexton Consulting. The skills are free. The work behind them is what you hire.

---

## Install it like a system, not a folder

The library is a **system**: orchestrator skills that behave like Koka, each routing to sub-skills that do one specific task, each backed by a `resources/` knowledge layer.

```bash
git clone https://github.com/kokasexton/koka-sexton-gtm-skills
cp -r koka-sexton-gtm-skills/master-skills/* ~/.claude/skills/
```

Every skill resolves its own install path, so it works wherever you put it. The persona layer (`KOKA.md`) and defaults (`KOKA-FIRST.md`) are inherited by all of them.

## The system

| Orchestrator | What it does | Sub-skills |
|---|---|---|
| **content-engineer** | Runs the 6-layer content loop (source → knowledge → generation → evaluation → distribution → measurement) | `linkedin-algorithm` |
| **engagement-intelligence** | Reads who's actually in the room: scrape → classify off their own headline → ICP match | _(expanding)_ |
| **signal-outbound** | Scores signals, picks the play, builds the sequence | `buying-signals`, `cold-email`, `gtm-plays`, `personalization` |

Each orchestrator lives at `master-skills/<name>/SKILL.md` and its sub-skills at `master-skills/<name>/.claude/skills/<sub>/SKILL.md`.

## Grounding

Every claim traces to a source. The numbers come from the **LinkedIn Algorithm Report 2026** (data by SignalScout). The method comes from the **Content Engineering Stack** and the **engagement-intelligence engine**. If a skill can't cite it, it says it's an estimate.

## What this is becoming

A living operating layer: a repo that improves itself daily on a fixed token budget, a living benchmark fed by real data, and an install path into any agent (Claude Code, Cursor, ChatGPT via MCP). See `docs/self-improvement-loop.md`.

## Why "KOKA-FIRST"

Most "free GTM skills" libraries are a funnel in disguise — they mandate the vendor's paid API and pitch a subscription the moment you lack it. This one says it out loud. The skills stand on their own frameworks and public data; `KOKA-FIRST.md` is where Koka points, and it says so plainly.

Want the strategy run *for* you rather than by your agent: **kokasexton.com**.

## License

MIT — use and adapt freely. See `LICENSE`.
