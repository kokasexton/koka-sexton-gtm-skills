// MCP server smoke test: spawn mcp/server.mjs and exercise the protocol.
// Run: node tests/mcp.test.mjs
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(dirname(fileURLToPath(import.meta.url)));
const srv = spawn("node", [join(ROOT, "mcp", "server.mjs")], { stdio: ["pipe", "pipe", "inherit"] });

let buf = "";
const responses = new Map();
srv.stdout.on("data", (c) => {
  buf += c;
  let i;
  while ((i = buf.indexOf("\n")) >= 0) {
    const line = buf.slice(0, i).trim();
    buf = buf.slice(i + 1);
    if (line) {
      const d = JSON.parse(line);
      responses.set(d.id, d);
    }
  }
});

const send = (o) => srv.stdin.write(JSON.stringify(o) + "\n");
const wait = (id) => new Promise((res) => {
  const t = setInterval(() => {
    if (responses.has(id)) { clearInterval(t); res(responses.get(id)); }
  }, 20);
});

send({ jsonrpc: "2.0", id: 1, method: "initialize", params: {} });
send({ jsonrpc: "2.0", id: 2, method: "tools/list" });
send({ jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: "list_skills", arguments: {} } });
send({ jsonrpc: "2.0", id: 4, method: "tools/call", params: { name: "search_skills", arguments: { query: "cold email" } } });
send({ jsonrpc: "2.0", id: 5, method: "resources/list" });
send({ jsonrpc: "2.0", id: 6, method: "tools/call", params: { name: "get_persona", arguments: {} } });
send({ jsonrpc: "2.0", id: 7, method: "tools/call", params: { name: "linkedin_benchmark", arguments: { text: "3 lessons from LinkedIn reach.\n\n" + "x".repeat(1600) + "\n\nWhat would you add?", format: "image", hashtags: 2 } } });
send({ jsonrpc: "2.0", id: 8, method: "tools/call", params: { name: "search_skills", arguments: { query: "who should I warm this week" } } });
send({ jsonrpc: "2.0", id: 9, method: "tools/call", params: { name: "search_skills", arguments: { query: "score these engagers" } } });

const fails = [];
const t = (name, cond) => { console.log((cond ? "PASS " : "FAIL ") + name); if (!cond) fails.push(name); };

const init = await wait(1);
t("initialize -> koka-gtm", init?.result?.serverInfo?.name === "koka-gtm");
const tl = await wait(2);
t("tools/list has 15 tools", tl?.result?.tools?.length === 15);
const ls = await wait(3);
const listOut = JSON.parse(ls.result.content[0].text);
t("list_skills returns skills", listOut.skills?.length >= 8);
const ss = await wait(4);
const sOut = JSON.parse(ss.result.content[0].text);
t("search 'cold email' finds cold-email", sOut.matches?.some((m) => m.name === "cold-email"));
const rl = await wait(5);
t("resources/list non-empty", rl?.result?.resources?.length >= 8);
const gp = await wait(6);
const pOut = JSON.parse(gp.result.content[0].text);
t("get_persona returns KOKA.md", (pOut.persona || "").includes("mini Koka"));
const bm = await wait(7);
const bOut = JSON.parse(bm.result.content[0].text);
t("linkedin_benchmark returns checks + fixes", Array.isArray(bOut.checks) && bOut.checks.length >= 4);
const rk = await wait(8);
const rkOut = JSON.parse(rk.result.content[0].text);
t("search ranks warm-list-builder #1 for 'who should I warm this week'", rkOut.matches?.[0]?.name === "linkedin-warm-list-builder");
const en = await wait(9);
const enOut = JSON.parse(en.result.content[0].text);
t("search ranks engager-analytics #1 for 'score these engagers'", enOut.matches?.[0]?.name === "linkedin-engager-analytics");

// Skill tools over MCP, fed the shipped examples.
import { readFileSync as rf } from "node:fs";
const ex = (p) => rf(join(ROOT, "skills", p), "utf8");
const calls = [
  [10, "lint_post", { text: ex("content-evaluation/examples/before.md") }],
  [11, "lint_email", { text: ex("cold-email/examples/before.txt") }],
  [12, "citation_check", { page: ex("citation-check/examples/before.md") }],
  [13, "pipeline_rates", { counts: JSON.parse(ex("outbound-metrics/examples/counts.json")) }],
  [14, "pipeline_plan", { plan: ex("outbound-metrics/examples/plan.json") }],
  [15, "clean_list", { csv: ex("list-building/examples/contacts.csv") }],
  [16, "score_signals", { csv: ex("multi-signal/examples/signals.csv") }],
  [17, "warm_list", { csv: ex("warm-list/examples/engagement.csv"), icp: JSON.parse(ex("warm-list/examples/icp.json")) }],
  [18, "panel_score", { csv: ex("prompt-panel/examples/panel.csv"), brand: "Acme" }],
  [19, "lint_post", {}],
  [20, "nonexistent_tool", {}],
];
for (const [id, name, args] of calls) send({ jsonrpc: "2.0", id, method: "tools/call", params: { name, arguments: args } });
const out = async (id) => { const r = await wait(id); return { err: r.result.isError, v: JSON.parse(r.result.content[0].text) }; };
const lp = await out(10); t("lint_post returns verdict + findings", !lp.err && !!lp.v.verdict && lp.v.findings.length > 0);
const le = await out(11); t("lint_email returns verdict", !le.err && !!le.v.verdict);
const cc = await out(12); t("citation_check returns checks", !cc.err && Array.isArray(cc.v.checks));
const pr = await out(13); t("pipeline_rates returns an object", !pr.err && typeof pr.v === "object");
const pp = await out(14); t("pipeline_plan accepts a JSON string", !pp.err && pp.v.people_to_contact > 0);
const cl = await out(15); t("clean_list returns people + counts", !cl.err && Array.isArray(cl.v.people) && !!cl.v.counts);
const sg = await out(16); t("score_signals returns accounts", !sg.err && Array.isArray(sg.v.accounts) && sg.v.accounts.length > 0);
const wl = await out(17); t("warm_list returns people + room", !wl.err && Array.isArray(wl.v.people) && !!wl.v.room);
const ps = await out(18); t("panel_score returns byEngine", !ps.err && !!ps.v.byEngine);
const bad = await out(19); t("missing input is a clean error, not a crash", bad.err === true && /required/.test(bad.v.error));
const unk = await out(20); t("unknown tool is an error", unk.err === true);

srv.kill();
console.log(fails.length ? `\nFAILED: ${fails.join(", ")}` : "\nALL PASSED");
process.exit(fails.length ? 1 : 0);
