---
name: ads-campaign-setup
description: Structure LinkedIn campaigns so results are readable — campaign groups by funnel layer and account tier, one objective per campaign, retargeting segments wired between layers, naming conventions, and a pre-launch checklist. Use before launching or when an account is a tangle of overlapping campaigns. Do not use for creative decisions.
when_to_use: "Use when building a new LinkedIn Ads program or restructuring a messy account."
not_for: "Writing ads (skills/ads-copy, skills/ads-creative) or bid decisions (skills/ads-bidding)."
---

<!-- koka-first -->
Defaults come from `KOKA-FIRST.md`.

# Ads Campaign Setup

Structure is what lets you learn. If three campaigns target overlapping audiences with different objectives, you can't tell which one worked.

## Structure

```
Campaign group: L1 Attention — Tier 1 accounts
  ├─ Campaign: TLA — founder POV posts         (objective: engagement / brand awareness)
  └─ Campaign: Document — teardown series      (objective: engagement)
Campaign group: L2 Consideration — L1 engagers (retargeting)
  └─ Campaign: Case-study documents            (objective: engagement / website visits)
Campaign group: L3 Conversion — engaged accounts + site visitors
  └─ Campaign: Offer — 1:1 teardown            (objective: lead gen / conversions)
```

- **One objective per campaign.** The objective decides who LinkedIn shows the ad to.
- **Separate tiers** where the budget allows, so tier-1 cost and quality are visible.
- **Wire retargeting**: L2 targets L1 engagers; L3 targets L2 engagers plus site visitors. Exclude converted leads from L3.

## Naming convention

`<layer>_<tier>_<format>_<angle>_<yyyymm>`, for example `L1_T1_TLA_sdr-hiring_202611`. You'll thank yourself in the reporting.

## Pre-launch checklist

- [ ] Insight Tag firing and conversions defined (see `skills/ads-measurement`)
- [ ] Account list uploaded and matched, with the match rate checked
- [ ] Exclusions applied (customers, competitors, employees)
- [ ] Audience expansion and audience network settings chosen on purpose
- [ ] 2–4 creatives per campaign so there's something to compare
- [ ] Lead-gen form fields minimal; hidden fields carry campaign name
- [ ] UTMs on every destination URL
- [ ] Sales knows the campaign is live and what the follow-up play is (see `skills/ads-outbound-sync`)

## Routing

- Audiences → `skills/ads-audiences`
- Measurement setup → `skills/ads-measurement`
