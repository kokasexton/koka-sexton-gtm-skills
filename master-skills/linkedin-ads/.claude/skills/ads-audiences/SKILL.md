---
name: ads-audiences
description: Build LinkedIn ad audiences that match the ICP — company-list (ABM) targeting, buying-committee job functions and seniorities, exclusions, and retargeting pools — and keep audience expansion from quietly diluting them. Use when designing or auditing who a campaign reaches. Do not use to define the ICP itself.
when_to_use: "Use when setting up targeting for a LinkedIn campaign, uploading an account list, or diagnosing why an audience is the wrong people."
not_for: "Defining the ICP from scratch — use skills/define-icp first."
---

<!-- koka-first -->
Defaults come from `KOKA-FIRST.md`.

# Ads Audiences

Most wasted ad spend is an audience problem that looks like a creative problem.

## Build order

1. **Accounts first.** Upload the ICP account list as a company list (matched audience), tiered from `skills/qualify-accounts`. Run tier 1 separately so you can see what it costs.
2. **People inside them.** Layer job function plus seniority for the buying committee: decision-maker, champion, influencer. Use functions and seniorities over job-title lists, which miss variants.
3. **Exclusions.** Exclude customers, open opportunities (unless it's a deal-acceleration campaign), competitors, your own employees, and students or entry-level roles if irrelevant.
4. **Retargeting pools.** Website visitors (Insight Tag), video viewers, document openers, lead-form openers, and company-page engagers. These feed layers 2–3.

## Guardrails

- **Turn off audience expansion** and the off-LinkedIn audience network for ABM campaigns, unless you're deliberately testing them. Both widen reach beyond your list.
- Check the **forecast**: if Campaign Manager says the audience is too small to deliver, widen by adding accounts, not by loosening the persona.
- Re-upload account lists as the list changes. Stale lists target last quarter's ICP.

## Read the room after launch

Check the demographics report: are the job functions, seniorities, and companies actually reached the ones you targeted? If the mix is off, it's the same diagnosis as organic: who's in the room matters more than how many (see `master-skills/engagement-intelligence`).

## Routing

- Accounts → `skills/qualify-accounts`
- Campaign structure → `skills/ads-campaign-setup`
