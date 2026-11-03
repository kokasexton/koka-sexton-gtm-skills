#!/usr/bin/env node
/**
 * mini-Koka demo — one command that shows the system working.
 *
 * Run:  node demo.mjs
 *
 * It starts the real MCP server and drives it like a client would: lists the
 * skills, routes example questions to the right skill, and benchmarks two
 * sample posts against the 2026 Algorithm Report.
 */
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const srv = spawn("node", [join(ROOT, "mcp", "server.mjs")], { stdio: ["pipe", "pipe", "inherit"] });

let buf = "";
const res = new Map();
srv.stdout.on("data", (c) => {
  buf += c;
  let i;
  while ((i = buf.indexOf("\n")) >= 0) {
    const line = buf.slice(0, i).trim();
    buf = buf.slice(i + 1);
    if (line) { const d = JSON.parse(line); res.set(d.id, d); }
  }
});

let id = 0;
const call = (name, args = {}) => new Promise((resolve) => {
  const myId = ++id;
  srv.stdin.write(JSON.stringify({ jsonrpc: "2.0", id: myId, method: "tools/call", params: { name, arguments: args } }) + "\n");
  const t = setInterval(() => {
    if (res.has(myId)) { clearInterval(t); resolve(JSON.parse(res.get(myId).result.content[0].text)); }
  }, 20);
});

const line = (s = "") => console.log(s);
const rule = () => line("─".repeat(64));

line();
line("  🧠  mini-Koka — live demo");
line("  (the real MCP server, driven like a client)");
rule();

// 1. What's installed
const skills = (await call("list_skills")).skills;
line(`\n1) ${skills.length} skills installed:`);
for (const s of skills) line(`   • ${s.name}`);

// 2. Routing: ask a question, get the right skill
line("\n2) Ask a question → the agent picks the right skill:");
const asks = [
  "who should I warm this week",
  "score these engagers",
  "run outbound on my list",
  "review my draft post",
];
for (const q of asks) {
  const top = (await call("search_skills", { query: q })).matches[0];
  line(`   "${q}"\n      → ${top?.name}`);
}

// 3. The benchmark engine on two real posts
line("\n3) Score a post against the 2026 Algorithm Report:\n");
const posts = [
  { label: "a short, plain, link-style post", args: { text: "Check this out: https://x.co  #a #b #c #d #e #f", format: "link" } },
  { label: "a long, image, well-formed post", args: { text: "3 things I learned about LinkedIn reach.\n\n" + "The detail matters here. ".repeat(80) + "\n\nWhat would you add?", format: "image", hashtags: 2, dayOfWeek: "Tue", hourUtc: 14 } },
];
for (const p of posts) {
  const b = await call("linkedin_benchmark", p.args);
  line(`   ${p.label}: ${b.good}/${b.total} good`);
  for (const c of b.checks) line(`      [${c.status.padEnd(10)}] ${c.trait.padEnd(11)} ${String(c.value)}`);
  if (b.fixes.length) line(`      fixes: ${b.fixes.length}`);
  line();
}

// 4. Persona
const persona = (await call("get_persona")).persona || "";
const principle = (persona.match(/signal over vanity[^\n]*/i) || [""])[0];
line(`4) Persona loaded (KOKA.md): ${principle || "signal over vanity"}`);
rule();
line("  That's the system: install → route → compute. kokasexton.com\n");

srv.kill();
process.exit(0);
