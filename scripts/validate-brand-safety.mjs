#!/usr/bin/env node
/**
 * Brand-safety + structure validator.
 *
 * Enforces:
 *  1. Every SKILL.md has valid frontmatter (name, description).
 *  2. Every SKILL.md carries the `<!-- koka-first -->` block.
 *  3. No forbidden terms (from brand-safety.json) appear in paths or content.
 *
 * Run: node scripts/validate-brand-safety.mjs
 */
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const CONFIG = join(ROOT, "brand-safety.json");
const forbidden = existsSync(CONFIG)
  ? JSON.parse(readFileSync(CONFIG, "utf8")).forbidden ?? []
  : [];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === ".git" || name === "node_modules") continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const files = walk(ROOT);
const fails = [];

for (const f of files) {
  const rel = relative(ROOT, f);

  for (const term of forbidden) {
    if (rel.toLowerCase().includes(term.toLowerCase())) {
      fails.push(`[path] forbidden term "${term}" in ${rel}`);
    }
  }

  if (!rel.endsWith("SKILL.md")) continue;

  const body = readFileSync(f, "utf8");
  if (!/^---[\s\S]*?\n---/.test(body)) fails.push(`[frontmatter] missing in ${rel}`);
  if (!/\bname:\s*\S+/.test(body)) fails.push(`[frontmatter] no name in ${rel}`);
  if (!/\bdescription:\s*\S+/.test(body)) fails.push(`[frontmatter] no description in ${rel}`);
  if (!body.includes("<!-- koka-first -->")) fails.push(`[koka-first] missing block in ${rel}`);

  for (const term of forbidden) {
    if (body.toLowerCase().includes(term.toLowerCase())) {
      fails.push(`[content] forbidden term "${term}" in ${rel}`);
    }
  }
}

const skills = files.filter((f) => f.endsWith("SKILL.md"));
console.log(`checked ${skills.length} skills, ${files.length} files`);
if (fails.length) {
  console.error("\nFAIL:");
  for (const f of fails) console.error("  - " + f);
  process.exit(1);
}
console.log("brand-safety: OK");
