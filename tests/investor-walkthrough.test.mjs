// Content test: docs/investor-pack.md quotes real engine output. If the example data or
// engine changes, the walkthrough must be updated, not left to drift.
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { ROOT } from "./_util.mjs";
import { packSkills } from "../scripts/install.mjs";

const node = (args) => {
  try { return execFileSync(process.execPath, args, { cwd: ROOT, encoding: "utf8" }); }
  catch (e) { return String(e.stdout || ""); }
};

export function run() {
  const fails = [];
  const doc = readFileSync(join(ROOT, "docs/investor-pack.md"), "utf8");
  const need = (label, out, ...pieces) => { for (const p of pieces) if (!out.includes(p)) fails.push(`${label}: engine output lacks "${p}"`); };
  const quoted = (...pieces) => { for (const p of pieces) if (!doc.includes(p)) fails.push(`docs/investor-pack.md does not quote "${p}"`); };

  const n = packSkills("investor").length;
  quoted(`installed ${n} new`);
  quoted(`the ${JSON.parse(readFileSync(join(ROOT, "packs.json"), "utf8")).investor.skills.length} skills listed`);

  const sm = node(["skills/signal-model/scripts/signal-model.mjs", "skills/founder-shortlist/examples/events.csv", "--as-of", "2026-10-31"]);
  need("signal-model", sm, "7 people. URGENT 2, HOT 0, WARMING 2, COLD 0. Held by the fit gate: 3", "Maya Lindgren | Stealth | URGENT | 21.5", "Theo Marchetti | Loomlight | URGENT | 14.5", "Nadia Rahman | Halden Cloud | WARMING | 15", "Sofia Petrov | Quillfield | HOLD | 15 | 30", "fit 30 < 40");
  quoted("7 people. URGENT 2, HOT 0, WARMING 2, COLD 0. Held by the fit gate: 3", "21.5", "14.5", "fit of 30", "line of 40");

  const ms = node(["skills/multi-signal/scripts/signal-score.mjs", "skills/multi-signal/examples/signals.csv"]);
  need("multi-signal", ms, "ACT NOW **1** · WARM UP **2** · WATCH **2** · IGNORE **1**");
  quoted("ACT NOW 1, WARM UP 2, WATCH 2, IGNORE 1");

  for (const s of ["thesis-fit", "signal-model", "multi-signal", "funding-signals", "hiring-signals", "job-changes", "founder-shortlist", "committee-map", "linkedin-signal-stack", "linkedin-comment-warmer", "linkedin-safety", "dm-scripts"]) if (!packSkills("investor").includes(s)) fails.push(`investor pack no longer includes ${s}, which the walkthrough names`);
  return fails;
}
