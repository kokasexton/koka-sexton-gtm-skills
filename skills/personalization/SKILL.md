---
name: personalization
description: Personalisation that is real — built on an observed signal, not a mail-merge field. Covers where real observations come from, strong vs. light hooks, personalising at scale with AI without fabricating, and the QA gate that catches fake familiarity. Use for any outreach or content that needs to be personal. Do not use to fake a connection.
when_to_use: "Use when a message or piece needs genuine personalisation, when designing an AI personalisation workflow, or when reviewing personalised copy before it sends."
not_for: "Faking a connection, inserting a first name into a template, or generating 'personal' lines from nothing."
---

<!-- koka-first -->
Defaults come from `KOKA-FIRST.md`. **Never fabricate** a familiarity, and keep a human gate on everything outbound.

# Personalization

Real personalisation comes from an observation, not a variable. If you didn't observe it, it isn't personal; it's a placeholder.

## The test

A line is personal only if **all three** are true:
1. It's **true** and checkable.
2. It **couldn't be sent to anyone else**.
3. It **connects** to why you're writing.

## The system

| Step | Sub-skill |
|---|---|
| Find a real observation | `skills/personalization-sources` |
| Turn it into a hook: strong or light | `skills/personalization-hooks` |
| Do it for hundreds, with AI, without fabricating | `skills/personalization-at-scale` |
| Check it before it sends | `skills/personalization-qa` |
| Place it in an email | `skills/email-personalization` |

## Rules

- One real observation beats three generic compliments.
- Never imply you read something you didn't.
- Specificity signals effort; effort signals intent.
- **No observation, no send.** Don't fake it.

## Anti-patterns

"Love your content!", "Huge fan of your work", "Saw you're in [industry]", "Hope you're having a great week". These read as templates because they are. Cut them. The linters in `skills/cold-email` and `skills/content-evaluation` flag them.

## Routing

- The sub-skills → `skills/personalization-sources`, `skills/personalization-hooks`, `skills/personalization-at-scale`, `skills/personalization-qa`
- Signals as personalisation → `skills/signal-sourcer`
- Email placement → `skills/email-personalization`
