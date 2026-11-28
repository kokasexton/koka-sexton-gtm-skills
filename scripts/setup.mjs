#!/usr/bin/env node
/**
 * setup — the guided front door. One command, three steps:
 *   1. install the skills (your role's pack, or everything),
 *   2. print the MCP config with this checkout's real path filled in, and
 *      optionally write it into your client's config,
 *   3. run the doctor and tell you the first thing to say.
 *
 *   node scripts/setup.mjs                          # asks which role and client
 *   node scripts/setup.mjs --role sdr --client claude-code
 *   node scripts/setup.mjs --role all --yes         # no questions, skills only
 *
 * Options:
 *   --role sdr|founder|investor|all   which pack (default: ask, or all when not interactive)
 *   --client claude-code|claude-desktop|cursor|none
 *                                     write the MCP entry into that client's config (default: just print it)
 *   --project | --target <dir>        where the skills go (default: ~/.claude/skills)
 *   --mcp-config <file>               write the MCP entry to this file instead of the client default
 *   --yes                             never ask questions
 *   --dry-run                         show what would change, change nothing
 *   --force                           replace skills you edited (old copy is backed up)
 *
 * Existing config files are merged, never replaced, and backed up first.
 * Zero dependencies. Node 18+.
 */
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { install } from "./install.mjs";
import { doctor, format } from "./doctor.mjs";
import { CLIENTS, clientConfigPath, mcpSnippet, mergeMcpConfig, readPacks, starterPrompts, isMain } from "../lib/onboarding.mjs";

const VALUE = ["--role", "--client", "--target", "--mcp-config"];
const BOOL = ["--project", "--yes", "--dry-run", "--force", "--help"];

export function parseSetupArgs(args) {
  const o = { role: null, client: null, target: null, mcpConfig: null, project: false, yes: false, dryRun: false, force: false, help: false };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (VALUE.includes(a)) {
      const v = args[i + 1];
      if (v === undefined || v.startsWith("--")) throw new Error(`${a} needs a value`);
      o[a === "--mcp-config" ? "mcpConfig" : a.slice(2)] = v;
      i++;
    } else if (BOOL.includes(a)) o[a === "--dry-run" ? "dryRun" : a.slice(2)] = true;
    else throw new Error(`unknown option "${a}". Try --help`);
  }
  const roles = [...Object.keys(readPacks()), "all"];
  if (o.role && !roles.includes(o.role)) throw new Error(`unknown role "${o.role}". Choose one of: ${roles.join(", ")}`);
  if (o.client && ![...CLIENTS, "none"].includes(o.client)) throw new Error(`unknown client "${o.client}". Choose one of: ${[...CLIENTS, "none"].join(", ")}`);
  return o;
}

/** The whole setup, non-interactive. Returns a summary; `log` receives the human output. */
export function setup(o, { log = console.log, home = homedir(), cwd = process.cwd() } = {}) {
  const role = o.role || "all";
  const target = resolve(o.target || (o.project ? join(cwd, ".claude", "skills") : join(home, ".claude", "skills")));
  const packs = readPacks();

  log(`\n1/3  Skills${role === "all" ? " (everything)" : ` (${packs[role].title} pack)`}`);
  const inst = install({ target, force: o.force, dryRun: o.dryRun, pack: role === "all" ? null : role, log: (m) => log("     " + m) });

  log("\n2/3  MCP server (optional; gives your agent the runnable tools and the benchmark engine)");
  let mcp = null;
  const client = o.client && o.client !== "none" ? o.client : null;
  const file = o.mcpConfig ? resolve(o.mcpConfig) : client ? clientConfigPath(client, { home, cwd }) : null;
  if (file) {
    mcp = mergeMcpConfig(file, { dryRun: o.dryRun });
    log(`     ${mcp.file}: ${mcp.status}${mcp.backup ? ` (old copy: ${mcp.backup})` : ""}${mcp.note ? ` (${mcp.note})` : ""}`);
    if (mcp.status === "unreadable") log("     Paste this by hand instead:\n" + mcpSnippet().replace(/^/gm, "       "));
    else if (client) log(`     Restart ${client === "claude-code" ? "Claude Code" : client === "cursor" ? "Cursor" : "Claude Desktop"} to load it.`);
  } else {
    log("     Add this to your MCP client's config (path already filled in):\n" + mcpSnippet().replace(/^/gm, "       "));
    log("     Or let this script write it: node scripts/setup.mjs --client claude-code | claude-desktop | cursor");
  }

  log("\n3/3  Check");
  let health = null;
  if (!o.dryRun) {
    health = doctor({ target, home, cwd });
    log(format(health).replace(/^/gm, "     "));
  } else log("     (skipped in a dry run)");

  const prompts = starterPrompts(role);
  log(`\nStart a new agent session and say${prompts.length > 1 ? " one of these" : ""}:`);
  for (const p of prompts) log(`  "${p}"`);
  log("\nNo data yet? See the whole system run on sample data: npm run demo");
  return { target, role, install: inst, mcp, health, prompts };
}

async function ask(rl, question, options) {
  const lines = options.map((o, i) => `  ${i + 1}) ${o.label}`).join("\n");
  for (;;) {
    const a = (await rl.question(`${question}\n${lines}\n> `)).trim();
    const n = Number(a);
    if (n >= 1 && n <= options.length) return options[n - 1].value;
    const hit = options.find((o) => o.value === a);
    if (hit) return hit.value;
    console.log("Pick a number from the list.\n");
  }
}

export async function main(argv) {
  let o;
  try {
    o = parseSetupArgs(argv);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
  if (o.help) {
    console.log("usage: node scripts/setup.mjs [--role sdr|founder|investor|all] [--client claude-code|claude-desktop|cursor|none] [--project | --target <dir>] [--mcp-config <file>] [--yes] [--dry-run] [--force]\n\nRuns the install, MCP config and health check in one go. With no options it asks two questions.");
    return;
  }
  const interactive = process.stdin.isTTY && process.stdout.isTTY && !o.yes;
  if (interactive && (!o.role || !o.client)) {
    const { createInterface } = await import("node:readline/promises");
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    try {
      const packs = readPacks();
      console.log("Koka GTM setup. Two questions.\n");
      if (!o.role) {
        o.role = await ask(rl, "Which best describes you?", [
          ...Object.entries(packs).map(([k, p]) => ({ label: `${p.title}: ${p.for}`, value: k })),
          { label: "Everything (all skills)", value: "all" },
        ]);
      }
      if (!o.client && !o.mcpConfig) {
        o.client = await ask(rl, "\nWhich MCP client should I wire up?", [
          { label: "Claude Code (writes ./.mcp.json in this folder)", value: "claude-code" },
          { label: "Claude Desktop", value: "claude-desktop" },
          { label: "Cursor", value: "cursor" },
          { label: "None, just show me the config", value: "none" },
        ]);
      }
    } finally {
      rl.close();
    }
  }
  try {
    const r = setup(o);
    if (r.health && !r.health.ok) process.exit(1);
  } catch (e) {
    console.error(e.message);
    process.exit(1);
  }
}

if (isMain(import.meta.url)) await main(process.argv.slice(2));
