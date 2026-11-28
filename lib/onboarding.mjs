// Onboarding helpers shared by scripts/setup.mjs and scripts/doctor.mjs:
// where each MCP client keeps its config, the exact server entry for this
// checkout, a safe merge into an existing config, and the role starter prompts.
import { copyFileSync, existsSync, mkdirSync, readFileSync, realpathSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { ROOT } from "./system.mjs";

export const SERVER_KEY = "koka-gtm";
export const CLIENTS = ["claude-code", "claude-desktop", "cursor"];
export const SERVER_PATH = join(ROOT, "mcp", "server.mjs");

/** The config file each client reads. `claude-code` is the project-level .mcp.json. */
export function clientConfigPath(client, { home = homedir(), platform = process.platform, cwd = process.cwd(), env = process.env } = {}) {
  if (client === "claude-code") return join(cwd, ".mcp.json");
  if (client === "cursor") return join(home, ".cursor", "mcp.json");
  if (client === "claude-desktop") {
    if (platform === "darwin") return join(home, "Library", "Application Support", "Claude", "claude_desktop_config.json");
    if (platform === "win32") return join(env.APPDATA || join(home, "AppData", "Roaming"), "Claude", "claude_desktop_config.json");
    return join(home, ".config", "Claude", "claude_desktop_config.json");
  }
  throw new Error(`unknown client "${client}". Choose one of: ${CLIENTS.join(", ")}`);
}

/** The server entry, with this checkout's real absolute path filled in. */
export function mcpEntry(serverPath = SERVER_PATH) {
  return { command: "node", args: [resolve(serverPath)] };
}

/** The JSON a user would paste, ready to use as-is. */
export function mcpSnippet(serverPath = SERVER_PATH) {
  return JSON.stringify({ mcpServers: { [SERVER_KEY]: mcpEntry(serverPath) } }, null, 2);
}

/**
 * Add the koka-gtm server to a client config, keeping everything else in it.
 * An unreadable (non-JSON) config is never overwritten. An existing file is
 * copied to <file>.koka-backup first. Returns what happened.
 */
export function mergeMcpConfig(file, { serverPath = SERVER_PATH, dryRun = false } = {}) {
  let cfg = {};
  const existed = existsSync(file);
  if (existed) {
    const raw = readFileSync(file, "utf8");
    if (raw.trim()) {
      try {
        cfg = JSON.parse(raw);
      } catch {
        return { file, status: "unreadable", note: "existing file is not valid JSON, left untouched; paste the snippet by hand" };
      }
    }
  }
  if (cfg === null || typeof cfg !== "object" || Array.isArray(cfg)) return { file, status: "unreadable", note: "existing file is not a JSON object, left untouched" };
  const entry = mcpEntry(serverPath);
  const current = cfg.mcpServers?.[SERVER_KEY];
  if (current && JSON.stringify(current) === JSON.stringify(entry)) return { file, status: "unchanged" };
  const status = current ? "updated" : "added";
  if (dryRun) return { file, status: `would be ${status}` };
  if (existed) copyFileSync(file, `${file}.koka-backup`);
  cfg.mcpServers = { ...(cfg.mcpServers || {}), [SERVER_KEY]: entry };
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, JSON.stringify(cfg, null, 2) + "\n");
  return { file, status, backup: existed ? `${file}.koka-backup` : null };
}

/** packs.json minus its _note keys. */
export function readPacks() {
  const packs = JSON.parse(readFileSync(join(ROOT, "packs.json"), "utf8"));
  return Object.fromEntries(Object.entries(packs).filter(([k]) => !k.startsWith("_")));
}

export const FRONT_DOOR_PROMPT = "Use the koka skill. Where should we start?";

/** Starter prompts for a role, or the front-door prompt plus one per role for a full install. */
export function starterPrompts(role) {
  const packs = readPacks();
  if (role && role !== "all") {
    if (!packs[role]) throw new Error(`unknown role "${role}". Choose one of: ${Object.keys(packs).join(", ")}, all`);
    return packs[role].first_prompts.map((p) => p.say);
  }
  return [FRONT_DOOR_PROMPT, ...Object.values(packs).map((p) => p.first_prompts[0].say)];
}

/** True when `metaUrl`'s file is the script being run, including via an npm bin symlink. */
export function isMain(metaUrl) {
  if (!process.argv[1]) return false;
  try {
    return realpathSync(process.argv[1]) === realpathSync(fileURLToPath(metaUrl));
  } catch {
    return false;
  }
}
