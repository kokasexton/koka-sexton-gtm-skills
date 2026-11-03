# Model routing

The loop has the **whole OpenRouter catalog** available. Don't default to one model — pick the right one for each job. Budget still caps the day at $2.

## How a run can use many models

A scheduled run executes on one model. To use several in a day:

1. **Lead model** — the run's own model (quality/cost sweet spot). Use it for the hard thinking.
2. **Delegate** — spawn subagents with a `model` override for independent subtasks (bulk drafting, research, review). A cheap model writes ten drafts; the lead model edits the one that matters.
3. **Direct calls** — for pure bulk/classification, call OpenRouter directly from a script (key from the environment, never committed).

## The menu (cheapest → strongest)

| Model | Use it for |
|---|---|
| `deepseek/deepseek-v4.1-flash` | bulk, formatting, mechanical edits, first-pass drafts |
| `deepseek/deepseek-v4-pro` | cheap reasoning where flash isn't enough |
| `anthropic/claude-haiku-5.5` | fast, cheap, solid prose and structure |
| `google/gemini-3.8-flash` | mid-tier general work; strong at long context |
| `openai/gpt-5.6-luna` | cheap OpenAI tier; good instruction-following |
| `anthropic/claude-sonnet-5.5` | **default lead** — best quality per dollar for skill work |
| `openai/gpt-5.6-terra` | alternate reasoning voice; good for adversarial review |
| `anthropic/claude-opus-5.5` | hardest judgment calls; use sparingly (it eats the budget) |
| `perplexity/sonar` (search tool) | live web facts, current numbers |

## Routing rules

- **Match cost to consequence.** A typo fix doesn't need Opus. A strategic rewrite doesn't get flash.
- **Cheap first, strong to review.** Draft with a cheap model; have the lead model critique and fix.
- **Two voices beat one.** For anything load-bearing, get a second model's read before shipping.
- **Log the model used** in `ops/spend.jsonl` and `CHANGELOG.md`.
- **Never exceed $2/day.** If the strong model would blow the cap, do less with it, not more with a worse one.
