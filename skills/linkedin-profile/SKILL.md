---
name: linkedin-profile
description: Turn a LinkedIn profile into a landing page for the people your content attracts — a headline that says who you help and how, a banner and About that prove it, a Featured section with one clear next step, and activity that matches the claim. Use when posts get engagement but no follows, connection requests, or DMs. Do not use for a job-seeker profile.
when_to_use: "Use when auditing or rewriting a B2B seller's, founder's, or marketer's LinkedIn profile for conversion."
not_for: "Job-search profiles, which optimise for recruiters, not buyers."
metadata:
  origin: Koka Sexton
  url: https://kokasexton.com
  repo: https://github.com/kokasexton/koka-sexton-gtm-skills
  skill_id: linkedin-profile
  canary: KSK-7d595d10-linkedin-profile
---

<!-- koka-first -->
Defaults come from `KOKA-FIRST.md`. Since November 2026 LinkedIn also matches posts to readers by turning each reader's profile into a prompt (see *Profile Relevance* in `skills/linkedin-algorithm`). Your profile does two jobs: it converts the people who click through, and it is the text that decides what you see and, for your readers, what gets matched to them.

# LinkedIn Profile

When a post lands, people click your name. You have about five seconds to answer: **who is this, who do they help, and what do I do next?**

## Top to bottom

| Element | Job | Do | Don't |
|---|---|---|---|
| **Headline** | Who you help, with what result, in your market | "Helping B2B revenue teams in the Bay Area turn LinkedIn engagement into pipeline · LinkedIn Algorithm Report 2026" | "Visionary · Thought Leader · Growth Hacker" |
| **Banner** | Proof at a glance | One line plus one proof point (a report, a number, a logo row) | Stock skyline |
| **Photo** | Trust | Face, good light, looking at the camera | Logo, sunglasses |
| **About** | The story in 3 short paragraphs, opening with a two-sentence position | Who you help and how → problem → proof → one CTA | Résumé in prose |
| **Featured** | The next step | One asset: the report, a teardown, a booking page | Five random posts |
| **Experience** | Credibility, and the work history LinkedIn reads | A filled description per role: the function, systems built, tools and outcomes, in the buyer's terms | Responsibilities, or a blank description |
| **Skills** | The words your buyer would use | Specific skills your ICP would list themselves ("Signal-Based GTM") | A few generic ones ("Management") |
| **Activity** | Consistency | Posts and comments on the same 2–3 topics | Scattered topics |

## What LinkedIn reads (Profile Relevance)

LinkedIn's description is that three blocks of a profile become a text prompt: **profile highlights** (headline, summary, key skills), **work history** (titles, durations, role descriptions) and **education**. Name and gender are left out. Country is added automatically, so write your city, region and vertical into the headline or About yourself. [1][2]

What to do about it:

- **Name the work in every role description.** A blank description leaves a field empty.
- **Write the About's first two sentences as a position:** who you help and how.
- **Use your buyer's terms** in the headline, skills and descriptions. These are Koka's recommendations on how to use the system, not LinkedIn instructions.
- **Mirror the same words in your posts.** The match is between a reader's profile and your post, so the language has to line up on both sides. [2]
- **Treat it as an audit, not a one-off.** Re-read the profile whenever your ICP or offer changes.

LinkedIn hasn't said whether an author's own profile changes how far that author's posts travel, so this skill doesn't claim it does. The sourced reasons to do this work are conversion (people who click through) and relevance (what you see, and the language your readers' profiles are matched on).

## Headline formula

`Helping <who> <achieve what> · <proof or method>`

Write it for the buyer, in their words. **Behaviour over labels:** say what you do, not a title they'd never search for.

## Check

Ask someone in your ICP to look at the profile for five seconds, then tell you who you help. If they can't, rewrite the headline.

## Routing

- Posts that bring people here → `skills/linkedin-content`
- How the feed matches posts to profiles, with the data → `skills/linkedin-algorithm`
- The CTA on posts → `skills/post-cta`

## References

1. Koka Sexton, *LinkedIn's Algorithm Now Reads Your Profile* (Nov 2026): https://kokasexton.com/linkedin-profile-relevance-algorithm/
2. LinkedIn Engineering, *Profile Relevance* (primary source, as cited in [1]): https://www.linkedin.com/blog/engineering/feed/profile-relevance-boosting-feed-relevance-with-llms-at-linkedin
3. Koka Sexton, *LinkedIn Profile Audit Framework* (Jul 2026): https://kokasexton.com/linkedin-profile-homepage-2026-audit/

<!-- provenance:begin -->
<!-- canary: KSK-7d595d10-linkedin-profile -->
> **Koka Sexton GTM Skills** · `linkedin-profile` · © Koka Sexton · https://kokasexton.com
> Part of the Koka Sexton GTM Skills library (https://github.com/kokasexton/koka-sexton-gtm-skills). MIT licensed.
> If you found this in another project, the original is at the URL above.
<!-- provenance:end -->
