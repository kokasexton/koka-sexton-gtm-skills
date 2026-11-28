#!/usr/bin/env node
/**
 * doctor — check that the install works, and say how to fix what doesn't.
 *
 *   node scripts/doctor.mjs                  # look in the usual places
 *   node scripts/doctor.mjs --target <dir>   # check one skills folder
 *   node scripts/doctor.mjs --json           # machine-readable
 *
 * Checks: Node version, this checkout, an installed skills folder (user-level
 * ~/.claude/skills, project-level ./.claude/skills, or --target), the MCP server
 * answering tools/list, and whether a client config points at a server that exists.
 * Exits 1 on any FAIL. WARN means "works, but you may have meant something else".
 * Zero dependencies. Node 18+.
 */
import { existsSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { homedir } from "node:os";
import { join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { ROOT, skillNames } from "../lib/system.mjs";
import { inspectInstall } from "./install.mjs";
import { CLIENTS, SERVER_KEY, SERVER_PATH, clientConfigPath, isMain } from "../lib/onboarding.mjs";

/** Start the MCP server, ask for its tools, return their names (or an error). */
export function probeMcp(serverPath = SERVER_PATH, timeout = 8000) {
  const input = [
    { jsonrpc: "2.0", id: 1, method: "initialize", params: {} },
    { jsonrpc: "2.0", id: 2, method: "tools/list" },
  ].map((m) => JSON.stringify(m)).join("\n") + "\n";
  const r = spawnSync(process.execPath, [serverPath], { input, encoding: "utf8", timeout });
  if (r.error) return { ok: false, error: r.error.code === "ETIMEDOUT" ? "timed out" : r.error.message };
  const replies = new Map();
  for (const line of (r.stdout || "").split("\n")) {
    if (!line.trim()) continue;
    try {
      const d = JSON.parse(line);
      replies.set(d.id, d);
    } catch {
      return { ok: false, error: "server wrote non-JSON to stdout (this breaks MCP clients)" };
    }
  }
  const tools = replies.get(2)?.result?.tools;
  if (!Array.isArray(tools)) return { ok: false, error: (r.stderr || "no tools/list reply").trim().split("\n")[0] };
  return { ok: true, tools: tools.map((t) => t.name), server: replies.get(1)?.result?.serverInfo };
}

const read = (f) => {
  try {
    return JSON.parse(readFileSync(f, "utf8"));
  } catch {
    return null;
  }
};

export function doctor({ target = null, home = homedir(), cwd = process.cwd(), platform = process.platform, env = process.env, probe = true } = {}) {
  const checks = [];
  const add = (id, status, message, fix = null) => checks.push({ id, status, message, ...(fix ? { fix } : {}) });

  const major = Number(process.versions.node.split(".")[0]);
  if (major >= 18) add("node", "pass", `Node ${process.versions.node}`);
  else add("node", "fail", `Node ${process.versions.node} is too old (need 18 or newer)`, "Install Node 18+ from nodejs.org, then re-run.");

  const have = ["skills", "system.json", "KOKA.md", "KOKA-FIRST.md", "packs.json", "mcp/server.mjs"].filter((p) => !existsSync(join(ROOT, p)));
  if (have.length) add("checkout", "fail", `this checkout is missing: ${have.join(", ")}`, "Re-clone the repo; the folder looks incomplete.");
  else add("checkout", "pass", `${skillNames().length} skills in ${ROOT}`);

  // Installed skills: an explicit target, else both usual locations.
  const places = target
    ? [resolve(target)]
    : [join(cwd, ".claude", "skills"), join(home, ".claude", "skills")];
  const found = places.filter((d) => existsSync(join(d, "koka", "SKILL.md")));
  if (!found.length) {
    add(
      "skills",
      target ? "fail" : "warn",
      target ? `no koka skill in ${places[0]}` : `no installed skills found in ${places.join(" or ")}`,
      "Run: node scripts/setup.mjs   (or: node scripts/install.mjs). Skip this if you use the Claude Code plugin or only the MCP server.",
    );
  } else {
    for (const d of found) {
      const missing = ["KOKA.md", "KOKA-FIRST.md"].filter((f) => !existsSync(join(d, "koka", f)));
      const man = read(join(d, ".koka-manifest.json"));
      const n = man?.skills ? Object.keys(man.skills).length : skillNames().filter((s) => existsSync(join(d, s, "SKILL.md"))).length;
      if (missing.length) add("skills", "fail", `${d}: koka is missing ${missing.join(", ")}`, `Re-run: node scripts/install.mjs --target ${d} --force`);
      else add("skills", "pass", `${n} skill(s) installed in ${d}`);
      const ins = inspectInstall(d);
      if (ins.managed) {
        const label = ins.pack === "full" ? "the full library" : ins.pack === "custom" ? "a custom set" : `the ${ins.pack} pack`;
        const packFlag = ins.pack && !["full", "custom"].includes(ins.pack) ? ` --pack ${ins.pack}` : "";
        const upd = `Run: node scripts/install.mjs --target ${d}${packFlag}   (updates untouched skills)`;
        if (ins.missing.length) add("install-pack", "fail", `${d} holds ${label}, but ${ins.missing.join(", ")} ${ins.missing.length > 1 ? "are" : "is"} gone`, upd);
        else if (ins.stale.length) add("install-pack", "warn", `${d} holds ${label}; ${ins.stale.length} skill(s) are behind this checkout: ${ins.stale.join(", ")}`, upd);
        else add("install-pack", "pass", `${d} holds ${label}, up to date${ins.edited.length ? ` (${ins.edited.length} edited locally, left alone: ${ins.edited.join(", ")})` : ""}`);
      }
    }
  }

  // The MCP server itself.
  let tools = null;
  if (probe && existsSync(SERVER_PATH)) {
    const p = probeMcp();
    if (p.ok) {
      tools = p.tools;
      add("mcp-server", "pass", `MCP server answers, ${p.tools.length} tools (${p.server?.name || "koka-gtm"})`);
    } else add("mcp-server", "fail", `MCP server did not answer: ${p.error}`, "Run `node mcp/server.mjs` by hand to see the error. Node 18+ is required.");
  }

  // Client configs that mention the server.
  const configs = [];
  for (const c of CLIENTS) {
    const f = clientConfigPath(c, { home, cwd, platform, env });
    if (!existsSync(f)) continue;
    const entry = read(f)?.mcpServers?.[SERVER_KEY];
    if (entry) configs.push({ client: c, file: f, entry });
  }
  if (!configs.length) {
    add("mcp-config", "warn", "no MCP client config mentions koka-gtm", "Run: node scripts/setup.mjs --client claude-code   (also: claude-desktop, cursor). Skip if you only use skill files or the plugin.");
  }
  for (const { client, file, entry } of configs) {
    const path = entry.args?.find((a) => typeof a === "string" && a.endsWith("server.mjs"));
    if (!path) add("mcp-config", "fail", `${client} (${file}): entry has no server.mjs path`, "Re-run: node scripts/setup.mjs --client " + client);
    else if (!existsSync(path)) add("mcp-config", "fail", `${client} (${file}) points at ${path}, which does not exist`, "The repo moved. Re-run: node scripts/setup.mjs --client " + client);
    else if (resolve(path) !== SERVER_PATH) add("mcp-config", "warn", `${client} (${file}) uses a different checkout: ${path}`, "Fine if intended. To use this one: node scripts/setup.mjs --client " + client);
    else add("mcp-config", "pass", `${client} config points at this checkout`);
  }
  return { ok: !checks.some((c) => c.status === "fail"), checks, tools };
}

const ICON = { pass: "PASS", warn: "WARN", fail: "FAIL" };

export function format(result) {
  const lines = result.checks.map((c) => `${ICON[c.status]}  ${c.message}${c.fix ? `\n      fix: ${c.fix}` : ""}`);
  const fails = result.checks.filter((c) => c.status === "fail").length;
  const warns = result.checks.filter((c) => c.status === "warn").length;
  lines.push("", fails ? `${fails} problem(s) to fix.` : warns ? `Working. ${warns} thing(s) to check if they apply to you.` : "All good.");
  return lines.join("\n");
}

function main(argv) {
  const args = argv.slice(2);
  const target = args.includes("--target") ? args[args.indexOf("--target") + 1] : null;
  if (args.includes("--help")) {
    console.log("usage: node scripts/doctor.mjs [--target <skills dir>] [--json]");
    return;
  }
  const result = doctor({ target });
  console.log(args.includes("--json") ? JSON.stringify(result, null, 2) : format(result));
  process.exit(result.ok ? 0 : 1);
}

if (isMain(import.meta.url)) main(process.argv);
