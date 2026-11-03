// Content test: no skill links to a missing file or a dead internal path.
//
// References may be written either as a repo-relative path
// (skills/<name>/...) or in the installed-skill shorthand used across
// the library ("skills/<sub>"), which resolves to a sub-skill directory of the
// same name wherever it lives (skills/<master>/.claude/skills/<sub>/).
import { existsSync, readFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { ROOT, skillFiles, rel } from "./_util.mjs";

const PATH_RE = /(?:master-skills|skills)\/[A-Za-z0-9._/-]+/g;

// Map every skill directory name -> its absolute directory path, so the
// installed-skill shorthand resolves regardless of where a sub-skill nests.
function skillDirMap() {
  const map = new Map();
  for (const f of skillFiles()) {
    const dir = dirname(f);
    map.set(basename(dir), dir);
  }
  return map;
}

function resolves(ref, dirs) {
  if (existsSync(join(ROOT, ref))) return true; // real repo-relative path
  const parts = ref.split("/");
  if (parts[0] !== "skills") return false;
  // Installed-skill shorthand: "skills/<sub>[/rest]" -> <skillDir>/<rest>.
  const dir = dirs.get(parts[1]);
  if (!dir) return false;
  return parts.length === 2 || existsSync(join(dir, parts.slice(2).join("/")));
}

export function run() {
  const fails = [];
  const dirs = skillDirMap();
  for (const f of skillFiles()) {
    const body = readFileSync(f, "utf8");
    const refs = new Set(body.match(PATH_RE) || []);
    for (const raw of refs) {
      const ref = raw.replace(/[.,)]+$/, "");
      if (resolves(ref, dirs)) continue;
      fails.push(`${rel(f)}: dead internal reference "${ref}"`);
    }
  }
  return fails;
}
