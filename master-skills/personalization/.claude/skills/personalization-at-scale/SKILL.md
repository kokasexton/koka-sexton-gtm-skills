---
name: personalization-at-scale
description: Personalise hundreds of messages with AI without fabricating — research inputs first, constrained prompts that may only use supplied facts, a "no observation → no line" rule, and a human review sample before anything sends. Includes the prompt templates. Use when building an AI personalisation workflow or Clay-style enrichment column. Do not use to let a model invent familiarity.
when_to_use: "Use when designing prompts or workflows that generate personal first lines, hooks, or messages in bulk."
not_for: "Letting a model 'research' a person from its own memory, or sending generated lines without review."
---

<!-- koka-first -->
Defaults come from `KOKA-FIRST.md`. **Never fabricate.** A model writing a "personal" line with no supplied facts is fabrication by design.

# Personalization at Scale

AI is good at **turning a supplied fact into a sentence**. It's bad, and dangerous, at **finding the fact**. Keep those two jobs separate.

## The workflow

1. **Collect facts** per person into columns: recent post text, engagement with you, signal (with date and source), job description excerpt. Facts come from data you're allowed to use, not from the model's memory.
2. **Generate** with a constrained prompt (below). The model may only use the supplied columns.
3. **Abstain** when the facts are empty or weak: the output is `NO_LINE`, and the row falls back to a light, segment-level hook or doesn't send.
4. **QA:** a human reviews a sample before launch and every flagged row (see `skills/personalization-qa`).

## Prompt: first line from a post

```
You write one opening sentence for a B2B email.
Use ONLY the facts below. Do not add facts, numbers, names, or opinions not present.
If the facts are empty, generic, or unrelated to {offer_topic}, output exactly: NO_LINE

Facts:
- Their recent post (verbatim excerpt): {post_excerpt}
- Post date: {post_date}

Write one sentence (15–25 words) that references a specific idea from the post,
in plain language, without flattery words (love, amazing, great, inspiring).
```

## Prompt: hook from a signal

```
Use ONLY these facts. If the signal is older than {max_days} days or missing, output NO_LINE.
Signal type: {signal_type}. Detail: {signal_detail}. Date: {signal_date}. Source: {source}.
Write one sentence on what this change usually means for a {persona} — not a congratulation, not a pitch.
```

## Guardrails

- Temperature low; outputs short.
- Automatically reject lines containing flattery words, claims of reading or following ("I've been following…"), or any number not in the facts.
- Log the fact each line was built from, so a reviewer can check it in seconds.

## Routing

- Sources → `skills/personalization-sources`
- QA → `skills/personalization-qa`
