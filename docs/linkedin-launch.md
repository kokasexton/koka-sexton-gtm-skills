# LinkedIn Launch Kit: how to use it

One request turns your own LinkedIn profile into a profile rebuild, a positioning statement, content pillars, a 30-day calendar, a month of drafted posts and DM scripts. You start it. The agent reads your profile, builds the drafts, and stops at each approval point. It never edits your profile, posts or sends.

## Start it

Say: **"Run my LinkedIn launch. My profile is linkedin.com/in/your-name."**

The skill is [`linkedin-launch`](../skills/linkedin-launch/SKILL.md). If you only want one part, name it ("Use content-calendar on these pillars").

## What you get

| # | File | From | You do |
|---|---|---|---|
| 1 | `01-profile-snapshot.md` | [`profile-read`](../skills/profile-read/SKILL.md) | Check it reads right |
| 2 | `02-positioning.md` | [`positioning-statement`](../skills/positioning-statement/SKILL.md) | **Approve** the one-sentence position |
| 3 | `03-pillars.md`, `pillars.json` | [`content-pillars`](../skills/content-pillars/SKILL.md) | **Approve** the pillars |
| 4 | `04-profile-rebuild.md` | [`profile-rebuild`](../skills/profile-rebuild/SKILL.md) | Paste each edit into LinkedIn |
| 5 | `05-calendar.md`, `.csv` | [`content-calendar`](../skills/content-calendar/SKILL.md) | Move any slot that clashes |
| 6 | `posts/`, `06-posts-review.md` | [`month-of-posts`](../skills/month-of-posts/SKILL.md) | **Approve** each post, fill the placeholders |
| 7 | `07-dm-scripts.md` | [`dm-scripts`](../skills/dm-scripts/SKILL.md) | Personalise and send by hand |

A finished example for a fictional consultant is in [`skills/linkedin-launch/examples/alex-rivera/`](../skills/linkedin-launch/examples/alex-rivera/00-README.md).

## How the profile read works

Three ways, same result:

1. **Browser (default).** With Claude in Chrome (or another browser tool your agent has), the agent opens **your own** profile in a new tab and reads the text: headline, About, Featured, top roles, then your recent activity. Two pages, read-only. You need to be signed in.
2. **Paste.** Paste your profile text and your last ten posts.
3. **PDF.** Use the "Save to PDF" option on your profile and attach it, plus the posts.

### Read this before you use the browser step

LinkedIn's User Agreement restricts automated access to the site. This step is designed to stay light: your own profile, two pages, read-only, with you present, started by you. The agent does not click anything that changes your account, open anyone else's profile, or page through lists. If LinkedIn shows a login wall, a verification step or a CAPTCHA, the agent stops and asks you to paste or attach instead. If you are not comfortable with any browser access, use paste or PDF. The outputs are identical. See [`linkedin-safety`](../skills/linkedin-safety/SKILL.md).

## The two tools

```
node skills/content-calendar/scripts/content-calendar.mjs skills/content-calendar/examples/pillars.json --start 2026-12-07 --per-week 4 --tz America/New_York
node skills/month-of-posts/scripts/batch-lint.mjs skills/month-of-posts/examples/posts/
```

- `content-calendar.mjs` places posts on dates at local times, rotates pillars with none twice in a row, never schedules link posts, and leaves Fridays empty. It exits 2 if you ask for more than five posts a week or have more than five pillars.
- `batch-lint.mjs` lints every post file and marks it READY only if you approved it, it isn't blocked and no `[[FILL: ...]]` is left. It exits 1 when an approved post is blocked or unfilled, and never edits a file.

## What the agent won't do

- Edit your profile, post, schedule, comment, connect or message.
- Invent a result, client, number, award or mutual connection. Gaps are `[[FILL: ...]]`.
- Open anyone else's profile or collect lists of people.

## Troubleshooting

| Symptom | Cause | Fix |
|---|---|---|
| Agent says it can't open the profile | Not signed in, no browser tool, or a login wall | Sign in and retry, or paste or attach a PDF |
| Snapshot has "not captured" gaps | Content sat behind "see more" | Paste those sections |
| Calendar exits with an error | More than five posts a week, or more than five pillars | Lower `per_week`, merge pillars |
| A pillar runs out of angles | Fewer angles than slots | Ask for more angles, or lower the cadence |
| Batch check exits 1 | An approved post is blocked or has a placeholder | Fix the finding or fill the placeholder, re-run |
| Posts sound generic | Thin profile or no stories supplied | Give two or three real stories, ask for a redraft |

## FAQ

**Does it post for me?** No. Every edit, post and message is yours to make.

**How long does it take?** The read and the drafts are quick. The approvals are where your time goes: position, pillars, then each post.

**Can I run only the DMs?** Yes, but they need your position first. Run `positioning-statement`, then `dm-scripts`.

**Will this get me results?** It gives you a clear position, a consistent schedule and drafts that pass the linter. Results depend on what you say and who sees it. Weights and cadence here are Koka defaults, not guarantees.
