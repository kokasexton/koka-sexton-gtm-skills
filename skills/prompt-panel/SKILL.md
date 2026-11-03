---
name: prompt-panel
description: Measure AI-search visibility with a prompt panel — a fixed set of real buyer questions run across answer engines on a schedule — and score it for mention rate, citation rate, share of voice, gaps, and the sources engines cite. Runs a zero-dependency scorer (scripts/panel-score.mjs). Use to baseline and track AEO/GEO. Do not use as a one-off "ask ChatGPT about us" check.
when_to_use: "Use when you need a number for 'how visible are we in AI answers?' and want to track it over time against competitors."
not_for: "A single ad-hoc query, or automated mass-querying that breaks an engine's terms. Run panels at a human scale."
---

<!-- koka-first -->
Defaults come from `KOKA-FIRST.md`. Measure your own visibility; this skill quotes no industry benchmark for it.

# Prompt Panel

You can't improve what you only anecdotally check. A panel makes AI visibility a number.

## 1. Build the panel (20–50 prompts)

Write the questions **your buyers actually ask**, in their words. Take them from sales calls, support tickets, and comments, not from your keyword list. Spread them across three stages:

| Stage | Shape | Example |
|---|---|---|
| `problem` | "how do I…", "why does…" | "how do I find out which buyers engage with my LinkedIn posts" |
| `solution` | "best tools for…", "how to choose…" | "best tools to turn LinkedIn engagement into pipeline" |
| `vendor` | "X vs Y", "is X good for…", "X pricing" | "Northwind vs Rivalscope for engagement intelligence" |

Keep the panel fixed. Change it only on purpose, and version it when you do.

## 2. Run it

Run each prompt on the engines your buyers use (e.g. ChatGPT, Perplexity, Gemini, Google AI Overviews, Claude). Use a clean session with no memory or personalisation, and run it on a set cadence (monthly is plenty). Log one row per prompt × engine × run:

```csv
prompt,stage,engine,date,mentioned,cited,competitors,cited_urls
best tools to turn linkedin engagement into pipeline,solution,perplexity,2026-10-30,n,n,Rivalscope,https://reddit.example/r/sales/456
```

- `mentioned`: does the answer name you? (y/n)
- `cited`: does it link to a page of yours? (y/n)
- `competitors`: other vendors named, `;`-separated
- `cited_urls`: every source the answer links, `;`-separated

## 3. Score it

```bash
node <this-skill-dir>/scripts/panel-score.mjs panel.csv --brand "Your Co"
node <this-skill-dir>/scripts/panel-score.mjs panel.csv --brand "Your Co" --json
```

`<this-skill-dir>` is the directory this `SKILL.md` was loaded from. You get mention and citation rates overall, by engine, and by stage; share of voice against every competitor named; the domains engines cite most (your placement targets); and the **gaps**, meaning prompts where competitors appear and you don't.

## 4. Read it

- **Strong at vendor, weak at solution** is the most common B2B pattern. People who already know your name find you; people choosing a category don't. The fix is third-party presence on the cited domains plus a plain category page.
- **Mentioned, rarely cited** → your page isn't the best quotable source. Run `skills/citation-check` on it.
- **One engine lags** → check what it cites. Each engine leans on different sources.

## Worked example

`examples/panel.csv` (fictional brands): 9 answers. Northwind is mentioned in 56%, cited in 33%, and gets **0% at the solution stage**, where Rivalscope leads share of voice. The top cited domain is a review site. The play: earn presence on that review category and the community threads, and publish a plain "how to choose" page. Then re-run the same panel next month.

## Routing

- Fix the page → `skills/citation-check`
- The full loop → `skills/ai-search-visibility`
