#!/usr/bin/env node
/**
 * install — put every skill in this repo where a code agent can discover it.
 *
 * Agents discover skills one level deep (<skills-dir>/<name>/SKILL.md), so the
 * nested source layout (orchestrator → .claude/skills/<sub>) is flattened on
 * install: every orchestrator and every sub-skill becomes a sibling. The
 * persona layer (KOKA.md, KOKA-FIRST.md) is copied into the `koka` skill so
 * the defaults travel with the install.
 *
 * Usage:
 *   node scripts/install.mjs                 # → ~/.claude/skills (all projects)
 *   node scripts/install.mjs --project       # → ./.claude/skills of the cwd project
 *   node scripts/install.mjs --target <dir>  # → any skills directory (Cursor, Codex, …)
 *   node scripts/install.mjs --dry-run       # show what would be installed
 *   node scripts/install.mjs --force         # overwrite skills that already exist
 *
 * Zero dependencies. Node 18+.
 */
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { basename, dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const REPO = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const PERSONA_FILES = ["KOKA.md", "KOKA-FIRST.md"];

/** Every directory in master-skills/ that holds a SKILL.md, at any depth. */
export function findSkills(root = REPO) {
  const out = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const p = join(dir, name);
      if (!statSync(p).isDirectory()) continue;
      if (existsSync(join(p, "SKILL.md"))) out.push(p);
      walk(p);
    }
  };
  walk(join(root, "master-skills"));
  return out.sort();
}

/** Copy one skill dir without its nested .claude/ (sub-skills install as siblings). */
function copySkill(src, dest) {
  cpSync(src, dest, {
    recursive: true,
    filter: (p) => {
      const r = relative(src, p);
      return !(r === ".claude" || r.startsWith(".claude/") || r.startsWith(".claude\\") || basename(p) === ".gitkeep");
    },
  });
}

export function install({ target, force = false, dryRun = false, log = console.log } = {}) {
  const skills = findSkills();
  const names = skills.map((s) => basename(s));
  const dupes = names.filter((n, i) => names.indexOf(n) !== i);
  if (dupes.length) throw new Error(`duplicate skill names: ${[...new Set(dupes)].join(", ")}`);

  if (!dryRun) mkdirSync(target, { recursive: true });
  const installed = [];
  const skipped = [];
  for (const src of skills) {
    const name = basename(src);
    const dest = join(target, name);
    if (existsSync(dest) && !force) {
      skipped.push(name);
      continue;
    }
    if (!dryRun) {
      if (existsSync(dest)) rmSync(dest, { recursive: true, force: true });
      copySkill(src, dest);
      if (name === "koka") for (const f of PERSONA_FILES) cpSync(join(REPO, f), join(dest, f));
    }
    installed.push(name);
  }
  log(`${dryRun ? "[dry run] would install" : "installed"} ${installed.length} skill(s) → ${target}`);
  for (const n of installed) log(`  + ${n}`);
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

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  try {
    main(process.argv);
  } catch (e) {
    console.error(`install failed: ${e.message}`);
    process.exit(1);
  }
}
