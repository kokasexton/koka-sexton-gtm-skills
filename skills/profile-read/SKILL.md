---
name: profile-read
description: Read the user's own LinkedIn profile and recent posts in their signed-in browser (or from pasted text or a PDF) and save a verbatim snapshot that the rest of the launch kit works from. Read-only, two pages, the user's own profile only. Use as step one of a profile rebuild, an audit, or any customised LinkedIn work. Do not use on anyone else's profile.
when_to_use: "Use when the ask is 'look at my LinkedIn and tell me what to change' or when another launch skill needs the user's current headline, About, Featured, experience and recent posts."
not_for: "Reading other people's profiles, bulk collection of any kind (skills/linkedin-safety), or editing the profile (the user does that)."
metadata:
  origin: Koka Sexton
  url: https://kokasexton.com
  repo: https://github.com/kokasexton/koka-sexton-gtm-skills
  skill_id: profile-read
  canary: KSK-61c9a045-profile-read
---

<!-- koka-first -->
Defaults come from `KOKA-FIRST.md`.

# Profile Read

Everything customised in the launch kit starts from what the profile actually says today. This skill reads it, once, and writes it down.

## Say this first, plainly

LinkedIn's User Agreement restricts automated access to the site. This step is a **user-started, read-only look at your own profile, in your own signed-in browser, across two pages**. It does not scrape, scroll through lists, open other people's profiles or click anything that changes your account. If you'd rather not use a browser, paste the text or upload the PDF instead (see below). Both paths produce the same snapshot.

## Path A: read it in the browser

Use a browser tool your agent has. In Claude, that is Claude in Chrome (load its tools, then check the open tabs, then work in a **new tab**; never reuse one of the user's tabs unless asked).

1. Ask for the profile URL once. If they don't know it, use `linkedin.com/in/me`, which opens their own profile when they are signed in.
2. Open it in a new tab. Confirm it is **their** profile and they are signed in (their name and an edit control are visible). If there is a login wall, a verification step or a CAPTCHA, **stop**. Tell them, and offer Path B. Never type credentials or try to get around a check.
3. Read the page as text. Capture, word for word: headline, location, About, Featured, the top three roles in Experience, Skills if shown, follower count, and the number of recommendations if shown. Note anything that is collapsed behind "see more" rather than guessing at it.
4. Open their recent activity (`/recent-activity/all/` under the profile URL) and read the last ten or so posts: the text, the format (image, document, text, video, link), the date, and the reaction and comment counts as displayed.
5. Close the tab you opened.

**Never do any of these:** click Edit, Connect, Follow, Message, Like, Comment, Post or Save; open another person's profile; page through a followers, connections or search list; take screenshots of other people.

## Path B: no browser

Ask for either: the profile text pasted in, or the PDF from the profile's own "Save to PDF" option, plus the last ten posts pasted. Read the PDF with a document tool. Mark in the snapshot that it came from a paste or a PDF.

## Write the snapshot

Save `01-profile-snapshot.md` in the launch-kit folder:

```
# Profile snapshot: <name>
Read on <date> from <browser | paste | PDF>. Verbatim. Nothing below is rewritten.

## Headline
## About
## Featured
## Experience (top three)
## Skills / followers / recommendations
## Recent posts (newest first): date, format, text, reactions, comments
## Not visible or not captured
```

Then add a short **What I notice** list of plain observations, each tied to a quote: who the headline says you help, what the About leads with, what Featured asks a visitor to do, which topics the posts keep returning to, which formats they use, and whether links sit in the body. State observations, not fixes. The fixes come from the other skills.

## Ask only what the snapshot can't answer

One message, five questions at most: who they most want to reach, what they sell or want to be found for, their best proof (a result, a client type, a number they can stand behind), their goal for the next 90 days, and anything off limits (clients they can't name, topics to avoid). If they answered in the request, don't ask again.

## Rules

- Public information the user can see themselves, and nothing else.
- Quote, don't paraphrase. If a section is empty, say it is empty.
- Never invent a metric, a client or a credential. Proof comes from the user.
- **Human gate.** Nothing is posted, edited or sent.

## Routing

- Define who to reach and say it in one sentence → `skills/positioning-statement`
- Rewrite the profile from the snapshot → `skills/profile-rebuild`
- The whole kit in order → `skills/linkedin-launch`
- Account safety and why this stays light → `skills/linkedin-safety`

<!-- provenance:begin -->
<!-- canary: KSK-61c9a045-profile-read -->
> **Koka Sexton GTM Skills** · `profile-read` · © Koka Sexton · https://kokasexton.com
> Part of the Koka Sexton GTM Skills library (https://github.com/kokasexton/koka-sexton-gtm-skills). MIT licensed.
> If you found this in another project, the original is at the URL above.
<!-- provenance:end -->
