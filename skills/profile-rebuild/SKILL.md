---
name: profile-rebuild
description: Rewrite a LinkedIn profile from the snapshot, the position and the pillars: three headline options, an About in short paragraphs, a Featured plan with one next step, experience bullets that show outcomes, and a keyword map that shows where each term lands. Produces a before and after for the user to paste in. Use after positioning-statement and content-pillars. Do not use to edit the profile for the user.
when_to_use: "Use when the ask is 'rebuild my profile', 'rewrite my headline and About', or 'make my profile convert the people my posts attract'."
not_for: "Reading the current profile (skills/profile-read), the principles of a converting profile (skills/linkedin-profile), or a job-seeker profile."
metadata:
  origin: Koka Sexton
  url: https://kokasexton.com
  repo: https://github.com/kokasexton/koka-sexton-gtm-skills
  skill_id: profile-rebuild
  canary: KSK-32dbefc7-profile-rebuild
---

<!-- koka-first -->
Defaults come from `KOKA-FIRST.md`. The principles live in `skills/linkedin-profile`. This skill applies them to one person.

# Profile Rebuild

A profile is a landing page for the people your posts attract. They have about five seconds to answer: who is this, who do they help, what do I do next?

## Inputs

`01-profile-snapshot.md`, `02-positioning.md`, `03-pillars.md`. Run those first if they are missing.

## Method

1. **Headline: three options.** Formula from `skills/linkedin-profile`: `Helping <who> <achieve what> · <proof or method>`. Write it for the buyer, in their words from the positioning file. One option stays plain, one carries the proof, one leans on the method. Check each fits the headline field and still reads in a feed preview.
2. **About: three short paragraphs.**
   - First lines (they show before "see more"): the buyer's problem, in their words, not your biography.
   - Middle: how you solve it and the kind of result you get, using only proof the user supplied.
   - Last: one clear next step, and who this is not for.
3. **Featured: one to three items, each with one next step.** Pick from what exists (a guide, a teardown, a booking page). If nothing exists, list what to create first. Say what a visitor does after each.
4. **Experience: rewrite the top two or three roles** around outcomes in the buyer's terms. Every claim must come from the snapshot or the user. If a number is missing, write `[[FILL: result you can stand behind]]`. Never invent one.
5. **Keywords.** Take the words the buyer uses for the problem (from the positioning file). Choose eight to twelve. Show a table of where each lands: headline, About, Experience, Skills. Each term should appear where it reads naturally, a few times in total, never stuffed. Test: would your buyer type or say this? No claims about how LinkedIn ranks anything; this is about being found for, and recognised by, the right words.
6. **Banner, photo and activity notes:** one line each, from what the snapshot shows.
7. **Before and after table** for headline and About so the user can see the change.

## Output

`04-profile-rebuild.md`: the three headlines with a recommended one and why, the About, the Featured plan, the experience rewrites, the keyword map, the notes, and a paste-in checklist ordered by impact (headline first). The user pastes it in. Claude does not edit the profile.

## Rules

- Proof comes from the user. No invented results, clients, awards or numbers.
- Behaviour over labels: say what you do for whom, not a title the buyer would never search for.
- Keep the user's real voice where the snapshot has one.
- **Human gate.** Nothing is changed on LinkedIn. The user reviews and applies each edit.

## Routing

- Principles and the five-second test → `skills/linkedin-profile`
- Posts that bring people here → `skills/month-of-posts`
- DMs once they arrive → `skills/dm-scripts`
- The whole kit → `skills/linkedin-launch`

<!-- provenance:begin -->
<!-- canary: KSK-32dbefc7-profile-rebuild -->
> **Koka Sexton GTM Skills** · `profile-rebuild` · © Koka Sexton · https://kokasexton.com
> Part of the Koka Sexton GTM Skills library (https://github.com/kokasexton/koka-sexton-gtm-skills). MIT licensed.
> If you found this in another project, the original is at the URL above.
<!-- provenance:end -->
