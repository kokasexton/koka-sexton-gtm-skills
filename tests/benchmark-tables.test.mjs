// The benchmark lookup tables must match what the generator renders from benchmarks.json.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./_util.mjs";
import { renderTables } from "../skills/linkedin-algorithm/scripts/build-tables.mjs";

export function run() {
  const fails = [];
  const f = join(ROOT, "skills/linkedin-algorithm/references/benchmark-tables.md");
  const cur = readFileSync(f, "utf8");
  if (cur !== renderTables()) fails.push("benchmark-tables.md is stale: run node skills/linkedin-algorithm/scripts/build-tables.mjs --write");
  for (const h of ["## Cadence", "## Format", "## Hashtags", "## Timing"]) if (!cur.includes(h)) fails.push("missing section " + h);
  const skill = readFileSync(join(ROOT, "skills/linkedin-algorithm/SKILL.md"), "utf8");
  if (!skill.includes("references/benchmark-tables.md")) fails.push("linkedin-algorithm SKILL.md does not link the tables");
  return fails;
}
