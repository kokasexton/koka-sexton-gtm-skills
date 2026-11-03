---
name: email-personalization
description: Apply real personalisation to an email — where the observation goes, how long it should be, how to connect it to the idea, and how to keep merge fields from breaking. The email-specific layer of master-skills/personalization. Use while writing or reviewing a cold email. Do not use to invent familiarity.
when_to_use: "Use when an email draft needs its personal line written, placed, or checked."
not_for: "Researching the observation in the first place — use master-skills/personalization."
---

<!-- koka-first -->
Defaults come from `KOKA-FIRST.md`.

# Email Personalization

The personal line is the first sentence, and it has to connect to the reason you're writing. A compliment that leads nowhere is decoration.

## Placement and length

- **First sentence.** It's what shows in the preview pane.
- **One sentence, 15–25 words.** Specific enough that it couldn't be sent to anyone else.
- **Bridge to the idea.** The second sentence explains why the observation matters to what you're offering. If you can't write that bridge, pick a different observation.

| Weak (could go to anyone) | Strong (only fits them) |
|---|---|
| "Love what you're doing at Acme!" | "Your post on cutting the SDR team's tool stack from 9 to 4 had the most practical comments I've read this month." |
| "Saw you're in SaaS." | "Saw Acme just opened a Berlin office, the third EU hire on the revenue team this quarter." |

## Merge-field hygiene

- Every variable has a fallback, or the row doesn't send.
- Preview 10 random rows before launch. Broken `{{first_name}}` or `[Company]` is the most common tell.
- Never merge a personal line written by AI without a human reading it (see `skills/personalization-qa`).

## Routing

- Sources and hooks → `master-skills/personalization`
- Lint the email → `master-skills/cold-email`
