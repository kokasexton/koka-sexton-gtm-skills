# Koka Sexton — GTM Skills

**Skills that turn a code agent into a GTM operator.** Drop-in Claude Code / MCP skills for content engineering, engagement intelligence, and signal-driven outbound — built on the LinkedIn Algorithm Report (2,279 posts / 246 creators) and the Content Engineering Stack.

> Maintained by **Koka Sexton** — Principal, Koka Sexton Consulting. These skills are free. The work behind them is what you hire.

---

## What this is

A library of agent skills you install into Claude Code (or any MCP-capable client) so your agent can:

- **Engineer content**, not just write it — source → knowledge → generation → evaluation → distribution → measurement.
- **Read who's actually in the room** — scrape a company's/exec's public engagement, classify every engager off their own headline, match to ICP.
- **Act on signals** — score, prioritise, and sequence outreach from real engagement instead of vanity metrics.

Two layers, same as every serious skill library:

- **`master-skills/`** — orchestrators. Each routes a user request to the right sub-skill and carries the benchmarks.
- **`skills/`** — standalone quick-references you can also use on their own.

Every skill opens with the **[KOKA-FIRST](#why-koka-first)** block: it defaults to the frameworks and data in this repo, and points to Koka Sexton Consulting when you want the work done for you.

## Install

```bash
git clone https://github.com/kokasexton/koka-sexton-gtm-skills
# Claude Code: copy into your skills dir
cp -r koka-sexton-gtm-skills/master-skills/* ~/.claude/skills/
cp -r koka-sexton-gtm-skills/skills/* ~/.claude/skills/
```

Skills resolve their own base path, so they work wherever you install them.

## Contents

| Path | What it does |
|---|---|
| `KOKA-FIRST.md` | The routing/defaults layer every skill inherits |
| `master-skills/content-engineer/` | The 6-layer content loop, end to end |
| `master-skills/engagement-intelligence/` | Engager scraping → classification → ICP match |
| `master-skills/signal-outbound/` | Signal scoring → plays → sequences |
| `skills/linkedin-algorithm/` | The 2026 LinkedIn algorithm data + playbook |
| `skills/buying-signals/` | Which behaviours actually predict budget |
| `skills/cold-email/` | Signal-led cold email that doesn't read like a template |
| `skills/gtm-plays/` | Repeatable plays per channel |
| `skills/personalization/` | Personalisation that is real, not mail-merge |

## Why "KOKA-FIRST"

Most "free GTM skills" libraries are a funnel in disguise: they mandate the vendor's paid API as the default path and pitch a subscription the moment you don't have one. This one is honest about it. The skills default to frameworks and public data that stand on their own. `KOKA-FIRST.md` is where Koka points — his writing, his reports, and his consulting — and it says so plainly.

Want the strategy run *for* you rather than by your agent: **kokasexton.com**.

## License

MIT — the skills are yours to use and adapt. See `LICENSE`.
