# The founder pack, end to end

Install one bundle, set your pillars, and get a calendar, a gate for every draft, and a month of posts you can check at a glance. Every number below comes from the fictional example files shipped with the skills. Run the commands and you will see the same output. Your own data will differ.

## 1. Install

```bash
node scripts/install.mjs --pack founder --target ./skills
```

Output: `installed 24 new, updated 0, 0 already up to date`. That is the 20 skills listed under `founder` in [`packs.json`](../packs.json), plus `koka` and the orchestrators those skills route through, so routing never points at a missing skill.

Then start a new agent session and say: *use the koka skill. Where should we start?*

## 2. Set the foundations

Work through these in order before you write a post. Each is a skill with its own instructions.

| Step | Skill | What it does |
|---|---|---|
| Profile | `profile-read`, `linkedin-profile`, `profile-rebuild` | Read your profile as a stranger would, then rebuild it |
| Position | `positioning-statement`, `content-pillars` | One sentence on who you help, and the few topics you will own |
| Launch | `linkedin-launch` | The sequence for going from quiet to visible |
| Rules | `linkedin-algorithm` | The canonical numbers every other skill cites |

## 3. Plan the month (`content-calendar`)

Give it your pillars and it lays out a month of slots.

```bash
node skills/content-calendar/scripts/content-calendar.mjs skills/content-calendar/examples/pillars.json
```

On the example pillars the output is a calendar from 2026-12-07 to 2027-01-05: 18 posts, 4 a week, with no post on Fridays. Friday is for replying to comments and building the warm list. The pillar split is Founder finance, plainly 9, Fundraising without theatre 5, Fractional work, behind the scenes 4.

The cadence, slot and rotation are Koka defaults, not benchmark data. Test the posting window against when your own audience is online.

## 4. Gate every draft (`content-evaluation`)

Nothing ships un-gated. The linter checks a draft against the benchmark data and Koka's voice rules, and every finding cites its source.

```bash
node skills/content-evaluation/scripts/lint-post.mjs skills/content-evaluation/examples/before.md
node skills/content-evaluation/scripts/lint-post.mjs skills/content-evaluation/examples/after.md
```

The example `before.md` gets **BLOCK** with 4 fails and 3 warnings: 7 hashtags, a link in the body, engagement bait, and slop phrases. The rewrite in `after.md` gets **SHIP** with 0 fails: 1,511 characters, one hashtag, no links. The fix was the lesson, not more words.

Write the hook and shape with `post-hooks`, `post-storytelling` and `post-formats`. Pick the time with `post-scheduling`. Plan the first reply and the comment follow-up with `post-engagement` and `post-cta`. Turn one strong post into several with `repurposing`.

## 5. Check the whole batch (`month-of-posts`)

Run every draft in a folder through the same gate and get one readiness table.

```bash
node skills/month-of-posts/scripts/batch-lint.mjs skills/month-of-posts/examples/posts
```

On the three example drafts: 2 approved, 1 ready to post, 1 blocked by the gate, 1 waiting on your input. The blocked draft is approved but not ready, because of its hashtags and a link in the body. A post is ready only when you approved it, the gate does not block it, and no placeholder is left. Nothing is posted for you.

## 6. Show up in public safely

`linkedin-comment-warmer` covers warming a target in public with real comments. `linkedin-safety` covers what keeps the account out of trouble. `dm-scripts` covers the warm opener and the reply path once someone engages. These skills never scrape LinkedIn and never send anything.

## Wrong pack?

Sellers working a list want `--pack sdr` and the [SDR pack guide](sdr-pack.md). Investors ranking founders against a thesis want `--pack investor` and the [VCO pack guide](vco-pack.md). An agent can list and fetch packs through the MCP tools `list_packs` and `get_pack`.
