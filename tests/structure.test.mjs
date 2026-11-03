// Structure test: the system is wired together.
//  - skill names are unique (the installer flattens them into one folder)
//  - every orchestrator has a Routing section and routes to each of its sub-skills
//  - the koka entry point routes to every orchestrator
//  - every runnable tool has a worked example and is documented in its SKILL.md
//  - the plugin manifest covers every skill directory
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { basename, dirname, join } from "node:path";
import { ROOT, skillFiles, rel } from "./_util.mjs";

export function run() {
  const fails = [];
  const dirs = skillFiles().map((f) => dirname(f));
  const names = dirs.map((d) => basename(d));

  for (const n of new Set(names)) {
    if (names.filter((x) => x === n).length > 1) fails.push(`duplicate skill name "${n}" — the installer would collide`);
  }

  const masters = dirs.filter((d) => dirname(d) === join(ROOT, "master-skills"));
  for (const m of masters) {
    const body = readFileSync(join(m, "SKILL.md"), "utf8");
    const subsDir = join(m, ".claude", "skills");
    if (basename(m) !== "koka" && !/^## Routing/m.test(body)) fails.push(`${rel(m)}/SKILL.md: no "## Routing" section`);
    if (!existsSync(subsDir)) continue;
    for (const sub of readdirSync(subsDir)) {
      if (!existsSync(join(subsDir, sub, "SKILL.md"))) continue;
      if (!body.includes(`skills/${sub}`)) fails.push(`${rel(m)}/SKILL.md: never routes to its sub-skill "${sub}"`);
    }
  }

  const koka = readFileSync(join(ROOT, "master-skills/koka/SKILL.md"), "utf8");
  for (const m of masters.map((d) => basename(d)).filter((n) => n !== "koka")) {
    if (!koka.includes(`master-skills/${m}`)) fails.push(`koka/SKILL.md: does not route to orchestrator "${m}"`);
  }
  for (const n of names.filter((n) => n !== "koka")) {
    if (!koka.includes(`skills/${n}`)) fails.push(`koka/SKILL.md: routing table misses "${n}"`);
  }

  for (const d of dirs) {
    const scripts = join(d, "scripts");
    if (!existsSync(scripts)) continue;
    const body = readFileSync(join(d, "SKILL.md"), "utf8");
    for (const s of readdirSync(scripts).filter((f) => f.endsWith(".mjs"))) {
      if (!body.includes(`scripts/${s}`)) fails.push(`${rel(d)}/SKILL.md: does not document its tool scripts/${s}`);
    }
    const ex = join(d, "examples");
    if (!existsSync(ex) || readdirSync(ex).length === 0) fails.push(`${rel(d)}: ships a tool but no examples/`);
    if (!/## Worked example/.test(body)) fails.push(`${rel(d)}/SKILL.md: ships a tool but has no "## Worked example" section`);
  }

  const manifestPath = join(ROOT, ".claude-plugin/plugin.json");
  if (!existsSync(manifestPath)) fails.push(".claude-plugin/plugin.json missing");
  else {
    const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));
    const roots = (manifest.skills || []).map((p) => join(ROOT, p));
    for (const r of roots) if (!existsSync(r)) fails.push(`plugin.json: skills path does not exist: ${rel(r)}`);
    for (const d of dirs) {
      if (!roots.some((r) => dirname(d) === r.replace(/\/$/, ""))) fails.push(`plugin.json: no skills path covers ${rel(d)}`);
    }
    const market = JSON.parse(readFileSync(join(ROOT, ".claude-plugin/marketplace.json"), "utf8"));
    if (!market.plugins?.some((p) => p.name === manifest.name)) fails.push(`marketplace.json: does not list plugin "${manifest.name}"`);
  }

  return fails;
}
