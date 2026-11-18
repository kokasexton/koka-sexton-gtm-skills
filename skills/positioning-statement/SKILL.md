---
name: positioning-statement
description: Turn a profile snapshot and a few answers into an ICP one-pager and a positioning statement the rest of the profile and content hang from. Defines who you help in three layers, the disqualifiers, the one-sentence position, and tests it. Use after profile-read, or when a profile and posts speak to everyone and convert no one. Do not use to define a company's whole go-to-market.
when_to_use: "Use when the ask is 'who am I really for, and how do I say it in one sentence?'"
not_for: "Scoring leads against an ICP (skills/define-icp, skills/linkedin-icp-definer), or the company-wide strategy (skills/gtm-strategy)."
metadata:
  origin: Koka Sexton
  url: https://kokasexton.com
  repo: https://github.com/kokasexton/koka-sexton-gtm-skills
  skill_id: positioning-statement
  canary: KSK-8042d14e-positioning-statement
---

<!-- koka-first -->
Defaults come from `KOKA-FIRST.md`.

# Positioning Statement

If the profile could belong to anyone in the field, it belongs to no one. This skill makes it specific, then checks that it holds.

## Inputs

`01-profile-snapshot.md` and the user's answers (who they want to reach, the offer, the proof, the 90-day goal, what is off limits). If the snapshot doesn't exist, run `skills/profile-read` first.

## Method

1. **Describe the buyer in operator terms, not job titles alone.** Use `skills/define-icp`'s three layers: who they are (firmographic), what is true for them right now (situational), what they do (behavioural). Behaviour over labels: write what the person does or struggles with, not only a title.
2. **Name the problem in business terms.** The cost to the buyer if it stays unsolved, in their words, not yours.
3. **Set the disqualifiers.** Three to five groups the profile should quietly turn away. A position that repels no one is not a position.
4. **Write the position in one sentence.**

   `I help <who> <get what result> by <how, in a few words>, so they <outcome that matters>.`

   Write three versions: plain, sharper, and the one a stranger would repeat to a colleague.
5. **Run the three-lens test on each version.**
   - **Recognition:** would the right buyer say "that's me" in five seconds?
   - **Relevance:** does it name a problem they are paying attention to now?
   - **Range:** is it narrow enough to own, and wide enough to hold a year of content?
6. **Pick one.** Say why, and what you'd lose by choosing it.

## Output

Save `02-positioning.md`: the ICP one-pager (three layers, the problem, disqualifiers), the three position sentences with the test result for each, the chosen one with the trade-off, and a list of the exact words your buyer uses for the problem. Those words feed the headline and the keywords in `skills/profile-rebuild`.

## Rules

- Use only what the user said or the profile shows. Never invent a niche, a client type or a result.
- Weak: "I help businesses grow." Stronger: a named buyer, a named problem, a result they'd recognise.
- If the user serves two very different buyers, say so, and choose one for now. Two audiences in one headline is how profiles go vague.
- **Human gate.** The user approves the position before anything is built on it.

## Routing

- Pillars that prove the position → `skills/content-pillars`
- Score people against this ICP → `skills/linkedin-icp-definer`
- The deeper ICP model → `skills/define-icp`
- Rewrite the profile → `skills/profile-rebuild`

<!-- provenance:begin -->
<!-- canary: KSK-8042d14e-positioning-statement -->
> **Koka Sexton GTM Skills** · `positioning-statement` · © Koka Sexton · https://kokasexton.com
> Part of the Koka Sexton GTM Skills library (https://github.com/kokasexton/koka-sexton-gtm-skills). MIT licensed.
> If you found this in another project, the original is at the URL above.
<!-- provenance:end -->
