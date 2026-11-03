// Shared helpers for the content tests under tests/.
// No dependencies — plain Node ESM.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

export const ROOT = process.cwd();

export function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === ".git" || name === "node_modules") continue;
    const p = join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

export function allFiles() {
  return walk(ROOT);
}

export function skillFiles() {
  return allFiles().filter((f) => f.endsWith("SKILL.md"));
}

export function rel(p) {
  return relative(ROOT, p);
}

/** Return the raw frontmatter block (between the leading --- fences), or "" if none. */
export function frontmatter(body) {
  const m = body.match(/^---\n([\s\S]*?)\n---/);
  return m ? m[1] : "";
}

/** Read a single-line frontmatter field (e.g. name, when_to_use). */
export function fmField(fm, key) {
  const m = fm.match(new RegExp("^" + key + ":\\s*(.+)$", "m"));
  return m ? m[1].trim() : null;
}
