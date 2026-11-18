---
name: founder-shortlist
description: Turn a tiered list into a partner-ready shortlist of founders and operators, each with why now, thesis match, the warmest angle and who should reach out. Five to ten names, not a data dump. Use after signal-model and thesis-fit have ranked an audience. Do not use to map a sales buying committee.
when_to_use: "Use when a partner or sourcing lead asks 'who should we call this week and why?' and you have a tiered list plus a thesis."
not_for: "Mapping the people inside one target account for a sale (skills/committee-map), or scoring signals (skills/signal-model)."
metadata:
  origin: Koka Sexton
  url: https://kokasexton.com
  repo: https://github.com/kokasexton/koka-sexton-gtm-skills
  skill_id: founder-shortlist
  canary: KSK-fe557f16-founder-shortlist
---

<!-- koka-first -->
Defaults come from `KOKA-FIRST.md`.

# Founder Shortlist

A ranked table is analyst work. A shortlist is the part a partner reads. Your job is the second one.

## Method

1. **Start from the top of the tiered list.** URGENT and HOT people who pass the thesis fit gate. Five to ten maximum. If fewer than five qualify, ship fewer. Do not pad.
2. **Write each entry in five lines:**
   - Name, current role, venture or last company.
   - **Why now.** The specific move or engagement, with dates. "Changed headline to building something new on the 14th, and commented on a partner's post on the 16th."
   - **Thesis match.** What fits and what doesn't. Say the gap out loud.
   - **Warmest angle.** The exact post, comment or shared connection to reference, and which person at the firm should reach out.
   - **Open question.** The one thing still unknown.
3. **End with what you left out and why.** Held by fit, capped by no second signal, too old.

## Rules

- Public data only. No logins, no cookies, no private information.
- Label inference as inference. Never invent a title, a quote, a round or a relationship.
- The first touch references something real and asks for nothing. Under 300 characters, one easy question.
- No statistics unless you can name the source.
- **Human gate.** Nothing is auto-sent.

## Output

The shortlist as a document the partner can read once, plus a CSV beside it (name, title, company, profile URL, tier, why now, owner, next action date) for the CRM.

## Routing

- Define the thesis first → `skills/thesis-fit`
- Score and tier the audience → `skills/signal-model`
- Write the first touch → `skills/first-touch` or `skills/linkedin-comment-warmer`
- Research one founder in depth → `skills/linkedin-signal-stack`

<!-- provenance:begin -->
<!-- canary: KSK-fe557f16-founder-shortlist -->
> **Koka Sexton GTM Skills** · `founder-shortlist` · © Koka Sexton · https://kokasexton.com
> Part of the Koka Sexton GTM Skills library (https://github.com/kokasexton/koka-sexton-gtm-skills). MIT licensed.
> If you found this in another project, the original is at the URL above.
<!-- provenance:end -->
