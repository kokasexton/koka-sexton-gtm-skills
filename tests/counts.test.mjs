// Counts test: every place that states how many skills or tools ship must agree
// with what actually ships (README prose, llms.txt, both plugin manifests).
// The README badges and catalog are generated; this covers the hand-written copy.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./_util.mjs";
import { counts } from "../scripts/build-catalog.mjs";

const WORDS = { eight: 8, nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14, fifteen: 15 };
const num = (w) => (/^\d+$/.test(w) ? Number(w) : WORDS[w.toLowerCase()]);

export function run() {
  const fails = [];
  const c = counts();
  const files = ["README.md", "llms.txt", ".claude-plugin/plugin.json", ".claude-plugin/marketplace.json"];
  for (const f of files) {
    const text = readFileSync(join(ROOT, f), "utf8");
    for (const m of text.matchAll(/\b(\d+|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen) (?:(?:zero-dependency|runnable) )?(?:Node scripts|tools)\b/gi)) {
      if (num(m[1]) !== c.tools) fails.push(`${f}: says "${m[0]}" but ${c.tools} tools ship`);
    }
    for (const m of text.matchAll(/\b(\d+) skills\b/g)) {
      if (Number(m[1]) !== c.skills) fails.push(`${f}: says "${m[0]}" but ${c.skills} skills ship`);
    }
  }
  return fails;
}
