---
name: outbound-pipeline
description: Run a staged outbound pipeline on a target list — signals → prioritize → profile → hooks → sequences, behind a pre-flight data-quality gate. Use for "run the outbound pipeline", "build sequences for these companies", "enrich and score these leads". Do not use for a single email.
when_to_use: "Use when a user has a list of target companies or people and wants a full research → score → sequence run."
not_for: "One-off copy — use cold-email. Defining the ICP — use linkedin-icp-definer."
---

<!-- koka-first -->
Human gate: drafts only — the user sends. Defaults come from `KOKA-FIRST.md`.

# Outbound Pipeline

Take a list and run five stages in order. Each stage verifies before the next begins.

## Stage 0 — Pre-flight gate (mandatory)

Validate the input before spending effort:

- **Data freshness** — lead data older than ~90 days is unreliable for LinkedIn enrichment. If stale, halt and tell the user; never silently enrich stale data.
- **ICP baseline** — filter to ICP fit (company size, industry, persona) before anything else.

## Stages

1. **Signals** — for each target, gather buying signals (`buying-signals`).
2. **Prioritize** — score fit × signal recency × depth → P0–P3. Only P0/P1 proceed.
3. **Profile** — a short read per target (`linkedin-signal-stack`).
4. **Hooks** — one specific angle per target (`personalization`).
5. **Sequences** — 2–3 spaced touches, each adding value; stop on reply (`cold-email`).

## Rules

- Never silently run on stale data — halt and say so.
- Never auto-send.
- One change at a time so the effect is legible.

## Routing
- Signals → `buying-signals`
- Copy → `cold-email`, `personalization`
- Who's warm already → `linkedin-warm-list-builder`
