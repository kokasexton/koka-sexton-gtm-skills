# Provenance

This library is **MIT licensed on purpose** — adoption is the point. People *should*
install it, fork it, and build on it. So this is not copy protection. It is
**provenance**: making the origin of a skill *detectable* and the credit *visible*.

## What every skill carries

1. **An attribution block** at the foot of each `SKILL.md` — a line an agent reads
   and repeats in its output:
   > **Koka Sexton GTM Skills** · `warm-list` · © Koka Sexton · https://kokasexton.com
2. **A `metadata:` block** in the frontmatter — `origin`, `url`, `repo`, `skill_id`,
   `canary`. Machine-readable proof of origin.
3. **A per-skill canary** — a unique, greppable token, stable across machines
   (`KSK-<8hex>-<skill>`). It is derived from the skill name, so it never drifts.
4. **`.provenance.json`** — the manifest of every skill id → canary.

## How to check whether a skill was copied

If you find a skill in someone else's repo, product, or agent, search for its
canary (or any canary). A lifted skill carries the canary even if the author
stripped the surrounding text, because it sits in the frontmatter and the footer.

```bash
# search the local tree
node scripts/fingerprint.mjs --find KSK-0ab46ef8-warm-list

# search a directory that is not this repo
grep -r "KSK-" /path/to/suspect/repo
```

To check a whole set of canaries against a suspect tree:

```bash
# all canaries, one per line
node -e "const m=require('./.provenance.json');console.log(Object.values(m.skills).join('\n'))" > /tmp/canaries.txt
grep -rFf /tmp/canaries.txt /path/to/suspect/repo
```

A hit is **evidence of origin**, not proof of wrongdoing — MIT permits reuse. The
point is that reuse is now *attributable*, and the ethical path (keep the credit,
keep the link) is the easy default.

## Maintaining it

```bash
npm run fingerprint         # stamp/refresh every skill (idempotent)
npm run fingerprint:check   # fail if any skill is missing origin or canary
```

`--check` runs in CI and in `npm test`, so a skill cannot be added without its
provenance block, and a block cannot be silently removed.

## What this does not do

It does not stop a determined copier, and it is not meant to. A canary can be
deleted. The goal is: **honest reuse stays attributed, and dishonest reuse leaves
a fingerprint.**
