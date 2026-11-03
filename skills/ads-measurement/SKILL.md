---
name: ads-measurement
description: Measure LinkedIn Ads honestly — Insight Tag and Conversions API setup, conversion definitions that mean pipeline, account-level engagement over click-through, and attribution that admits what it can't see. Use when setting up tracking or reporting on ad performance. Do not use to justify spend after the fact with vanity metrics.
when_to_use: "Use when configuring conversion tracking, choosing KPIs, or building an ads report for leadership."
not_for: "Cherry-picking a metric that makes a campaign look good."
---

<!-- koka-first -->
Defaults come from `KOKA-FIRST.md`. **Signal over vanity** applies directly: impressions and CTR are inputs, not outcomes.

# Ads Measurement

If the report leads with impressions, it's measuring the wrong thing.

## Set up

1. **Insight Tag** on every page, with conversions defined for the actions that matter: demo request, pricing page, high-intent content.
2. **Conversions API (CAPI)**, server-side or via your CRM integration, so offline outcomes (meeting held, opportunity created) flow back. Browser tracking alone misses a lot.
3. **UTMs** on every URL, matching the campaign naming convention, so the CRM can attribute.
4. **Lead-gen form sync** to the CRM, with campaign name in a hidden field.

## KPIs, in order of importance

| Level | Metric | Question it answers |
|---|---|---|
| Outcome | Pipeline created / influenced at target accounts | Is this making money? |
| Account | Target accounts engaged; engaged accounts that took a meeting | Are the right companies paying attention? |
| Audience | Seniority and function mix of engagers | Is it the right people? |
| Efficiency | Cost per engaged target account; cost per qualified meeting | Can we scale it? |
| Input | CTR, CPM, frequency, engagement rate | Diagnostics only |

## Attribution, honestly

- LinkedIn's view-through conversions overstate impact; last-click in the CRM understates it. Report both and say so.
- The cleanest test is a **holdout**: run ads to half the tier-2 accounts, not the other half, and compare meeting rates over a quarter.
- Ask in the meeting: "What made you take this call?" Self-reported attribution catches what tags miss.

## Routing

- Turning engaged accounts into conversations → `skills/ads-outbound-sync`
- Pipeline math → `skills/outbound-metrics`
