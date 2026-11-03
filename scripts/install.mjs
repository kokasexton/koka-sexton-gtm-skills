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
 *   node scripts/install.mjs --force         # overwrite skills that already exist
 *
 * Zero dependencies. Node 18+.
 */
import { cpSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { homedir } from "node:os";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { ROOT, skillNames } from "../lib/system.mjs";

const PERSONA_FILES = ["KOKA.md", "KOKA-FIRST.md"];

export function install({ target, force = false, dryRun = false, log = console.log } = {}) {
  if (!dryRun) mkdirSync(target, { recursive: true });
  const installed = [];
  const skipped = [];
  for (const name of skillNames()) {
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
    console.log("usage: node scripts/install.mjs [--project | --target <dir>] [--force] [--dry-run]");
    return;
  }
  const t = args.includes("--target") ? args[args.indexOf("--target") + 1] : null;
  const target = resolve(t || (args.includes("--project") ? join(process.cwd(), ".claude", "skills") : join(homedir(), ".claude", "skills")));
  install({ target, force: args.includes("--force"), dryRun: args.includes("--dry-run") });
  if (!args.includes("--dry-run")) console.log('\nDone. Start a new agent session and say: "use the koka skill — where should we start?"');
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main(process.argv);
