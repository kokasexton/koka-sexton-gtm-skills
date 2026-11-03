#!/usr/bin/env node
/**
 * build-catalog — generate the skill catalog in README.md from system.json and
 * the SKILL.md files, so the README can never drift from what ships.
 *
 *   node scripts/build-catalog.mjs          # rewrite the block (and badge counts) in README.md
 *   node scripts/build-catalog.mjs --check  # exit 1 if README is out of date (CI)
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { ROOT, SYSTEM, skillNames, orchestratorsInOrder } from "../lib/system.mjs";

const README = join(ROOT, "README.md");
const START = "<!-- catalog:start -->";
const END = "<!-- catalog:end -->";

function meta(name) {
  const dir = join(ROOT, "skills", name);
  const body = readFileSync(join(dir, "SKILL.md"), "utf8");
  const fm = (body.match(/^---\n([\s\S]*?)\n---/) || [])[1] || "";
  const description = ((fm.match(/^description:\s*(.+)$/m) || [])[1] || "").replace(/^"|"$/g, "").trim();
  const first = description.split(/(?<=[.!?])\s+(?=[A-Z])/)[0];
  const scripts = join(dir, "scripts");
  const tools = existsSync(scripts) ? readdirSync(scripts).filter((f) => f.endsWith(".mjs")) : [];
  return { name, first, tools };
}

export function counts() {
  const names = skillNames();
  return { skills: names.length, tools: names.reduce((n, s) => n + meta(s).tools.length, 0), orchestrators: orchestratorsInOrder().length };
}

export function buildCatalog() {
  const row = (m, type) => `| ${type === "sub-skill" ? "↳ " : ""}[${type === "sub-skill" ? m.name : `**${m.name}**`}](skills/${m.name}/SKILL.md) | ${type} | ${m.first} | ${m.tools.map((t) => `\`${t}\``).join(", ") || "—"} |`;
  const lines = [START, "", "| Skill | Type | What it does | Runnable tool |", "|---|---|---|---|"];
  lines.push(row(meta(SYSTEM.entry), "entry point"));
  for (const stage of SYSTEM.stages) {
    lines.push(`| **${stage.stage.toUpperCase()}** | | | |`);
    for (const o of stage.orchestrators) {
      lines.push(row(meta(o), "orchestrator"));
      for (const s of SYSTEM.orchestrators[o]) lines.push(row(meta(s), "sub-skill"));
    }
  }
  const c = counts();
  lines.push("", `_${c.skills} skills · ${c.orchestrators} orchestrators + 1 entry point · ${c.tools} runnable tools · generated from \`system.json\` by \`scripts/build-catalog.mjs\`_`, "", END);
  return lines.join("\n");
}

export function renderReadme(readme = readFileSync(README, "utf8")) {
  const a = readme.indexOf(START);
  const b = readme.indexOf(END);
  if (a < 0 || b < 0) throw new Error("README.md is missing the catalog markers");
  const c = counts();
  return (readme.slice(0, a) + buildCatalog() + readme.slice(b + END.length))
    .replace(/badge\/skills-\d+-/, `badge/skills-${c.skills}-`)
    .replace(/alt="\d+ skills"/, `alt="${c.skills} skills"`)
    .replace(/badge\/runnable%20tools-\d+-/, `badge/runnable%20tools-${c.tools}-`)
    .replace(/alt="\d+ tools"/, `alt="${c.tools} tools"`);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const current = readFileSync(README, "utf8");
  const next = renderReadme(current);
  if (process.argv.includes("--check")) {
    if (next !== current) {
      console.error("README catalog is out of date — run: node scripts/build-catalog.mjs");
      process.exit(1);
    }
    console.log("catalog: README in sync");
  } else {
    writeFileSync(README, next);
    console.log("catalog: README updated");
  }
}
