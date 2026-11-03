---
name: find-contacts
description: Find the right people inside target accounts — map the buying committee, search by function and seniority with Boolean title logic, prefer people who show signals, and get contact data from compliant sources. Use when you have target accounts and need names. Do not use to mass-collect every employee.
when_to_use: "Use when building the contact layer for tiered accounts: who to reach, and how to find them."
not_for: "Sourcing companies (skills/source-companies) or verifying emails (skills/clean-validate)."
---

<!-- koka-first -->
Defaults come from `KOKA-FIRST.md`. Only collect data you're allowed to use, and honour opt-outs and local privacy law.

# Find Contacts

Three right people at an account beat thirty random ones.

## Map the committee first

Per tier-1 account, aim for **3–5 people** across roles:
- **Economic buyer:** VP/C-level in the function (see `skills/atl-messaging`)
- **Champion:** a Director or manager who feels the pain (see `skills/btl-messaging`)
- **User:** a practitioner who'll live in the product
- **Watch for blockers:** security, procurement, IT

Tier 2: 1–3 people. Tier 3: 1, usually the champion.

## Search with Boolean titles

Titles vary wildly. Search by function and seniority, then refine with Boolean:

```
("VP" OR "Vice President" OR "Head of" OR "Director") AND ("Revenue Operations" OR "RevOps" OR "Sales Operations")
NOT ("Assistant" OR "Intern" OR "Recruiter")
```

Classify what you find off their **own headline** (the rubric in `skills/warm-list` catches "Ex-", "Aspiring", "Assistant to").

## Prefer people with signals

Inside an account, prioritise the person who **engaged** with your content, **recently joined**, or **posts about the problem**. One of them is worth more than the org chart (see `master-skills/signal-sourcer`).

## Contact data

- Get it from compliant enrichment tools and keep the source recorded on each record.
- **Work email over personal.** Never use a personal address for cold B2B outreach.
- Use phone numbers only where calling is lawful and expected.

## Routing

- Clean and verify → `skills/clean-validate`
- De-dupe → `skills/deduplicate`
