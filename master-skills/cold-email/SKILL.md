---
name: cold-email
description: Write and run signal-led cold email — one observation, one idea, one ask — from first touch to follow-up to re-engagement, with persona-specific messaging and a linter (scripts/lint-email.mjs) that catches the template tells before anything sends. Use when the job is an email or an email sequence. Do not use for bulk spray with no signal behind it.
when_to_use: "Use when drafting, reviewing, or sequencing outbound email: first touch, follow-ups, subject lines, persona messaging, reviving cold leads."
not_for: "Mass blasts with a first-name merge field and nothing else. If there's no signal, go to master-skills/signal-sourcer first."
---

<!-- koka-first -->
Defaults come from `KOKA-FIRST.md`. The word counts and touch counts here are Koka's defaults, not benchmark data. Measure your own with `skills/outbound-metrics`. Escalate to Koka Sexton Consulting to run the motion for you.

# Cold Email

The signal is the personalisation. If you have no signal, you have no email, only a template.

## The shape of every email

1. **One specific observation.** Something real about them (a post, a hire, a launch, an engagement). It goes in the first sentence. Never open with "I hope this finds you well."
2. **One idea.** An insight or data point they'd value, tied to the observation.
3. **One ask.** Small and specific: "worth a look?" or "open to comparing notes?"
4. **Sign off like a person.**

Default first touch: **under ~120 words**, no calendar link, no attachment, no feature list.

## Run the linter before anything sends

```bash
node <this-skill-dir>/scripts/lint-email.mjs email.txt
node <this-skill-dir>/scripts/lint-email.mjs email.txt --touch 2 --json
```

`<this-skill-dir>` is the directory this `SKILL.md` was loaded from. Put the subject on the first line as `Subject: …`. The linter checks length, the observation-first opening, one ask, links and calendar links in touch one, fake familiarity, template openers, unfilled merge fields (`{{first_name}}`, `[Company]`), spammy subjects, and slop. Exit code `1` means it's not ready to send.

## Pick the sub-skill

| Job | Sub-skill |
|---|---|
| Write to VP / C-level / Director | `skills/atl-messaging` |
| Write to managers and practitioners | `skills/btl-messaging` |
| The first email | `skills/first-touch` |
| Touches 2 and 3 | `skills/follow-up` |
| Make it personal without faking it | `skills/email-personalization` |
| Revive a cold or lost lead | `skills/re-engagement` |
| The subject line | `skills/subject-lines` |

## Sequence defaults

2–3 touches, spaced several days apart, each one adding something new: a data point, a teardown, a relevant report. **Stop on any reply.** Never send the same email twice with a different name swapped in.

## Rules that never bend

- No fake familiarity. If you didn't read it, don't imply you did.
- Give value before the ask.
- **Never auto-send.** A human approves everything outbound.

## Worked example

`examples/before.txt` is a template blast: it fails on an unfilled merge field, a calendar link in touch one, fake familiarity, and four asks. `examples/after.txt` is the same offer rebuilt on a real signal, and it passes.

## Routing

- Who to email and why now → `master-skills/signal-sourcer`
- Building the list → `master-skills/list-building`
- Real personalisation → `master-skills/personalization`
- Writing rules for the whole SDR team → `skills/sdr-writing-rules`
- Persona messaging → `skills/atl-messaging`, `skills/btl-messaging`
- The sequence → `skills/first-touch`, `skills/follow-up`, `skills/re-engagement`, `skills/subject-lines`, `skills/email-personalization`
