// Structure test: the system is wired together, as declared in system.json.
//  - every skill under skills/ appears exactly once (entry, orchestrator, or one orchestrator's sub-skill)
//  - every orchestrator has a Routing section and routes to each of its sub-skills
//  - the koka entry point routes to every orchestrator and every sub-skill
//  - every runnable tool is documented in its SKILL.md and ships a worked example
//  - the plugin manifest loads skills from skills/
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT, SYSTEM, skillNames } from "../lib/system.mjs";

const body = (n) => readFileSync(join(ROOT, "skills", n, "SKILL.md"), "utf8");
const routes = (text, name) => text.includes(`skills/${name}`) || new RegExp("`" + name + "`").test(text);

export function run() {
  const fails = [];
  const names = skillNames();
  const declared = [SYSTEM.entry, ...Object.keys(SYSTEM.orchestrators), ...Object.values(SYSTEM.orchestrators).flat()];

  for (const n of names) {
    const c = declared.filter((d) => d === n).length;
    if (c === 0) fails.push(`system.json: skill "${n}" is not placed in the system`);
    if (c > 1) fails.push(`system.json: skill "${n}" is placed ${c} times`);
  }
  for (const d of new Set(declared)) if (!names.includes(d)) fails.push(`system.json: "${d}" has no skills/${d}/SKILL.md`);

  const staged = SYSTEM.stages.flatMap((s) => s.orchestrators).sort();
  if (JSON.stringify(staged) !== JSON.stringify(Object.keys(SYSTEM.orchestrators).sort())) fails.push("system.json: stages must list every orchestrator exactly once");

  for (const [orch, subs] of Object.entries(SYSTEM.orchestrators)) {
    if (!names.includes(orch)) continue;
    const b = body(orch);
    if (!/^## Routing/m.test(b)) fails.push(`skills/${orch}/SKILL.md: no "## Routing" section`);
    for (const s of subs) if (!routes(b, s)) fails.push(`skills/${orch}/SKILL.md: never routes to its sub-skill "${s}"`);
  }

  if (names.includes(SYSTEM.entry)) {
    const k = body(SYSTEM.entry);
    for (const n of names.filter((n) => n !== SYSTEM.entry)) if (!routes(k, n)) fails.push(`skills/${SYSTEM.entry}/SKILL.md: does not route to "${n}"`);
  }

  for (const n of names) {
    const scripts = join(ROOT, "skills", n, "scripts");
    if (!existsSync(scripts)) continue;
    const b = body(n);
    for (const s of readdirSync(scripts).filter((f) => f.endsWith(".mjs")))
      if (!b.includes(`scripts/${s}`)) fails.push(`skills/${n}/SKILL.md: does not document its tool scripts/${s}`);
    const ex = join(ROOT, "skills", n, "examples");
    if (!existsSync(ex) || readdirSync(ex).length === 0) fails.push(`skills/${n}: ships a tool but no examples/`);
    if (!/## Worked example/.test(b)) fails.push(`skills/${n}/SKILL.md: ships a tool but has no "## Worked example" section`);
  }

  const manifest = JSON.parse(readFileSync(join(ROOT, ".claude-plugin/plugin.json"), "utf8"));
  const paths = [].concat(manifest.skills || []);
  if (paths.length && !paths.some((p) => /^\.\/skills\/?$/.test(p))) fails.push("plugin.json: skills paths must include ./skills/ (or be omitted to use the default)");
  const market = JSON.parse(readFileSync(join(ROOT, ".claude-plugin/marketplace.json"), "utf8"));
  if (!market.plugins?.some((p) => p.name === manifest.name)) fails.push(`marketplace.json: does not list plugin "${manifest.name}"`);

  return fails;
}
