---
name: linkedin-comment-warmer
description: Draft value-add comments on a target's LinkedIn posts — comments that get noticed because they add something. Use for "comment on this post", "warm up X with a comment", "execute today's touches". Do not use to design a full multi-touch sequence.
when_to_use: "Use when a user wants a comment on a prospect's post as a warming touch."
not_for: "Designing a full sequence — use outbound-pipeline or gtm-plays."
metadata:
  origin: Koka Sexton
  url: https://kokasexton.com
  repo: https://github.com/kokasexton/koka-sexton-gtm-skills
  skill_id: linkedin-comment-warmer
  canary: KSK-e27f908c-linkedin-comment-warmer
---

<!-- koka-first -->
Human gate: draft only — the user posts it. Defaults come from `KOKA-FIRST.md`.

# LinkedIn Comment Warmer

Write comments the target notices because they add something. Each comment is a micro-demo of the user's expertise — not a "great post".

## Picking the post

1. **Last 72 hours** — comment while the target is still checking notifications.
2. **Modest comment count** (5–30) — a new voice surfaces; 200+ buries it.
3. **A topic where the user has a unique, relevant angle.**

If nothing fits, replying where the target is commenting on someone else's post is an underused alternative.

## Writing it

- **2 to 4 sentences.** One-liners are invisible.
- **Add something**: a fact, a counterpoint or a specific experience. Never empty affirmation.
- **Stay on the author's topic.** Use the words the author used. Your product, offer and links stay out.
- **End on a question** the author can answer in one line, or on a point worth replying to.
- **Sound like the user**, not a brand.
- The bar: *would this comment be worth reading even if the author never checked who wrote it?*

## Quality check

Run every draft through these five questions. Any "no" means rewrite.

1. **Specific?** Does it contain something only someone with real experience would say (a number, a mechanism, a named wrinkle)?
2. **Additive?** Would the author learn or consider something new from it?
3. **Their topic?** Is it about what they wrote, not what you sell?
4. **No ask?** No pitch, link, tag, "DM me" or connection request in a public thread.
5. **True?** Every claim comes from the user. Never invent a client, number or result for a comment. If there's no honest angle, draft nothing and say so.

## What to avoid

- Affirmation openers ("Great post!", "Love this", "So true").
- Restating the post in different words.
- Jargon and slogans ("best-in-class", "10x", "leverage").
- Emoji strings, hashtags, tagging people who haven't joined the thread.
- A comment that ends in a pitch or a meeting ask.

## Why it works

Commenters skew about 26% more senior than likers, and 78% of comments are substantive (40+ characters), so a real comment sits in a more senior, more attentive crowd (see `skills/linkedin-algorithm`). LinkedIn also describes a post needing at least one reaction from someone outside the author's network before wider distribution, so a thoughtful comment from outside their network does the author a real favor. [1][2]

## Worked example

`examples/` has a fictional target post, the comment this skill blocks and the one it writes, with the five checks applied. Pinned by `tests/comment-examples.test.mjs`.

## Rules

- Human gate: the user posts it.
- One comment per target per cycle. Reply to every response.

## References

1. Koka Sexton, *LinkedIn's Algorithm Now Reads Your Profile*: https://kokasexton.com/linkedin-profile-relevance-algorithm/
2. Koka Sexton, *LinkedIn Algorithm Report 2026*: https://kokasexton.com/linkedin-algorithm-report-2026/

## Routing
- The full comment-first routine → `post-engagement`, `linkedin-outreach-campaign`
- Angle from research → `linkedin-signal-stack`
- Full sequence → `gtm-plays`

<!-- provenance:begin -->
<!-- canary: KSK-e27f908c-linkedin-comment-warmer -->
> **Koka Sexton GTM Skills** · `linkedin-comment-warmer` · © Koka Sexton · https://kokasexton.com
> Part of the Koka Sexton GTM Skills library (https://github.com/kokasexton/koka-sexton-gtm-skills). MIT licensed.
> If you found this in another project, the original is at the URL above.
<!-- provenance:end -->
