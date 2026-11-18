---
name: committee-map
description: Map the buying committee inside one target account from public information: who is the economic buyer, champion, influencer and blocker, who to warm first, and the first touch for each. Use when you have an account and need the key people, not a list of names. Do not use to shortlist investors or founders.
when_to_use: "Use when the ask is 'who are the key people at this account, who do I talk to first, and how?'"
not_for: "Ranking an audience (skills/signal-model), finding email addresses (skills/find-contacts), or picking investors (skills/founder-shortlist)."
metadata:
  origin: Koka Sexton
  url: https://kokasexton.com
  repo: https://github.com/kokasexton/koka-sexton-gtm-skills
  skill_id: committee-map
  canary: KSK-0d62aa55-committee-map
---

<!-- koka-first -->
Defaults come from `KOKA-FIRST.md`.

# Committee Map

One champion cannot close a deal alone. This skill shows the room before anyone sends a message.

## Method

1. **Fix the account and the offer.** One account at a time. Know who in it feels the pain the offer solves.
2. **Collect the people.** From public profiles, the company's own pages, and any engagement you already have. Classify seniority and function from each person's own headline, using the rubric in `skills/engagement-intelligence`.
3. **Assign a committee role to each person:**
   - **Economic buyer:** holds the budget.
   - **Champion:** feels the pain and has standing to push.
   - **Influencer:** shapes the decision from the side.
   - **Blocker:** controls risk, security, legal or procurement.
   - **Unknown:** say so. Do not guess.
4. **Pull in signal.** Run `skills/signal-model` on any events you hold. Note who is already warming and who has no signal yet.
5. **Pick who to warm first.** Usually the strongest compound signal at the right level, not the most senior title. Say why.
6. **Write the first touch per person.** A react, a comment or a short DM that references something real and asks for nothing.

## Output

- A committee table: person, title, role, tier, strongest signal.
- **Warm first:** one name and the reason.
- **Path to the buyer:** who can introduce or influence whom, from public evidence only.
- **Gaps:** roles with no one identified yet.
- A CSV for the CRM.

## Rules

- Public data only. No logins, no cookies, no private information.
- Label inferred roles as inferred. Never invent a title, a reporting line or a relationship.
- One account per map. A bigger list is a different job.
- **Human gate.** Nothing is auto-sent.

## Routing

- Score who is engaging and how hot → `skills/signal-model`
- Define whether the account fits at all → `skills/qualify-accounts`
- Find contact details → `skills/find-contacts`
- Write the first touch → `skills/first-touch`, `skills/linkedin-comment-warmer`
- Research one person → `skills/linkedin-signal-stack`

<!-- provenance:begin -->
<!-- canary: KSK-0d62aa55-committee-map -->
> **Koka Sexton GTM Skills** · `committee-map` · © Koka Sexton · https://kokasexton.com
> Part of the Koka Sexton GTM Skills library (https://github.com/kokasexton/koka-sexton-gtm-skills). MIT licensed.
> If you found this in another project, the original is at the URL above.
<!-- provenance:end -->
