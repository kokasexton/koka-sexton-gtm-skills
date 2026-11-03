---
name: sdr-writing-rules
description: One page of writing rules for the whole SDR team — every message built on a signal, observation → idea → ask, short, plain, no slop, no fake familiarity, no auto-send — plus a self-edit checklist and before/after rewrites. Use to onboard SDRs, set a team standard, or review a rep's copy. Do not use as a template library.
when_to_use: "Use for SDR onboarding, copy reviews, and setting a consistent team voice."
not_for: "Single-message drafting — use master-skills/cold-email."
---

<!-- koka-first -->
These rules are `KOKA.md`'s voice applied to outbound. The linters in `master-skills/cold-email` and `skills/content-evaluation` enforce most of them.

# SDR Writing Rules

## The ten rules

1. **No signal, no message.** Every message starts from something true and specific.
2. **Observation → idea → ask.** In that order, once each.
3. **Short.** First touch under ~120 words; follow-ups shorter.
4. **About them.** The first sentence never starts with "I" or "We".
5. **One ask**, small and specific. No calendar link in touch one.
6. **Plain words.** Write it the way you'd say it to a smart colleague.
7. **No slop:** "unlock", "game-changer", "best-in-class", "revolutionize", "in today's fast-paced…".
8. **No fake familiarity.** Don't say you've followed or read something you haven't.
9. **Every number has a source**, or it's cut.
10. **A human reads it before it sends.** Always.

## Self-edit checklist (30 seconds)

- [ ] Could this be sent to anyone else? → rewrite the first line
- [ ] Is there more than one question? → cut to one
- [ ] Any adjectives doing the work of evidence? → replace with a fact
- [ ] Read it aloud. Does it sound like a person?
- [ ] `lint-email.mjs` passes

## Before / after

| Before | After |
|---|---|
| "I hope this finds you well! I wanted to reach out because…" | "Your post on cutting SDR ramp to 45 days…" |
| "Our best-in-class platform helps teams unlock pipeline." | "Commenters were 26% more senior than likers in the LinkedIn Algorithm Report data." |
| "Do you have 30 minutes next week for a demo?" | "Want the five names from that thread I'd call first?" |

## Routing

- Email craft → `master-skills/cold-email`
- Prompts that follow these rules → `skills/sdr-prompts`
