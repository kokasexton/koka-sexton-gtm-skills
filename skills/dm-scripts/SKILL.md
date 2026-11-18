---
name: dm-scripts
description: Write DM scripts for two outreach scenarios chosen from the user's goal, usually a warm opener for someone who engaged or connected and a follow-up for someone who showed interest, with a reply path for yes, not now and no. Short, specific, one ask each, built from the position and the profile. Nothing is sent. Use after positioning-statement. Do not use for bulk or automated messaging.
when_to_use: "Use when the ask is 'write my DMs', 'what do I say when someone connects or comments?', or 'give me outreach scripts for my launch'."
not_for: "Running outreach at volume (skills/linkedin-outreach-campaign), cold email (skills/first-touch), or reviving stalled threads (skills/re-engagement)."
metadata:
  origin: Koka Sexton
  url: https://kokasexton.com
  repo: https://github.com/kokasexton/koka-sexton-gtm-skills
  skill_id: dm-scripts
  canary: KSK-f4c3b0e8-dm-scripts
---

<!-- koka-first -->
Defaults come from `KOKA-FIRST.md`. Message craft comes from `skills/linkedin-outreach-campaign` and `skills/first-touch`.

# DM Scripts

Two scenarios, written well, beat twenty templates. Pick the two the user will meet most in the next month and script them for their own position.

## Inputs

`02-positioning.md` (who they help, the problem, the proof) and `01-profile-snapshot.md` (voice). Ask once: which two situations matter most? Common pairs:

- **New connection or new follower** (someone relevant just arrived): a first message that opens a conversation, not a pitch.
- **Someone engaged with a post** (liked, commented, or shared): a message that picks up where they showed interest.
- **A referral or warm intro**, or **someone who asked a question in the comments**, if those are the user's real cases.

## Method for each scenario

1. **Trigger:** one line on when this script is used, and what you know about the person at that point.
2. **Opener, two versions.** Short, specific to the trigger, one idea, no pitch, no "I'd love to pick your brain". Where `skills/linkedin-outreach-campaign` sets a length limit, keep to it. Leave `[[FILL: ...]]` where a real detail about the person goes (a post they wrote, their role, the thing they commented). The user supplies it.
3. **One ask, small.** A question the person can answer in a line. Not a call on the first message.
4. **Reply paths.** A short answer for each of: **yes** (move toward a call, book it plainly, no further selling), **not now** (leave the door open, set a date), **no or not relevant** (thank them and stop).
5. **Silence.** One follow-up after a sensible gap, with a new angle, then stop. Hand to `skills/follow-up`.

## Output

`07-dm-scripts.md`: for each scenario, the trigger, two openers, the ask, the three reply paths and the silence follow-up, plus a short "do not" list: no pasted pitch, no attachment on the first message, no message to someone who has said no.

## Rules

- Use only what the user says about themselves and the public information they can see. Never invent a mutual connection, a post you didn't read, or a result.
- Every script is for a person-to-person message the user sends themselves. No automation, no volume.
- A message that reads as a template should be rewritten until it doesn't.
- **Human gate.** Nothing is sent. The user personalises each message and sends it.

## Routing

- Warming before the message → `skills/linkedin-comment-warmer`
- Quiet threads → `skills/follow-up`, `skills/re-engagement`
- Campaign-level outreach → `skills/linkedin-outreach-campaign`
- Safe volume and account health → `skills/linkedin-safety`
- The whole kit → `skills/linkedin-launch`

<!-- provenance:begin -->
<!-- canary: KSK-f4c3b0e8-dm-scripts -->
> **Koka Sexton GTM Skills** · `dm-scripts` · © Koka Sexton · https://kokasexton.com
> Part of the Koka Sexton GTM Skills library (https://github.com/kokasexton/koka-sexton-gtm-skills). MIT licensed.
> If you found this in another project, the original is at the URL above.
<!-- provenance:end -->
