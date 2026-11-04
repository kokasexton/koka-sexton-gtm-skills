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
 * Tools: list_skills · get_skill · search_skills · get_persona · linkedin_benchmark(s)
 *        · lint_post · lint_email · citation_check · pipeline_rates · pipeline_plan
 *        · clean_list · score_signals · warm_list · panel_score
 * Resources: skill://<name> for every SKILL.md, plus persona://koka
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { SKILL_TOOLS, runSkillTool } from "../lib/tools.mjs";
import { benchmarkPost, benchmarkData } from "../lib/benchmark.mjs";

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
  for (const p of walk(join(ROOT, "skills"))) {
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

const STOP = new Set(("a an the and or of to for in on at with is are do does what when how " +
  "i you we it my me your this that these those who whom whose can help use using asks").split(/\s+/));
function stem(w) { return w.length > 3 && w.endsWith("s") ? w.slice(0, -1) : w; }
function tokenize(s) {
  return String(s || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/).filter((w) => w.length > 1 && !STOP.has(w)).map(stem);
}
function countOcc(hay, w) {
  let n = 0, i = 0;
  while ((i = hay.indexOf(w, i)) >= 0) { n++; i += w.length; }
  return n;
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
  {
    name: "linkedin_benchmark",
    description: "Evaluate a LinkedIn post (draft or published) against the 2026 Algorithm Report data. Returns detected traits, per-trait benchmark checks, and fixes.",
    inputSchema: {
      type: "object",
      properties: {
        text: { type: "string", description: "the post text" },
        format: { type: "string", description: "image | document | text | video | article" },
        hashtags: { type: "integer", description: "hashtag count (else parsed from text)" },
        dayOfWeek: { type: "string", description: "Mon..Sun" },
        hourUtc: { type: "integer", description: "posting hour in UTC" },
      },
      required: ["text"],
    },
  },
  {
    name: "linkedin_benchmarks",
    description: "Return the LinkedIn Algorithm Report benchmark dataset, or one metric (e.g. 'cadence', 'craft', 'comments').",
    inputSchema: { type: "object", properties: { metric: { type: "string" } } },
  },
  ...SKILL_TOOLS,
];

function call(name, args = {}) {
  const skillTool = runSkillTool(name, args);
  if (skillTool !== null) return skillTool;
  const all = skills();
  if (name === "list_skills") {
    return { skills: all.map(({ name, description, path }) => ({ name, description, path })) };
  }
  if (name === "get_skill") {
    const s = all.find((x) => x.name === args.name);
    return s ? { name: s.name, path: s.path, content: s.body } : { error: `no skill named ${args.name}` };
  }
  if (name === "search_skills") {
    const tokens = tokenize(args.query);
    const phrase = String(args.query || "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
    const scored = all
      .map((s) => {
        const nm = s.name.toLowerCase();
        const desc = s.description.toLowerCase();
        const body = s.body.toLowerCase();
        let score = 0;
        for (const w of tokens) {
          if (nm.includes(w)) score += 5;      // name is the strongest signal
          if (desc.includes(w)) score += 3;    // description next
          score += countOcc(body, w);          // body last
        }
        if (phrase && (nm.includes(phrase) || desc.includes(phrase))) score += 10; // exact phrase bonus
        return { name: s.name, description: s.description, path: s.path, score };
      })
      .filter((s) => s.score > 0)
      .sort((a, b) => b.score - a.score || a.name.localeCompare(b.name));
    return { query: args.query, matches: scored };
  }
  if (name === "get_persona") {
    return { persona: readDoc("KOKA.md"), defaults: readDoc("KOKA-FIRST.md") };
  }
  if (name === "linkedin_benchmark") {
    return benchmarkPost(args);
  }
  if (name === "linkedin_benchmarks") {
    return benchmarkData(args.metric);
  }
  return { error: `unknown tool ${name}` };
}

function handle(req) {
  const { method, id, params } = req;
  if (method === "initialize") {
    return { protocolVersion: PROTOCOL, capabilities: { tools: {}, resources: {} },
      serverInfo: { name: "koka-gtm", version: "2.0.0" } };
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
