#!/usr/bin/env node
/**
 * install — copy every skill into a skills folder an agent discovers.
 *
 * Skills already live flat at skills/<name>/SKILL.md, so this is a careful
 * copy: it never overwrites an existing skill unless --force, skips .gitkeep
 * files, and copies the persona layer (KOKA.md, KOKA-FIRST.md) into `koka/`
 * so the defaults travel with the install.
 *
 * Usage:
 *   node scripts/install.mjs                 # → ~/.claude/skills (all projects)
 *   node scripts/install.mjs --project       # → ./.claude/skills of the cwd project
 *   node scripts/install.mjs --target <dir>  # → any skills directory
 *   node scripts/install.mjs --dry-run       # show what would be installed
 *   node scripts/install.mjs --pack sdr      # a role bundle: sdr | founder | investor (see packs.json)
 *   node scripts/install.mjs --force         # overwrite skills that already exist
 *
 * Zero dependencies. Node 18+.
 */
import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { homedir } from "node:os";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { readFileSync } from "node:fs";
import { ROOT, parentOf, skillNames } from "../lib/system.mjs";

const PERSONA_FILES = ["KOKA.md", "KOKA-FIRST.md"];

/** Skills in a role pack, plus `koka` and every parent orchestrator, so routing never dangles. */
export function packSkills(pack) {
  const packs = JSON.parse(readFileSync(join(ROOT, "packs.json"), "utf8"));
  if (!packs[pack] || pack.startsWith("_")) throw new Error(`unknown pack "${pack}". Available: ${Object.keys(packs).filter((k) => !k.startsWith("_")).join(", ")}`);
  const parents = parentOf();
  const set = new Set(["koka"]);
  for (const n of packs[pack].skills) {
    set.add(n);
    if (parents.get(n)) set.add(parents.get(n));
  }
  return [...set].sort();
}

export function install({ target, force = false, dryRun = false, pack = null, log = console.log } = {}) {
  const wanted = pack ? new Set(packSkills(pack)) : null;
  if (!dryRun) mkdirSync(target, { recursive: true });
  const installed = [];
  const skipped = [];
  for (const name of skillNames()) {
    if (wanted && !wanted.has(name)) continue;
    const dest = join(target, name);
    if (existsSync(dest) && !force) {
      skipped.push(name);
      continue;
    }
    if (!dryRun) {
      if (existsSync(dest)) rmSync(dest, { recursive: true, force: true });
      cpSync(join(ROOT, "skills", name), dest, { recursive: true, filter: (p) => basename(p) !== ".gitkeep" });
      if (name === "koka") for (const f of PERSONA_FILES) cpSync(join(ROOT, f), join(dest, f));
    }
    installed.push(name);
  }
  log(`${dryRun ? "[dry run] would install" : "installed"} ${installed.length} skill(s) → ${target}`);
  if (skipped.length) log(`skipped ${skipped.length} existing (use --force to overwrite): ${skipped.join(", ")}`);
  return { installed, skipped, target };
}

function main(argv) {
  const args = argv.slice(2);
  if (args.includes("--help")) {
    console.log("usage: node scripts/install.mjs [--project | --target <dir>] [--pack sdr|founder|investor] [--force] [--dry-run]");
    return;
  }
  const t = args.includes("--target") ? args[args.indexOf("--target") + 1] : null;
  const target = resolve(t || (args.includes("--project") ? join(process.cwd(), ".claude", "skills") : join(homedir(), ".claude", "skills")));
  const pack = args.includes("--pack") ? args[args.indexOf("--pack") + 1] : null;
  try {
    install({ target, force: args.includes("--force"), dryRun: args.includes("--dry-run"), pack });
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
  if (!args.includes("--dry-run")) console.log('\nDone. Start a new agent session and say: "use the koka skill — where should we start?"');
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main(process.argv);
