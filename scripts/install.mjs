#!/usr/bin/env node
/**
 * install — copy every skill into a skills folder an agent discovers.
 *
 * Skills already live flat at skills/<name>/SKILL.md, so this is a careful
 * copy that is safe to re-run. It records what it installed in
 * <target>/.koka-manifest.json, so a re-run:
 *   - installs skills that are missing,
 *   - updates skills you have not touched when the shipped version changed,
 *   - leaves skills you edited (or that it did not install) alone unless --force,
 *   - and with --force, saves the old copy to <target>/.koka-backup/<time>/ first.
 * It skips .gitkeep files and copies the persona layer (KOKA.md, KOKA-FIRST.md)
 * into `koka/`. With --pack, the installed `koka` lists which skills are
 * actually present, so it never routes to a skill that is not installed.
 *
 * Usage:
 *   node scripts/install.mjs                 # → ~/.claude/skills (all projects)
 *   node scripts/install.mjs --project       # → ./.claude/skills of the cwd project
 *   node scripts/install.mjs --target <dir>  # → any skills directory
 *   node scripts/install.mjs --dry-run       # show what would be installed
 *   node scripts/install.mjs --pack sdr      # a role bundle: sdr | founder | investor (see packs.json)
 *   node scripts/install.mjs --force         # overwrite edited/untracked skills (old copy is backed up)
 *
 * Zero dependencies. Node 18+.
 */
import { cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { homedir, tmpdir } from "node:os";
import { basename, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { ROOT, parentOf, skillNames } from "../lib/system.mjs";

const PERSONA_FILES = ["KOKA.md", "KOKA-FIRST.md"];
const MANIFEST = ".koka-manifest.json";
const BACKUP_DIR = ".koka-backup";
const PACK_MARK = "<!-- koka-pack -->";

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

/** Stable content hash of a directory tree (paths + bytes, sorted). */
function hashDir(dir) {
  const h = createHash("sha256");
  const walk = (d, rel) => {
    for (const n of readdirSync(d).sort()) {
      const p = join(d, n);
      const r = rel ? `${rel}/${n}` : n;
      if (statSync(p).isDirectory()) walk(p, r);
      else h.update(r + "\0").update(readFileSync(p)).update("\0");
    }
  };
  walk(dir, "");
  return h.digest("hex");
}

/** The note appended to `koka` in a pack install: which skills exist here. */
function packNote(packTitle, present, prompts = []) {
  const first = prompts.length
    ? ["", "Good first asks for this role (offer these to a new user):", ...prompts.map((f) => `- "${f.say}" (\`${f.skill}\`)`), ""]
    : [];
  return [
    "",
    PACK_MARK,
    `## Installed pack: ${packTitle}`,
    "",
    "This is a partial install. The routing table above names the whole library, but **only the skills listed here are installed**. Route only to these. If the ask needs a skill that is not listed, say it is not installed and suggest re-running the installer without `--pack` (or with another pack). Do not improvise its content.",
    "",
    `Installed (${present.length}): ${present.map((n) => `\`${n}\``).join(", ")}`,
    ...first,
    "",
  ].join("\n");
}

/** Stage one skill exactly as it should land in the target; returns the staged dir. */
function stage(name, staging, note) {
  const out = join(staging, name);
  cpSync(join(ROOT, "skills", name), out, { recursive: true, filter: (p) => basename(p) !== ".gitkeep" });
  if (name === "koka") {
    for (const f of PERSONA_FILES) cpSync(join(ROOT, f), join(out, f));
    if (note) writeFileSync(join(out, "SKILL.md"), readFileSync(join(out, "SKILL.md"), "utf8").replace(/\s*$/, "\n") + note);
  }
  return out;
}

function readManifest(target) {
  try {
    return JSON.parse(readFileSync(join(target, MANIFEST), "utf8")).skills || {};
  } catch {
    return {};
  }
}

export function install({ target, force = false, dryRun = false, pack = null, log = console.log } = {}) {
  const all = skillNames();
  const wanted = pack ? new Set(packSkills(pack)) : null;
  const packs = JSON.parse(readFileSync(join(ROOT, "packs.json"), "utf8"));
  const manifest = readManifest(target);
  // Skills that will exist here after this run (ours only): what `koka` may route to.
  const present = wanted
    ? all.filter((n) => wanted.has(n) || existsSync(join(target, n, "SKILL.md")))
    : all;
  const note = wanted ? packNote(packs[pack].title, present, packs[pack].first_prompts || []) : null;

  const installed = [];
  const updated = [];
  const unchanged = [];
  const skipped = [];
  const backedUp = [];
  const next = { ...manifest };
  const staging = mkdtempSync(join(tmpdir(), "koka-stage-"));
  const stamp = new Date().toISOString().replace(/[:.]/g, "-");
  try {
    for (const name of all) {
      if (wanted && !wanted.has(name)) continue;
      const dest = join(target, name);
      const staged = stage(name, staging, name === "koka" ? note : null);
      const source = hashDir(staged);
      const known = manifest[name];
      let action;
      if (!existsSync(dest)) action = "install";
      else {
        const current = hashDir(dest);
        if (current === source) {
          unchanged.push(name);
          next[name] = { source, installed: current };
          continue;
        }
        const untouched = known && known.installed === current; // exactly what we wrote, no local edits
        if (untouched || force) action = untouched ? "update" : "overwrite";
        else {
          skipped.push({ name, reason: known ? "edited locally" : "not installed by this tool and differs" });
          continue;
        }
      }
      if (!dryRun) {
        if (action === "overwrite") {
          const bak = join(target, BACKUP_DIR, stamp);
          mkdirSync(bak, { recursive: true });
          renameSync(dest, join(bak, name));
          backedUp.push(name);
        } else if (action === "update") rmSync(dest, { recursive: true, force: true });
        mkdirSync(target, { recursive: true });
        cpSync(staged, dest, { recursive: true });
        next[name] = { source, installed: hashDir(dest) };
      } else if (action === "overwrite") backedUp.push(name);
      (action === "install" ? installed : updated).push(name);
    }
    if (!dryRun && (installed.length || updated.length || unchanged.length)) {
      mkdirSync(target, { recursive: true });
      writeFileSync(join(target, MANIFEST), JSON.stringify({ _note: "Written by scripts/install.mjs. Tracks installed skills so re-runs can update untouched ones safely.", skills: next }, null, 2) + "\n");
    }
  } finally {
    rmSync(staging, { recursive: true, force: true });
  }
  const verb = dryRun ? "[dry run] would" : "";
  log(`${verb ? verb + " " : ""}${dryRun ? "install" : "installed"} ${installed.length} new, ${dryRun ? "update" : "updated"} ${updated.length}, ${unchanged.length} already up to date → ${target}`);
  if (backedUp.length) log(`${dryRun ? "would back up" : "backed up"} ${backedUp.length} replaced skill(s) to ${join(target, BACKUP_DIR, dryRun ? "<time>" : stamp)}: ${backedUp.join(", ")}`);
  if (skipped.length) log(`left ${skipped.length} alone (use --force to replace; old copy is backed up): ${skipped.map((s) => `${s.name} (${s.reason})`).join(", ")}`);
  return { installed: [...installed, ...updated], newlyInstalled: installed, updated, unchanged, skipped: skipped.map((s) => s.name), backedUp, target };
}

const VALUE_FLAGS = ["--target", "--pack"];
const BOOL_FLAGS = ["--project", "--force", "--dry-run", "--help"];

/** Parse argv; throws on unknown flags or a value flag with no value. */
export function parseArgs(args) {
  const out = { force: false, dryRun: false, project: false, help: false, target: null, pack: null };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (VALUE_FLAGS.includes(a)) {
      const v = args[i + 1];
      if (v === undefined || v.startsWith("--")) throw new Error(`${a} needs a value (e.g. ${a} ${a === "--pack" ? "sdr" : "<dir>"})`);
      out[a.slice(2)] = v;
      i++;
    } else if (BOOL_FLAGS.includes(a)) out[a === "--dry-run" ? "dryRun" : a.slice(2)] = true;
    else throw new Error(`unknown option "${a}". Try --help`);
  }
  return out;
}

function main(argv) {
  let o;
  try {
    o = parseArgs(argv.slice(2));
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
  if (o.help) {
    console.log("usage: node scripts/install.mjs [--project | --target <dir>] [--pack sdr|founder|investor] [--force] [--dry-run]\n\nRe-running updates skills you have not edited. --force replaces edited ones (old copy saved under .koka-backup/).");
    return;
  }
  const target = resolve(o.target || (o.project ? join(process.cwd(), ".claude", "skills") : join(homedir(), ".claude", "skills")));
  try {
    install({ target, force: o.force, dryRun: o.dryRun, pack: o.pack });
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
  if (!o.dryRun) console.log('\nDone. Start a new agent session and say: "use the koka skill — where should we start?"');
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main(process.argv);
