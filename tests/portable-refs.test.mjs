// Content test: a skill must stay portable once installed.
// (tests/ pointers are provenance notes, exempt.)
// install.mjs copies each skill directory (plus the persona files into koka/),
// so a skill may only reference (a) files inside its own directory and
// (b) the shipped persona files KOKA.md / KOKA-FIRST.md. A reference to other
// repo-root paths (lib/, docs/, README.md ...) dangles in an installed copy.
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { skillFiles, rel } from "./_util.mjs";

const PERSONA = new Set(["KOKA.md", "KOKA-FIRST.md"]);
const RE = /(?<![A-Za-z0-9._\/-])((?:scripts|data|examples|templates|docs|lib|mcp|ops)\/[A-Za-z0-9._\/-]+|[A-Z][A-Za-z]*(?:-[A-Z][A-Za-z]*)*\.md|system\.json|packs\.json)/g;

export function run() {
  const fails = [];
  for (const f of skillFiles()) {
    const body = readFileSync(f, "utf8");
    for (const m of new Set(body.match(RE) || [])) {
      const ref = m.replace(/[.,)]+$/, "");
      if (PERSONA.has(ref) || ref === "SKILL.md") continue;
      if (existsSync(join(dirname(f), ref))) continue;
      fails.push(`${rel(f)}: "${ref}" is not inside the skill and is not shipped by install`);
    }
  }
  return fails;
}
