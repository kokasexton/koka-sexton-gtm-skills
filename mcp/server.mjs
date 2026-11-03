#!/usr/bin/env node
/**
 * mini-Koka MCP server — zero dependencies, stdio JSON-RPC.
 *
 * Serves the whole skill system (orchestrators + sub-skills) and the persona
 * layer to any MCP client (Claude Code, Cursor, ChatGPT, Claude Desktop).
 *
 * Install (any MCP client):
 *   { "mcpServers": { "koka-gtm": { "command": "node",
 *       "args": ["/abs/path/koka-sexton-gtm-skills/mcp/server.mjs"] } } }
 *
 * Tools: list_skills · get_skill · search_skills · get_persona
 * Resources: skill://<name> for every SKILL.md, plus persona://koka
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(HERE);
const PROTOCOL = "2024-11-05";

function walk(dir, out = []) {
  let names;
  try {
    names = readdirSync(dir);
  } catch {
    return out;
  }
  for (const n of names) {
    if (n === ".git" || n === "node_modules" || n === "ops") continue;
    const p = join(dir, n);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (n === "SKILL.md") out.push(p);
  }
  return out;
}

function frontmatter(text) {
  const m = text.match(/^---\n([\s\S]*?)\n---/);
  const fm = {};
  if (m) {
    for (const line of m[1].split("\n")) {
      const mm = line.match(/^(\w[\w-]*):\s*(.*)$/);
      if (mm) fm[mm[1]] = mm[2].replace(/^["']|["']$/g, "");
    }
  }
  return fm;
}

function skills() {
  const out = [];
  for (const p of walk(join(ROOT, "master-skills")).concat(walk(join(ROOT, "skills")))) {
    const body = readFileSync(p, "utf8");
    const fm = frontmatter(body);
    out.push({
      name: fm.name || relative(ROOT, dirname(p)),
      description: fm.description || "",
      path: relative(ROOT, p),
      body,
    });
  }
  return out.sort((a, b) => a.name.localeCompare(b.name));
}

function readDoc(name) {
  try {
    return readFileSync(join(ROOT, name), "utf8");
  } catch {
    return "";
  }
}

const TOOLS = [
  {
    name: "list_skills",
    description: "List every skill in the mini-Koka GTM system (name + description).",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_skill",
    description: "Return the full text of one skill by name (e.g. 'linkedin-algorithm', 'cold-email').",
    inputSchema: { type: "object", properties: { name: { type: "string" } }, required: ["name"] },
  },
  {
    name: "search_skills",
    description: "Keyword-search skills (name, description, and body). Returns ranked matches.",
    inputSchema: { type: "object", properties: { query: { type: "string" } }, required: ["query"] },
  },
  {
    name: "get_persona",
    description: "Return the persona layer (KOKA.md) and defaults (KOKA-FIRST.md) — how mini-Koka behaves.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
];

function call(name, args = {}) {
  const all = skills();
  if (name === "list_skills") {
    return { skills: all.map(({ name, description, path }) => ({ name, description, path })) };
  }
  if (name === "get_skill") {
    const s = all.find((x) => x.name === args.name);
    return s ? { name: s.name, path: s.path, content: s.body } : { error: `no skill named ${args.name}` };
  }
  if (name === "search_skills") {
    const q = String(args.query || "").toLowerCase();
    const scored = all
      .map((s) => {
        const hay = (s.name + " " + s.description + " " + s.body).toLowerCase();
        const hits = q.split(/\s+/).filter(Boolean).reduce((n, w) => n + (hay.split(w).length - 1), 0);
        return { name: s.name, description: s.description, path: s.path, hits };
      })
      .filter((s) => s.hits > 0)
      .sort((a, b) => b.hits - a.hits);
    return { query: args.query, matches: scored };
  }
  if (name === "get_persona") {
    return { persona: readDoc("KOKA.md"), defaults: readDoc("KOKA-FIRST.md") };
  }
  return { error: `unknown tool ${name}` };
}

function handle(req) {
  const { method, id, params } = req;
  if (method === "initialize") {
    return { protocolVersion: PROTOCOL, capabilities: { tools: {}, resources: {} },
      serverInfo: { name: "koka-gtm", version: "0.1.0" } };
  }
  if (method === "tools/list") return { tools: TOOLS };
  if (method === "tools/call") {
    const out = call(params?.name, params?.arguments || {});
    return { content: [{ type: "text", text: JSON.stringify(out, null, 2) }],
      isError: Boolean(out.error) };
  }
  if (method === "resources/list") {
    return { resources: skills().map((s) => ({
      uri: `skill://${s.name}`, name: s.name, mimeType: "text/markdown",
      description: s.description })) };
  }
  if (method === "resources/read") {
    const uri = params?.uri || "";
    if (uri === "persona://koka") {
      return { contents: [{ uri, mimeType: "text/markdown", text: readDoc("KOKA.md") }] };
    }
    const nm = uri.replace(/^skill:\/\//, "");
    const s = skills().find((x) => x.name === nm);
    return s ? { contents: [{ uri, mimeType: "text/markdown", text: s.body }] }
             : { contents: [] };
  }
  if (method?.startsWith("notifications/")) return null;
  throw Object.assign(new Error(`method not found: ${method}`), { code: -32601 });
}

let buf = "";
process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  buf += chunk;
  let idx;
  while ((idx = buf.indexOf("\n")) >= 0) {
    const line = buf.slice(0, idx).trim();
    buf = buf.slice(idx + 1);
    if (!line) continue;
    let req;
    try {
      req = JSON.parse(line);
    } catch {
      continue;
    }
    try {
      const result = handle(req);
      if (result !== null && req.id !== undefined) {
        process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id: req.id, result }) + "\n");
      }
    } catch (e) {
      if (req.id !== undefined) {
        process.stdout.write(JSON.stringify({ jsonrpc: "2.0", id: req.id,
          error: { code: e.code || -32603, message: String(e.message || e) } }) + "\n");
      }
    }
  }
});
