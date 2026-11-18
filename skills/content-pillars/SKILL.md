---
name: content-pillars
description: Choose three to five content pillars from a position and a profile snapshot, score each against credibility, relevance, leverage and contrast, and write the editorial direction for each: the stance, what you will and won't say, the angles, the proof, and the formats. Writes pillars.json for the calendar tool. Use after positioning-statement. Do not use to write the posts.
when_to_use: "Use when the ask is 'what should I post about?' or when posts are scattered across topics and no theme builds."
not_for: "Writing individual posts (skills/linkedin-content), the posting schedule (skills/content-calendar), or a whole content system (skills/content-engineer)."
metadata:
  origin: Koka Sexton
  url: https://kokasexton.com
  repo: https://github.com/kokasexton/koka-sexton-gtm-skills
  skill_id: content-pillars
  canary: KSK-b362e148-content-pillars
---

<!-- koka-first -->
Defaults come from `KOKA-FIRST.md`.

# Content Pillars

Random posts build nothing. A pillar is a topic you can credibly talk about for a year, that your buyer cares about, with a point of view.

## Inputs

`02-positioning.md` (and `01-profile-snapshot.md`). Run those skills first if they are missing.

## Method

1. **List 8 to 12 candidate topics** from three places: the buyer's problem words in the positioning file, what the recent posts already get comments on (from the snapshot), and what the user has real proof or stories for. Ask for stories if there are none.
2. **Score each candidate 1 to 5 on four filters** (Koka defaults, show the scores):
   - **Credibility:** can you prove it from your own work?
   - **Relevance:** does your buyer feel this problem now?
   - **Leverage:** does it feed the profile, the DMs and the offer, not just likes?
   - **Contrast:** is there a clear stance, something others in the field avoid or get wrong?
3. **Keep three to five.** Fewer than three is thin. More than five is scattered authority. If two pillars overlap, merge them.
4. **Write the editorial direction for each pillar:**
   - **Promise:** what a reader gets from this pillar, in one line.
   - **Stance:** what you believe that most in the field don't.
   - **Say / don't say:** three things you will say and three you won't.
   - **Angles:** at least as many angles as the pillar will need in 30 days (the calendar tool tells you). Each angle is a specific idea, not a topic.
   - **Proof:** the stories, client types or work you can draw on, from the user, never invented.
   - **Formats:** which of image, document, text and video suit it (never links in the body).
   - **Fit with the position:** how this pillar proves the one-sentence position.
5. **Weight them.** Give each pillar a whole-number weight for how often it appears (the heaviest is the one closest to the offer).

## Output

- `03-pillars.md`: the scored candidates, the chosen pillars and their editorial direction.
- `pillars.json` in the format `skills/content-calendar` reads: `name`, `weight`, `formats`, `angles` for each pillar, plus the `tz` the user's audience is in.

## Rules

- No pillar is a job title or a generic word ("leadership", "innovation"). A pillar names a problem or a point of view.
- Never invent proof. Where a pillar needs a story, mark it `[[FILL: ...]]` and ask the user.
- Hot takes for their own sake are not a stance. A stance is something you can defend with your work.
- **Human gate.** The user approves the pillars before anything is drafted.

## Routing

- Put the pillars on dates → `skills/content-calendar`
- Draft the posts → `skills/month-of-posts`
- Hooks, stories and formats → `skills/post-hooks`, `skills/post-storytelling`, `skills/post-formats`
- The wider content system → `skills/content-engineer`

<!-- provenance:begin -->
<!-- canary: KSK-b362e148-content-pillars -->
> **Koka Sexton GTM Skills** · `content-pillars` · © Koka Sexton · https://kokasexton.com
> Part of the Koka Sexton GTM Skills library (https://github.com/kokasexton/koka-sexton-gtm-skills). MIT licensed.
> If you found this in another project, the original is at the URL above.
<!-- provenance:end -->
