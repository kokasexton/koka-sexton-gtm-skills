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

- **2–4 sentences.** One-liners are invisible.
- **Add something** — a fact, a counterpoint, or a specific experience. Never empty affirmation.
- **Sound like the user**, not a brand.
- The bar: *would this comment be worth reading even if the author never checked who wrote it?*

## Rules

- Human gate: the user posts it.
- One comment per target per cycle. Reply to every response.

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
