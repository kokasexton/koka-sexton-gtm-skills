---
name: linkedin-algorithm
description: The 2026 LinkedIn algorithm data and playbook — cadence, formats, timing, hashtags, comment strategy, funnel metrics, and the 6-rule operating guide. Use for any LinkedIn reach or engagement question. Includes the Profile Relevance system (Nov 2026). Sourced from the VCO LinkedIn Algorithm Report 2026 (data by SignalScout) and LinkedIn Engineering.
when_to_use: "Use for LinkedIn strategy, reach/engagement diagnosis, content mix, posting cadence, and client guidance."
not_for: "Drafting a specific post — use skills/linkedin-content and its sub-skills. This is the data and playbook layer."
metadata:
  origin: Koka Sexton
  url: https://kokasexton.com
  repo: https://github.com/kokasexton/koka-sexton-gtm-skills
  skill_id: linkedin-algorithm
  canary: KSK-d48e7fa7-linkedin-algorithm
---

<!-- koka-first -->
Source: **LinkedIn Algorithm Report 2026** (data by SignalScout) — 2,279 posts, 246 creators, 3,780 engagers, 49,501 reactions, 15,517 comments, May 2025–June 2026. Full report: kokasexton.com/insights.

# LinkedIn Algorithm 2026

> **Don't just read this — run it.** These numbers power a benchmark engine: the MCP tool `linkedin_benchmark` evaluates any draft against them (length, hashtags, format, line breaks, timing) and returns fixes; `linkedin_benchmarks` returns the raw dataset. Data: `data/benchmarks.json`; engine: the repo's benchmark engine, reached through those MCP tools. For a pre-publish gate that also checks voice, slop, and engagement bait, run `lint-post.mjs` in `skills/content-evaluation`.

## The 5 truths

1. Attention is earned, not owned — follower counts ≠ reach.
2. Fewer, better posts beat more, weaker ones — each post competes with your last.
3. Conversation is the real signal — a comment reaches further and comes from more senior people than a like.
4. Keep people on the platform — native formats win; links in the post body get buried.
5. A few people matter more than the crowd — super-engagers and real buyers drive the value.

## Mechanics

- **Staged filtering:** spam screen → small-cohort test → expand only if dwell/engagement is strong. Posts die early even for big accounts if the first cohort doesn't engage.
- **Rewarded:** topical relevance (interest graph, not follower graph), profile authority, dwell time, saves, substantive comments, native content.
- **Penalised:** engagement pods, repetitive hooks, templated generic writing, manipulative link tactics, formulaic CTAs. AI-assisted writing is *not* auto-penalised — generic polished-but-empty output is.

## Profile Relevance (added November 2026)

LinkedIn Engineering described a new retrieval source for the feed called **Profile Relevance**. It uses an LLM to turn each member's profile into a text prompt, turns each post into an embedding, and matches the two in a shared space. It surfaces posts from people the reader isn't connected to. Treat the report data above as the baseline and this as a change layered on top of it.

**How it works**

- **The reader's profile is the query.** Three blocks go into the prompt: profile highlights (headline, summary, key skills), work history (titles, durations, role descriptions) and education. Name and gender are left out. [1][2]
- **The post is the document.** Its embedding comes from post text, titles, transcripts and author metadata such as location. A video with no transcript gives the system less to match. [1]
- **An outside reaction opens the door.** A post becomes eligible only after at least one like, comment or share from a member not connected to the author. Reactions from connections, including engagement pods, don't count toward it. [1][3]
- **Location is added for you.** Country is appended to the prompt automatically, so city, region and vertical have to be written into the profile and the post. [1]
- **Rollout isn't specified.** LinkedIn doesn't say which countries get it or from when. [3]

**What LinkedIn reported** (online experiments against the previous retrieval source, as cited in [1] and [3]):

| Metric | Change |
|---|---|
| Feed updates viewed | +0.54% |
| Viral rate | +0.94% |
| Hide rate | −18.8% |
| Viral engagement for cold-start members | +17.7% |
| Daily active use for cold-start members | +1.8% |

These gains are small on average and largest for members LinkedIn knows little about. Nothing in the engineering post measures what the change does for an author's reach, so don't promise a reach lift.

**What to do with it**

1. **Write posts in your buyer's vocabulary.** The match runs between your post and the reader's headline, skills and work history. Name the function, system, tool and outcome your ICP would put in their own profile.
2. **Plan for the first outside reaction.** Post when your unconnected audience is active, and give people outside your network a reason to react (a specific, useful point beats a general one).
3. **Add transcripts and captions to video** so there is text to index.
4. **Stop leaning on pods.** Connected peers can't open this route.
5. **Keep your own profile specific.** It shapes what *you* see, which matters for warming (see `skills/linkedin-profile`). Whether an author's own profile affects how far their posts travel isn't stated in the sources below.

