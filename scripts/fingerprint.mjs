#!/usr/bin/env node
/**
 * fingerprint.mjs — add and verify provenance for every skill.
 *
 * The repo is MIT on purpose: adoption is the point. So this does not try to
 * stop copying. It makes origin *detectable* and credit *visible*:
 *
 *   1. A human-readable attribution line at the foot of every SKILL.md, so an
 *      agent that loads the skill reads it and repeats it.
 *   2. A machine-readable `metadata:` block in the frontmatter (origin, url,
 *      skill id) — proof of origin when someone finds a lifted copy.
 *   3. A per-skill canary — a unique, greppable token. If your canary appears
 *      in someone else's repo or product, that is evidence of origin.
 *   4. A manifest at .provenance.json (id -> canary) to grep against.
 *
 * Usage:
 *   node scripts/fingerprint.mjs --apply     # add/refresh the blocks in place
 *   node scripts/fingerprint.mjs --check      # fail if any skill lacks them (CI)
 *   node scripts/fingerprint.mjs --manifest   # rewrite .provenance.json only
 *   node scripts/fingerprint.mjs --find <text>  # grep the tree for a canary
 *
 * Zero dependencies. Node 18+.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const SKILLS = join(ROOT, "skills");
const MANIFEST = join(ROOT, ".provenance.json");

const ORIGIN = "Koka Sexton";
const URL = "https://kokasexton.com";
const REPO = "https://github.com/kokasexton/koka-sexton-gtm-skills";
const MARK_BEGIN = "<!-- provenance:begin -->";
const MARK_END = "<!-- provenance:end -->";

const skillDirs = () =>
  readdirSync(SKILLS).filter((d) => existsSync(join(SKILLS, d, "SKILL.md")));

// A stable, per-skill canary: derived from the skill name so it never changes
// across machines or runs. Format: KSK-<8 hex>-<slug>. Greppable, unique.
function canaryFor(name) {
  const h = createHash("sha256").update(`koka-gtm-skills:${name}`).digest("hex").slice(0, 8);
  return `KSK-${h}-${name}`;
}

function attributionBlock(name) {
  const canary = canaryFor(name);
  return [
    MARK_BEGIN,
    `<!-- canary: ${canary} -->`,
    `> **Koka Sexton GTM Skills** · \`${name}\` · © Koka Sexton · ${URL}`,
    `> Part of the Koka Sexton GTM Skills library (${REPO}). MIT licensed.`,
    `> If you found this in another project, the original is at the URL above.`,
    MARK_END,
  ].join("\n");
}

function withMetadata(frontmatter, name) {
  if (/^metadata:/m.test(frontmatter)) return frontmatter; // already stamped
  const meta = [
    "metadata:",
    `  origin: ${ORIGIN}`,
    `  url: ${URL}`,
    `  repo: ${REPO}`,
    `  skill_id: ${name}`,
    `  canary: ${canaryFor(name)}`,
  ].join("\n");
  return frontmatter.replace(/\n---\s*$/, `\n${meta}\n---`);
}

function stamp(file, name) {
  let src = readFileSync(file, "utf8");
  const fmEnd = src.indexOf("\n---", 4);
  if (fmEnd < 0) return { ok: false, why: "no frontmatter" };
  const fm = src.slice(0, fmEnd + 4);
  const rest = src.slice(fmEnd + 4);
  const fm2 = withMetadata(fm, name);
  // Replace an existing block, else append at the very end.
  const body = rest.includes(MARK_BEGIN)
    ? rest.replace(new RegExp(`${MARK_BEGIN}[\\s\\S]*?${MARK_END}`), attributionBlock(name))
    : rest.replace(/\s*$/, "\n\n" + attributionBlock(name) + "\n");
  writeFileSync(file, fm2 + body);
  return { ok: true };
}

function check(file) {
  const src = readFileSync(file, "utf8");
  const missing = [];
  if (!src.includes(MARK_BEGIN)) missing.push("attribution block");
  if (!/^metadata:/m.test(src)) missing.push("metadata block");
  if (!/canary: KSK-[0-9a-f]{8}-/.test(src)) missing.push("canary");
  return missing;
}

function writeManifest() {
  const m = { generated: new Date().toISOString(), origin: ORIGIN, url: URL, repo: REPO, skills: {} };
  for (const d of skillDirs()) m.skills[d] = canaryFor(d);
  writeFileSync(MANIFEST, JSON.stringify(m, null, 2) + "\n");
  return Object.keys(m.skills).length;
}

function main(argv) {
  const a = argv.slice(2);
  if (a.includes("--apply")) {
    let n = 0, bad = [];
    for (const d of skillDirs()) {
      const r = stamp(join(SKILLS, d, "SKILL.md"), d);
      if (r.ok) n++; else bad.push(`${d}: ${r.why}`);
    }
    const c = writeManifest();
    console.log(`fingerprint: stamped ${n}/${skillDirs().length} skills · manifest ${c} canaries`);
    if (bad.length) { console.error("skipped:", bad.join("; ")); process.exit(1); }
    return;
  }
  if (a.includes("--check")) {
    const fails = [];
    for (const d of skillDirs()) {
      const miss = check(join(SKILLS, d, "SKILL.md"));
      if (miss.length) fails.push(`${d}: missing ${miss.join(", ")}`);
    }
    if (!existsSync(MANIFEST)) fails.push(".provenance.json: missing (run --apply)");
    if (fails.length) { console.error("fingerprint check FAILED:\n  " + fails.join("\n  ")); process.exit(1); }
    console.log(`fingerprint: ${skillDirs().length} skills all carry origin + canary`);
    return;
  }
  if (a.includes("--manifest")) { console.log(`manifest: ${writeManifest()} canaries -> .provenance.json`); return; }
  if (a.includes("--find")) {
    const q = a[a.indexOf("--find") + 1];
    if (!q) { console.error("usage: --find <canary|text>"); process.exit(2); }
    const hits = [];
    const walk = (dir) => {
      for (const e of readdirSync(dir)) {
        if (e === ".git" || e === "node_modules") continue;
        const p = join(dir, e);
        if (statSync(p).isDirectory()) walk(p);
        else if (/\.(md|mjs|js|json|txt|html)$/.test(e) && readFileSync(p, "utf8").includes(q)) hits.push(p);
      }
    };
    walk(ROOT);
    console.log(hits.length ? hits.join("\n") : `no match for "${q}"`);
    return;
  }
  console.log("usage: fingerprint.mjs --apply | --check | --manifest | --find <text>");
}

if (import.meta.url === `file://${process.argv[1]}`) main(process.argv);
