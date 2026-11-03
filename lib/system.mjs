// The skill system's shape, read from system.json. Shared by the catalog
// builder, the installer, and the tests.
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
export const SYSTEM = JSON.parse(readFileSync(join(ROOT, "system.json"), "utf8"));

/** Every skill directory name under skills/ that holds a SKILL.md. */
export function skillNames() {
  return readdirSync(join(ROOT, "skills"))
    .filter((n) => existsSync(join(ROOT, "skills", n, "SKILL.md")))
    .sort();
}

/** name -> parent orchestrator (null for orchestrators and the entry point). */
export function parentOf() {
  const m = new Map();
  for (const [orch, subs] of Object.entries(SYSTEM.orchestrators)) for (const s of subs) m.set(s, orch);
  return m;
}

/** Orchestrators in stage order. */
export function orchestratorsInOrder() {
  return SYSTEM.stages.flatMap((s) => s.orchestrators);
}