**Cadence note (external research, not from the report):** van der Blom's 2019 data found a second post within two hours needs about 3× the engagement of the first, and waiting more than three hours treats both about equally [4]. Buffer's study of more than two million posts found no specific reach cap tied to posting frequency [5]. Read both as support for the 3–5 posts a week rule and against stacking posts on the same day.

**Sources**

1. Koka Sexton, *LinkedIn's Algorithm Now Reads Your Profile* (Nov 2026): https://kokasexton.com/linkedin-profile-relevance-algorithm/
2. LinkedIn Engineering, *Profile Relevance* (primary source, as cited in [1]; not independently re-read for this update): https://www.linkedin.com/blog/engineering/feed/profile-relevance-boosting-feed-relevance-with-llms-at-linkedin
3. Tutkit, *LinkedIn matches your professional profile with posts from strangers*: https://www.tutkit.com/en/news/1023-linkedin-matches-your-professional-profile-with-posts-from-strangers
4. Richard van der Blom, LinkedIn Algorithm report (2019): https://www.slideshare.net/RichardvdBlom/full-report-linked-in-algorithm-july-2019
5. Buffer, *How Often Should You Post on LinkedIn?*: https://buffer.com/library/how-often-to-post-on-linkedin/

## The numbers

Quick lookups (cadence, format, hashtags, length, timing, topics) are in [references/benchmark-tables.md](references/benchmark-tables.md), generated from the dataset.

- **Power law:** median post 58 engagements; top 10% 326+ (5.6×); top 1% 2,000+ (35×). The goal is raising your outlier rate.
- **Cadence:** sweet spot **3–5 posts/week** (~195 median, 2.4× the daily cohort). 7+/week collapses to ~80.
- **Formats:** image median 70 vs link/article 25 (**2.8×**). Comment share: Image 22.5%, Document 21.7%, Text 21.4%, Video 14.7%, Article 12.6%.
- **Timing:** Mon–Wed peak; late-morning→early-afternoon (12:00–16:00 UTC). Friday afternoon is a graveyard.
- **Craft:** 1,500+ chars ≈ 2× short (74 vs ~40). **1–2 hashtags** best (median 91); 6+ → 33 (**−63%**). Line breaks/whitespace +72% (62 vs 36). Questions 59; leading with a number 57.
- **Mix:** 76.9% likes, 20.7% comments, 2.3% shares. Reactions 78% plain Like.
- **Audience:** 1 in 3 engagers is Director+; Founders/CEOs 16.5% (largest single tier). Marketing 21.6%, Sales/Revenue 18.7%.
- **Follower-efficiency paradox:** 2K–5K followers → 9.7 eng/1K; 50K+ → 0.8 (**12× collapse**). Comment-engineered content is the clearest efficiency driver.
- **Super-engagers:** 91.9% engage with only one creator; a hardcore few show up across 5–15. That repeating list is the warmest audience in B2B.
- **Comments = buying signal:** commenters 44.2% Director+ vs likers 35.1% (**+26% seniority**). 78% of comments are substantive (40+ chars). Treat the comment section like a CRM.
- **Topics:** AI/automation tops (median 76); how-to/tactical 69; **hot takes underperform (54, −29%)**. Teach the shift, don't provoke.
- **ABM:** engagement clusters by company — account-level intent shows publicly in real time.
- **Viral anatomy (top 1%):** 78% image-based (vs 47% normal), ~0 hashtags.

## The 6-rule playbook

1. Post **3–5×/week** (Mon/Tue/Wed), not daily.
2. Lead with **image/document** formats; keep links out of the body.
3. Use **1–2 hashtags** maximum.
4. Write **long** (1,500+ chars) with whitespace.
5. **Reply to every comment** — the comment section is your pipeline.
6. Engage the **repeating engagers** by name; they're your warmest list.

<!-- provenance:begin -->
<!-- canary: KSK-d48e7fa7-linkedin-algorithm -->
> **Koka Sexton GTM Skills** · `linkedin-algorithm` · © Koka Sexton · https://kokasexton.com
> Part of the Koka Sexton GTM Skills library (https://github.com/kokasexton/koka-sexton-gtm-skills). MIT licensed.
> If you found this in another project, the original is at the URL above.
<!-- provenance:end -->

## Lookup tables

`scripts/build-tables.mjs` renders `references/benchmark-tables.md` from `data/benchmarks.json`. Run `node scripts/build-tables.mjs --write` after the dataset changes; `tests/benchmark-tables.test.mjs` fails if the committed tables drift from the data. Use the tables for a quick answer ("how many hashtags?") and the `linkedin_benchmark` tool for a verdict on a real draft.

## Worked example

Question: "How many hashtags should this post carry?" The answer comes straight from the generated table, see `examples/hashtag-lookup.md`: 1-2 hashtags median 91, 6+ median 33 (63% drop), and top-1% posts typically carry 0.
