// Content test: numbers quoted from the LinkedIn Algorithm Report must match the
// canonical copy in master-skills/content-engineer/.claude/skills/linkedin-algorithm/SKILL.md.
//
// Two assertions:
//   1. The canonical skill carries each benchmark value (source-of-truth integrity).
//   2. Every other skill that restates a benchmark uses the matching number
//      (no drift, no fabrication). Restatements are registered explicitly so a
//      new number in a derived skill is caught rather than silently trusted.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./_util.mjs";

const CANONICAL =
  "master-skills/content-engineer/.claude/skills/linkedin-algorithm/SKILL.md";

// Benchmark values as they appear in the canonical skill.
const CANONICAL_MUSTS = [
  { value: "2.8×", re: /2\.8×/ },
  { value: "63%", re: /63%/ },
  { value: "+26%", re: /26% seniority/ },
  { value: "12×", re: /12× collapse/ },
  { value: "3–5 posts/week", re: /3–5 posts\/week/ },
  { value: "78%", re: /78% of comments are substantive/ },
];

// Every restatement of a benchmark elsewhere in the library, with the number it must carry.
const RESTATEMENTS = [
  {
    file: "master-skills/content-engineer/SKILL.md",
    re: /Image formats outperform link posts ~([\d.]+)×/,
    expect: ["2.8"],
    label: "image vs link multiplier",
  },
  {
    file: "master-skills/content-engineer/SKILL.md",
    re: /6\+ costs ~(\d+)%/,
    expect: ["63"],
    label: "hashtag penalty",
  },
  {
    file: "master-skills/content-engineer/SKILL.md",
    re: /~(\d+)% more senior than likers/,
    expect: ["26"],
    label: "commenter seniority lift",
  },
  {
    file: "master-skills/content-engineer/SKILL.md",
    re: /Cadence (\d)–(\d) posts\/week/,
    expect: ["3", "5"],
    label: "cadence sweet spot",
  },
  {
    file: "master-skills/engagement-intelligence/SKILL.md",
    re: /~(\d+)% more senior than likers/,
    expect: ["26"],
    label: "commenter seniority lift",
  },
  {
    file: "master-skills/engagement-intelligence/SKILL.md",
    re: /reach ~(\d+)× more per follower/,
    expect: ["12"],
    label: "follower-efficiency collapse",
  },
  {
    file: "master-skills/signal-outbound/.claude/skills/buying-signals/SKILL.md",
    re: /skew ~(\d+)% more senior than likers/,
    expect: ["26"],
    label: "commenter seniority lift",
  },
  {
    file: "master-skills/signal-outbound/.claude/skills/buying-signals/SKILL.md",
    re: /(\d+)% write substantive replies/,
    expect: ["78"],
    label: "substantive comments",
  },
];

function read(relPath) {
  return readFileSync(join(ROOT, relPath), "utf8");
}

export function run() {
  const fails = [];

  const canonical = read(CANONICAL);
  for (const { value, re } of CANONICAL_MUSTS) {
    if (!re.test(canonical)) {
      fails.push(`[canonical] ${CANONICAL}: benchmark "${value}" not found in the source of truth`);
    }
  }

  for (const { file, re, expect, label } of RESTATEMENTS) {
    const body = read(file);
    const m = body.match(re);
    if (!m) {
      fails.push(`[restatement] ${file}: no longer states the "${label}" benchmark`);
      continue;
    }
    const got = m.slice(1);
    if (got.join("|") !== expect.join("|")) {
      fails.push(
        `[restatement] ${file}: "${label}" is ${got.join("–")} but canonical is ${expect.join("–")}`
      );
    }
  }

  return fails;
}
