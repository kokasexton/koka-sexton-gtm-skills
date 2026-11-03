// Content test: no fabricated statistics.
//
// Every percentage or multiplier ("26%", "2.8×") written anywhere in a skill or
// a tool must either appear in the canonical LinkedIn Algorithm Report skill,
// or be registered below with the reason it isn't a benchmark claim (a worked
// example's own output, a labelled Koka default, a cadence). A new number with
// no source fails CI until someone sources it or explains it.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT, walk, rel } from "./_util.mjs";

const CANONICAL = "skills/linkedin-algorithm/SKILL.md";
const STAT = /\d+(?:\.\d+)?(?:%|×)/g;

const ALLOWED = {
  "skills/prompt-panel/SKILL.md": {
    tokens: ["56%", "33%", "0%"],
    why: "worked-example output of panel-score.mjs on examples/panel.csv (pinned by tools test)",
  },
  "skills/warm-list/SKILL.md": {
    tokens: ["60%", "33%"],
    why: "worked-example output (60%) and the report's '1 in 3' baseline expressed as 33%",
  },
  "skills/post-cta/SKILL.md": {
    tokens: ["3×"],
    why: "'3×/week' is a posting cadence inside an example question, not a statistic",
  },
  "skills/outbound-metrics/SKILL.md": {
    tokens: ["2%", "30%", "75%", "98.5%", "5.1%", "40%"],
    why: "labelled Koka health-threshold defaults (2/30/75%) and worked-example output on fictional counts",
  },
};

export function run() {
  const fails = [];
  const canonical = new Set(readFileSync(join(ROOT, CANONICAL), "utf8").match(STAT) || []);
  const files = walk(join(ROOT, "skills")).filter((f) => /SKILL\.md$|\.mjs$/.test(f));
  for (const f of files) {
    const r = rel(f);
    if (r === CANONICAL) continue;
    const allowed = new Set(ALLOWED[r]?.tokens || []);
    const found = new Set(readFileSync(f, "utf8").match(STAT) || []);
    for (const tok of found) {
      if (!canonical.has(tok) && !allowed.has(tok)) {
        fails.push(`${r}: "${tok}" is not in the canonical report — source it, label it, or register it in tests/no-unsourced-stats.test.mjs`);
      }
    }
    for (const tok of allowed) if (!found.has(tok)) fails.push(`${r}: allowlisted "${tok}" no longer appears — remove it from the allowlist`);
  }
  return fails;
}
