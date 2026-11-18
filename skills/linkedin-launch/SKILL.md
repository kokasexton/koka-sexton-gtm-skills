---
name: linkedin-launch
description: Orchestrator for a personalised LinkedIn launch kit. The user activates it, the agent reads their own profile in their signed-in browser (or from pasted text or a PDF), then builds a profile rebuild, an ICP and positioning statement, three to five content pillars, a 30-day calendar, a month of drafted posts and DM scripts for two scenarios. Everything is a draft for the user to approve. Use for a new or tired LinkedIn presence. Do not use to post, edit or message for the user.
when_to_use: "Use when the ask is 'set up my LinkedIn', 'rebuild my profile and plan my content', 'look at my LinkedIn and build me a launch plan', or any request that needs the user's actual profile before it can be answered."
not_for: "One post (skills/linkedin-content), company-page or ad work (skills/linkedin-ads), or outreach at volume (skills/linkedin-outreach-campaign)."
metadata:
  origin: Koka Sexton
  url: https://kokasexton.com
  repo: https://github.com/kokasexton/koka-sexton-gtm-skills
  skill_id: linkedin-launch
  canary: KSK-d54420f1-linkedin-launch
---

<!-- koka-first -->
Defaults come from `KOKA-FIRST.md`.

# LinkedIn Launch

One request, seven steps, one folder of finished drafts. The agent reads the user's own profile first, so everything after it is about this person, not a template.

## How the user starts it

They say something like: **"Run my LinkedIn launch. My profile is linkedin.com/in/<name>."** That's the whole activation. The agent does the rest and stops at each approval point.

## The order

1. **Read the profile** → `skills/profile-read`. A browser read of the user's own profile and recent posts (two pages, read-only), or pasted text or a PDF. Saves `01-profile-snapshot.md`. Say the terms note from that skill before opening anything.
2. **Position** → `skills/positioning-statement`. Who they help, the problem, the disqualifiers, one sentence that passes the test. Saves `02-positioning.md`. **Approval point.**
3. **Pillars** → `skills/content-pillars`. Three to five pillars with editorial direction, and `pillars.json`. Saves `03-pillars.md`. **Approval point.**
4. **Profile rebuild** → `skills/profile-rebuild`. Three headlines, the About, Featured, experience and the keyword map. Saves `04-profile-rebuild.md`. The user pastes it in.
5. **Calendar** → `skills/content-calendar`. Thirty days on real dates at local times, from the script. Saves `05-calendar.md` and `.csv`.
6. **Posts** → `skills/month-of-posts`. One file per post, linted as a batch, approved one by one. Saves `posts/` and `06-posts-review.md`. **Approval point for every post.**
7. **DMs** → `skills/dm-scripts`. Two scenarios, with reply paths. Saves `07-dm-scripts.md`. The user sends their own messages.

Steps 2 and 3 must be approved before anything is built on them. If the user wants only part of the kit, run only that step and its inputs: a profile rebuild needs steps 1 to 3, a calendar needs step 3, DMs need steps 1 and 2.

## Where it works

Create a `linkedin-launch/` folder for the user and save each numbered file in it. Finish with a short summary: what's ready, what is waiting on the user (approvals and `[[FILL: ...]]` placeholders), and the one next action.

## Worked example

`skills/linkedin-launch/examples/alex-rivera/` is the full kit for a fictional fractional-finance consultant, files 01 to 07, so the user can see what each step produces before running it on their own profile. Nothing in it is a real person or a real result.

## Rules

- **Own profile only.** The browser step reads the user's own page. Never open another person's profile, and never click anything that changes the account. If a login wall, a check or a CAPTCHA appears, stop and offer the paste or PDF route.
- **Draft, don't do.** The agent doesn't edit the profile, post, schedule or send. The user does each of those.
- **No invented proof.** Results, clients and numbers come from the user. Gaps are `[[FILL: ...]]`.
- **Public information only**, and only what the user can see themselves.
- Follow `skills/linkedin-safety` for volume and account health.

## Routing

- Read the profile → `skills/profile-read`
- Define who you help → `skills/positioning-statement`
- Pick the pillars → `skills/content-pillars`
- Rewrite the profile → `skills/profile-rebuild`
- Put posts on dates → `skills/content-calendar`
- Draft and check the month → `skills/month-of-posts`
- Script the DMs → `skills/dm-scripts`
- A single post, any time → `skills/linkedin-content`
- Account safety → `skills/linkedin-safety`

<!-- provenance:begin -->
<!-- canary: KSK-d54420f1-linkedin-launch -->
> **Koka Sexton GTM Skills** · `linkedin-launch` · © Koka Sexton · https://kokasexton.com
> Part of the Koka Sexton GTM Skills library (https://github.com/kokasexton/koka-sexton-gtm-skills). MIT licensed.
> If you found this in another project, the original is at the URL above.
<!-- provenance:end -->
