---
name: subject-lines
description: Subject lines that read like a colleague wrote them — short, specific, lowercase-friendly, about the recipient — plus a clean A/B testing method that tests one variable at a time against reply rate, not opens. Use when writing or testing subject lines. Do not use to write clickbait.
when_to_use: "Use when writing the subject for a cold email or designing a subject-line test."
not_for: "Newsletters or marketing email, where different rules apply."
---

<!-- koka-first -->
Defaults come from `KOKA-FIRST.md`. There are no subject-line benchmarks in this repo. Test against your own baseline.

# Subject Lines

The subject line's only job is to look like it's worth opening, coming from a person, about something relevant to them.

## Patterns that read as human

| Pattern | Example |
|---|---|
| Their thing | `your post on sdr hiring` |
| The trigger | `berlin office` |
| The question | `pipeline from comments?` |
| Mutual context | `after the revops summit` |
| The idea, in brief | `26% more senior` |

Default: **2–5 words**, about them, with no punctuation tricks.

## Avoid

- ALL CAPS, "!!!", fake "Re:" or "Fwd:", emoji, and urgency ("Last chance").
- Spam-trigger words such as free, guarantee, act now, $$$, and "% off".
- Their first name as the whole subject. It's the mail-merge tell.
- Promising something the body doesn't deliver.

The linter in `skills/cold-email` flags the worst of these.

## Testing that tells you something

1. **One variable** per test (pattern, length, or specificity), not three at once.
2. **Measure replies**, not opens. Open tracking is unreliable, and a subject that opens but doesn't earn replies is clickbait.
3. **Enough volume** to see a real difference: hundreds of sends per variant, not twenty.
4. **Same list, same body, same week.** Otherwise you're testing the list.
5. Log the result in `skills/outbound-metrics` and keep the winner as the new control.

## Routing

- The email → `skills/first-touch`
- Metrics → `skills/outbound-metrics`
