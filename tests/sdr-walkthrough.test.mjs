// Content test: docs/sdr-pack.md quotes real engine output. If the example data or
// engine changes, the walkthrough must be updated, not left to drift.
import { readFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { join } from "node:path";
import { ROOT } from "./_util.mjs";
import { packSkills } from "../scripts/install.mjs";

const node = (args) => execFileSync(process.execPath, args, { cwd: ROOT, encoding: "utf8" });

export function run() {
  const fails = [];
  const doc = readFileSync(join(ROOT, "docs/sdr-pack.md"), "utf8");
  const need = (label, out, ...pieces) => { for (const p of pieces) if (!out.includes(p)) fails.push(`${label}: engine output lacks "${p}"`); };
  const quoted = (...pieces) => { for (const p of pieces) if (!doc.includes(p)) fails.push(`docs/sdr-pack.md does not quote "${p}"`); };

  const n = packSkills("sdr").length;
  quoted(`installed ${n} new`);

  const wl = node(["skills/warm-list/scripts/warm-list.mjs", "skills/warm-list/examples/engagement.csv", "--icp", "skills/warm-list/examples/icp.json"]);
  need("warm-list", wl, "**10** unique engagers", "**60%** Director+", "P0 **3** · P1 **4** · P2 **0** · P3 **3**", "Northwind Analytics", "Dana Okafor", "last 106d ago");
  quoted("10 unique engagers", "60% Director+", "P0 x3, P1 x4, P2 x0, P3 x3", "106 days");

  const rates = node(["skills/outbound-metrics/scripts/pipeline-math.mjs", "rates", "skills/outbound-metrics/examples/counts.json"]);
  need("rates", rates, "**0.4%**", "about **250** sends");
  const plan = node(["skills/outbound-metrics/scripts/pipeline-math.mjs", "plan", "skills/outbound-metrics/examples/plan.json"]);
  need("plan", plan, "| Sends | 7465 |", "**2489**", "**1224** fewer sends", "# Plan: 30 opportunities");
  quoted("7,465 sends", "2,489 people", "1,224 sends", "0.4%", "250 sends");

  for (const s of ["warm-list", "outbound-metrics", "first-touch", "follow-up", "dm-scripts", "re-engagement"]) if (!packSkills("sdr").includes(s)) fails.push(`sdr pack no longer includes ${s}, which the walkthrough names`);
  return fails;
}
