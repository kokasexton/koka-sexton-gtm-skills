// Content test: every SKILL.md has valid frontmatter + the koka-first block.
// Required fields per docs/self-improvement-loop.md: name, description, when_to_use, not_for.
import { readFileSync } from "node:fs";
import { basename, dirname } from "node:path";
import { skillFiles, rel, frontmatter, fmField } from "./_util.mjs";

const REQUIRED = ["name", "description", "when_to_use", "not_for"];

export function run() {
  const fails = [];
  for (const f of skillFiles()) {
    const body = readFileSync(f, "utf8");
    const fm = frontmatter(body);
    if (!fm) {
      fails.push(`${rel(f)}: missing frontmatter block`);
      continue;
    }
    for (const key of REQUIRED) {
      if (!fmField(fm, key)) fails.push(`${rel(f)}: frontmatter missing "${key}"`);
    }
    const name = fmField(fm, "name");
    const dir = basename(dirname(f));
    if (name && name !== dir) {
      fails.push(`${rel(f)}: frontmatter name "${name}" != directory "${dir}"`);
    }
    if (!body.includes("<!-- koka-first -->")) {
      fails.push(`${rel(f)}: missing <!-- koka-first --> block`);
    }
  }
  return fails;
}
