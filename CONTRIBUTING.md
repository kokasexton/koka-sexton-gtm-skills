# Contributing

This library has a quality bar. It's what makes it worth installing.

## The rules

1. **One skill, one job.** If the description needs "and also", it's two skills.
2. **Cite the number or call it an estimate.** Benchmarks come from the canonical copy in [`linkedin-algorithm`](master-skills/linkedin-content/.claude/skills/linkedin-algorithm/SKILL.md). If you restate a number anywhere, including inside a tool, register it in `tests/data-accuracy.test.mjs` so drift fails CI. Weights you invented are labelled as defaults, not data.
3. **Skills that do the work ship a tool.** It should be a zero-dependency Node 18+ script in `scripts/`, use exit codes CI can use, have `--json` for machines, and ship a worked example in `examples/`. Fictional companies only, and no real people's data.
4. **Route it.** A sub-skill is reachable from its orchestrator's `## Routing` section and from the `koka` routing table. `tests/structure.test.mjs` enforces both.
5. **Never fabricate** a stat, a source, or a familiarity, and never auto-send anything outbound.
6. **No secrets.** See [SECURITY.md](SECURITY.md).

## Add a skill

```bash
cp -r templates/skill master-skills/<orchestrator>/.claude/skills/<your-skill>
# edit SKILL.md: name must equal the directory name
node scripts/build-catalog.mjs   # regenerate the README catalog
npm test                         # every gate CI runs
```

A new **orchestrator** goes at `master-skills/<name>/SKILL.md`. Also add its `.claude/skills/` path to `.claude-plugin/plugin.json` and a row to the `koka` routing table.

## Required frontmatter

```yaml
---
name: your-skill            # = directory name, kebab-case, unique across the repo
description: What it does, when to use it, and when not to. The first sentence becomes the catalog line.
when_to_use: "The asks that should trigger it."
not_for: "The asks that look similar but shouldn't."
---
```

Every `SKILL.md` carries the `<!-- koka-first -->` block right after the frontmatter.

## Voice

Read [`KOKA.md`](KOKA.md). Direct, warm, concrete. Short sentences when they land harder. No "in today's fast-paced landscape". The linter will catch you.
