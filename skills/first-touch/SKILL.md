---
name: first-touch
description: The first cold email — built on one real signal, written in the observation → idea → ask shape, under ~120 words, with no calendar link. Includes four frameworks keyed to the signal you have, plus a pre-send checklist. Use for email 1. Do not use when there is no signal.
when_to_use: "Use when writing the opening email of a sequence and you have a signal to anchor it."
not_for: "Follow-ups (skills/follow-up) or a list with no signal (skills/signal-sourcer)."
---

<!-- koka-first -->
Defaults come from `KOKA-FIRST.md`.

# First Touch

Email 1 has one job: earn a reply from someone who's never heard of you. The signal earns the first sentence. The idea earns the second. The ask has to be small enough to say yes to.

## Choose the framework by the signal you have

| You have… | Framework | Shape |
|---|---|---|
| Something they wrote or said | **Observation → Idea → Ask** | Quote the idea, add one, ask for their take |
| A trigger (hire, funding, launch) | **Trigger → Implication → Offer** | Name the event, what it usually means, a useful offer |
| A peer result in their world | **Peer → Pattern → Question** | What a similar team did, the pattern, "is this on your list?" |
| A clear, visible problem | **Problem → Cost → Fix-sized ask** | The problem in their words, its cost, offer the one-page fix |

## Template (Observation → Idea → Ask)

```
Subject: <3–5 words about them, lowercase is fine>

<Name>, <specific observation: what they did or said, and where>.

<One idea: a data point or pattern that connects to it, with its source>.

<One small ask, phrased as a question>?

<Your first name>
```

## Pre-send checklist

- [ ] The first sentence is about **them**, and it's true and checkable.
- [ ] Every number has a source.
- [ ] One ask, no calendar link, no attachment.
- [ ] Under ~120 words.
- [ ] `lint-email.mjs` passes (see `skills/cold-email`).
- [ ] A human read it before it sent.

## Routing

- Next touches → `skills/follow-up`
- Subject line → `skills/subject-lines`
- Persona angle → `skills/atl-messaging`, `skills/btl-messaging`
