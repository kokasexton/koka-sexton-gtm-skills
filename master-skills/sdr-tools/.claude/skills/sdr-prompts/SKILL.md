---
name: sdr-prompts
description: Ready-to-use agent prompts for SDR work — account research brief, signal-to-message draft, reply triage and response, objection response, and meeting prep — each constrained to supplied facts so the agent never invents. Use when an SDR or an agent needs to do one of these jobs now. Do not use to generate messages without facts.
when_to_use: "Use for daily SDR tasks with an AI agent: researching, drafting from a signal, handling replies and objections, preparing for meetings."
not_for: "Bulk personalisation pipelines — see skills/personalization-at-scale."
---

<!-- koka-first -->
Defaults come from `KOKA-FIRST.md`. Every prompt forbids invented facts. Human gate on everything outbound.

# SDR Prompts

Paste a prompt, fill the braces, and run. Each one ends with what to do if facts are missing.

## 1. Account research brief

```
Build a 6-line research brief on {company} for a {persona} conversation about {offer_topic}.
Use ONLY the sources provided below. Cite the source for each line. If a line has no source, write "unknown".
Lines: what they sell & to whom · recent change (date) · hiring in {function} · stack clues · public priorities of {persona} · best angle for outreach and why.
Sources:
{pasted_sources}
```

## 2. Signal → first message

```
Write a cold email under 100 words.
Signal (true, dated): {signal}. Recipient: {name}, {title}. Offer topic: {offer_topic}.
Shape: observation (the signal) → one idea that connects it to {offer_topic} → one small question.
No flattery, no calendar link, no claims or numbers not given here. Subject: 2–5 words, lowercase.
Then run the cold-email rules: one ask, no template opener.
```

## 3. Reply triage and response

```
Classify this reply as: interested · question · not-now (with timing?) · wrong-person (referral?) · objection · unsubscribe.
Then draft a response under 80 words that does exactly what the reply needs. For unsubscribe: confirm removal, nothing else.
Reply: {reply_text}
Thread context: {thread}
```

## 4. Objection response

```
Objection: {objection}. Context: {context}.
Respond in under 70 words: acknowledge it plainly → one relevant fact or question (only from context) → low-pressure next step.
Do not argue. If the objection is a clear no, accept it and leave the door open.
```

## 5. Meeting prep

```
From the notes and sources below, write: 3 likely priorities, 3 questions to ask, 1 risk, and what "a good outcome" for this call looks like.
Use only the provided material; mark guesses as guesses.
{notes_and_sources}
```

## Routing

- Writing rules these follow → `skills/sdr-writing-rules`
- Lint the draft → `master-skills/cold-email`
