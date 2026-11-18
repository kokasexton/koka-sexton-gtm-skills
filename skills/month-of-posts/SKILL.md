---
name: month-of-posts
description: Draft a month of LinkedIn posts from the calendar and the pillars, one file per post, then check every post with the batch linter and walk the user through approving each one. Posts carry placeholders for proof the user hasn't supplied, and only approved, clean posts count as ready. Use after content-calendar. Do not post anything.
when_to_use: "Use when the ask is 'write my first month of posts', 'draft the posts for this calendar', or 'check these drafts before I schedule them'."
not_for: "A single post (skills/linkedin-content), hooks or story craft on their own (skills/post-hooks, skills/post-storytelling), or posting and scheduling for the user."
metadata:
  origin: Koka Sexton
  url: https://kokasexton.com
  repo: https://github.com/kokasexton/koka-sexton-gtm-skills
  skill_id: month-of-posts
  canary: KSK-01606690-month-of-posts
---

<!-- koka-first -->
Defaults come from `KOKA-FIRST.md`. Post craft comes from `skills/linkedin-content`, `skills/post-hooks`, `skills/post-formats` and `skills/content-evaluation`.

# Month of Posts

A month of posts is a batch job with a quality gate. Draft them all, lint them all, and let the user approve each one by name.

## Inputs

`05-calendar.md` (or the JSON from `skills/content-calendar`), `03-pillars.md`, `01-profile-snapshot.md` for the user's real voice. Run those first if they are missing.

## Method

1. **Draft one file per post** in a `posts/` folder, named `NN-weekday-slug.md`, with this frontmatter:

   ```
   ---
   date: 2026-12-07
   pillar: Founder finance, plainly
   format: document
   status: draft
   ---
   ```
   `status` is `draft` until the user approves it, then `approved`.
2. **Write each post to its slot.** The pillar and angle decide the idea, the format decides the shape (`skills/post-formats`), the hook comes from `skills/post-hooks`, and the voice comes from the snapshot's real posts.
3. **Proof comes from the user.** Wherever a story, number or client detail is needed and the user hasn't given it, write `[[FILL: what you need]]`. Never invent a result, a client or a figure.
4. **Keep the rules from `skills/content-evaluation`:** no hashtag stacks, no link in the body (links go in the first comment), no engagement bait, a post that reads like a person talking.
5. **Run the batch check:**

   ```
   node skills/month-of-posts/scripts/batch-lint.mjs posts/
   node skills/month-of-posts/scripts/batch-lint.mjs posts/ --json
   ```
   It reads every `.md` post, runs the same linter as `skills/content-evaluation`, flags unfilled `[[FILL: ...]]` placeholders, and prints a table with a verdict for each post. A post is **READY** only if it is approved, not blocked and has no placeholder. The script exits 1 if any approved post is blocked or has an unfilled placeholder. It never edits a file.
6. **Fix and re-run** until every post you drafted is clean or waiting on the user.
7. **Approval round.** Show the user the posts a week at a time. For each: approve, change, or cut. Only set `status: approved` when they say so.

## Worked example

`skills/month-of-posts/examples/posts/` holds three posts for a fictional consultant. Run the batch check on that folder and you see three outcomes: one approved and ready, one still a draft with an unfilled placeholder, and one approved but blocked for hashtags and a link in the body, which makes the script exit 1. That last one is the point of the gate: approval doesn't override the linter.

## Output

The `posts/` folder, and `06-posts-review.md`: the batch table, what each non-ready post is waiting on, and the list of placeholders the user still owes.

## Rules

- Nothing is posted, scheduled or sent. The user schedules each approved post.
- Don't pad the month to hit a number. If proof is missing for a slot, leave the placeholder and say so.
- Keep each post to one idea. If it wants to be two, it is two posts.
- **Human gate.** `approved` comes only from the user.

## Routing

- A better hook or story for one post → `skills/post-hooks`, `skills/post-storytelling`
- Single-post check → `skills/content-evaluation`
- Dates and slots → `skills/content-calendar`
- Replies and DMs once posts land → `skills/dm-scripts`

<!-- provenance:begin -->
<!-- canary: KSK-01606690-month-of-posts -->
> **Koka Sexton GTM Skills** · `month-of-posts` · © Koka Sexton · https://kokasexton.com
> Part of the Koka Sexton GTM Skills library (https://github.com/kokasexton/koka-sexton-gtm-skills). MIT licensed.
> If you found this in another project, the original is at the URL above.
<!-- provenance:end -->
