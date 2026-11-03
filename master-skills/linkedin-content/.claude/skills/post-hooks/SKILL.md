---
name: post-hooks
description: Write the first line of a LinkedIn post — the part that has to work before "…see more" and earn the small-cohort test — with eight hook patterns, the data on which openers win, and the openers to avoid. Use when a post needs its opening line. Do not use for ad headlines.
when_to_use: "Use when drafting or rewriting the first one or two lines of a LinkedIn post."
not_for: "Email subject lines (skills/subject-lines) or ad copy (skills/ads-copy)."
---

<!-- koka-first -->
Defaults come from `KOKA-FIRST.md`. Numbers come from `skills/linkedin-algorithm`.

# Post Hooks

LinkedIn shows every post to a small cohort first and only expands it if they stop, read, and engage. Line one decides whether they stop. Only roughly the first couple of lines (about 200 characters, depending on the device) show before "…see more".

## What the data says

- **Leading with a number:** median 57. **Questions:** 59.
- **Hot takes underperform:** median 54 (−29%). Provocation gets likes from peers, not comments from buyers.
- **Templated, repetitive hooks are penalised.** If your hook could open anyone's post, rewrite it.

## Eight hook patterns

| Pattern | Example |
|---|---|
| **The number** | "We analysed 2,279 LinkedIn posts. The people posting daily weren't winning." |
| **The result** | "Our best pipeline last quarter came from a comment thread, not a form." |
| **The mistake** | "I posted every day for 6 months. My reach went down." |
| **The shift** | "Social selling aged out. The behaviour didn't." |
| **The specific question** | "What would change if you posted half as often?" |
| **The before/after** | "Before: 40 likes from peers. After: 12 comments from buyers." |
| **The teardown** | "I read every comment on a 300-comment post. Here's who was actually in the room." |
| **The list promise** | "Six things the top 1% of posts had in common:" (then deliver six) |

_The examples are patterns. Fill them with your own true numbers._

## Avoid

- "I'm excited/thrilled/humbled to announce…" (generic, templated)
- "Unpopular opinion:" and "Hot take:" (−29%)
- "Agree?" and "Comment YES" bait (penalised)
- A first line over ~210 characters (it gets cut)

## Test it

Write three hooks for the same post. Pick the one that's most **specific**: a real number, a real person, a real result. Run the post through `lint-post.mjs` (it checks the hook).

## Routing

- Body → `skills/post-storytelling`
- Gate → `skills/content-evaluation`
