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

const fails = [];
const t = (name, cond) => { console.log((cond ? "PASS " : "FAIL ") + name); if (!cond) fails.push(name); };

const init = await wait(1);
t("initialize -> koka-gtm", init?.result?.serverInfo?.name === "koka-gtm");
const tl = await wait(2);
t("tools/list has 4 tools", tl?.result?.tools?.length === 4);
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

srv.kill();
console.log(fails.length ? `\nFAILED: ${fails.join(", ")}` : "\nALL PASSED");
process.exit(fails.length ? 1 : 0);
